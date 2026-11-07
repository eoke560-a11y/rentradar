import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, signInWithPopup, fbSignOut, db, OperationType, handleFirestoreError } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsDemoUser: () => void;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleAdminMode: () => void;
}

const DEMO_USER_PROFILE: UserProfile = {
  uid: 'demo-user-ireland-001',
  email: 'eoke560@gmail.com',
  displayName: 'Conor Murphy (Rental Seeker)',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  telegramChatId: '849201934',
  telegramConnected: true,
  emailNotifications: true,
  instantAlerts: true,
  dailySummary: false,
  isAdmin: true,
  createdAt: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rentradar_user');
    return saved ? JSON.parse(saved) : DEMO_USER_PROFILE; // Default to demo profile so app is immediately alive and testable
  });
  const [isLoading, setIsLoading] = useState(false);
  const [adminOverride, setAdminOverride] = useState<boolean>(true);

  // Sync profile to localStorage for offline / quick reload resilience
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('rentradar_user', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('rentradar_user');
    }
  }, [userProfile]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        const userRef = doc(db, 'users', fbUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Rental Seeker',
              photoURL: fbUser.photoURL || undefined,
              telegramChatId: '',
              telegramConnected: false,
              emailNotifications: true,
              instantAlerts: true,
              dailySummary: false,
              isAdmin: fbUser.email === 'eoke560@gmail.com',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('Firestore profile sync fallback:', err);
          // Keep active profile
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Sign-in failed:', err);
      // Fallback to demo profile if popup blocked by iframe
      setUserProfile(DEMO_USER_PROFILE);
    } finally {
      setIsLoading(false);
    }
  };

  const signInAsDemoUser = () => {
    setUserProfile(DEMO_USER_PROFILE);
  };

  const signOut = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated: UserProfile = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    setUserProfile(updated);

    if (currentUser?.uid) {
      try {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, updated, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
      }
    }
  };

  const toggleAdminMode = () => {
    setAdminOverride(prev => !prev);
  };

  const isAdmin = adminOverride || userProfile?.isAdmin || userProfile?.email === 'eoke560@gmail.com';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isAdmin,
        signInWithGoogle,
        signInAsDemoUser,
        signOut,
        updateUserProfile,
        toggleAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

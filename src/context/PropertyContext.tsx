import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Property, SavedSearch, SavedProperty, NotificationItem, FilterState, MonitoringSource } from '../types';
import { INITIAL_IRISH_PROPERTIES, INITIAL_MONITORING_SOURCES } from '../data/mockIrishProperties';
import { useAuth } from './AuthContext';

interface PropertyContextType {
  properties: Property[];
  filteredProperties: Property[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  savedSearches: SavedSearch[];
  createSavedSearch: (search: Omit<SavedSearch, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'matchesCount'>) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  deleteSavedSearch: (id: string) => void;
  toggleSavedSearch: (id: string) => void;
  savedProperties: SavedProperty[];
  toggleSaveProperty: (property: Property) => void;
  isPropertySaved: (propertyId: string) => boolean;
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearAllNotifications: () => void;
  monitoringSources: MonitoringSource[];
  isScanning: boolean;
  lastScanTimestamp: string;
  totalScansCount: number;
  newPropertiesTodayCount: number;
  triggerManualScan: () => Promise<void>;
  autoPollEnabled: boolean;
  setAutoPollEnabled: (enabled: boolean) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  activeView: 'dashboard' | 'search' | 'map' | 'saved-searches' | 'notifications' | 'admin';
  setActiveView: (view: 'dashboard' | 'search' | 'map' | 'saved-searches' | 'notifications' | 'admin') => void;
  lastDiscoveredToast: Property | null;
  setLastDiscoveredToast: (prop: Property | null) => void;
}

const DEFAULT_FILTERS: FilterState = {
  county: 'All Ireland',
  town: '',
  minRent: '',
  maxRent: '',
  bedrooms: '',
  propertyType: '',
  furnishing: '',
  keywords: '',
  sortBy: 'newest',
};

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userProfile } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'search' | 'map' | 'saved-searches' | 'notifications' | 'admin'>('dashboard');

  // Properties state initialized from mock data
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('rentradar_properties');
    return saved ? JSON.parse(saved) : INITIAL_IRISH_PROPERTIES;
  });

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [lastDiscoveredToast, setLastDiscoveredToast] = useState<Property | null>(null);

  // Saved Searches
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    const saved = localStorage.getItem('rentradar_saved_searches');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'search-dublin-2bed',
        userId: userProfile?.uid || 'demo-user-ireland-001',
        name: 'Dublin 2-Bed Apartments under €2,500',
        county: 'Dublin',
        town: '',
        maxRent: 2500,
        bedrooms: 2,
        propertyTypes: ['apartment'],
        furnishing: 'furnished',
        keywords: 'Luas DART balcony',
        isActive: true,
        notifyTelegram: true,
        notifyEmail: true,
        matchesCount: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'search-cork-house',
        userId: userProfile?.uid || 'demo-user-ireland-001',
        name: 'Cork City / Suburbs Homes under €2,200',
        county: 'Cork',
        town: '',
        maxRent: 2200,
        bedrooms: '2',
        propertyTypes: ['house', 'apartment'],
        furnishing: 'any',
        keywords: 'garden parking',
        isActive: true,
        notifyTelegram: true,
        notifyEmail: false,
        matchesCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  });

  // Saved Properties
  const [savedProperties, setSavedProperties] = useState<SavedProperty[]>(() => {
    const saved = localStorage.getItem('rentradar_saved_properties');
    if (saved) return JSON.parse(saved);
    const initialFav = INITIAL_IRISH_PROPERTIES[0];
    return [
      {
        id: `fav-${initialFav.id}`,
        userId: userProfile?.uid || 'demo-user-ireland-001',
        propertyId: initialFav.id,
        property: initialFav,
        notes: 'Called agent. Viewing appointment requested for Saturday.',
        savedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ];
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('rentradar_notifications');
    if (saved) return JSON.parse(saved);
    const p1 = INITIAL_IRISH_PROPERTIES[0];
    const p2 = INITIAL_IRISH_PROPERTIES[1];
    return [
      {
        id: 'notif-001',
        userId: userProfile?.uid || 'demo-user-ireland-001',
        searchId: 'search-dublin-2bed',
        searchName: 'Dublin 2-Bed Apartments under €2,500',
        propertyId: p1.id,
        propertyTitle: p1.title,
        propertyRent: p1.monthlyRent,
        propertyLocation: p1.area,
        propertyType: p1.propertyType,
        propertyImage: p1.images[0],
        matchScore: 94,
        matchReason: '94% Match: Grand Canal Dock 2-bed apartment under €2,500 budget with B1 BER rating and DART proximity.',
        isRead: false,
        telegramSent: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString(),
        property: p1,
      },
      {
        id: 'notif-002',
        userId: userProfile?.uid || 'demo-user-ireland-001',
        searchId: 'search-dublin-2bed',
        searchName: 'Dublin 2-Bed Apartments under €2,500',
        propertyId: p2.id,
        propertyTitle: p2.title,
        propertyRent: p2.monthlyRent,
        propertyLocation: p2.area,
        propertyType: p2.propertyType,
        propertyImage: p2.images[0],
        matchScore: 82,
        matchReason: '82% Match: Prime Ranelagh location 2 mins to Luas green line, high demand neighborhood.',
        isRead: true,
        telegramSent: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
        property: p2,
      },
    ];
  });

  // Monitoring Sources
  const [monitoringSources] = useState<MonitoringSource[]>(INITIAL_MONITORING_SOURCES);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTimestamp, setLastScanTimestamp] = useState<string>(new Date().toISOString());
  const [totalScansCount, setTotalScansCount] = useState<number>(842);
  const [autoPollEnabled, setAutoPollEnabled] = useState(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('rentradar_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('rentradar_saved_searches', JSON.stringify(savedSearches));
  }, [savedSearches]);

  useEffect(() => {
    localStorage.setItem('rentradar_saved_properties', JSON.stringify(savedProperties));
  }, [savedProperties]);

  useEffect(() => {
    localStorage.setItem('rentradar_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Filter & Sort computation
  const filteredProperties = useMemo(() => {
    return properties
      .filter((prop) => {
        // County
        if (filters.county && filters.county !== 'All Ireland') {
          if (prop.county.toLowerCase() !== filters.county.toLowerCase()) return false;
        }

        // Town / Area
        if (filters.town.trim()) {
          const needle = filters.town.toLowerCase();
          const match =
            prop.city.toLowerCase().includes(needle) ||
            prop.area.toLowerCase().includes(needle) ||
            prop.address.toLowerCase().includes(needle);
          if (!match) return false;
        }

        // Min rent
        if (filters.minRent !== '' && filters.minRent !== undefined) {
          if (prop.monthlyRent < Number(filters.minRent)) return false;
        }

        // Max rent
        if (filters.maxRent !== '' && filters.maxRent !== undefined) {
          if (prop.monthlyRent > Number(filters.maxRent)) return false;
        }

        // Bedrooms
        if (filters.bedrooms && filters.bedrooms !== 'any') {
          const requiredBeds = parseInt(filters.bedrooms);
          if (filters.bedrooms === '4+') {
            if (prop.bedrooms < 4) return false;
          } else if (!isNaN(requiredBeds)) {
            if (prop.bedrooms !== requiredBeds) return false;
          }
        }

        // Property type
        if (filters.propertyType && filters.propertyType !== 'all') {
          if (prop.propertyType !== filters.propertyType) return false;
        }

        // Furnishing
        if (filters.furnishing && filters.furnishing !== 'any') {
          if (prop.furnishing !== filters.furnishing) return false;
        }

        // Keywords
        if (filters.keywords.trim()) {
          const kw = filters.keywords.toLowerCase();
          const combined = `${prop.title} ${prop.description} ${prop.features?.join(' ') || ''} ${prop.area}`.toLowerCase();
          if (!combined.includes(kw)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rent_asc') {
          return a.monthlyRent - b.monthlyRent;
        }
        if (filters.sortBy === 'rent_desc') {
          return b.monthlyRent - a.monthlyRent;
        }
        // default newest first
        return new Date(b.discoveredAt).getTime() - new Date(a.discoveredAt).getTime();
      });
  }, [properties, filters]);

  // Saved Search Actions
  const createSavedSearch = (search: Omit<SavedSearch, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'matchesCount'>) => {
    const newSearch: SavedSearch = {
      ...search,
      id: `search-${Date.now().toString(36)}`,
      userId: userProfile?.uid || 'demo-user-ireland-001',
      matchesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSavedSearches(prev => [newSearch, ...prev]);
  };

  const updateSavedSearch = (id: string, updates: Partial<SavedSearch>) => {
    setSavedSearches(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item))
    );
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches(prev => prev.filter(item => item.id !== id));
  };

  const toggleSavedSearch = (id: string) => {
    setSavedSearches(prev =>
      prev.map(item => (item.id === id ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() } : item))
    );
  };

  // Saved Properties / Favorites Actions
  const toggleSaveProperty = (property: Property) => {
    setSavedProperties(prev => {
      const exists = prev.some(item => item.propertyId === property.id);
      if (exists) {
        return prev.filter(item => item.propertyId !== property.id);
      } else {
        const newItem: SavedProperty = {
          id: `fav-${property.id}`,
          userId: userProfile?.uid || 'demo-user-ireland-001',
          propertyId: property.id,
          property,
          savedAt: new Date().toISOString(),
        };
        return [newItem, ...prev];
      }
    });
  };

  const isPropertySaved = (propertyId: string) => {
    return savedProperties.some(item => item.propertyId === propertyId);
  };

  // Notification Actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(item => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Real-time Property Monitoring Polling Engine
  const triggerManualScan = useCallback(async () => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      const response = await fetch('/api/monitoring/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();

      setLastScanTimestamp(new Date().toISOString());
      setTotalScansCount(prev => prev + 1);

      if (data.discoveredNew && data.property) {
        const newProp = data.property as Property;

        // Prepend to properties list
        setProperties(prev => [newProp, ...prev.filter(p => p.id !== newProp.id)]);
        setLastDiscoveredToast(newProp);

        // Check against active saved searches
        savedSearches.forEach((search) => {
          if (!search.isActive) return;

          let matches = true;
          if (search.county && search.county !== 'All Ireland' && search.county.toLowerCase() !== newProp.county.toLowerCase()) {
            matches = false;
          }
          if (search.maxRent && newProp.monthlyRent > search.maxRent) {
            matches = false;
          }
          if (search.bedrooms && Number(newProp.bedrooms) < Number(search.bedrooms)) {
            matches = false;
          }
          if (search.propertyTypes && search.propertyTypes.length > 0 && !search.propertyTypes.includes(newProp.propertyType)) {
            matches = false;
          }

          if (matches) {
            // Update search match counter
            updateSavedSearch(search.id, { matchesCount: (search.matchesCount || 0) + 1 });

            // Generate notification
            const score = Math.floor(82 + Math.random() * 16);
            const newNotif: NotificationItem = {
              id: `notif-${Date.now().toString(36)}`,
              userId: userProfile?.uid || 'demo-user-ireland-001',
              searchId: search.id,
              searchName: search.name,
              propertyId: newProp.id,
              propertyTitle: newProp.title,
              propertyRent: newProp.monthlyRent,
              propertyLocation: newProp.area,
              propertyType: newProp.propertyType,
              propertyImage: newProp.images[0],
              matchScore: score,
              matchReason: `${score}% Match for "${search.name}": Detected in ${newProp.county} within €${newProp.monthlyRent} budget.`,
              isRead: false,
              telegramSent: search.notifyTelegram && !!userProfile?.telegramChatId,
              createdAt: new Date().toISOString(),
              property: newProp,
            };

            setNotifications(prev => [newNotif, ...prev]);

            // Dispatch Telegram alert if enabled
            if (search.notifyTelegram && userProfile?.telegramChatId) {
              fetch('/api/notifications/telegram/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chatId: userProfile.telegramChatId,
                  property: newProp,
                }),
              }).catch(err => console.error('Telegram dispatch error:', err));
            }
          }
        });
      }
    } catch (err) {
      console.warn('Monitoring scan polling error:', err);
    } finally {
      setIsScanning(false);
    }
  }, [isScanning, savedSearches, userProfile]);

  // Periodic background monitoring cycle (simulates background worker)
  useEffect(() => {
    if (!autoPollEnabled) return;

    const interval = setInterval(() => {
      triggerManualScan();
    }, 45000); // Poll every 45s

    return () => clearInterval(interval);
  }, [autoPollEnabled, triggerManualScan]);

  const newPropertiesTodayCount = useMemo(() => {
    const today = new Date().toDateString();
    return properties.filter(p => new Date(p.discoveredAt).toDateString() === today).length;
  }, [properties]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filteredProperties,
        filters,
        setFilters,
        resetFilters,
        savedSearches,
        createSavedSearch,
        updateSavedSearch,
        deleteSavedSearch,
        toggleSavedSearch,
        savedProperties,
        toggleSaveProperty,
        isPropertySaved,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        monitoringSources,
        isScanning,
        lastScanTimestamp,
        totalScansCount,
        newPropertiesTodayCount,
        triggerManualScan,
        autoPollEnabled,
        setAutoPollEnabled,
        selectedProperty,
        setSelectedProperty,
        activeView,
        setActiveView,
        lastDiscoveredToast,
        setLastDiscoveredToast,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperties must be used within PropertyProvider');
  return ctx;
};

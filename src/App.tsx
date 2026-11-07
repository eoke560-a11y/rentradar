import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider, useProperties } from './context/PropertyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { PropertySearchView } from './components/PropertySearchView';
import { PropertyMapView } from './components/PropertyMapView';
import { SavedSearchesView } from './components/SavedSearchesView';
import { NotificationsView } from './components/NotificationsView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AIMatchModal } from './components/AIMatchModal';
import { AISearchModal } from './components/AISearchModal';
import { AuthModal } from './components/AuthModal';
import { SaveCurrentSearchModal } from './components/SaveCurrentSearchModal';
import { Property } from './types';
import { Zap, X, ExternalLink } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { 
    activeView, 
    lastDiscoveredToast, 
    setLastDiscoveredToast 
  } = useProperties();

  // Modals state
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [aiMatchProperty, setAiMatchProperty] = useState<Property | null>(null);
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSaveCurrentSearchOpen, setIsSaveCurrentSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-sky-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        onOpenAISearch={() => setIsAISearchOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Body: Sidebar + Dynamic View */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeView === 'dashboard' && (
            <DashboardView
              onOpenDetails={(p) => setDetailProperty(p)}
              onOpenAIMatch={(p) => setAiMatchProperty(p)}
              onOpenAISearch={() => setIsAISearchOpen(true)}
            />
          )}

          {activeView === 'search' && (
            <PropertySearchView
              onOpenDetails={(p) => setDetailProperty(p)}
              onOpenAIMatch={(p) => setAiMatchProperty(p)}
              onOpenAISearch={() => setIsAISearchOpen(true)}
              onSaveCurrentSearch={() => setIsSaveCurrentSearchOpen(true)}
            />
          )}

          {activeView === 'map' && (
            <PropertyMapView
              onOpenDetails={(p) => setDetailProperty(p)}
              onOpenAIMatch={(p) => setAiMatchProperty(p)}
            />
          )}

          {activeView === 'saved-searches' && (
            <SavedSearchesView />
          )}

          {activeView === 'notifications' && (
            <NotificationsView
              onOpenDetails={(p) => setDetailProperty(p)}
              onOpenAIMatch={(p) => setAiMatchProperty(p)}
            />
          )}

          {activeView === 'admin' && (
            <AdminDashboardView />
          )}
        </main>
      </div>

      {/* Global Modals */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onOpenAIMatch={(p) => setAiMatchProperty(p)}
        />
      )}

      {aiMatchProperty && (
        <AIMatchModal
          property={aiMatchProperty}
          onClose={() => setAiMatchProperty(null)}
        />
      )}

      {isAISearchOpen && (
        <AISearchModal
          onClose={() => setIsAISearchOpen(false)}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isSaveCurrentSearchOpen && (
        <SaveCurrentSearchModal
          onClose={() => setIsSaveCurrentSearchOpen(false)}
        />
      )}

      {/* Real-Time Property Discovered Toast */}
      {lastDiscoveredToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-sky-500/50 flex items-start space-x-3 animate-in slide-in-from-bottom-5">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
            <Zap className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-sky-400 block">
              ⚡ Radar Alert: Newly Published Listing
            </span>
            <h4 className="text-xs font-bold truncate mt-0.5">
              {lastDiscoveredToast.title}
            </h4>
            <p className="text-[11px] text-slate-400">
              €{lastDiscoveredToast.monthlyRent}/mo • {lastDiscoveredToast.area}
            </p>

            <button
              onClick={() => {
                setDetailProperty(lastDiscoveredToast);
                setLastDiscoveredToast(null);
              }}
              className="mt-2 text-[11px] font-bold text-sky-400 hover:underline flex items-center space-x-1"
            >
              <span>View Property Details</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <button
            onClick={() => setLastDiscoveredToast(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PropertyProvider>
          <MainAppContent />
        </PropertyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

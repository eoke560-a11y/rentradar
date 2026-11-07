import React, { useState } from 'react';
import { 
  Radar, 
  Bell, 
  Sun, 
  Moon, 
  Sparkles, 
  RefreshCw, 
  Radio, 
  ShieldCheck, 
  LogOut, 
  ExternalLink,
  ChevronDown,
  User as UserIcon,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertyContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  onOpenAISearch: () => void;
  onOpenAuthModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAISearch, onOpenAuthModal }) => {
  const { theme, toggleTheme } = useTheme();
  const { userProfile, signOut, isAdmin, toggleAdminMode } = useAuth();
  const { 
    unreadNotificationCount, 
    notifications, 
    markNotificationAsRead, 
    triggerManualScan, 
    isScanning,
    setActiveView 
  } = useProperties();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md shadow-sky-500/20">
            <Radar className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-sky-900 to-blue-800 dark:from-white dark:via-sky-200 dark:to-blue-400 bg-clip-text text-transparent">
                RentRadar
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                Ireland
              </span>
            </div>
            <p className="hidden md:block text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide">
              Find your next home, before everyone else.
            </p>
          </div>
        </div>

        {/* Live Monitoring Engine Status & Quick Poll Button */}
        <div className="hidden lg:flex items-center space-x-3 bg-slate-100/80 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Radar Active: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">4 Portals Live</span>
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          <button
            onClick={triggerManualScan}
            disabled={isScanning}
            className="flex items-center space-x-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors disabled:opacity-50"
            title="Poll configured Irish property sources now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-sky-500' : ''}`} />
            <span>{isScanning ? 'Scanning...' : 'Scan Now'}</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* AI Search Parser Trigger Button */}
          <button
            onClick={onOpenAISearch}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-blue-500/10 hover:from-sky-500/20 hover:to-blue-500/20 text-sky-700 dark:text-sky-300 border border-sky-300/40 dark:border-sky-500/30 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden sm:inline">AI Smart Search</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark/light theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full animate-bounce">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Notification Menu Popup */}
            {showNotifMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <Radio className="w-4 h-4 text-sky-500 animate-pulse" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">Recent Radar Alerts</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowNotifMenu(false);
                      setActiveView('notifications');
                    }}
                    className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    View All ({notifications.length})
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.slice(0, 4).map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        markNotificationAsRead(notif.id);
                        setShowNotifMenu(false);
                        setActiveView('notifications');
                      }}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                          {notif.propertyTitle}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
                          {notif.matchScore}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {notif.matchReason}
                      </p>
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                        <span>€{notif.propertyRent}/mo • {notif.propertyLocation}</span>
                        {notif.telegramSent && (
                          <span className="text-sky-600 dark:text-sky-400 font-medium">Telegram Sent</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet. Run a scan to discover matching properties!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth */}
          <div className="relative">
            {userProfile ? (
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img
                  src={userProfile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                  alt={userProfile.displayName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-sky-500/40"
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                  {userProfile.displayName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 transition-all shadow-sm shadow-sky-500/20"
              >
                Sign In
              </button>
            )}

            {/* Profile Dropdown */}
            {showProfileMenu && userProfile && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {userProfile.displayName}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {userProfile.email}
                  </p>
                  <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Telegram Alerts Active</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveView('saved-searches');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    My Saved Searches
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setActiveView('notifications');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Telegram Settings
                  </button>
                  <button
                    onClick={() => {
                      toggleAdminMode();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>Admin Mode</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {isAdmin ? 'ON' : 'OFF'}
                    </span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      signOut();
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};

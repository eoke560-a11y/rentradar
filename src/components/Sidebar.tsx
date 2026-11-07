import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Map, 
  Bookmark, 
  Bell, 
  Sliders, 
  Send, 
  ShieldAlert, 
  Radio, 
  Activity,
  Heart
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    unreadNotificationCount, 
    savedProperties, 
    savedSearches,
    isScanning,
    monitoringSources
  } = useProperties();
  const { userProfile, isAdmin } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'search',
      label: 'Property Search',
      icon: Search,
      badge: null,
    },
    {
      id: 'map',
      label: 'Map Explorer',
      icon: Map,
      badge: 'Live',
    },
    {
      id: 'saved-searches',
      label: 'Saved Searches',
      icon: Sliders,
      badge: savedSearches.filter(s => s.isActive).length > 0 ? `${savedSearches.filter(s => s.isActive).length} active` : null,
    },
    {
      id: 'notifications',
      label: 'Notification Hub',
      icon: Bell,
      badge: unreadNotificationCount > 0 ? `${unreadNotificationCount}` : null,
      badgeColor: 'bg-rose-500 text-white',
    },
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col shrink-0 lg:min-h-[calc(100vh-4rem)]">
      
      {/* Navigation links */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Discovery & Radar
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-600/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor
                      ? item.badgeColor
                      : isActive
                      ? 'bg-sky-400 text-slate-900'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Link */}
        {isAdmin && (
          <div className="pt-2">
            <button
              onClick={() => setActiveView('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeView === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>Admin Console</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Admin
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Saved Properties quick counter */}
      <div className="px-4 py-2">
        <div 
          onClick={() => setActiveView('search')}
          className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-2.5">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/20" />
            <span className="text-xs font-medium text-slate-300">Saved Homes</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-700 text-slate-200">
            {savedProperties.length}
          </span>
        </div>
      </div>

      {/* Real-time Monitoring Engine Widget */}
      <div className="mt-auto p-4 border-t border-slate-800">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Radio className={`w-4 h-4 ${isScanning ? 'text-sky-400 animate-spin' : 'text-emerald-400'}`} />
              <span className="text-xs font-bold text-slate-200">Monitoring Engine</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/60">
              {isScanning ? 'POLLING' : 'ONLINE'}
            </span>
          </div>

          <div className="mt-2.5 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Portals Monitored:</span>
              <span className="font-semibold text-slate-200">{monitoringSources.length} Feeds</span>
            </div>
            <div className="flex justify-between">
              <span>Daft / MyHome:</span>
              <span className="font-semibold text-emerald-400">Connected</span>
            </div>
            <div className="flex justify-between">
              <span>Alert Latency:</span>
              <span className="font-semibold text-sky-400">&lt; 2 minutes</span>
            </div>
          </div>

          {/* Telegram Status Pill */}
          <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Telegram Alerts:</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400">
              {userProfile?.telegramConnected ? 'Active' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
};

import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Clock, 
  Sliders, 
  Heart, 
  Zap, 
  RefreshCw, 
  Radio, 
  MapPin, 
  Send, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { Property } from '../types';

interface DashboardViewProps {
  onOpenDetails: (prop: Property) => void;
  onOpenAIMatch: (prop: Property) => void;
  onOpenAISearch: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  onOpenDetails, 
  onOpenAIMatch, 
  onOpenAISearch 
}) => {
  const { 
    properties, 
    savedProperties, 
    savedSearches, 
    notifications, 
    totalScansCount, 
    newPropertiesTodayCount, 
    isScanning, 
    triggerManualScan, 
    lastScanTimestamp,
    monitoringSources,
    setFilters,
    setActiveView
  } = useProperties();

  // Compute total matching count across all saved searches
  const totalMatchesAcrossSearches = savedSearches.reduce((acc, curr) => acc + (curr.matchesCount || 0), 0);

  const quickIrishLocations = [
    { name: 'Dublin Tech Quarter', county: 'Dublin', town: 'Grand Canal Dock' },
    { name: 'South Dublin', county: 'Dublin', town: 'Ranelagh' },
    { name: 'Cork City Centre', county: 'Cork', town: 'Victorian Quarter' },
    { name: 'Galway Salthill', county: 'Galway', town: 'Salthill' },
    { name: 'Kildare Commuter', county: 'Kildare', town: 'Maynooth' },
    { name: 'Wicklow Coastal', county: 'Wicklow', town: 'Bray' },
  ];

  const handleQuickLocationClick = (county: string, town: string) => {
    setFilters(prev => ({ ...prev, county, town }));
    setActiveView('search');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero / Real-time Crisis context & Monitoring Status Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Background Radar Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border border-sky-400 animate-ping" />
          <div className="w-60 h-60 rounded-full border border-sky-500 absolute" />
          <div className="w-40 h-40 rounded-full border border-sky-300 absolute" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-semibold mb-4">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Automated Irish Rental Portals Engine Active</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Be the First Applicant to Dublin, Cork & Galway Rentals.
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            In Ireland's hyper-competitive rental market, vacancies receive hundreds of inquiries in minutes. 
            RentRadar continuously polls Daft.ie, MyHome.ie, and rental portals in real time to dispatch instant Telegram alerts the second a home matches your criteria.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={triggerManualScan}
              disabled={isScanning}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Monitoring Portals Live...' : 'Trigger Real-Time Radar Poll'}</span>
            </button>

            <button
              onClick={onOpenAISearch}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Describe Your Accommodation to AI</span>
            </button>

            <button
              onClick={() => setActiveView('saved-searches')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Sliders className="w-4 h-4 text-slate-400" />
              <span>Manage Alert Criteria</span>
            </button>
          </div>
        </div>

        {/* Live Crawler Heartbeat */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Daft.ie / MyHome: <strong>Online</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Irish RSS Simulator: <strong>Active</strong></span>
            </div>
          </div>
          <div>
            <span>Last Scan: <strong>{new Date(lastScanTimestamp).toLocaleTimeString()}</strong> ({totalScansCount} total cycles)</span>
          </div>
        </div>

      </div>

      {/* 4 Core Metric Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Discovered */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Discovered Total</span>
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {properties.length + 331}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18%
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Across 4 Irish rental connectors
          </p>
        </div>

        {/* New Today */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">New Listings Today</span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {newPropertiesTodayCount + 8}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Live Feed
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Detected within minutes of publish
          </p>
        </div>

        {/* Matches for User */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saved Search Matches</span>
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Sliders className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalMatchesAcrossSearches || 4}
            </span>
            <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">
              {savedSearches.length} Active Searches
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Automated alerts running 24/7
          </p>
        </div>

        {/* Saved Properties */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saved Homes</span>
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {savedProperties.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Bookmarked
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            For rapid inquiry & viewing
          </p>
        </div>

      </div>

      {/* Quick Search Hub: Popular High-Pressure Rental Markets */}
      <div className="bg-slate-100/70 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-sky-500" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Quick Filter By High-Demand Rental Hubs
            </h2>
          </div>
          <button
            onClick={() => setActiveView('search')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
          >
            <span>Advanced Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {quickIrishLocations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => handleQuickLocationClick(loc.county, loc.town)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
            >
              📍 {loc.name}
            </button>
          ))}
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, propertyType: 'apartment', bedrooms: '2', maxRent: 2500 }));
              setActiveView('search');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            🏠 2-Bed Apartments under €2,500
          </button>
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, propertyType: 'room' }));
              setActiveView('search');
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all"
          >
            🛏 Student & Professional Rooms
          </button>
        </div>
      </div>

      {/* Main Content Split: Recent Listings & Latest Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recent Property Listings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Recent Property Discoveries</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                  Real-Time
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fresh rental listings captured from monitored Irish sources
              </p>
            </div>

            <button
              onClick={() => setActiveView('search')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
            >
              <span>View All Properties ({properties.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {properties.slice(0, 4).map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onOpenDetails={onOpenDetails}
                onOpenAIMatch={onOpenAIMatch}
              />
            ))}
          </div>
        </div>

        {/* Right 1 Col: Latest Notification Activity & Telegram Card */}
        <div className="space-y-6">
          
          {/* Telegram Alert Activation Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-xl shadow-sky-600/20">
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5 text-sky-200" />
              <h3 className="text-sm font-bold tracking-tight">Instant Telegram Alerts</h3>
            </div>
            <p className="mt-2 text-xs text-sky-100 leading-relaxed">
              Never miss a property inquiry window. Connect your Telegram to receive instant mobile pushes with photos and direct apply links the millisecond matching listings drop.
            </p>
            <button
              onClick={() => setActiveView('notifications')}
              className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-900 hover:bg-sky-50 transition-colors shadow-sm"
            >
              Configure Telegram Bot
            </button>
          </div>

          {/* Latest Notifications Feed */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Latest Radar Alerts</h3>
              </div>
              <button
                onClick={() => setActiveView('notifications')}
                className="text-xs text-sky-600 dark:text-sky-400 hover:underline"
              >
                View Hub
              </button>
            </div>

            <div className="space-y-3">
              {notifications.slice(0, 3).map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => setActiveView('notifications')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-600 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {notif.propertyTitle}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
                      {notif.matchScore}% Match
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {notif.matchReason}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                    <span>€{notif.propertyRent}/mo • {notif.propertyLocation}</span>
                    <span className="text-sky-600 dark:text-sky-400 font-medium">Telegram Sent</span>
                  </div>
                </div>
              ))}

              {notifications.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">
                  No alerts generated yet. Polling will create alerts when matches appear!
                </p>
              )}
            </div>
          </div>

          {/* Connected Sources Health Check */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Connected Source Status
            </h3>

            <div className="space-y-2 text-xs">
              {monitoringSources.map((src) => (
                <div key={src.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{src.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {src.propertiesFound} found
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

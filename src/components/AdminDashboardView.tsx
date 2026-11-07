import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Users, 
  Building2, 
  Server, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Send,
  Zap,
  Power
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardView: React.FC = () => {
  const { 
    monitoringSources, 
    totalScansCount, 
    properties, 
    triggerManualScan, 
    isScanning,
    lastScanTimestamp 
  } = useProperties();
  const { userProfile, isAdmin } = useAuth();

  const [metrics, setMetrics] = useState<any>({
    totalRegisteredUsers: 1420,
    totalPropertiesDiscovered: properties.length + 331,
    totalPollCycles: totalScansCount,
    notificationDeliveryRate: '99.4%',
    notificationsDispatched: 129,
    telegramSubscribers: 814,
    systemUptime: '99.98%',
    activeSourcesCount: 4,
    recentErrors: [
      { timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), source: 'MyHome Connector', error: 'HTTP 429 Rate Limit - automatically backed off for 30s' },
      { timestamp: new Date(Date.now() - 1000 * 60 * 720).toISOString(), source: 'Irish RSS Feed', error: 'Malformed XML item skipped safely' },
    ],
  });

  const [sourcesState, setSourcesState] = useState(monitoringSources);

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then(res => res.json())
      .then(data => {
        if (data) setMetrics(data);
      })
      .catch(err => console.warn('Could not load admin metrics from server:', err));
  }, []);

  const handleToggleSource = (sourceId: string) => {
    setSourcesState(prev =>
      prev.map(s => {
        if (s.id === sourceId) {
          const nextStatus = s.status === 'active' ? 'paused' : 'active';
          fetch('/api/monitoring/sources/toggle', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId, status: nextStatus }),
          }).catch(console.warn);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              RentRadar Ireland Mission Control
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-1">
            System Administration & Crawler Architecture
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Authorized session for {userProfile?.email || 'admin@rentradar.ie'}
          </p>
        </div>

        <button
          onClick={triggerManualScan}
          disabled={isScanning}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-all disabled:opacity-50 self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Running Diagnostic Crawl...' : 'Trigger Global Portal Sync'}</span>
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Registered Seekers</span>
            <Users className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {metrics.totalRegisteredUsers.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active Irish Renters
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Properties Monitored</span>
            <Building2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {properties.length + 331}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            {totalScansCount} Poll cycles executed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Telegram Delivery</span>
            <Send className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {metrics.notificationDeliveryRate}
          </p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            {metrics.telegramSubscribers} Linked Bots
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">Crawler Uptime</span>
            <Server className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
            {metrics.systemUptime}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Healthy & Operational
          </span>
        </div>

      </div>

      {/* Connected Property Sources Table */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Connected Irish Property Portals & Connectors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modular adapter architecture respecting terms, rate limits and duplicate elimination
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            {sourcesState.filter(s => s.status === 'active').length} of {sourcesState.length} Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Portal Connector</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Interval</th>
                <th className="py-3 px-4">Listings Extracted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sourcesState.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {source.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {source.url}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize text-slate-600 dark:text-slate-300">
                    {source.type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    Every {source.pollIntervalMinutes}m
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {source.propertiesFound}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      source.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {source.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleSource(source.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        source.status === 'active'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                          : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                      }`}
                    >
                      {source.status === 'active' ? 'Pause' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Error & Rate Limiting Incident Log */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>Crawler Diagnostic & Rate-Limit Backoff Log</span>
        </h3>

        <div className="space-y-2">
          {metrics.recentErrors?.map((err: any, idx: number) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-start justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  [{err.source}]
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-300">
                  {err.error}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 ml-4">
                {new Date(err.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

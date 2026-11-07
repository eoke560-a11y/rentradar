import React, { useState } from 'react';
import { 
  Bell, 
  Send, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Trash2, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Radio, 
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Mail
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import { Property } from '../types';

interface NotificationsViewProps {
  onOpenDetails: (prop: Property) => void;
  onOpenAIMatch: (prop: Property) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ 
  onOpenDetails, 
  onOpenAIMatch 
}) => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearAllNotifications,
    properties 
  } = useProperties();
  const { userProfile, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'telegram'>('all');
  const [telegramChatIdInput, setTelegramChatIdInput] = useState(userProfile?.telegramChatId || '849201934');
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.isRead;
    return true;
  });

  const handleSaveTelegram = async () => {
    if (!telegramChatIdInput.trim()) return;
    await updateUserProfile({
      telegramChatId: telegramChatIdInput.trim(),
      telegramConnected: true,
    });
  };

  const handleTestTelegramAlert = async () => {
    setIsTestingTelegram(true);
    setTestResult(null);

    const sampleProperty = properties[0] || {
      title: 'Modern Waterfront 2-Bed Apartment, Grand Canal Dock',
      monthlyRent: 2450,
      area: 'Grand Canal Dock, Dublin 2',
      propertyType: 'apartment',
      bedrooms: 2,
      originalUrl: 'https://www.daft.ie/demo-001',
    };

    try {
      const response = await fetch('/api/notifications/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegramChatIdInput || '849201934',
          property: sampleProperty,
        }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, error: 'Could not connect to Telegram gateway.' });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const copyBotCommand = () => {
    navigator.clipboard.writeText('/start rentradar_ireland');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-sky-500" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Notification & Telegram Alert Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time match alerts, delivery history, and mobile Telegram bot integration.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 transition-colors"
          >
            Mark All Read
          </button>
          <button
            onClick={clearAllNotifications}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setActiveTab('unread')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'unread'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Unread Only ({notifications.filter(n => !n.isRead).length})
        </button>
        <button
          onClick={() => setActiveTab('telegram')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
            activeTab === 'telegram'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram Integration</span>
        </button>
      </div>

      {/* Tab: Telegram Integration Hub */}
      {activeTab === 'telegram' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in">
          
          {/* Telegram Setup Card */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-5">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-400/20">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  RentRadar Telegram Bot (@RentRadarIrelandBot)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant mobile notifications with photos, rent, location, and apply links
                </p>
              </div>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p>
                  Open Telegram and search for <strong>@RentRadarIrelandBot</strong> or click to start chat.
                </p>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <div className="flex-1">
                  <p>Send the activation command:</p>
                  <div className="mt-1.5 flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 font-mono text-xs">
                    <span>/start rentradar_ireland</span>
                    <button
                      onClick={copyBotCommand}
                      className="text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p>
                  Paste your Telegram Chat ID below to link your account to RentRadar's automated crawler.
                </p>
              </div>
            </div>

            {/* Input & Save */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Telegram Chat ID
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 849201934"
                  value={telegramChatIdInput}
                  onChange={(e) => setTelegramChatIdInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                />
                <button
                  onClick={handleSaveTelegram}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 transition-colors"
                >
                  Save ID
                </button>
              </div>
            </div>

            {/* Test Trigger Button */}
            <div>
              <button
                onClick={handleTestTelegramAlert}
                disabled={isTestingTelegram}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isTestingTelegram ? 'animate-spin' : ''}`} />
                <span>{isTestingTelegram ? 'Sending Test Alert...' : 'Send Live Test Alert to Telegram'}</span>
              </button>
            </div>

          </div>

          {/* Test Delivery Payload Inspector */}
          <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-sky-500" />
              <span>Telegram Gateway Delivery Inspector</span>
            </h3>

            {testResult ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Alert dispatched successfully via {testResult.mode || 'Telegram Gateway'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
                  <p className="text-slate-400 mb-2">// Sample Telegram Message Payload:</p>
                  <pre className="whitespace-pre-wrap">{testResult.payload?.formattedMessage || JSON.stringify(testResult, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400 space-y-2">
                <Send className="w-6 h-6 mx-auto text-slate-400" />
                <p>Click "Send Live Test Alert" to verify message delivery and preview format.</p>
              </div>
            )}

            {/* Anti-Duplicate Protection Note */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-200 block">
                🛡 Anti-Duplicate Notification Shield
              </span>
              <p>
                RentRadar tracks portal listing fingerprints and SHA256 hashes. Even if a property is reposted or bumped on Daft or MyHome, you will never receive annoying duplicate alerts.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Notifications List (All & Unread) */}
      {activeTab !== 'telegram' && (
        <div className="space-y-4">
          {filteredNotifs.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifs.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    !notif.isRead
                      ? 'bg-sky-50/50 dark:bg-sky-950/20 border-sky-300 dark:border-sky-800 shadow-sm'
                      : 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Image / Thumbnail */}
                    <img
                      src={notif.propertyImage || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
                      alt={notif.propertyTitle}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {notif.propertyTitle}
                        </h4>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {notif.matchScore}% Match
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {notif.matchReason}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          €{notif.propertyRent.toLocaleString()}/mo
                        </span>
                        <span>•</span>
                        <span>{notif.propertyLocation}</span>
                        <span>•</span>
                        <span>{new Date(notif.createdAt).toLocaleTimeString()}</span>
                        {notif.telegramSent && (
                          <>
                            <span>•</span>
                            <span className="text-sky-600 dark:text-sky-400 font-medium flex items-center space-x-1">
                              <Send className="w-3 h-3" />
                              <span>Telegram Delivered</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800">
                    {notif.property && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAIMatch(notif.property!);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                        >
                          AI Breakdown
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(notif.property!);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-sky-600 text-white"
                        >
                          View Listing
                        </button>
                      </>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 space-y-3">
              <Bell className="w-8 h-8 mx-auto text-slate-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No Notifications in this View
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                When new properties matching your saved searches are detected by the crawler, alerts will populate here.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

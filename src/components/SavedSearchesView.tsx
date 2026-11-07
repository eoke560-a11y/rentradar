import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Edit3, 
  Send, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Search, 
  MapPin, 
  Euro, 
  Bed, 
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { SavedSearch, PropertyType } from '../types';
import { IRISH_COUNTIES } from '../data/mockIrishProperties';
import { useAuth } from '../context/AuthContext';

export const SavedSearchesView: React.FC = () => {
  const { 
    savedSearches, 
    createSavedSearch, 
    updateSavedSearch, 
    deleteSavedSearch, 
    toggleSavedSearch,
    setFilters,
    setActiveView 
  } = useProperties();
  const { userProfile } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [county, setCounty] = useState('Dublin');
  const [town, setTown] = useState('');
  const [maxRent, setMaxRent] = useState<number | ''>(2400);
  const [minRent, setMinRent] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<string>('2');
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>(['apartment']);
  const [keywords, setKeywords] = useState('');
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setCounty('Dublin');
    setTown('');
    setMaxRent(2400);
    setMinRent('');
    setBedrooms('2');
    setPropertyTypes(['apartment']);
    setKeywords('');
    setNotifyTelegram(true);
    setNotifyEmail(true);
    setIsModalOpen(true);
  };

  const openEditModal = (search: SavedSearch) => {
    setEditingId(search.id);
    setName(search.name);
    setCounty(search.county);
    setTown(search.town || '');
    setMaxRent(search.maxRent || '');
    setMinRent(search.minRent || '');
    setBedrooms(search.bedrooms ? String(search.bedrooms) : '');
    setPropertyTypes(search.propertyTypes || ['apartment']);
    setKeywords(search.keywords || '');
    setNotifyTelegram(search.notifyTelegram);
    setNotifyEmail(search.notifyEmail);
    setIsModalOpen(true);
  };

  const handleTypeToggle = (type: PropertyType) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateSavedSearch(editingId, {
        name,
        county,
        town,
        maxRent: maxRent ? Number(maxRent) : undefined,
        minRent: minRent ? Number(minRent) : undefined,
        bedrooms: bedrooms || undefined,
        propertyTypes: propertyTypes.length > 0 ? propertyTypes : ['apartment'],
        keywords,
        notifyTelegram,
        notifyEmail,
      });
    } else {
      createSavedSearch({
        name,
        county,
        town,
        maxRent: maxRent ? Number(maxRent) : undefined,
        minRent: minRent ? Number(minRent) : undefined,
        bedrooms: bedrooms || undefined,
        propertyTypes: propertyTypes.length > 0 ? propertyTypes : ['apartment'],
        keywords,
        isActive: true,
        notifyTelegram,
        notifyEmail,
      });
    }

    setIsModalOpen(false);
  };

  const handleRunSearchInExplorer = (search: SavedSearch) => {
    setFilters({
      county: search.county,
      town: search.town || '',
      minRent: search.minRent || '',
      maxRent: search.maxRent || '',
      bedrooms: search.bedrooms ? String(search.bedrooms) : '',
      propertyType: search.propertyTypes[0] || '',
      furnishing: '',
      keywords: search.keywords || '',
      sortBy: 'newest',
    });
    setActiveView('search');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-sky-500 animate-pulse" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Automated Saved Searches & Alerts
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            RentRadar checks Irish rental portals around the clock. Configure your exact criteria to receive instant push alerts.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-lg shadow-sky-500/25 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Saved Search</span>
        </button>
      </div>

      {/* Telegram reminder banner if not connected */}
      {!userProfile?.telegramChatId && (
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-300">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                Telegram Alerts are recommended for instant rental alerts
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                In Ireland, the first 10 applicants have a 90% higher viewing invitation rate.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('notifications')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-sky-700 dark:text-sky-300 bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            Connect Telegram
          </button>
        </div>
      )}

      {/* Saved Searches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savedSearches.map((search) => (
          <div
            key={search.id}
            className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
              search.isActive
                ? 'bg-white dark:bg-slate-800/90 border-slate-200/80 dark:border-slate-700/80 shadow-md hover:border-sky-300 dark:hover:border-sky-600'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 opacity-70'
            }`}
          >
            <div>
              {/* Header: Title & Status Toggle */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${search.isActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`}></span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {search.name}
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Created {new Date(search.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Active / Paused Switch */}
                <button
                  onClick={() => toggleSavedSearch(search.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${
                    search.isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {search.isActive ? 'Monitoring Active' : 'Paused'}
                </button>
              </div>

              {/* Criteria Summary Pills */}
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>{search.county}{search.town ? ` (${search.town})` : ''}</span>
                </span>

                {search.maxRent && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300">
                    Max €{search.maxRent.toLocaleString()}/mo
                  </span>
                )}

                {search.bedrooms && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300">
                    {search.bedrooms} {search.bedrooms === 1 ? 'Bed' : 'Beds'}
                  </span>
                )}

                {search.propertyTypes && search.propertyTypes.length > 0 && (
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {search.propertyTypes.join(', ')}
                  </span>
                )}

                {search.keywords && (
                  <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 font-medium text-sky-700 dark:text-sky-300">
                    "{search.keywords}"
                  </span>
                )}
              </div>

              {/* Notification Channels */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-4 text-xs">
                <span className="text-slate-400 font-medium">Alerts:</span>
                <span className={`flex items-center space-x-1 font-semibold ${
                  search.notifyTelegram ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 line-through'
                }`}>
                  <Send className="w-3 h-3" />
                  <span>Telegram</span>
                </span>
                <span className={`flex items-center space-x-1 font-semibold ${
                  search.notifyEmail ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 line-through'
                }`}>
                  <Mail className="w-3 h-3" />
                  <span>Email</span>
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {search.matchesCount || 0} Matches Found
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleRunSearchInExplorer(search)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 transition-colors"
                >
                  View Listings
                </button>

                <button
                  onClick={() => openEditModal(search)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  title="Edit Search"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteSavedSearch(search.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Search"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        ))}

        {savedSearches.length === 0 && (
          <div className="col-span-full p-10 text-center rounded-3xl bg-white dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700">
            <Sliders className="w-8 h-8 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              No Saved Searches Yet
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create your first monitoring criteria to let RentRadar track the Irish rental market for you.
            </p>
            <button
              onClick={openCreateModal}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 transition-colors"
            >
              + Create Alert
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-sky-500" />
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {editingId ? 'Edit Saved Search Alert' : 'Create Automated Search Alert'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              
              {/* Alert Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2-Bed Grand Canal or Dublin 4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* County & Town */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    County *
                  </label>
                  <select
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {IRISH_COUNTIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Town or Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ranelagh, Salthill"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Rent & Bedrooms */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Max Monthly Rent (€)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={maxRent}
                    onChange={(e) => setMaxRent(e.target.value ? parseInt(e.target.value) : '')}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Min Bedrooms
                  </label>
                  <select
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Bed / Studio</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4+ Beds</option>
                  </select>
                </div>
              </div>

              {/* Property Types */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Property Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['apartment', 'house', 'studio', 'room'] as PropertyType[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleTypeToggle(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        propertyTypes.includes(t)
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Keywords (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Luas, balcony, parking, pet friendly"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Notification Preferences */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Notification Channels
                </span>

                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={notifyTelegram}
                    onChange={(e) => setNotifyTelegram(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>Send instant Telegram mobile alert (Recommended)</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                  />
                  <span>Send email notification summary</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all"
                >
                  {editingId ? 'Update Alert' : 'Save & Start Monitoring'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

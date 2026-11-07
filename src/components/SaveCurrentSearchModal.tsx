import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Send, 
  Mail, 
  CheckCircle2, 
  Sliders,
  MapPin,
  Euro
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyType } from '../types';

interface SaveCurrentSearchModalProps {
  onClose: () => void;
}

export const SaveCurrentSearchModal: React.FC<SaveCurrentSearchModalProps> = ({ onClose }) => {
  const { filters, createSavedSearch, setActiveView } = useProperties();

  const defaultName = `${filters.county !== 'All Ireland' ? filters.county : 'Ireland'} ${
    filters.bedrooms ? `${filters.bedrooms}-Bed ` : ''
  }${filters.propertyType ? `${filters.propertyType}s ` : 'Rentals '}${
    filters.maxRent ? `under €${filters.maxRent}` : ''
  }`.trim() || 'Custom Irish Rental Alert';

  const [name, setName] = useState(defaultName);
  const [notifyTelegram, setNotifyTelegram] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const propertyTypes: PropertyType[] = filters.propertyType
      ? [filters.propertyType as PropertyType]
      : ['apartment', 'house'];

    createSavedSearch({
      name,
      county: filters.county,
      town: filters.town,
      minRent: filters.minRent ? Number(filters.minRent) : undefined,
      maxRent: filters.maxRent ? Number(filters.maxRent) : undefined,
      bedrooms: filters.bedrooms || undefined,
      propertyTypes,
      keywords: filters.keywords,
      isActive: true,
      notifyTelegram,
      notifyEmail,
    });

    onClose();
    setActiveView('saved-searches');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white shadow-md">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Save Search as Automated Alert
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                RentRadar will continuously check Irish portals for matches
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Alert Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* Current Filter Criteria Summary */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Criteria Being Monitored:
            </span>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Location:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filters.county} {filters.town ? `(${filters.town})` : ''}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Max Rent:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filters.maxRent ? `€${filters.maxRent}/month` : 'Any'}
              </span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Bedrooms:</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {filters.bedrooms ? `${filters.bedrooms} Beds` : 'Any'}
              </span>
            </div>
            {filters.keywords && (
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Keywords:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  "{filters.keywords}"
                </span>
              </div>
            )}
          </div>

          {/* Channels */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyTelegram}
                onChange={(e) => setNotifyTelegram(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="flex items-center space-x-1">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>Send Telegram Instant Alert</span>
              </span>
            </label>

            <label className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
              />
              <span className="flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-indigo-500" />
                <span>Send Email Summary Alert</span>
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              Start Real-Time Alert
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  Heart, 
  ExternalLink, 
  Send, 
  MapPin, 
  Bed, 
  Bath, 
  Building2, 
  Home, 
  Sparkles, 
  Calendar, 
  Clock, 
  Train, 
  Bus, 
  Footprints, 
  ShieldCheck, 
  Phone,
  CheckCircle2
} from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onOpenAIMatch: (prop: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({ 
  property, 
  onClose, 
  onOpenAIMatch 
}) => {
  const { isPropertySaved, toggleSaveProperty } = useProperties();
  const { userProfile } = useAuth();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [telegramSending, setTelegramSending] = useState(false);
  const [telegramSuccess, setTelegramSuccess] = useState(false);

  const isSaved = isPropertySaved(property.id);
  const images = property.images && property.images.length > 0 ? property.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'];

  const handleSendTelegramTest = async () => {
    setTelegramSending(true);
    setTelegramSuccess(false);

    try {
      await fetch('/api/notifications/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: userProfile?.telegramChatId || '849201934',
          property,
        }),
      });
      setTelegramSuccess(true);
      setTimeout(() => setTelegramSuccess(false), 3500);
    } catch (err) {
      console.warn('Telegram test alert error:', err);
    } finally {
      setTelegramSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="relative h-72 sm:h-80 w-full bg-slate-950">
          <img
            src={images[activeImgIdx]}
            alt={property.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40 pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Demo Data Tag */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider shadow-md">
            DEMO DATA
          </div>

          {/* Image Thumbnail Selector */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4 z-20 flex space-x-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    idx === activeImgIdx ? 'border-sky-400 scale-105 shadow-md' : 'border-white/40 opacity-70'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(100vh-22rem)] overflow-y-auto">
          
          {/* Header & Pricing */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  €{property.monthlyRent.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  /month
                </span>
                {property.berRating && (
                  <span className="ml-2 text-xs font-black px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    BER {property.berRating}
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-xl font-extrabold text-slate-900 dark:text-white">
                {property.title}
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <span>{property.address || `${property.area}, Co. ${property.county}`}</span>
              </p>
            </div>

            {/* Save & AI Match Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onOpenAIMatch(property)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 flex items-center space-x-1.5 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-sky-500" />
                <span>AI Breakdown</span>
              </button>

              <button
                onClick={() => toggleSaveProperty(property)}
                className={`p-2.5 rounded-xl border transition-colors ${
                  isSaved
                    ? 'bg-rose-500 border-rose-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title={isSaved ? 'Saved to Bookmarks' : 'Save Property'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Bedrooms</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Bathrooms</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Property Type</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block capitalize">
                {property.propertyType}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Furnishing</span>
              <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block capitalize">
                {property.furnishing}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Property Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Irish Commute & Transit Score */}
          {property.commuteInfo && (
            <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200/80 dark:border-sky-800/60 space-y-3">
              <h3 className="text-xs font-bold text-sky-900 dark:text-sky-200 uppercase tracking-wider flex items-center space-x-2">
                <Footprints className="w-4 h-4 text-sky-600" />
                <span>Irish Transit & Commuter Connectivity</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {property.commuteInfo.luas && (
                  <div className="flex items-center space-x-2">
                    <Train className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Luas Green/Red</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{property.commuteInfo.luas}</span>
                    </div>
                  </div>
                )}
                {property.commuteInfo.dart && (
                  <div className="flex items-center space-x-2">
                    <Train className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">DART / Train</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{property.commuteInfo.dart}</span>
                    </div>
                  </div>
                )}
                {property.commuteInfo.bus && (
                  <div className="flex items-center space-x-2">
                    <Bus className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Dublin Bus / TFI</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{property.commuteInfo.bus}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features / Amenities */}
          {property.features && property.features.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Key Features
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feat, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Agent Demo Info & Telegram Test Button */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Letting Agency</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {property.agentName || 'Premier Dublin Lettings Ltd'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {property.agentPhone || '+353 (01) 492 1100'} • Source: {property.sourceName}
              </p>
            </div>

            <button
              onClick={handleSendTelegramTest}
              disabled={telegramSending}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{telegramSending ? 'Dispatching...' : telegramSuccess ? 'Sent to Telegram!' : 'Test Send via Telegram'}</span>
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Discovered {new Date(property.discoveredAt).toLocaleTimeString()} by RentRadar
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Close
            </button>

            <a
              href={property.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 hover:text-white transition-colors shadow-md"
            >
              <span>View On {property.sourceName}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

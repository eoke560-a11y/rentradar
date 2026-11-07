import React, { useState } from 'react';
import { 
  Heart, 
  ExternalLink, 
  Sparkles, 
  Bed, 
  Bath, 
  MapPin, 
  Clock, 
  Calendar, 
  Home, 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Property } from '../types';
import { useProperties } from '../context/PropertyContext';

interface PropertyCardProps {
  property: Property;
  onOpenDetails: (prop: Property) => void;
  onOpenAIMatch: (prop: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onOpenDetails, 
  onOpenAIMatch 
}) => {
  const { isPropertySaved, toggleSaveProperty } = useProperties();
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const isSaved = isPropertySaved(property.id);

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Format discovery time relative
  const getDiscoveredTimeText = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <div className="group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-xl hover:border-sky-300 dark:hover:border-sky-600 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onOpenDetails(property)}>
        <img
          src={images[currentImgIdx]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />

        {/* Mandatory DEMO DATA Badge */}
        {property.isDemo && (
          <div className="absolute top-3 left-3 z-10 flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-black tracking-wider uppercase shadow-md">
            <span>DEMO DATA</span>
          </div>
        )}

        {/* Source indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[11px] font-semibold text-white/90 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{property.sourceName}</span>
          </span>
        </div>

        {/* Save / Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveProperty(property);
          }}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:scale-110'
          }`}
          title={isSaved ? 'Remove from saved' : 'Save property'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Photo carousel arrows if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel dots */}
            <div className="absolute bottom-3 right-3 z-10 flex space-x-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImgIdx ? 'bg-sky-400 w-3' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Price & BER Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                €{property.monthlyRent.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                /month
              </span>
            </div>

            {property.berRating && (
              <span className={`text-[11px] font-black px-2 py-0.5 rounded border ${
                property.berRating.startsWith('A')
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : property.berRating.startsWith('B')
                  ? 'bg-lime-100 dark:bg-lime-950/60 text-lime-800 dark:text-lime-300 border-lime-300 dark:border-lime-800'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
              }`}>
                BER {property.berRating}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(property)}
            className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <span className="truncate">{property.address || `${property.area}, Co. ${property.county}`}</span>
          </div>

          {/* Specs: Beds, Baths, Property Type, Furnishing */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <div className="flex items-center space-x-1.5">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center space-x-1.5 capitalize">
              {property.propertyType === 'house' ? <Home className="w-3.5 h-3.5 text-slate-400" /> : <Building2 className="w-3.5 h-3.5 text-slate-400" />}
              <span className="truncate">{property.propertyType}</span>
            </div>
          </div>

          {/* Discovery Timestamp & Published Timestamp */}
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center space-x-1 text-sky-600 dark:text-sky-400 font-medium">
              <Zap className="w-3 h-3" />
              <span>Radar: {getDiscoveredTimeText(property.discoveredAt)}</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Calendar className="w-3 h-3" />
              <span>Listed: {new Date(property.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
          
          {/* AI Match Button */}
          <button
            onClick={() => onOpenAIMatch(property)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>AI Match</span>
          </button>

          {/* View Details / Original */}
          <a
            href={property.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center space-x-1 py-2 px-3 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Open original listing website"
          >
            <span>Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          {/* Details modal trigger */}
          <button
            onClick={() => onOpenDetails(property)}
            className="py-2 px-3 rounded-xl text-xs font-semibold text-white bg-slate-900 dark:bg-sky-600 hover:bg-sky-700 transition-colors"
          >
            Details
          </button>
        </div>

      </div>

    </div>
  );
};

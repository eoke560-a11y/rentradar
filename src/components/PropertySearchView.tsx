import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Bookmark, 
  RotateCcw, 
  MapPin, 
  Euro, 
  Bed, 
  Home, 
  Layers, 
  Sliders,
  CheckCircle2,
  ArrowUpDown
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { PropertyCard } from './PropertyCard';
import { IRISH_COUNTIES } from '../data/mockIrishProperties';
import { Property } from '../types';

interface PropertySearchViewProps {
  onOpenDetails: (prop: Property) => void;
  onOpenAIMatch: (prop: Property) => void;
  onOpenAISearch: () => void;
  onSaveCurrentSearch: () => void;
}

export const PropertySearchView: React.FC<PropertySearchViewProps> = ({
  onOpenDetails,
  onOpenAIMatch,
  onOpenAISearch,
  onSaveCurrentSearch,
}) => {
  const { 
    filteredProperties, 
    filters, 
    setFilters, 
    resetFilters,
    properties 
  } = useProperties();

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  const handleCountyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, county: e.target.value }));
  };

  const handleTownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, town: e.target.value }));
  };

  const handleMinRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value) : '';
    setFilters(prev => ({ ...prev, minRent: val }));
  };

  const handleMaxRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value) : '';
    setFilters(prev => ({ ...prev, maxRent: val }));
  };

  const handleBedroomsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, bedrooms: e.target.value }));
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, propertyType: e.target.value }));
  };

  const handleFurnishingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, furnishing: e.target.value }));
  };

  const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, keywords: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as any }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Search Header & Controls */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-5">
        
        {/* Top Search Bar & Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Irish Rental Property Search
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Filter through verified Dublin, Cork, Galway and nationwide listings discovered by RentRadar
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAISearch}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500/10 to-indigo-500/10 hover:from-sky-500/20 hover:to-indigo-500/20 text-sky-700 dark:text-sky-300 border border-sky-300/40 dark:border-sky-500/30 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>AI Search Parser</span>
            </button>

            <button
              onClick={onSaveCurrentSearch}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Save As Real-Time Alert</span>
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
              title="Reset all search filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Primary Filter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
          
          {/* County */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              County
            </label>
            <div className="relative">
              <select
                value={filters.county}
                onChange={handleCountyChange}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              >
                {IRISH_COUNTIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Town or City */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Town or City / Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Grand Canal, Ranelagh, Salthill"
                value={filters.town}
                onChange={handleTownChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Rent Range (Min / Max) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Min Rent (€)
              </label>
              <input
                type="number"
                placeholder="Min €"
                value={filters.minRent}
                onChange={handleMinRentChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Max Rent (€)
              </label>
              <input
                type="number"
                placeholder="Max €"
                value={filters.maxRent}
                onChange={handleMaxRentChange}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Bedrooms
            </label>
            <select
              value={filters.bedrooms}
              onChange={handleBedroomsChange}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Any Bedrooms</option>
              <option value="1">1 Bedroom / Studio</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4+">4+ Bedrooms</option>
            </select>
          </div>

        </div>

        {/* Secondary Filter Row: Property Type, Furnishing, Keywords, Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          
          {/* Property Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Property Type
            </label>
            <select
              value={filters.propertyType}
              onChange={handlePropertyTypeChange}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">All Types (House, Apt, Studio, Room)</option>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="studio">Studio</option>
              <option value="room">Room / Shared</option>
            </select>
          </div>

          {/* Furnishing Status */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Furnishing
            </label>
            <select
              value={filters.furnishing}
              onChange={handleFurnishingChange}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Any Furnishing</option>
              <option value="furnished">Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Luas, DART, parking, balcony"
                value={filters.keywords}
                onChange={handleKeywordsChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Sorting */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Sort By</span>
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
            </label>
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
            >
              <option value="newest">Newest Discovered First</option>
              <option value="rent_asc">Lowest Monthly Rent First</option>
              <option value="rent_desc">Highest Monthly Rent First</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Header: Count & Active Criteria Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {filteredProperties.length} Properties Matching Filters
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            (out of {properties.length} total monitored)
          </span>
        </div>

        {/* Demonstration Disclaimer reminder */}
        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center space-x-1">
          <span>⚠️ All listings marked as DEMO DATA for realistic evaluation</span>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onOpenDetails={onOpenDetails}
              onOpenAIMatch={onOpenAIMatch}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Properties Match This Exact Criteria
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try broadening your budget range, clearing keyword filters, or setting an automated Real-Time Saved Search so RentRadar notifies you as soon as one is posted.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={onSaveCurrentSearch}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors shadow-sm"
            >
              Save As Automated Alert
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

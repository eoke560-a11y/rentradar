import React, { useEffect, useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck,
  Building2,
  Euro
} from 'lucide-react';
import { Property, AIMatchResult } from '../types';
import { useProperties } from '../context/PropertyContext';

interface AIMatchModalProps {
  property: Property;
  onClose: () => void;
}

export const AIMatchModal: React.FC<AIMatchModalProps> = ({ property, onClose }) => {
  const { filters, savedSearches } = useProperties();
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState<AIMatchResult | null>(null);

  // Use the user's active saved search or current filters
  const criteria = savedSearches[0] || {
    county: filters.county !== 'All Ireland' ? filters.county : property.county,
    maxRent: filters.maxRent || 2500,
    bedrooms: filters.bedrooms || property.bedrooms,
    propertyType: filters.propertyType || property.propertyType,
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch('/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property,
        searchCriteria: criteria,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.match) {
          setMatchData(data.match);
        }
      })
      .catch((err) => {
        console.warn('AI Match fetch error:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [property]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Intelligent AI Match Analysis
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Powered by Gemini 2.5 Flash & Irish Rental Market Data
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

        {/* Property Brief */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center space-x-3">
          <img
            src={property.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=200&q=80'}
            alt={property.title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
              {property.title}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              €{property.monthlyRent.toLocaleString()}/mo • {property.bedrooms} Bed {property.propertyType} • {property.area}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto text-sky-500 animate-spin" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Evaluating Rental Crisis Demand & Search Fit...
            </p>
            <p className="text-[11px] text-slate-400">
              Assessing BER energy efficiency, transit proximity, and market rent benchmarks
            </p>
          </div>
        ) : matchData ? (
          <div className="space-y-4">
            
            {/* Score & Demand Gauges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                    Match Score
                  </span>
                  <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mt-0.5">
                    {matchData.score}%
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full bg-sky-600/10 flex items-center justify-center font-bold text-sky-600">
                  {matchData.score >= 85 ? '🌟' : '👍'}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    Applicant Competition
                  </span>
                  <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1 flex items-center space-x-1">
                    <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <span>{matchData.estimatedDemandScore || 'Extreme'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-400 text-right">
                  High Inquiry
                </span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
              <span className="font-bold block mb-1 text-slate-900 dark:text-white">
                RentRadar Analysis:
              </span>
              {matchData.explanation}
            </div>

            {/* Pros & Cons */}
            <div className="space-y-2 text-xs">
              {matchData.pros?.map((pro, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
              {matchData.cons?.map((con, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>

            {/* RTB Benchmark */}
            {matchData.marketRentComparison && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>Irish RTB Index Benchmark:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {matchData.marketRentComparison}
                </span>
              </div>
            )}

          </div>
        ) : null}

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 dark:bg-sky-600 text-white hover:bg-sky-700 transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};

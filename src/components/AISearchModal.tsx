import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  ArrowRight, 
  Lightbulb, 
  RefreshCw,
  Send
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';

interface AISearchModalProps {
  onClose: () => void;
}

export const AISearchModal: React.FC<AISearchModalProps> = ({ onClose }) => {
  const { setFilters, setActiveView } = useProperties();
  const [prompt, setPrompt] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const samplePrompts = [
    'Looking for a 2-bed apartment in Dublin near Grand Canal Dock or D4 under €2,500 with a balcony and Luas',
    'Charming 3-bed family house in Galway Salthill near the sea under €2,400 with garden',
    'Modern 1-bed apartment or studio in Cork Victorian Quarter under €2,100 furnished',
    'Double room to rent in Swords or Dublin 8 with utilities included under €1,100',
  ];

  const handleParseAndApply = async (textToParse: string) => {
    const text = textToParse || prompt;
    if (!text.trim()) return;

    setIsParsing(true);

    try {
      const response = await fetch('/api/ai/parse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await response.json();

      if (data.filters) {
        setFilters(prev => ({
          ...prev,
          county: data.filters.county || 'All Ireland',
          town: data.filters.town || '',
          minRent: data.filters.minRent ?? '',
          maxRent: data.filters.maxRent ?? '',
          bedrooms: data.filters.bedrooms ? String(data.filters.bedrooms) : '',
          propertyType: data.filters.propertyType || '',
          furnishing: data.filters.furnishing || '',
          keywords: data.filters.keywords || '',
          sortBy: 'newest',
        }));

        setActiveView('search');
        onClose();
      }
    } catch (err) {
      console.warn('AI query parse error:', err);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Natural-Language Property Search
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Describe your dream Irish accommodation in plain English
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

        {/* Input Textarea */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Find me a quiet 2-bedroom apartment in Dublin near Grand Canal Dock under €2,500 with a balcony and parking..."
            className="w-full p-3.5 rounded-2xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-sky-500 resize-none transition-all"
          />

          <button
            onClick={() => handleParseAndApply(prompt)}
            disabled={isParsing || !prompt.trim()}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            {isParsing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Interpreting Accommodation Requirements...</span>
              </>
            ) : (
              <>
                <span>Parse Criteria & Search Listings</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Example prompts */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Try one of these real Irish rental scenarios:</span>
          </div>

          <div className="space-y-1.5">
            {samplePrompts.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(sample);
                  handleParseAndApply(sample);
                }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/60 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 transition-colors"
              >
                "{sample}"
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

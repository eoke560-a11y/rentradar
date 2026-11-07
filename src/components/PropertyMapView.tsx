import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Layers, 
  ExternalLink, 
  Heart, 
  Sparkles, 
  Building2, 
  Bed, 
  Bath, 
  X,
  Compass
} from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';

interface PropertyMapViewProps {
  onOpenDetails: (prop: Property) => void;
  onOpenAIMatch: (prop: Property) => void;
}

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({ 
  onOpenDetails, 
  onOpenAIMatch 
}) => {
  const { filteredProperties, toggleSaveProperty, isPropertySaved } = useProperties();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedMapProperty, setSelectedMapProperty] = useState<Property | null>(null);

  const zoomPresets = [
    { name: 'All Ireland', center: [53.4, -7.9] as [number, number], zoom: 7 },
    { name: 'Dublin & East', center: [53.3441, -6.25] as [number, number], zoom: 11 },
    { name: 'Cork City', center: [51.9015, -8.4633] as [number, number], zoom: 12 },
    { name: 'Galway Bay', center: [53.265, -9.07] as [number, number], zoom: 12 },
    { name: 'Limerick', center: [52.6685, -8.58] as [number, number], zoom: 12 },
  ];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [53.4, -7.9],
        zoom: 7,
        zoomControl: true,
      });

      // Sleek CartoDB Positron / OSM tiles for clean SaaS aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Sync property markers on map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    filteredProperties.forEach((prop) => {
      if (!prop.latitude || !prop.longitude) return;

      // Custom HTML Marker Pill showing rent in €
      const customIcon = L.divIcon({
        className: 'custom-rent-pin',
        html: `
          <div style="
            background: #0284c7;
            color: white;
            font-weight: 800;
            font-size: 11px;
            padding: 4px 8px;
            border-radius: 9999px;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.45);
            border: 2px solid white;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: translate(-50%, -50%);
          ">
            <span>€${prop.monthlyRent}</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([prop.latitude, prop.longitude], { icon: customIcon });

      marker.on('click', () => {
        setSelectedMapProperty(prop);
        map.panTo([prop.latitude, prop.longitude], { animate: true });
      });

      marker.addTo(layer);
    });
  }, [filteredProperties]);

  const handleZoomTo = (center: [number, number], zoom: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  };

  return (
    <div className="relative h-[calc(100vh-10rem)] w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col animate-in fade-in">
      
      {/* Map Control Toolbar */}
      <div className="absolute top-4 left-4 z-[500] flex flex-wrap items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
        <div className="flex items-center space-x-1 px-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Compass className="w-3.5 h-3.5 text-sky-500" />
          <span>Quick Hubs:</span>
        </div>

        {zoomPresets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleZoomTo(preset.center, preset.zoom)}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Map Properties Count Pill */}
      <div className="absolute top-4 right-4 z-[500] bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg border border-slate-700 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{filteredProperties.length} Properties Plotted</span>
      </div>

      {/* The Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Selected Property Float Card Overlay */}
      {selectedMapProperty && (
        <div className="absolute bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[600] animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-4 flex flex-col space-y-3 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedMapProperty(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Property Photo & Details */}
            <div className="flex space-x-3.5">
              <img
                src={selectedMapProperty.images[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'}
                alt={selectedMapProperty.title}
                className="w-24 h-24 rounded-xl object-cover shrink-0"
              />

              <div className="flex-1 min-w-0 pr-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  DEMO DATA
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {selectedMapProperty.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {selectedMapProperty.area}, Co. {selectedMapProperty.county}
                </p>

                <div className="mt-2 flex items-baseline space-x-1.5">
                  <span className="text-base font-black text-slate-900 dark:text-white">
                    €{selectedMapProperty.monthlyRent.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-slate-400">/mo</span>
                  {selectedMapProperty.berRating && (
                    <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      BER {selectedMapProperty.berRating}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="flex items-center space-x-4 text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
              <div className="flex items-center space-x-1">
                <Bed className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedMapProperty.bedrooms} Beds</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedMapProperty.bathrooms} Baths</span>
              </div>
              <div className="capitalize">
                <span>{selectedMapProperty.propertyType}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-2">
              <button
                onClick={() => onOpenAIMatch(selectedMapProperty)}
                className="flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center justify-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>AI Match</span>
              </button>

              <button
                onClick={() => toggleSaveProperty(selectedMapProperty)}
                className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                  isPropertySaved(selectedMapProperty.id)
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                title="Save Property"
              >
                <Heart className={`w-3.5 h-3.5 ${isPropertySaved(selectedMapProperty.id) ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onOpenDetails(selectedMapProperty)}
                className="flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold bg-slate-900 dark:bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                Full Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

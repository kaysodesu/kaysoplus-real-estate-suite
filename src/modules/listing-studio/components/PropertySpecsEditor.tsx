import React from 'react';
import { Sliders, Sparkles, Check } from 'lucide-react';
import { ClientRecord } from '../types';

interface PropertySpecsEditorProps {
  client: ClientRecord;
  onUpdateClientSpecs: (updated: {
    sqft: string;
    beds: string;
    features: string;
  }) => void;
}

const COMMON_TAGS = [
  'Custom Infinity Pool',
  "Chef's Wolf/Sub-Zero Kitchen",
  'Italian Marble Floors',
  'Panoramic Sunset Views',
  'Level 2 EV Charger',
  'Smart Home Automation',
  'Private Elevator Foyer',
  'Walk-in Wine Cellar',
  'Top-Rated School District',
  'Fenced Landscaped Yard',
  '24/7 Concierge',
  'Wraparound Balcony',
];

export const PropertySpecsEditor: React.FC<PropertySpecsEditorProps> = ({
  client,
  onUpdateClientSpecs,
}) => {
  const handleTagClick = (tag: string) => {
    let current = client.features || '';
    if (current.includes(tag)) {
      // Remove tag
      const updated = current
        .replace(new RegExp(`(, )?${tag}`, 'g'), '')
        .replace(/^, /, '')
        .trim();
      onUpdateClientSpecs({
        sqft: client.sqft,
        beds: client.beds,
        features: updated,
      });
    } else {
      // Append tag
      const updated = current ? `${current}, ${tag}` : tag;
      onUpdateClientSpecs({
        sqft: client.sqft,
        beds: client.beds,
        features: updated,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Property Specifications & AI Context
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Live Sync
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Square Footage
          </label>
          <input
            type="text"
            id="prop-sqft"
            value={client.sqft}
            onChange={(e) =>
              onUpdateClientSpecs({
                sqft: e.target.value,
                beds: client.beds,
                features: client.features,
              })
            }
            placeholder="e.g. 4,850 sq ft"
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">
            Bedrooms / Bathrooms
          </label>
          <input
            type="text"
            id="prop-beds"
            value={client.beds}
            onChange={(e) =>
              onUpdateClientSpecs({
                sqft: client.sqft,
                beds: e.target.value,
                features: client.features,
              })
            }
            placeholder="e.g. 5 Beds, 6 Baths"
            className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Raw Feature Notes (Listing USPs & Architecture)
        </label>
        <textarea
          id="prop-features"
          rows={3}
          value={client.features}
          onChange={(e) =>
            onUpdateClientSpecs({
              sqft: client.sqft,
              beds: client.beds,
              features: e.target.value,
            })
          }
          placeholder="List unique selling features, school district info, high-end appliance brands, sunset views..."
          className="w-full px-3 py-2 bg-slate-50/70 border border-slate-200 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Quick Amenities Tag Chips */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 text-[11px] font-semibold text-slate-500">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Click to add/remove amenity keywords:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_TAGS.map((tag, idx) => {
            const isIncluded = (client.features || '').includes(tag);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleTagClick(tag)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 font-medium cursor-pointer ${
                  isIncluded
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {isIncluded && <Check className="w-3 h-3 text-blue-600" />}
                <span>{tag}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

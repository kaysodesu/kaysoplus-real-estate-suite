import React, { useState } from 'react';
import { X, Sparkles, Wand2, Home, Check } from 'lucide-react';
import { ClientRecord } from '../types';
import { useRealEstateData } from '../../../data/RealEstateDataContext';

interface IntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveClient: (client: ClientRecord) => void;
}

const PRESET_TEMPLATES = [
  {
    label: '✨ Luxury Waterfront',
    name: 'Harrison Vance',
    property: '880 Ocean Promenade (Coastal Estate)',
    sqft: '6,200 sq ft',
    beds: '6 Beds, 7 Baths',
    features: 'Private deep-water yacht dock, infinity edge saltwater pool, custom glass wine cellar, Wolf/Sub-Zero appliances, private elevator, panoramic coastal views.',
    tags: ['Waterfront', 'Yacht Dock', 'Ultra Luxury'],
  },
  {
    label: '🔑 Suburban Family Home',
    name: 'Elena Rostova',
    property: '412 Whispering Pines Way (Highland Park)',
    sqft: '3,100 sq ft',
    beds: '4 Beds, 3.5 Baths',
    features: 'Blue-ribbon school district, fenced 0.5-acre landscaped backyard, gourmet chef island, heated 3-car garage with level 2 EV charger, finished basement.',
    tags: ['Family Ready', 'Top Schools', 'Large Lot'],
  },
  {
    label: '🌆 Skyline Penthouse',
    name: 'Alexander Sterling',
    property: 'Apex Tower Suite 52 (Downtown Metro)',
    sqft: '2,400 sq ft',
    beds: '3 Beds, 3 Baths',
    features: '360-degree city views, private wraparound sky terrace, motorized custom blackout drapery, 24/7 concierge, private rooftop plunge pool access.',
    tags: ['Penthouse', 'Skyline Views', 'Concierge'],
  },
];

export const IntakeModal: React.FC<IntakeModalProps> = ({
  isOpen,
  onClose,
  onSaveClient,
}) => {
  const [name, setName] = useState('');
  const [property, setProperty] = useState('');
  const [sqft, setSqft] = useState('');
  const [beds, setBeds] = useState('');
  const [features, setFeatures] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { properties: inventory } = useRealEstateData();

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setName(preset.name);
    setProperty(preset.property);
    setSqft(preset.sqft);
    setBeds(preset.beds);
    setFeatures(preset.features);
    setErrorMessage('');
  };

  const handleSave = () => {
    const trimmedName = name.trim();
    const trimmedProperty = property.trim();
    const trimmedSqft = sqft.trim();
    const trimmedBeds = beds.trim();
    const trimmedFeatures = features.trim();

    if (!trimmedName || !trimmedProperty) {
      setErrorMessage('Please enter at least a client name and a property reference descriptor!');
      return;
    }

    const newKey = 'client_' + trimmedName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Date.now().toString().slice(-4);

    const newClient: ClientRecord = {
      id: newKey,
      name: trimmedName,
      property: trimmedProperty,
      subtitle: `Managing listing assets for ${trimmedProperty}`,
      sqft: trimmedSqft || 'N/A',
      beds: trimmedBeds || 'N/A',
      features: trimmedFeatures || 'No additional features provided.',
      tags: ['New Intake', 'Active'],
      createdAt: new Date().toISOString(),
      outputs: {
        luxury: `✨ ICONIC STATEMENT RESIDENCE: TOURS OPEN ✨\n\nIntroducing a masterfully tailored living experience at ${trimmedProperty}.\n\nSpecs Checklist:\n• Architectural Blueprint: ${trimmedSqft || 'Custom Size'}\n• Layout Masterwork: ${trimmedBeds || 'Premium Count'}\n\nCore Lifestyle Elements:\n${trimmedFeatures || 'Elite custom detailing throughout.'}\n\nThis curated inventory block sets a new standard for luxury operational design. Connect for calendar booking rules.`,
        first_time: `🔑 COMPACT SOVEREIGNTY ARCHITECTURE 🔑\n\nStop missing out on real equity growth. Welcome home to ${trimmedProperty}!\n\nThis turn-key asset provides an optimal footprint of ${trimmedSqft || 'spacious proportions'} and a gorgeous ${trimmedBeds || 'highly functional'} layout configuration.\n\nHighlights Include:\n📌 ${trimmedFeatures || 'Premium location tags and top-tier amenities.'}\n\nBuilt for high-turnover productivity. Own your tomorrow.`,
        social_thread: `1/ Big news for real estate acquisition teams. A pristine high-volume opportunity has hit the board at ${trimmedProperty}. Full breakdown on the design assets below 👇\n\n2/ Space breakdown: Leveraging an expansive footprint of ${trimmedSqft || 'premium volume'} with an optimized ${trimmedBeds || 'accommodation template'}.\n\n3/ The critical value driver here lies in the feature matrix: ${trimmedFeatures || 'High-end custom construction assets throughout.'}\n\n4/ DM the studio queue right now to lock down priority file review paths. This inventory asset is moving fast.`,
        zillow_optimized: `Exceptional opportunity to capture premium real estate tracking values at ${trimmedProperty}. Spanning an efficient ${trimmedSqft || 'open design layout'} with ${trimmedBeds || 'masterfully executed spaces'}. Highlight features include: ${trimmedFeatures || 'Exquisite custom elements throughout.'} Turn-key and market optimized.`
      }
    };

    onSaveClient(newClient);

    // Reset inputs
    setName('');
    setProperty('');
    setSqft('');
    setBeds('');
    setFeatures('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div id="intake-modal" className="modal-overlay">
      <div className="modal-card border border-slate-200 bg-white">
        {/* Header */}
        <div className="modal-header px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              📋
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                New Client Intake Questionnaire
              </h3>
              <p className="text-xs text-slate-500">
                Onboard client details to automatically map 4 AI listing formulas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="close-modal-btn w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick presets */}
          <div>
            <label className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1 mb-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Quick Demo Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_TEMPLATES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-left text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-700 hover:text-blue-900 transition-all font-medium"
                >
                  <span className="block font-semibold truncate">{p.label}</span>
                  <span className="text-[10px] text-slate-500 truncate block mt-0.5">{p.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pull a property straight from Property Operations' inventory */}
          {inventory.length > 0 && (
            <div className="form-group space-y-1.5">
              <label htmlFor="intake-from-inventory" className="text-[11px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1">
                <Home className="w-3 h-3 text-blue-500" />
                Fill from Property Inventory
              </label>
              <select
                id="intake-from-inventory"
                defaultValue=""
                onChange={e => {
                  const p = inventory.find(x => x.id === e.target.value);
                  if (!p) return;
                  const rooms = p.units.reduce((sum, u) => sum + u.totalRooms, 0);
                  setProperty(`${p.address}, ${p.city}, ${p.state} ${p.zipCode} (${p.type})`);
                  setSqft(`${p.squareFeet.toLocaleString()} sq ft`);
                  setBeds(`${rooms} Room${rooms === 1 ? '' : 's'} across ${p.units.length} unit${p.units.length === 1 ? '' : 's'}`);
                  setFeatures(p.amenities.join(', '));
                  setErrorMessage('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="" disabled>Choose a property you manage…</option>
                {inventory.map(p => (
                  <option key={p.id} value={p.id}>{p.address}, {p.city}</option>
                ))}
              </select>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 text-xs bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              {errorMessage}
            </div>
          )}

          <div className="form-group space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Client Full Name <span className="text-red-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">Agent or Owner</span>
            </label>
            <input
              type="text"
              id="new-client-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g., Robert Sterling"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="form-group space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Property Address / Classification <span className="text-red-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-400">Street & Property Type</span>
            </label>
            <input
              type="text"
              id="new-client-property"
              value={property}
              onChange={(e) => {
                setProperty(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="e.g., 555 Ocean Dr (Waterfront Luxury)"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Square Footage
              </label>
              <input
                type="text"
                id="new-prop-sqft"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                placeholder="e.g., 4,500 sq ft"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="form-group space-y-1.5">
              <label className="text-xs font-semibold text-slate-800">
                Bedrooms / Bathrooms
              </label>
              <input
                type="text"
                id="new-prop-beds"
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                placeholder="e.g., 5 Beds, 5.5 Baths"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="form-group space-y-1.5">
            <label className="text-xs font-semibold text-slate-800 flex items-center justify-between">
              <span>Raw Feature Notes (AI Context)</span>
              <span className="text-[11px] font-normal text-slate-400">Amenities & USPs</span>
            </label>
            <textarea
              id="new-prop-features"
              rows={3}
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="List unique selling features, local school notes, high-end appliance brands, sunset views, custom pool, EV charger..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-generate px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Onboard Client & Map Prompts ⚡</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

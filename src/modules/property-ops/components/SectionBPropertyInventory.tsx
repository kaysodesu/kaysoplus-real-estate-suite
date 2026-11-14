import React, { useState } from 'react';
import { PropertyInventory, RoomInventory } from '../types';
import { 
  Building2, 
  MapPin, 
  Sliders, 
  DollarSign, 
  Layers, 
  Sparkles, 
  Check, 
  Zap, 
  Droplets, 
  Flame, 
  Trash2, 
  Wifi, 
  ShieldCheck, 
  DoorClosed, 
  Plus, 
  Info,
  RefreshCw
} from 'lucide-react';

interface SectionBPropertyInventoryProps {
  properties: PropertyInventory[];
  selectedPropertyId: string;
  onSelectProperty: (id: string) => void;
  onUpdateProperty: (updated: PropertyInventory) => void;
}

export const SectionBPropertyInventory: React.FC<SectionBPropertyInventoryProps> = ({
  properties,
  selectedPropertyId,
  onSelectProperty,
  onUpdateProperty,
}) => {
  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const activeUnit = property.units[activeUnitIdx] || property.units[0];

  // Room recalculator helper
  // Base sqft weighting + bathroom type premium + exterior access door premium
  const recalculateRoomSplits = (rooms: RoomInventory[], totalRent: number) => {
    if (rooms.length === 0) return [];

    const totalSqFt = rooms.reduce((acc, r) => acc + (r.squareFeet || 100), 0);
    
    // Weight calculation
    const roomWeights = rooms.map((r) => {
      const sqFtFactor = (r.squareFeet || 100) / totalSqFt;
      const bathBonus = r.bathroomType === 'private' ? 0.08 : 0;
      const doorBonus = r.privateAccessDoor !== 'none' ? 0.05 : 0;
      return {
        id: r.id,
        weight: sqFtFactor + bathBonus + doorBonus,
      };
    });

    const sumWeights = roomWeights.reduce((acc, rw) => acc + rw.weight, 0);

    return rooms.map((room) => {
      const match = roomWeights.find((rw) => rw.id === room.id);
      const calculated = match ? Math.round((match.weight / sumWeights) * totalRent) : Math.round(totalRent / rooms.length);
      return {
        ...room,
        calculatedRent: calculated,
      };
    });
  };

  const handleUpdateRoom = (roomId: string, updates: Partial<RoomInventory>) => {
    const updatedRooms = activeUnit.rooms.map((r) => (r.id === roomId ? { ...r, ...updates } : r));
    const recalculated = recalculateRoomSplits(updatedRooms, property.totalHomeRent);

    const updatedUnits = property.units.map((u, idx) =>
      idx === activeUnitIdx ? { ...u, rooms: recalculated } : u
    );

    onUpdateProperty({
      ...property,
      units: updatedUnits,
    });
  };

  const handleAddRoom = () => {
    const newRoom: RoomInventory = {
      id: `room-${Date.now()}`,
      name: `Bedroom ${activeUnit.rooms.length + 1}`,
      squareFeet: 250,
      bathroomType: 'shared',
      privateAccessDoor: 'none',
      calculatedRent: 800,
    };

    const updatedRooms = [...activeUnit.rooms, newRoom];
    const recalculated = recalculateRoomSplits(updatedRooms, property.totalHomeRent);

    const updatedUnits = property.units.map((u, idx) =>
      idx === activeUnitIdx ? { ...u, totalRooms: updatedRooms.length, rooms: recalculated } : u
    );

    onUpdateProperty({
      ...property,
      units: updatedUnits,
    });
  };

  const handleTotalRentChange = (newTotal: number) => {
    const recalculated = recalculateRoomSplits(activeUnit.rooms, newTotal);
    const updatedUnits = property.units.map((u, idx) =>
      idx === activeUnitIdx ? { ...u, rooms: recalculated } : u
    );

    onUpdateProperty({
      ...property,
      totalHomeRent: newTotal,
      units: updatedUnits,
    });
  };

  const handleToggleUtility = (utilKey: keyof PropertyInventory['utilitiesIncluded']) => {
    onUpdateProperty({
      ...property,
      utilitiesIncluded: {
        ...property.utilitiesIncluded,
        [utilKey]: !property.utilitiesIncluded[utilKey],
      },
    });
  };

  const handleFeeChange = (
    feeType: 'pestControl' | 'lawnMaintenance' | 'applianceRepairReplacement',
    party: 'Tenant' | 'Property Owner' | 'Homeowner'
  ) => {
    onUpdateProperty({
      ...property,
      feeResponsibilities: {
        ...property.feeResponsibilities,
        [feeType]: party,
      },
    });
  };

  const sumCalculatedRooms = activeUnit.rooms.reduce((sum, r) => sum + r.calculatedRent, 0);

  return (
    <div id="section-b-property-inventory" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
              Section B
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Property Inventory & Room Split Valuation
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Address specs, utilities, maintenance fees, and proportional room rent splits factoring square footage and private door access.
          </p>
        </div>

        {/* Property Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Active Property:</span>
          <select
            id="property-inventory-select"
            value={property.id}
            onChange={(e) => onSelectProperty(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.address}, {p.city} ({p.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Property Core Specs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Address & City */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Location
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{property.address}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {property.city}, {property.state} {property.zipCode}
          </div>
        </div>

        {/* Type & Square Feet */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-600" />
            Structure & Size
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-sm">{property.type}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {property.squareFeet.toLocaleString()} Total Interior Sq Ft
          </div>
        </div>

        {/* Total Home Rent */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Total Home Rent
            </span>
            <span className="text-[10px] text-emerald-600">Monthly</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="total-home-rent-input"
              type="number"
              value={property.totalHomeRent}
              onChange={(e) => handleTotalRentChange(Number(e.target.value) || 0)}
              className="font-bold text-base text-emerald-600 dark:text-emerald-400 font-mono w-28 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
            />
            <span className="text-xs text-slate-400 font-medium">/ month</span>
          </div>
        </div>

        {/* Security Deposit Amount */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Security Deposit Required
          </div>
          <div className="font-bold text-slate-900 dark:text-white text-base font-mono">
            ${property.securityDepositAmount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            For Tenants to Move In
          </div>
        </div>

      </div>

      {/* Utilities, Washer/Dryer & Fee Responsibility Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Utilities Included vs Not Included */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Utilities Included / Not Included
            </h3>
            <span className="text-[10px] text-slate-400">Click to toggle</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(property.utilitiesIncluded).map(([key, val]) => (
              <button
                key={key}
                id={`toggle-utility-${key}`}
                onClick={() => handleToggleUtility(key as any)}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  val 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-semibold' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                }`}
              >
                <span className="capitalize flex items-center gap-1.5">
                  {key === 'water' && <Droplets className="w-3 h-3 text-blue-500" />}
                  {key === 'electric' && <Zap className="w-3 h-3 text-amber-500" />}
                  {key === 'gas' && <Flame className="w-3 h-3 text-orange-500" />}
                  {key === 'trash' && <Trash2 className="w-3 h-3 text-emerald-500" />}
                  {key === 'internet' && <Wifi className="w-3 h-3 text-indigo-500" />}
                  {key === 'sewer' && <Droplets className="w-3 h-3 text-cyan-500" />}
                  {key}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/60 dark:bg-slate-800/60">
                  {val ? 'Included' : 'Tenant'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Washer / Dryer Options & Amenities */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            Washer/Dryer & Core Amenities
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Washer / Dryer Configuration
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['In-Unit', 'On-Site/Shared', 'Hookups Only', 'None'] as const).map((opt) => (
                <button
                  key={opt}
                  id={`washer-dryer-opt-${opt.toLowerCase().replace(/[^a-z]/g, '-')}`}
                  onClick={() => onUpdateProperty({ ...property, washerDryerOption: opt })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    property.washerDryerOption === opt
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
              Included Property Amenities
            </span>
            <div className="flex flex-wrap gap-1.5">
              {property.amenities.map((amenity, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Additional Fees & Responsibilities */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-500" />
            Additional Maintenance Fee Split
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Designated responsibility for ongoing home operational costs.
          </p>

          <div className="space-y-2.5 text-xs">
            
            {/* Pest Control */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Pest Control</span>
              <div className="flex gap-1">
                {(['Tenant', 'Property Owner', 'Homeowner'] as const).map((party) => (
                  <button
                    key={party}
                    onClick={() => handleFeeChange('pestControl', party)}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      property.feeResponsibilities.pestControl === party
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {party}
                  </button>
                ))}
              </div>
            </div>

            {/* Lawn Maintenance */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Lawn Maintenance</span>
              <div className="flex gap-1">
                {(['Tenant', 'Property Owner', 'Homeowner'] as const).map((party) => (
                  <button
                    key={party}
                    onClick={() => handleFeeChange('lawnMaintenance', party)}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      property.feeResponsibilities.lawnMaintenance === party
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {party}
                  </button>
                ))}
              </div>
            </div>

            {/* Appliance Repair / Replacement */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Appliance Repair/Repl.</span>
              <div className="flex gap-1">
                {(['Tenant', 'Property Owner', 'Homeowner'] as const).map((party) => (
                  <button
                    key={party}
                    onClick={() => handleFeeChange('applianceRepairReplacement', party)}
                    className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                      property.feeResponsibilities.applianceRepairReplacement === party
                        ? 'bg-purple-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {party}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* RENT SPLIT CALCULATOR PER ROOM (SQ FT, BATH, PRIVATE DOORS) */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rent Split Calculator per Room Allocation
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Calculates proportional monthly rent dynamically based on bedroom square footage, shared vs private bathrooms, and private exterior door access (front/back/side).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Sum of Room Splits</span>
              <span className={`font-mono text-sm font-bold ${sumCalculatedRooms === property.totalHomeRent ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                ${sumCalculatedRooms.toLocaleString()} / ${property.totalHomeRent.toLocaleString()}
              </span>
            </div>

            <button
              id="add-room-inventory-button"
              onClick={handleAddRoom}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Room
            </button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {activeUnit.rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => handleUpdateRoom(room.id, { name: e.target.value })}
                    className="font-bold text-slate-900 dark:text-white text-sm bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:outline-hidden"
                  />
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    {room.assignedTenantName ? (
                      <span className="text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-500" /> Assigned: {room.assignedTenantName}
                      </span>
                    ) : (
                      <span className="text-slate-400">Vacant Suite</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Split Rent</span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ${room.calculatedRent}/mo
                  </span>
                </div>
              </div>

              {/* Adjusters */}
              <div className="space-y-2 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                
                {/* Square Feet */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Square Footage</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      value={room.squareFeet}
                      onChange={(e) => handleUpdateRoom(room.id, { squareFeet: Number(e.target.value) || 50 })}
                      className="w-16 px-2 py-1 rounded-md text-xs font-mono font-bold bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-right"
                    />
                    <span className="text-[11px] text-slate-400">sq ft</span>
                  </div>
                </div>

                {/* Bathroom Type */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Bathroom</span>
                  <select
                    value={room.bathroomType}
                    onChange={(e: any) => handleUpdateRoom(room.id, { bathroomType: e.target.value })}
                    className="px-2 py-1 rounded-md text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200"
                  >
                    <option value="shared">Shared Bath (Standard)</option>
                    <option value="private">Private Bath (+Premium)</option>
                  </select>
                </div>

                {/* Private Access Door */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
                    <DoorClosed className="w-3.5 h-3.5 text-slate-400" /> Private Door
                  </span>
                  <select
                    value={room.privateAccessDoor}
                    onChange={(e: any) => handleUpdateRoom(room.id, { privateAccessDoor: e.target.value })}
                    className="px-2 py-1 rounded-md text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200"
                  >
                    <option value="none">Interior Only</option>
                    <option value="front_door">Front Door Access</option>
                    <option value="back_door">Back Door Access</option>
                    <option value="side_door">Side Door Access</option>
                  </select>
                </div>

              </div>

              <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                <span>Weight Ratio: {((room.squareFeet / property.squareFeet) * 100).toFixed(1)}%</span>
                <span className="font-semibold text-slate-500">
                  {room.bathroomType === 'private' ? 'En-suite' : 'Hallway'}{room.privateAccessDoor !== 'none' ? ' • Private Entry' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            The algorithm automatically balances private bathroom upgrades (standard 8% weighting) and private exterior egress (5% weighting) while ensuring room prices mathematically reconcile to the property's gross lease agreement.
          </span>
        </div>

      </div>

    </div>
  );
};

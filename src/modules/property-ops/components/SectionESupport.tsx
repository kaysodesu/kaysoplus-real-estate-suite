import React, { useState } from 'react';
import { 
  CommunicationLog, 
  MaintenanceTicket, 
  LocalVendor, 
  PropertyInventory, 
  ProspectLead 
} from '../types';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Smartphone, 
  Users, 
  Send, 
  Wrench, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Star, 
  ShieldCheck, 
  DollarSign, 
  Radio, 
  Home, 
  User, 
  X,
  Tag
} from 'lucide-react';

interface SectionESupportProps {
  communications: CommunicationLog[];
  maintenanceTickets: MaintenanceTicket[];
  vendors: LocalVendor[];
  properties: PropertyInventory[];
  tenants: ProspectLead[];
  onAddCommunication: (log: CommunicationLog) => void;
  onAddMaintenanceTicket: (ticket: MaintenanceTicket) => void;
  onUpdateTicketStatus: (ticketId: string, status: MaintenanceTicket['status']) => void;
  onApplyTicketRentDeduction: (ticketId: string) => void;
  onDispatchVendor: (ticketId: string, vendorName: string) => void;
}

export const SectionESupport: React.FC<SectionESupportProps> = ({
  communications,
  maintenanceTickets,
  vendors,
  properties,
  tenants,
  onAddCommunication,
  onAddMaintenanceTicket,
  onUpdateTicketStatus,
  onApplyTicketRentDeduction,
  onDispatchVendor,
}) => {
  // Communication composer state
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [scope, setScope] = useState<CommunicationLog['recipientScope']>('Individual Tenant');
  const [channel, setChannel] = useState<CommunicationLog['channel']>('SMS Text');
  const [targetTenantId, setTargetTenantId] = useState<string>(tenants[0]?.id || '');
  const [targetPropertyId, setTargetPropertyId] = useState<string>(properties[0]?.id || '');
  const [commonSubject, setCommonSubject] = useState<CommunicationLog['commonSubject']>('Rent Payment Reminder');
  const [details, setDetails] = useState('');

  // Maintenance request state
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [maintCategory, setMaintCategory] = useState<MaintenanceTicket['category']>('Plumbing');
  const [maintPriority, setMaintPriority] = useState<MaintenanceTicket['priority']>('Normal');
  const [maintDesc, setMaintDesc] = useState('');
  const [maintTenantId, setMaintTenantId] = useState<string>(tenants[0]?.id || '');
  const [maintEntryPerm, setMaintEntryPerm] = useState(true);
  const [maintPreferredTime, setMaintPreferredTime] = useState('Any afternoon after 1:00 PM');

  // Vendor filter
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<string>('ALL');

  // Communication scope filter
  const [commScopeFilter, setCommScopeFilter] = useState<string>('ALL');

  const handleSendCommunication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const matchedTenant = tenants.find((t) => t.id === targetTenantId);

    const newLog: CommunicationLog = {
      id: `comm-${Date.now()}`,
      timestamp: new Date().toISOString(),
      recipientScope: scope,
      targetTenantId: scope === 'Individual Tenant' ? targetTenantId : undefined,
      targetTenantName: scope === 'Individual Tenant' ? matchedTenant?.contact.fullName : undefined,
      targetPropertyId: scope === 'Property House' ? targetPropertyId : undefined,
      channel,
      commonSubject,
      details,
      senderName: 'Property Owner / Administrator',
    };

    onAddCommunication(newLog);
    setShowComposeModal(false);
    setDetails('');
  };

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintDesc.trim()) return;

    const matchedTenant = tenants.find((t) => t.id === maintTenantId);
    const prop = properties.find((p) => p.id === matchedTenant?.assignedPropertyId) || properties[0];

    const newTicket: MaintenanceTicket = {
      id: `maint-${Date.now()}`,
      tenantId: maintTenantId,
      tenantName: matchedTenant?.contact.fullName || 'Tenant',
      propertyId: prop.id,
      propertyAddress: prop.address,
      unitNumber: prop.units[0]?.unitNumber || 'Main Unit',
      category: maintCategory,
      priority: maintPriority,
      description: maintDesc,
      entryPermissionGranted: maintEntryPerm,
      preferredTime: maintPreferredTime,
      status: 'Reported',
      reportedDate: new Date().toISOString().split('T')[0],
      repairCost: 0,
    };

    onAddMaintenanceTicket(newTicket);
    setShowMaintModal(false);
    setMaintDesc('');
  };

  const filteredCommunications = communications.filter((c) => {
    if (commScopeFilter === 'ALL') return true;
    return c.recipientScope === commScopeFilter;
  });

  const filteredVendors = vendors.filter((v) => {
    if (vendorCategoryFilter === 'ALL') return true;
    return v.category === vendorCategoryFilter;
  });

  return (
    <div id="section-e-support" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
              Section E
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Support, Contact History & Maintenance Operations
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Multi-channel communications (logged calls, SMS, emails, mass messaging), maintenance dispatch, repair status pipeline, and local merchant directory.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="open-compose-comm-modal-btn"
            onClick={() => setShowComposeModal(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Dispatch Communication
          </button>
          <button
            id="open-maint-ticket-modal-btn"
            onClick={() => setShowMaintModal(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Wrench className="w-3.5 h-3.5" /> New Maintenance Request
          </button>
        </div>
      </div>

      {/* Grid: Contact History (Communications) & Maintenance Request Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Contact History (Communications with Tenants / Mass Messaging) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Communications & Contact History
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Logged phone calls, SMS text, emails, and private software notices.
              </p>
            </div>

            {/* Scope Filter Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {(['ALL', 'Individual Tenant', 'Property House', 'All Tenants (Mass Broadcast)'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setCommScopeFilter(s)}
                  className={`px-2.5 py-1 rounded-lg transition-all text-[11px] ${
                    commScopeFilter === s
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {s === 'ALL' ? 'All' : s === 'Individual Tenant' ? 'Direct' : s === 'Property House' ? 'House' : 'Mass'}
                </button>
              ))}
            </div>
          </div>

          {/* Communications Feed */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {filteredCommunications.map((comm) => (
              <div
                key={comm.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                      {comm.channel === 'Phone Call' && <Phone className="w-3 h-3" />}
                      {comm.channel === 'SMS Text' && <Smartphone className="w-3 h-3" />}
                      {comm.channel === 'Email' && <Mail className="w-3 h-3" />}
                      {comm.channel === 'Private Portal Message' && <MessageSquare className="w-3 h-3" />}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {comm.commonSubject}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    comm.recipientScope === 'All Tenants (Mass Broadcast)'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : comm.recipientScope === 'Property House'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {comm.recipientScope}
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                  {comm.details}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>
                    To: {comm.targetTenantName || (comm.targetPropertyId ? 'All Unit Residents' : 'All Network Tenants')}
                  </span>
                  <span>{new Date(comm.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Property Maintenance Requests & Repair Status Pipeline */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Property Maintenance & Repair Status
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tracks reported tickets through dispatch, resolution, and tenant repair out-of-pocket rent deductions.
              </p>
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
            {maintenanceTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">
                        {ticket.category} Issue
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        ticket.priority === 'Emergency'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                          : ticket.priority === 'High'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      {ticket.tenantName} — {ticket.propertyAddress} ({ticket.unitNumber})
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    id={`ticket-status-select-${ticket.id}`}
                    value={ticket.status}
                    onChange={(e) => onUpdateTicketStatus(ticket.id, e.target.value as any)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                        : ticket.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-800'
                        : ticket.status === 'Dispatched'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    <option value="Reported">Reported</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <p className="text-slate-700 dark:text-slate-300 text-xs">
                  {ticket.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span>Preferred Entry: <strong>{ticket.preferredTime}</strong></span>
                  </div>
                  <div className="text-right">
                    <span>Vendor: <strong>{ticket.assignedVendor || 'Unassigned'}</strong></span>
                  </div>
                </div>

                {/* Repair Cost & Out-of-Pocket Rent Reduction Link */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    Repair Cost: ${ticket.repairCost || 0}
                  </span>

                  {ticket.appliedAsRentDeduction ? (
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Rent Deduction Applied to Ledger
                    </span>
                  ) : (
                    <button
                      id={`apply-rent-deduction-btn-${ticket.id}`}
                      onClick={() => onApplyTicketRentDeduction(ticket.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-200 dark:border-rose-900 transition-colors"
                    >
                      Reduce Rent (Tenant Paid Out-of-Pocket)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* LOCAL VENDORS & MERCHANTS DIRECTORY */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Vetted Local Vendors & Certified Merchants Directory
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Licensed and bonded trade contractors on call for fast property maintenance dispatch.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Trade:</span>
            <select
              value={vendorCategoryFilter}
              onChange={(e) => setVendorCategoryFilter(e.target.value)}
              className="text-xs p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="ALL">All Specialties</option>
              <option value="Plumbing">Plumbing</option>
              <option value="HVAC">HVAC</option>
              <option value="Electrician">Electrician</option>
              <option value="Pest Exterminator">Pest Exterminator</option>
              <option value="Lawn & Grounds">Lawn & Grounds</option>
              <option value="Appliance Specialist">Appliance Specialist</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {vendor.businessName}
                  </h4>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                    {vendor.category} • Rep: {vendor.contactPerson}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-bold text-amber-500 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vendor.rating}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                <div>Phone: <a href={`tel:${vendor.phone}`} className="font-mono text-indigo-600 hover:underline">{vendor.phone}</a></div>
                <div>Email: <a href={`mailto:${vendor.email}`} className="text-slate-600 dark:text-slate-300 hover:underline">{vendor.email}</a></div>
                <div>Rates: <strong className="text-slate-800 dark:text-slate-200">{vendor.rateEstimate}</strong></div>
              </div>

              <p className="text-[10px] text-slate-500 italic">
                {vendor.notes}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Insured & Bonded
                </span>
                <button
                  id={`dispatch-vendor-btn-${vendor.id}`}
                  onClick={() => {
                    const ticketId = prompt('Enter Maintenance Ticket ID to dispatch to this vendor: (e.g. maint-1)');
                    if (ticketId) onDispatchVendor(ticketId, vendor.businessName);
                  }}
                  className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-900"
                >
                  Quick Dispatch
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* COMPOSE COMMUNICATION MODAL (MASS MESSAGING & DROP DOWN TEMPLATES) */}
      {/* ========================================================= */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div 
            id="compose-communication-modal"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-indigo-600" />
                Dispatch Communication Log
              </h3>
              <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendCommunication} className="space-y-3 text-xs">
              
              {/* Recipient Scope */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcast Audience Scope
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Individual Tenant', 'Property House', 'All Tenants (Mass Broadcast)'] as const).map((sc) => (
                    <button
                      type="button"
                      key={sc}
                      onClick={() => setScope(sc)}
                      className={`p-2 rounded-xl border text-center font-semibold text-[11px] transition-all ${
                        scope === sc
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sc === 'Individual Tenant' ? 'Single Tenant' : sc === 'Property House' ? 'House Roster' : 'Mass Broadcast'}
                    </button>
                  ))}
                </div>
              </div>

              {scope === 'Individual Tenant' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Target Tenant
                  </label>
                  <select
                    value={targetTenantId}
                    onChange={(e) => setTargetTenantId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.contact.fullName} ({t.contact.phone})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {scope === 'Property House' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Property (All Unit Tenants)
                  </label>
                  <select
                    value={targetPropertyId}
                    onChange={(e) => setTargetPropertyId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.address} ({p.units[0]?.unitNumber})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Transmission Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e: any) => setChannel(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="SMS Text">SMS Text</option>
                    <option value="Email">Email</option>
                    <option value="Phone Call">Phone Call</option>
                    <option value="Private Portal Message">Private Portal Message</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Common Communications Subject
                  </label>
                  <select
                    value={commonSubject}
                    onChange={(e: any) => setCommonSubject(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Rent Payment Reminder">Rent Payment Reminder</option>
                    <option value="Scheduled Maintenance Inspection">Scheduled Maintenance Inspection</option>
                    <option value="Quiet Hours & Noise Advisory">Quiet Hours & Noise Advisory</option>
                    <option value="Lease Renewal Discussion">Lease Renewal Discussion</option>
                    <option value="Utility Bill Split Notification">Utility Bill Split Notification</option>
                    <option value="Parking Space Regulations">Parking Space Regulations</option>
                    <option value="Package Delivery Notice">Package Delivery Notice</option>
                    <option value="Emergency Weather Alert">Emergency Weather Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Message Details / Short Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter message details to dispatch and log in permanent contact history..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowComposeModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-dispatch-comm-btn"
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch & Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* NEW MAINTENANCE TICKET MODAL */}
      {/* ========================================================= */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div 
            id="create-maintenance-ticket-modal"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 space-y-3.5"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-rose-600" />
                Submit Property Maintenance Request
              </h3>
              <button onClick={() => setShowMaintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMaintenance} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tenant Requesting
                </label>
                <select
                  value={maintTenantId}
                  onChange={(e) => setMaintTenantId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.contact.fullName} ({t.contact.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={maintCategory}
                    onChange={(e: any) => setMaintCategory(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Appliance">Appliance</option>
                    <option value="Structural">Structural</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={maintPriority}
                    onChange={(e: any) => setMaintPriority(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe repair needed..."
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Preferred Technician Entry Time
                </label>
                <input
                  type="text"
                  value={maintPreferredTime}
                  onChange={(e) => setMaintPreferredTime(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="entry-permission-check"
                  checked={maintEntryPerm}
                  onChange={(e) => setMaintEntryPerm(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="entry-permission-check" className="text-slate-700 dark:text-slate-300 font-medium">
                  Grant entry permission if tenant is not present
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowMaintModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-maint-ticket-btn"
                  className="px-4 py-1.5 font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-2xs"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { 
  ProspectLead, 
  PropertyInventory, 
  LeaseRecord, 
  LedgerTransaction, 
  RentCalendarEntry, 
  CommunicationLog, 
  MaintenanceTicket, 
  LocalVendor, 
  OfficialDocument 
} from './types';
import { 
  INITIAL_LEADS, 
  INITIAL_PROPERTIES, 
  INITIAL_LEASES, 
  INITIAL_TRANSACTIONS, 
  INITIAL_CALENDAR_ENTRIES, 
  INITIAL_COMMUNICATIONS, 
  INITIAL_MAINTENANCE, 
  INITIAL_VENDORS 
} from './data/mockData';

import { useRealEstateData } from '../../data/RealEstateDataContext';

// Component Sections
import { SectionAClientInfo } from './components/SectionAClientInfo';
import { SectionBPropertyInventory } from './components/SectionBPropertyInventory';
import { SectionCLease } from './components/SectionCLease';
import { SectionDFinancialLedger } from './components/SectionDFinancialLedger';
import { SectionESupport } from './components/SectionESupport';
import { PrivateMessageModal } from './components/PrivateMessageModal';
import { AdminDesignerGuideModal } from './components/AdminDesignerGuideModal';

// Icons
import { 
  Shield, 
  Building2, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Compass, 
  UserCheck, 
  Layers, 
  MessageSquare, 
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Master State: shared across the suite (Virtual Tours and Listing Studio read the same records)
  const {
    prospects, setProspects, properties, setProperties, leases, setLeases,
    transactions, setTransactions, calendarEntries, setCalendarEntries,
    communications, setCommunications, maintenanceTickets, setMaintenanceTickets,
    vendors, setVendors,
  } = useRealEstateData();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('A');

  // Currently selected prospect/tenant in Section A
  const [selectedLeadId, setSelectedLeadId] = useState<string>(INITIAL_LEADS[0].id);

  // Modal controls
  const [showDesignerGuide, setShowDesignerGuide] = useState(false);
  const [privateMessageRecipient, setPrivateMessageRecipient] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    roomName?: string;
  } | null>(null);

  // The active lead
  const currentLead = prospects.find((p) => p.id === selectedLeadId) || prospects[0];

  // The Approval Gate Condition:
  // "Only qualified and approved clients will trigger the following sections and the administrative property owner has approved the application and assigned that tenant to the property and unit."
  const isDownstreamUnlocked = 
    currentLead?.status === 'approved_by_admin' && 
    Boolean(currentLead?.assignedPropertyId);

  // Handlers for Section A
  const handleUpdateLeadStatus = (
    leadId: string, 
    status: ProspectLead['status'], 
    propertyId?: string, 
    unitId?: string, 
    roomId?: string
  ) => {
    setProspects((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          return {
            ...lead,
            status,
            assignedPropertyId: propertyId || lead.assignedPropertyId,
            assignedUnitId: unitId || lead.assignedUnitId,
            assignedRoomId: roomId || lead.assignedRoomId,
          };
        }
        return lead;
      })
    );
  };

  const handleAddProspect = (newLead: ProspectLead) => {
    setProspects((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
  };

  // Handlers for Section B
  const handleUpdateRoomRent = (propertyId: string, unitId: string, roomId: string, calculatedRent: number) => {
    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id === propertyId) {
          return {
            ...prop,
            units: prop.units.map((unit) => {
              if (unit.id === unitId) {
                return {
                  ...unit,
                  rooms: unit.rooms.map((room) => {
                    if (room.id === roomId) {
                      return { ...room, calculatedRent };
                    }
                    return room;
                  }),
                };
              }
              return unit;
            }),
          };
        }
        return prop;
      })
    );
  };

  // Handlers for Section C
  const handleUpdateLease = (updatedLease: LeaseRecord) => {
    setLeases((prev) => prev.map((l) => (l.id === updatedLease.id ? updatedLease : l)));
  };

  const handleAddLeaseDocument = (leaseId: string, doc: OfficialDocument) => {
    setLeases((prev) =>
      prev.map((l) => {
        if (l.id === leaseId) {
          return {
            ...l,
            officialDocuments: [...l.officialDocuments, doc],
          };
        }
        return l;
      })
    );
  };

  // Handlers for Section D
  const handleAddTransaction = (newTx: LedgerTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleUpdateCalendarEntry = (updatedEntry: RentCalendarEntry) => {
    setCalendarEntries((prev) =>
      prev.map((e) => (e.id === updatedEntry.id ? updatedEntry : e))
    );
  };

  const handleUpdateTransactionDateReceived = (txId: string, date: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, dateReceivedManually: date } : t))
    );
  };

  // Handlers for Section E
  const handleAddCommunication = (log: CommunicationLog) => {
    setCommunications((prev) => [log, ...prev]);
  };

  const handleAddMaintenanceTicket = (ticket: MaintenanceTicket) => {
    setMaintenanceTickets((prev) => [ticket, ...prev]);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: MaintenanceTicket['status']) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const handleApplyTicketRentDeduction = (ticketId: string) => {
    const ticket = maintenanceTickets.find((t) => t.id === ticketId);
    if (!ticket) return;

    // Mark ticket as rent deduction applied
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, appliedAsRentDeduction: true } : t))
    );

    // Add deduction to ledger
    const deductionTx: LedgerTransaction = {
      id: `tx-deduct-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tenantId: ticket.tenantId,
      tenantName: ticket.tenantName,
      accountOnFile: 'Rent Ledger Credit Adjust',
      amount: -(ticket.repairCost || 65),
      type: 'Deduction',
      method: 'ACH',
      notes: `Tenant out-of-pocket repair reimbursement for ${ticket.category} (#${ticket.id})`,
      deductionReason: ticket.description,
      dateReceivedManually: new Date().toISOString().split('T')[0],
      status: 'Completed',
    };

    setTransactions((prev) => [deductionTx, ...prev]);
  };

  const handleDispatchVendor = (ticketId: string, vendorName: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: 'Dispatched',
            assignedVendor: vendorName,
          };
        }
        return t;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                  Prospect & Property Management Portal
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-200/50 dark:border-indigo-800/60">
                  Admin System
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Gated lead intake, weighted room split calculator, multi-year archives & financial ledgers
              </p>
            </div>
          </div>

          {/* Quick Active Tenant Status Indicator & Designer Blueprint Guide Action */}
          <div className="flex items-center gap-2.5">
            {/* Approval Gate Status Indicator */}
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDownstreamUnlocked
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
            }`}>
              {isDownstreamUnlocked ? (
                <>
                  <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Gate Open: <strong>{currentLead.contact.fullName}</strong> (Approved & Assigned)</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Downstream Gated: <strong>{currentLead?.contact.fullName || 'Lead'}</strong> (Pending Approval)</span>
                </>
              )}
            </div>

            {/* Administrator Guide for Graphic Designer */}
            <button
              id="open-designer-guide-btn"
              onClick={() => setShowDesignerGuide(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Admin Guide for Designer</span>
            </button>
          </div>
        </div>

        {/* Five Ordered Navigation Tabs: Section A -> B -> C -> D -> E */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800/80">
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto py-2 no-scrollbar text-xs font-medium" aria-label="Sections">
            
            {/* Section A: Client Information */}
            <button
              id="nav-tab-section-a"
              onClick={() => setActiveTab('A')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'A'
                  ? 'bg-indigo-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Section A: Client Intake & Archive</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === 'A' ? 'bg-indigo-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                {prospects.length}
              </span>
            </button>

            {/* Section B: Property Inventory (GATED) */}
            <button
              id="nav-tab-section-b"
              onClick={() => {
                if (!isDownstreamUnlocked) {
                  alert("Section B is gated! To unlock, approve the prospect in Section A and assign them to a property & unit.");
                }
                setActiveTab('B');
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'B'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Section B: Property Inventory</span>
              {!isDownstreamUnlocked ? (
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              ) : (
                <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
            </button>

            {/* Section C: Lease (GATED) */}
            <button
              id="nav-tab-section-c"
              onClick={() => {
                if (!isDownstreamUnlocked) {
                  alert("Section C is gated! To unlock, approve the prospect in Section A and assign them to a property & unit.");
                }
                setActiveTab('C');
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'C'
                  ? 'bg-violet-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Section C: Lease & Multi-Year Archive</span>
              {!isDownstreamUnlocked ? (
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              ) : (
                <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
            </button>

            {/* Section D: Financial Ledger (GATED) */}
            <button
              id="nav-tab-section-d"
              onClick={() => {
                if (!isDownstreamUnlocked) {
                  alert("Section D is gated! To unlock, approve the prospect in Section A and assign them to a property & unit.");
                }
                setActiveTab('D');
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'D'
                  ? 'bg-cyan-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Section D: Financial Ledger</span>
              {!isDownstreamUnlocked ? (
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              ) : (
                <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
            </button>

            {/* Section E: Support (GATED) */}
            <button
              id="nav-tab-section-e"
              onClick={() => {
                if (!isDownstreamUnlocked) {
                  alert("Section E is gated! To unlock, approve the prospect in Section A and assign them to a property & unit.");
                }
                setActiveTab('E');
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'E'
                  ? 'bg-rose-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Section E: Support & Maintenance</span>
              {!isDownstreamUnlocked ? (
                <Lock className="w-3 h-3 text-amber-500 shrink-0" />
              ) : (
                <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
              )}
            </button>

          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ========================================================= */}
        {/* APPROVAL GATE BLOCKER BANNER (WHEN USER ATTEMPTS B-E ON UNAPPROVED LEAD) */}
        {/* ========================================================= */}
        {activeTab !== 'A' && !isDownstreamUnlocked && (
          <div 
            id="gated-section-warning-banner"
            className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-amber-900 dark:text-amber-200">
                  Approval & Unit Assignment Gate Active
                </h3>
                <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 max-w-2xl">
                  *Per administrative operating rules: Only qualified and approved clients will trigger Sections B, C, D, and E once the property owner has approved the application and assigned that tenant to the property and unit.*
                  Currently, <strong>{currentLead?.contact.fullName || 'Selected Lead'}</strong> is in <strong>{currentLead?.status.replace(/_/g, ' ')}</strong> status.
                </p>
              </div>
            </div>

            <button
              id="return-to-intake-gate-btn"
              onClick={() => setActiveTab('A')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <span>Review in Section A to Approve</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION A: CLIENT INFORMATION & ARCHIVE */}
        {/* ========================================================= */}
        {activeTab === 'A' && (
          <SectionAClientInfo
            leads={prospects}
            properties={properties}
            selectedLeadId={selectedLeadId}
            onSelectLead={(id) => setSelectedLeadId(id)}
            onUpdateStatus={handleUpdateLeadStatus}
            onAddNewLead={handleAddProspect}
            onOpenMessage={(contact) => setPrivateMessageRecipient(contact)}
            onOpenDesignerGuide={() => setShowDesignerGuide(true)}
            onUnlockSection={(tab) => setActiveTab(tab)}
          />
        )}

        {/* ========================================================= */}
        {/* SECTION B: PROPERTY INVENTORY & WEIGHTED RENT SPLIT */}
        {/* ========================================================= */}
        {activeTab === 'B' && (
          <SectionBPropertyInventory
            properties={properties}
            activeLeadPropertyId={currentLead?.assignedPropertyId}
            onUpdateRoomRent={handleUpdateRoomRent}
            onOpenPrivateMessage={(resident) => setPrivateMessageRecipient(resident)}
          />
        )}

        {/* ========================================================= */}
        {/* SECTION C: LEASE AGREEMENTS & MULTI-YEAR ARCHIVE */}
        {/* ========================================================= */}
        {activeTab === 'C' && (
          <SectionCLease
            leases={leases}
            activeTenantId={currentLead?.id}
            onUpdateLease={handleUpdateLease}
            onAddLeaseDocument={handleAddLeaseDocument}
          />
        )}

        {/* ========================================================= */}
        {/* SECTION D: FINANCIAL LEDGER & RENT DUE CALENDAR */}
        {/* ========================================================= */}
        {activeTab === 'D' && (
          <SectionDFinancialLedger
            transactions={transactions}
            calendarEntries={calendarEntries}
            onAddTransaction={handleAddTransaction}
            onUpdateCalendarEntry={handleUpdateCalendarEntry}
            onUpdateTransactionDateReceived={handleUpdateTransactionDateReceived}
          />
        )}

        {/* ========================================================= */}
        {/* SECTION E: SUPPORT, COMMUNICATIONS & MAINTENANCE */}
        {/* ========================================================= */}
        {activeTab === 'E' && (
          <SectionESupport
            communications={communications}
            maintenanceTickets={maintenanceTickets}
            vendors={vendors}
            properties={properties}
            tenants={prospects.filter((p) => p.status === 'approved_by_admin')}
            onAddCommunication={handleAddCommunication}
            onAddMaintenanceTicket={handleAddMaintenanceTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onApplyTicketRentDeduction={handleApplyTicketRentDeduction}
            onDispatchVendor={handleDispatchVendor}
          />
        )}

      </main>

      {/* Persistent Global Modals */}

      {/* 1. Private In-Software Message Modal */}
      {privateMessageRecipient && (
        <PrivateMessageModal
          isOpen={Boolean(privateMessageRecipient)}
          recipient={privateMessageRecipient}
          onClose={() => setPrivateMessageRecipient(null)}
          onSend={(msg) => {
            // Append to permanent communication contact history log
            const newComm: CommunicationLog = {
              id: `comm-pm-${Date.now()}`,
              timestamp: new Date().toISOString(),
              recipientScope: 'Individual Tenant',
              targetTenantId: privateMessageRecipient.id,
              targetTenantName: privateMessageRecipient.name,
              channel: 'Private Portal Message',
              commonSubject: 'Direct Administrative Message',
              details: `[Subject: ${msg.subject}] ${msg.messageText}`,
              senderName: 'Property Owner / Admin',
            };
            handleAddCommunication(newComm);
          }}
        />
      )}

      {/* 2. Professional Administrator Guide for Graphic Designer */}
      <AdminDesignerGuideModal
        isOpen={showDesignerGuide}
        onClose={() => setShowDesignerGuide(false)}
      />

    </div>
  );
}

import React, { useState } from 'react';
import { LeaseRecord, OfficialDocument } from '../types';
import { 
  FileText, 
  Calendar, 
  Bell, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Send, 
  FileCheck, 
  X, 
  Search,
  History,
  Archive,
  Mail,
  Smartphone,
  UserCheck
} from 'lucide-react';

interface SectionCLeaseProps {
  leases: LeaseRecord[];
  activeTenantId?: string;
  onUpdateLease: (updated: LeaseRecord) => void;
  onAddLeaseDocument: (leaseId: string, doc: OfficialDocument) => void;
}

export const SectionCLease: React.FC<SectionCLeaseProps> = ({
  leases,
  activeTenantId,
  onUpdateLease,
  onAddLeaseDocument,
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingLeaseModal, setViewingLeaseModal] = useState<LeaseRecord | null>(null);

  // New document upload state
  const [newDocTitle, setNewDocTitle] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Active lease (matched to activeTenantId or default first)
  const currentLease = leases.find((l) => l.tenantId === activeTenantId) || leases[0];

  const handleToggleRenewalAlert = (alertKey: keyof LeaseRecord['renewalAlerts']) => {
    if (!currentLease) return;
    const updated = {
      ...currentLease,
      renewalAlerts: {
        ...currentLease.renewalAlerts,
        [alertKey]: !currentLease.renewalAlerts[alertKey],
      },
    };
    onUpdateLease(updated);
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim() || !currentLease) return;

    const newDoc: OfficialDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.endsWith('.pdf') ? newDocTitle : `${newDocTitle}.pdf`,
      type: 'PDF',
      fileSize: '1.1 MB',
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'Fully Executed',
    };

    onAddLeaseDocument(currentLease.id, newDoc);
    setNewDocTitle('');
    setShowUploadModal(false);
  };

  // Filter archived leases
  const filteredLeases = leases.filter((l) => {
    const matchesYear = selectedYear === 'ALL' || l.archiveYear === selectedYear;
    const matchesQuery = 
      l.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.roomName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesQuery;
  });

  return (
    <div id="section-c-lease" className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold text-xs uppercase tracking-wider">
              Section C
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Lease Agreement & Multi-Year Tenant Archive
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Terms, automated renewal notifications (60d, 30d, 14d, 1d), official document execution, and 3-4 year archived signed agreements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800/60 text-xs font-semibold flex items-center gap-1.5">
            <Archive className="w-3.5 h-3.5" /> 3-4 Year Audit Storage Active
          </span>
        </div>
      </div>

      {/* Active Lease Card & Automated Renewal Alerts */}
      {currentLease && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">
                Active Tenant Lease
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {currentLease.tenantName} — {currentLease.roomName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentLease.propertyAddress} ({currentLease.unitNumber})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="view-active-lease-modal-btn"
                onClick={() => setViewingLeaseModal(currentLease)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> View Specialized Lease Agreement
              </button>
            </div>
          </div>

          {/* Lease Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Term Period</span>
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                {currentLease.startDate} to {currentLease.endDate}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Monthly Rent</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                ${currentLease.monthlyRent.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Security Deposit</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                ${currentLease.securityDepositPaid.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Execution Status</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {currentLease.signatureStatus}
              </span>
            </div>
          </div>

          {/* Renewal Notification Triggers (60 days, 30 days, 14 days, and day before due date) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-violet-600" />
                Automated Renewal Notification Triggers
              </h4>
              <span className="text-[11px] text-slate-400">
                Scheduled notifications dispatched prior to lease termination date ({currentLease.endDate})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* 60 Days */}
              <div className={`p-3.5 rounded-xl border transition-all ${currentLease.renewalAlerts.days60Sent ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">60 Days Prior</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentLease.renewalAlerts.days60Sent ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {currentLease.renewalAlerts.days60Sent ? 'Dispatched' : 'Queued'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  First formal notice inquiring intention to renew for another 12-month term.
                </p>
                <button
                  id="toggle-60-day-alert-btn"
                  onClick={() => handleToggleRenewalAlert('days60Sent')}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  {currentLease.renewalAlerts.days60Sent ? 'Mark Pending' : 'Send Notification Now'}
                </button>
              </div>

              {/* 30 Days */}
              <div className={`p-3.5 rounded-xl border transition-all ${currentLease.renewalAlerts.days30Sent ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">30 Days Prior</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentLease.renewalAlerts.days30Sent ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {currentLease.renewalAlerts.days30Sent ? 'Dispatched' : 'Queued'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  Follow-up alert with revised rent schedule or move-out checklist.
                </p>
                <button
                  id="toggle-30-day-alert-btn"
                  onClick={() => handleToggleRenewalAlert('days30Sent')}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  {currentLease.renewalAlerts.days30Sent ? 'Mark Pending' : 'Send Notification Now'}
                </button>
              </div>

              {/* 14 Days */}
              <div className={`p-3.5 rounded-xl border transition-all ${currentLease.renewalAlerts.days14Sent ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">14 Days Prior</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentLease.renewalAlerts.days14Sent ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {currentLease.renewalAlerts.days14Sent ? 'Dispatched' : 'Queued'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  Urgent lease renewal deadline warning or key turn-in scheduling.
                </p>
                <button
                  id="toggle-14-day-alert-btn"
                  onClick={() => handleToggleRenewalAlert('days14Sent')}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  {currentLease.renewalAlerts.days14Sent ? 'Mark Pending' : 'Send Notification Now'}
                </button>
              </div>

              {/* Day Before Due Date */}
              <div className={`p-3.5 rounded-xl border transition-all ${currentLease.renewalAlerts.dayBeforeSent ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">Day Before Expiration</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentLease.renewalAlerts.dayBeforeSent ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {currentLease.renewalAlerts.dayBeforeSent ? 'Dispatched' : 'Queued'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  Final day reminder: automated transition to month-to-month or final walk-through.
                </p>
                <button
                  id="toggle-1-day-alert-btn"
                  onClick={() => handleToggleRenewalAlert('dayBeforeSent')}
                  className="w-full py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 shadow-2xs"
                >
                  {currentLease.renewalAlerts.dayBeforeSent ? 'Mark Pending' : 'Send Notification Now'}
                </button>
              </div>

            </div>
          </div>

          {/* Official Documents Repository */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-violet-600" />
                Additional Official Documents & Addenda
              </h4>
              <button
                id="upload-doc-modal-btn"
                onClick={() => setShowUploadModal(true)}
                className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Official Document
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentLease.officialDocuments.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">{doc.title}</span>
                      <span className="text-[10px] text-slate-400">{doc.fileSize} • Uploaded {doc.uploadedAt}</span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold shrink-0">
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TENANTS ARCHIVE (3 TO 4 YEARS OF DATA STORAGE) */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-violet-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tenants Archive with Hyperlinked Specialized Agreements (3 to 4 Years Storage)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Persistent storage of finalized tenant records with timestamps, signature channel verification, and linked contracts.
            </p>
          </div>

          {/* Search & Multi-Year Tabs (2026, 2025, 2024, 2023) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                id="search-lease-archive-input"
                type="text"
                placeholder="Search tenant or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white w-48"
              />
            </div>

            {/* Year Filters */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {(['ALL', 2026, 2025, 2024, 2023] as const).map((yr) => (
                <button
                  key={yr}
                  id={`archive-year-${yr}`}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedYear === yr
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {yr === 'ALL' ? 'All (4 Yrs)' : yr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leases Archive Table / List */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tenant Name</th>
                <th className="py-3 px-4">Property & Room</th>
                <th className="py-3 px-4">Term Dates</th>
                <th className="py-3 px-4">Rent</th>
                <th className="py-3 px-4">Signature Channel</th>
                <th className="py-3 px-4">Timestamp Verified</th>
                <th className="py-3 px-4 text-right">Specialized Agreement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeases.map((lease) => (
                <tr key={lease.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {lease.tenantName}
                    <span className="block text-[10px] text-slate-400 font-normal">{lease.tenantEmail}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                    <span className="font-semibold">{lease.propertyAddress}</span>
                    <span className="block text-[11px] text-slate-400">{lease.roomName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {lease.startDate} — {lease.endDate}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    ${lease.monthlyRent}/mo
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                      {lease.signatureMethod === 'email_link' && <Mail className="w-3 h-3 text-blue-500" />}
                      {lease.signatureMethod === 'text_link' && <Smartphone className="w-3 h-3 text-emerald-500" />}
                      {lease.signatureMethod === 'portal_in_person_agent' && <UserCheck className="w-3 h-3 text-violet-500" />}
                      {lease.signatureMethod === 'email_link' ? 'Email DocLink' : lease.signatureMethod === 'text_link' ? 'SMS Text Link' : 'In-Person Agent'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {lease.signedTimestamp ? new Date(lease.signedTimestamp).toLocaleString() : 'Pending Sign'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      id={`hyperlink-agreement-${lease.id}`}
                      onClick={() => setViewingLeaseModal(lease)}
                      className="px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 text-violet-700 dark:text-violet-300 font-bold text-xs inline-flex items-center gap-1 border border-violet-200 dark:border-violet-800 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> View Agreement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SPECIALIZED LEASE AGREEMENT MODAL */}
      {/* ========================================================= */}
      {viewingLeaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div 
            id="specialized-lease-agreement-modal"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Specialized Residential Lease Agreement
                  </h3>
                  <p className="text-xs text-slate-500">
                    Finalized legal contract • Storage Ref: #{viewingLeaseModal.id}
                  </p>
                </div>
              </div>
              <button
                id="close-lease-agreement-modal-btn"
                onClick={() => setViewingLeaseModal(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 dark:text-slate-300">
              
              {/* Certificate Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-emerald-950 dark:text-emerald-200">
                      Legally Executed & Audit-Stamped
                    </h4>
                    <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">
                      Verified Signature via {viewingLeaseModal.signatureMethod} on {viewingLeaseModal.signedTimestamp ? new Date(viewingLeaseModal.signedTimestamp).toUTCString() : 'Active Record'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-bold text-[10px]">
                  ACTIVE CONTRACT
                </span>
              </div>

              {/* Core Terms */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Contract Specifics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lessee / Tenant</span>
                    <span className="font-bold text-slate-900 dark:text-white">{viewingLeaseModal.tenantName}</span>
                    <span className="text-slate-400 block text-[10px]">{viewingLeaseModal.tenantPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Premises Address</span>
                    <span className="font-bold text-slate-900 dark:text-white">{viewingLeaseModal.propertyAddress}</span>
                    <span className="text-slate-400 block text-[10px]">{viewingLeaseModal.roomName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Term Range</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {viewingLeaseModal.startDate} to {viewingLeaseModal.endDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Monthly Split Rent</span>
                    <span className="font-mono font-bold text-emerald-600 text-sm">
                      ${viewingLeaseModal.monthlyRent}/month
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Security Deposit Held</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                      ${viewingLeaseModal.securityDepositPaid}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Archive Retention</span>
                    <span className="font-semibold text-violet-600 dark:text-violet-400">
                      Tier {viewingLeaseModal.archiveYear} (4-Year Archival)
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Attachments */}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2">
                  Uploaded & Finalized Documents
                </h4>
                <div className="space-y-2">
                  {viewingLeaseModal.officialDocuments.map((doc) => (
                    <div key={doc.id} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-violet-500" />
                        <span className="font-medium text-slate-800 dark:text-slate-200">{doc.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{doc.fileSize} • Executed</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Proof Block */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Digital Signature Seal</span>
                    <div className="font-serif italic text-base text-slate-800 dark:text-slate-200 mt-1">
                      /s/ {viewingLeaseModal.tenantName}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      IP: 198.51.100.42 • Method: {viewingLeaseModal.signatureMethod}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Countersigned by Agent</span>
                    <div className="font-serif italic text-base text-indigo-600 dark:text-indigo-400 mt-1">
                      /s/ Sarah Jenkins, Admin
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Archival Record #LE-OR-{viewingLeaseModal.archiveYear}-09
              </span>
              <div className="flex gap-2">
                <button
                  id="close-agreement-btn"
                  onClick={() => setViewingLeaseModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                <button
                  id="print-download-agreement-btn"
                  onClick={() => alert(`Downloading legal archive packet for ${viewingLeaseModal.tenantName}...`)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-white bg-violet-600 hover:bg-violet-700 flex items-center gap-1.5 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-violet-600" />
                Attach Official Document
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  id="doc-title-input"
                  type="text"
                  required
                  placeholder="e.g. Lead Paint Disclosure Addendum"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-center text-xs text-slate-400 space-y-1">
                <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                <span>Drag & drop PDF / Word document or click to browse</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-upload-doc-btn"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
                >
                  Save & Attach
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

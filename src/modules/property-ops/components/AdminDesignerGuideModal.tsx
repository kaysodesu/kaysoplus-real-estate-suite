import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Layers, 
  ShieldCheck, 
  Palette, 
  Calendar, 
  FileText, 
  Home, 
  DollarSign, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface AdminDesignerGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDesignerGuideModal: React.FC<AdminDesignerGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="admin-designer-guide-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Spec Guide for Graphic & UI/UX Designer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Architectural blueprint & UX principles for Prospect Lead Entry & Archive Processing
              </p>
            </div>
          </div>
          <button
            id="close-admin-guide-button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm text-slate-700 dark:text-slate-300">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-indigo-950 dark:text-indigo-200">
                  Role: Professional Administrator Guidance
                </h4>
                <p className="text-xs text-indigo-900/80 dark:text-indigo-300/80 mt-1 leading-relaxed">
                  Graphic designers must treat this portal not merely as an intake form, but as an end-to-end 
                  operational lifecycle. New applicants begin as raw prospects in <strong>Section A</strong>. 
                  Downstream operational sections (<strong>B: Property</strong>, <strong>C: Lease</strong>, <strong>D: Financial Ledger</strong>, and <strong>E: Support</strong>) 
                  are <em>strictly gated</em> until the administrative property owner has formally approved the application and bound the tenant to an assigned property unit.
                </p>
              </div>
            </div>
          </div>

          {/* Sequential Order Specification */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center font-bold">1</span>
              Strict Sectional Hierarchy & Visual Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold">A</span>
                  Section A: Client Information
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Contact info, demographic classification (Single, Couple, Pets, ESA, Veteran, Senior 55+), real estate preferences, contact history, employment, income/budget, background check, rental history, employment history, application & admin fees ($50/$150), and security deposit holding.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/30">
                <div className="font-semibold text-amber-950 dark:text-amber-200 flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Approval & Unit Assignment Gate
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  <strong>CRITICAL RULE:</strong> Sections B, C, D, and E must stay locked until the administrative property owner has approved the qualified lead and assigned them to a specific property and unit. Once assigned, the unit immediately reveals all existing co-tenants with direct phone/email and in-portal private messaging.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">B</span>
                  <Home className="w-3.5 h-3.5 text-emerald-600" />
                  Section B: Property Inventory
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Address, Type, Sq Ft, Amenities, Utilities Included matrix, Washer/Dryer options, Fee Responsibility splits (Pest Control, Lawn, Appliance repair between Tenant / Property Owner / Homeowner), Security Deposit amount, and dynamic Room Rent Split Calculator based on sqft, private vs shared bath, and private exterior door access.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-bold">C</span>
                  <FileText className="w-3.5 h-3.5 text-violet-600" />
                  Section C: Lease & Archive
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Start/End dates, automated Renewal Alerts (60 days, 30 days, 14 days, and day before due date), official document repository, and 3-to-4-year tenant archive with hyperlinks to specialized lease agreements executed via email link, text link, or in-person with agent.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold">D</span>
                  <DollarSign className="w-3.5 h-3.5 text-cyan-600" />
                  Section D: Financial Ledger
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Pay frequency, filtered transaction ledger (by tenant, account on file, late fees, rent credits, and repair deductions). Interactive Rent Calendar with Unpaid / Pending / Paid toggles, 24-hour pending late fee countdown with custom fee pricing, payment method analytics (Venmo, CashApp, Zelle, ACH, Cash, Card) showing collected vs projected income in parentheses and unpaid money loss. Manual date received recording.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-bold">E</span>
                  <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                  Section E: Support & Operations
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Communication history (logged phone, text, email, private software messages with mass messaging capability and common communication dropdowns), property maintenance ticketing with repair statuses, out-of-pocket rent reduction linking, and local vendor directory.
                </p>
              </div>

            </div>
          </div>

          {/* Designer Visual Guidelines & Tokens */}
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Graphic Designer Token Guide & Color Semantics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-950/20">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                  Paid / Qualified / Verified
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Emerald Green badges (#10B981) indicating collected funds, cleared background checks, and approved tenant agreements.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/20">
                <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider block mb-1">
                  Pending / Projected Income
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Warm Amber (#F59E0B) for 24h grace periods, projected income in parentheses, and awaiting admin countersignatures.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50/40 dark:bg-rose-950/20">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block mb-1">
                  Unpaid / Late / Loss Delay
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Rose Red (#F43F5E) for overdue rent, money loss tracking, flagged background reports, and emergency maintenance.
                </p>
              </div>
            </div>
          </div>

          {/* Best Practices Checklist for the Designer */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Administrative Verification Checklist
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>No Orphan Fields:</strong> Every financial deduction must connect to an accountable repair ticket or landlord approval note.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Privacy in Roommates:</strong> The unit tenant roster shows general email/phone for easy co-living, while allowing private 1-on-1 portal messaging.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Mathematical Coherence:</strong> Room rent splits must sum precisely to the property's gross monthly rent total.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Archival Integrity:</strong> Multi-year filter tabs (2023-2026) must maintain read-only audit trails for tax and legal compliance.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            id="dismiss-admin-guide-button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs transition-colors shadow-xs"
          >
            Acknowledge & Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};

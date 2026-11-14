import React, { useState } from 'react';
import { 
  PayFrequency, 
  PaymentMethod, 
  LedgerTransaction, 
  RentCalendarEntry 
} from '../types';
import { 
  DollarSign, 
  Calendar, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  X, 
  Edit3, 
  User, 
  Wrench, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SectionDFinancialLedgerProps {
  transactions: LedgerTransaction[];
  calendarEntries: RentCalendarEntry[];
  onAddTransaction: (tx: LedgerTransaction) => void;
  onUpdateCalendarEntry: (entry: RentCalendarEntry) => void;
  onUpdateTransactionDateReceived: (txId: string, date: string) => void;
}

export const SectionDFinancialLedger: React.FC<SectionDFinancialLedgerProps> = ({
  transactions,
  calendarEntries,
  onAddTransaction,
  onUpdateCalendarEntry,
  onUpdateTransactionDateReceived,
}) => {
  const [payFrequency, setPayFrequency] = useState<PayFrequency>('monthly');

  // Filters
  const [tenantFilter, setTenantFilter] = useState<string>('ALL');
  const [accountFilter, setAccountFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Calendar state
  const [selectedCalendarEntry, setSelectedCalendarEntry] = useState<RentCalendarEntry | null>(null);
  const [calendarCustomFee, setCalendarCustomFee] = useState<number>(50);
  const [calendarAgreementNotes, setCalendarAgreementNotes] = useState<string>('');
  const [calendarDateReceived, setCalendarDateReceived] = useState<string>(new Date().toISOString().split('T')[0]);

  // New transaction modal
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [newTxTenantName, setNewTxTenantName] = useState('Marcus Vance');
  const [newTxAccount, setNewTxAccount] = useState('Zelle (Checking *4920)');
  const [newTxAmount, setNewTxAmount] = useState<number>(1450);
  const [newTxType, setNewTxType] = useState<LedgerTransaction['type']>('Rent Payment');
  const [newTxMethod, setNewTxMethod] = useState<PaymentMethod>('Zelle');
  const [newTxNotes, setNewTxNotes] = useState('');
  const [newTxDeductionReason, setNewTxDeductionReason] = useState('');
  const [newTxDateReceived, setNewTxDateReceived] = useState(new Date().toISOString().split('T')[0]);

  // Unique lists for filter dropdowns
  const uniqueTenants = Array.from(new Set(transactions.map((t) => t.tenantName)));
  const uniqueAccounts = Array.from(new Set(transactions.map((t) => t.accountOnFile)));

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchTenant = tenantFilter === 'ALL' || tx.tenantName === tenantFilter;
    const matchAccount = accountFilter === 'ALL' || tx.accountOnFile === accountFilter;
    const matchType = 
      typeFilter === 'ALL' ||
      (typeFilter === 'Late Fee' && tx.type === 'Late Fee') ||
      (typeFilter === 'Rent Credit' && tx.type === 'Rent Credit') ||
      (typeFilter === 'Deduction' && tx.type === 'Deduction') ||
      (typeFilter === 'Rent Payment' && tx.type === 'Rent Payment');
    return matchTenant && matchAccount && matchType;
  });

  // Financial Summary Metrics:
  // Paid (Collected)
  const totalCollected = calendarEntries
    .filter((e) => e.status === 'Paid')
    .reduce((sum, e) => sum + e.rentAmount, 0);

  // Pending (Projected)
  const totalPending = calendarEntries
    .filter((e) => e.status === 'Pending')
    .reduce((sum, e) => sum + e.rentAmount, 0);

  // Unpaid / Late (Money Loss or delayed)
  const totalUnpaidLoss = calendarEntries
    .filter((e) => e.status === 'Unpaid')
    .reduce((sum, e) => sum + e.rentAmount + (e.lateFeePending24h ? e.lateFeeAmount : 0), 0);

  // By Payment Method breakdown
  const paymentMethods: PaymentMethod[] = ['Venmo', 'CashApp', 'Zelle', 'ACH', 'Cash', 'Debit/Credit'];

  const methodStats = paymentMethods.map((m) => {
    const paidForMethod = calendarEntries
      .filter((e) => e.method === m && e.status === 'Paid')
      .reduce((s, e) => s + e.rentAmount, 0);
    const pendingForMethod = calendarEntries
      .filter((e) => e.method === m && e.status === 'Pending')
      .reduce((s, e) => s + e.rentAmount, 0);
    const unpaidForMethod = calendarEntries
      .filter((e) => e.method === m && e.status === 'Unpaid')
      .reduce((s, e) => s + e.rentAmount, 0);
    return {
      method: m,
      paid: paidForMethod,
      pending: pendingForMethod,
      unpaid: unpaidForMethod,
    };
  });

  const handleOpenCalendarAction = (entry: RentCalendarEntry) => {
    setSelectedCalendarEntry(entry);
    setCalendarCustomFee(entry.lateFeeAmount || 50);
    setCalendarAgreementNotes(entry.agreementWithTenant || '');
    setCalendarDateReceived(entry.dateReceived || new Date().toISOString().split('T')[0]);
  };

  const handleSaveCalendarEntry = (newStatus: 'Unpaid' | 'Pending' | 'Paid') => {
    if (!selectedCalendarEntry) return;

    const updated: RentCalendarEntry = {
      ...selectedCalendarEntry,
      status: newStatus,
      lateFeePending24h: newStatus === 'Unpaid',
      lateFeeAmount: calendarCustomFee,
      agreementWithTenant: calendarAgreementNotes,
      dateReceived: newStatus === 'Paid' ? calendarDateReceived : undefined,
    };

    onUpdateCalendarEntry(updated);
    setSelectedCalendarEntry(null);
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = newTxType === 'Deduction' || newTxType === 'Rent Credit' ? -Math.abs(newTxAmount) : Math.abs(newTxAmount);

    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tenantId: `tenant-${Date.now()}`,
      tenantName: newTxTenantName,
      accountOnFile: newTxAccount,
      amount: finalAmount,
      type: newTxType,
      method: newTxMethod,
      notes: newTxNotes,
      deductionReason: newTxType === 'Deduction' ? newTxDeductionReason : undefined,
      dateReceivedManually: newTxDateReceived,
      status: 'Completed',
    };

    onAddTransaction(newTx);
    setShowAddTxModal(false);
    setNewTxNotes('');
    setNewTxDeductionReason('');
  };

  return (
    <div id="section-d-financial-ledger" className="space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold text-xs uppercase tracking-wider">
              Section D
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Financial Ledger & Interactive Rent Due Calendar
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Payment frequencies, filtered transactions with out-of-pocket repair deductions, interactive rent calendar, and payment method performance.
          </p>
        </div>

        {/* Pay Frequency Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Pay Frequency:</span>
          <select
            id="pay-frequency-select"
            value={payFrequency}
            onChange={(e) => setPayFrequency(e.target.value as PayFrequency)}
            className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white capitalize focus:ring-2 focus:ring-cyan-500"
          >
            {(['daily', 'weekly', 'monthly', 'quarterly', 'semi-annual', 'annual'] as const).map((freq) => (
              <option key={freq} value={freq}>
                {freq}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Financial Overview Metrics Bar (Collected, Projected, Money Loss) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Total Collected (Paid) */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Total Collected
            </span>
            <span className="text-[10px] uppercase font-bold bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded-full">
              Processed
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300">
            ${totalCollected.toLocaleString()}
          </div>
          <div className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-1">
            Cleared & confirmed in owner accounts
          </div>
        </div>

        {/* Projected Income (in parentheses based on Pending) */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Pending Collections
            </span>
            <span className="text-[10px] uppercase font-bold bg-amber-100 dark:bg-amber-900 px-2 py-0.5 rounded-full">
              In Transit
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300">
            (${totalPending.toLocaleString()} projected)
          </div>
          <div className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
            Shows projected income once transfers settle
          </div>
        </div>

        {/* Money Loss / Delayed (Unpaid + Late Fees) */}
        <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-800 dark:text-rose-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              Unpaid / Money Loss
            </span>
            <span className="text-[10px] uppercase font-bold bg-rose-100 dark:bg-rose-900 px-2 py-0.5 rounded-full">
              Overdue
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-300">
            -${totalUnpaidLoss.toLocaleString()}
          </div>
          <div className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-1">
            Delayed revenue subject to 24h pending fee agreements
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* CURRENT RENT DUE CALENDAR (INTERACTIVE STATUS DROP-DOWN) */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Current Rent Due Calendar (September 2026)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any tenant card on their rent due date to toggle between <strong>Unpaid</strong>, <strong>Pending</strong>, and <strong>Paid</strong>. If Unpaid, a custom late fee remains pending for 24 hours.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Paid
            </span>
            <span className="flex items-center gap-1 text-amber-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Pending
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Unpaid (24h Pending Fee)
            </span>
          </div>
        </div>

        {/* Calendar Grid Representation */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-7 gap-2 pt-2">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((dayNumber) => {
            const matches = calendarEntries.filter((e) => e.dueDay === dayNumber);
            return (
              <div
                key={dayNumber}
                className={`min-h-24 p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  matches.length > 0
                    ? 'bg-slate-50 dark:bg-slate-800/80 border-cyan-300 dark:border-cyan-800/60 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-mono font-bold ${matches.length > 0 ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-400'}`}>
                    Sep {dayNumber}
                  </span>
                  {matches.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-200 font-bold">
                      Rent Due
                    </span>
                  )}
                </div>

                {/* Tenant Due Cards on this day */}
                <div className="space-y-1 mt-1">
                  {matches.map((entry) => (
                    <button
                      key={entry.id}
                      id={`cal-tenant-btn-${entry.id}`}
                      onClick={() => handleOpenCalendarAction(entry)}
                      className={`w-full text-left p-1.5 rounded-lg text-xs font-medium border transition-all ${
                        entry.status === 'Paid'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                          : entry.status === 'Pending'
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                      }`}
                    >
                      <div className="font-bold truncate text-[11px] flex items-center justify-between">
                        <span>{entry.tenantName}</span>
                        <span className="font-mono">${entry.rentAmount}</span>
                      </div>
                      <div className="text-[9px] flex items-center justify-between opacity-80 mt-0.5">
                        <span className="capitalize">{entry.method}</span>
                        <span className="font-bold uppercase">{entry.status}</span>
                      </div>
                      {entry.lateFeePending24h && (
                        <div className="text-[9px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-0.5 mt-0.5">
                          <Clock className="w-2.5 h-2.5" /> 24h Fee Pending (+${entry.lateFeeAmount})
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method Performance Matrix (Venmo, CashApp, Zelle, ACH, Cash, Debit/Credit) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-indigo-500" />
          Tenant Payment Methods & Inflow Analytics
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tracks verified collections against pending processing times across the 6 supported handles.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {methodStats.map((item) => (
            <div key={item.method} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">
                {item.method}
              </span>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Paid:</span>
                  <span className="font-mono font-bold">${item.paid}</span>
                </div>
                <div className="flex justify-between text-amber-600 dark:text-amber-400">
                  <span>Pending:</span>
                  <span className="font-mono font-bold">(${item.pending})</span>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Unpaid:</span>
                  <span className="font-mono font-bold">-${item.unpaid}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filterable Transaction Ledger */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              Detailed Transaction Ledger & Deductions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Filter by tenant, account on file, late fees, rent credits, or repair deductions (tenant out-of-pocket reductions).
            </p>
          </div>

          <button
            id="open-add-transaction-modal-btn"
            onClick={() => setShowAddTxModal(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Record Transaction / Deduction
          </button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-400 font-semibold">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          {/* Filter by Tenant */}
          <div>
            <select
              id="filter-by-tenant-select"
              value={tenantFilter}
              onChange={(e) => setTenantFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Tenants</option>
              {uniqueTenants.map((tn) => (
                <option key={tn} value={tn}>{tn}</option>
              ))}
            </select>
          </div>

          {/* Filter by Account on File */}
          <div>
            <select
              id="filter-by-account-select"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Accounts on File</option>
              {uniqueAccounts.map((ac) => (
                <option key={ac} value={ac}>{ac}</option>
              ))}
            </select>
          </div>

          {/* Filter by Type */}
          <div>
            <select
              id="filter-by-type-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Types</option>
              <option value="Rent Payment">Rent Payments</option>
              <option value="Late Fee">Late Fees</option>
              <option value="Rent Credit">Rent Credits</option>
              <option value="Deduction">Deductions (Out-of-Pocket Repairs)</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Tenant Name</th>
                <th className="py-3 px-4">Account on File</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Date Received (Manual)</th>
                <th className="py-3 px-4">Notes / Deduction Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{tx.date}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{tx.tenantName}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">{tx.accountOnFile}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                      tx.type === 'Rent Payment'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : tx.type === 'Late Fee'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : tx.type === 'Deduction'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                        : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{tx.method}</td>
                  <td className="py-3 px-4 font-mono font-bold text-sm">
                    <span className={tx.amount < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                      {tx.amount < 0 ? `-$${Math.abs(tx.amount)}` : `+$${tx.amount}`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-slate-700 dark:text-slate-300">
                      <span>{tx.dateReceivedManually || 'Not Recorded'}</span>
                      <button
                        title="Record/Edit Date Received"
                        onClick={() => {
                          const newD = prompt('Enter Date Received (YYYY-MM-DD):', tx.dateReceivedManually || tx.date);
                          if (newD) onUpdateTransactionDateReceived(tx.id, newD);
                        }}
                        className="text-slate-400 hover:text-cyan-600"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {tx.deductionReason ? (
                      <span className="text-rose-600 font-medium">Deduction: {tx.deductionReason}</span>
                    ) : (
                      tx.notes
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CALENDAR TENANT STATUS DROPDOWN / LATE FEE MODAL */}
      {/* ========================================================= */}
      {selectedCalendarEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div 
            id="calendar-status-popup"
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-5 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider block">
                  Rent Due Status Modifier
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  {selectedCalendarEntry.tenantName} — Sep {selectedCalendarEntry.dueDay}, 2026
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedCalendarEntry.propertyAddress} • Due Amount: ${selectedCalendarEntry.rentAmount}
                </p>
              </div>
              <button onClick={() => setSelectedCalendarEntry(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status Selection Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Select Rent Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="status-btn-paid"
                  onClick={() => handleSaveCalendarEntry('Paid')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedCalendarEntry.status === 'Paid'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200'
                  }`}
                >
                  Paid
                </button>
                <button
                  id="status-btn-pending"
                  onClick={() => handleSaveCalendarEntry('Pending')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedCalendarEntry.status === 'Pending'
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  id="status-btn-unpaid"
                  onClick={() => handleSaveCalendarEntry('Unpaid')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    selectedCalendarEntry.status === 'Unpaid'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200'
                  }`}
                >
                  Unpaid
                </button>
              </div>
            </div>

            {/* If Unpaid is selected or active: 24h grace fee customization */}
            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                24-Hour Late Fee Protocol
              </div>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80">
                If the Unpaid option is selected, a late fee will be pending for 24 hours unless the property owner establishes a deferred agreement or speaks directly with the tenant.
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Custom Set Late Fee:</span>
                <div className="flex items-center gap-1">
                  <span className="text-slate-400">$</span>
                  <input
                    id="custom-late-fee-input"
                    type="number"
                    value={calendarCustomFee}
                    onChange={(e) => setCalendarCustomFee(Number(e.target.value) || 0)}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Owner-Tenant Agreement / Grace Period Notes:
                </label>
                <input
                  id="agreement-notes-input"
                  type="text"
                  placeholder="e.g. Spoke with tenant; approved payment by Friday 5PM."
                  value={calendarAgreementNotes}
                  onChange={(e) => setCalendarAgreementNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            {/* Date Received Manual Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Manual Date Received (When Marked Paid)
              </label>
              <input
                id="manual-date-received-input"
                type="date"
                value={calendarDateReceived}
                onChange={(e) => setCalendarDateReceived(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedCalendarEntry(null)}
                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                id="save-calendar-entry-changes-btn"
                onClick={() => handleSaveCalendarEntry(selectedCalendarEntry.status)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Transaction Modal */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-800 space-y-3.5">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-600" />
                Record Transaction / Rent Deduction
              </h3>
              <button onClick={() => setShowAddTxModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tenant Name</label>
                <input
                  type="text"
                  required
                  value={newTxTenantName}
                  onChange={(e) => setNewTxTenantName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Transaction Type</label>
                  <select
                    value={newTxType}
                    onChange={(e: any) => setNewTxType(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Rent Payment">Rent Payment</option>
                    <option value="Late Fee">Late Fee</option>
                    <option value="Rent Credit">Rent Credit</option>
                    <option value="Deduction">Deduction (Out-of-Pocket Repair)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
                  <select
                    value={newTxMethod}
                    onChange={(e: any) => setNewTxMethod(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Venmo">Venmo</option>
                    <option value="CashApp">CashApp</option>
                    <option value="Zelle">Zelle</option>
                    <option value="ACH">ACH</option>
                    <option value="Cash">Cash</option>
                    <option value="Debit/Credit">Debit/Credit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newTxAmount}
                    onChange={(e) => setNewTxAmount(Number(e.target.value) || 0)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date Received</label>
                  <input
                    type="date"
                    required
                    value={newTxDateReceived}
                    onChange={(e) => setNewTxDateReceived(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {newTxType === 'Deduction' && (
                <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
                  <label className="block font-semibold text-rose-800 dark:text-rose-200 mb-1">
                    Repair Deduction Explanation
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenant replaced shower valve out of pocket ($65 receipt)."
                    value={newTxDeductionReason}
                    onChange={(e) => setNewTxDeductionReason(e.target.value)}
                    className="w-full p-1.5 text-xs rounded-lg border border-rose-300 dark:border-rose-700 bg-white dark:bg-slate-800"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Account on File</label>
                <input
                  type="text"
                  placeholder="e.g. Chase Checking *4421"
                  value={newTxAccount}
                  onChange={(e) => setNewTxAccount(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-add-tx-btn"
                  className="px-4 py-1.5 text-white bg-cyan-600 hover:bg-cyan-700 font-semibold rounded-xl"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  ProspectLead, 
  PropertyInventory, 
  DemographicInfo, 
  ContactHistoryItem,
  RentalHistoryItem,
  EmploymentHistoryItem
} from '../types';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Briefcase, 
  CreditCard, 
  Shield, 
  HeartHandshake, 
  Plus, 
  Send, 
  Check, 
  Lock, 
  Home, 
  Building2,
  Award, 
  PawPrint, 
  Users,
  MessageSquare,
  Sparkles,
  Compass,
  X
} from 'lucide-react';

interface SectionAClientInfoProps {
  leads?: ProspectLead[];
  properties: PropertyInventory[];
  selectedLeadId?: string;
  onSelectLead?: (leadId: string) => void;
  onUpdateStatus?: (leadId: string, status: ProspectLead['status'], propertyId?: string, unitId?: string, roomId?: string) => void;
  onAddNewLead?: (newLead: ProspectLead) => void;
  onOpenMessage?: (contact: { id: string; name: string; email: string; phone: string; roomName?: string }) => void;
  onOpenDesignerGuide?: () => void;
  onUnlockSection?: (sectionKey: 'B' | 'C' | 'D' | 'E') => void;
  // Backward compatibility
  lead?: ProspectLead;
  allLeads?: ProspectLead[];
  onUpdateLead?: (updated: ProspectLead) => void;
  onApproveAndAssign?: (leadId: string, propertyId: string, unitId: string, roomId: string) => void;
  onOpenPrivateMessage?: (name: string, email: string, phone: string, unitInfo: string) => void;
}

export const SectionAClientInfo: React.FC<SectionAClientInfoProps> = ({
  lead: propsLead,
  properties,
  leads,
  allLeads,
  selectedLeadId,
  onSelectLead,
  onUpdateStatus,
  onAddNewLead,
  onOpenMessage,
  onOpenDesignerGuide,
  onUpdateLead,
  onApproveAndAssign,
  onOpenPrivateMessage,
  onUnlockSection,
}) => {
  const effectiveLeads = leads || allLeads || [];
  const lead = 
    effectiveLeads.find((l) => l.id === selectedLeadId) || 
    propsLead || 
    effectiveLeads[0];

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProspectLead>(lead || {} as ProspectLead);

  // Assignment states for Property Owner
  const [selectedPropId, setSelectedPropId] = useState<string>(lead?.assignedPropertyId || properties[0]?.id || '');
  const [selectedUnitId, setSelectedUnitId] = useState<string>(lead?.assignedUnitId || properties[0]?.units[0]?.id || '');
  const [selectedRoomId, setSelectedRoomId] = useState<string>(lead?.assignedRoomId || properties[0]?.units[0]?.rooms[0]?.id || '');
  const [approvalNotes, setApprovalNotes] = useState(lead?.adminApprovalNotes || '');

  // Contact history log state
  const [newLogType, setNewLogType] = useState<'Phone Call' | 'Inquiry Email' | 'Text SMS' | 'Scheduled Tour' | 'In-Person Meeting'>('Phone Call');
  const [newLogNotes, setNewLogNotes] = useState('');
  const [showAddLog, setShowAddLog] = useState(false);

  // New Lead Intake Modal state
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadEmployer, setNewLeadEmployer] = useState('');
  const [newLeadGrossIncome, setNewLeadGrossIncome] = useState(5000);
  const [newLeadMaxBudget, setNewLeadMaxBudget] = useState(1500);
  const [newLeadOccupantType, setNewLeadOccupantType] = useState<'single' | 'couple'>('single');
  const [newLeadIsVeteran, setNewLeadIsVeteran] = useState(false);
  const [newLeadIsSenior, setNewLeadIsSenior] = useState(false);
  const [newLeadHasESA, setNewLeadHasESA] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData(lead);
      setSelectedPropId(lead.assignedPropertyId || properties[0]?.id || '');
      setSelectedUnitId(lead.assignedUnitId || properties[0]?.units[0]?.id || '');
      setSelectedRoomId(lead.assignedRoomId || properties[0]?.units[0]?.rooms[0]?.id || '');
      setApprovalNotes(lead.adminApprovalNotes || '');
    }
  }, [lead?.id]);

  if (!lead) {
    return (
      <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <p className="text-sm text-slate-500 mb-3">No prospect leads currently registered in archive.</p>
        <button
          onClick={() => setShowNewLeadModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
        >
          + Register First Prospect Intake
        </button>
      </div>
    );
  }

  const activeProperty = properties.find((p) => p.id === selectedPropId) || properties[0];
  const activeUnit = activeProperty?.units?.find((u) => u.id === selectedUnitId) || activeProperty?.units?.[0];

  const handleDemographicChange = <K extends keyof DemographicInfo>(key: K, value: DemographicInfo[K]) => {
    setFormData((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [key]: value,
      },
    }));
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateLead?.(formData);
    setIsEditing(false);
  };

  const handleAddContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNotes.trim()) return;

    const newLog: ContactHistoryItem = {
      id: `ch-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: newLogType,
      notes: newLogNotes,
      agentName: 'Administrative Property Manager',
    };

    const updated: ProspectLead = {
      ...lead,
      contactHistory: [newLog, ...lead.contactHistory],
    };
    onUpdateLead?.(updated);
    setFormData(updated);
    setNewLogNotes('');
    setShowAddLog(false);
  };

  const handleApproveAndAssignAction = () => {
    if (onUpdateStatus) {
      onUpdateStatus(lead.id, 'approved_by_admin', selectedPropId, selectedUnitId, selectedRoomId);
    }
    if (onApproveAndAssign) {
      onApproveAndAssign(lead.id, selectedPropId, selectedUnitId, selectedRoomId);
    }
  };

  const handlePrivateMessageAction = (name: string, email: string, phone: string, unitInfo: string, id?: string) => {
    if (onOpenMessage) {
      onOpenMessage({
        id: id || lead.id,
        name,
        email,
        phone,
        roomName: unitInfo,
      });
    }
    if (onOpenPrivateMessage) {
      onOpenPrivateMessage(name, email, phone, unitInfo);
    }
  };

  const handleCreateNewLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;

    const created: ProspectLead = {
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
      demographics: {
        occupantType: newLeadOccupantType,
        emotionalSupportPets: newLeadHasESA,
        pets: false,
        petCount: 0,
        petDetails: 'None',
        isVeteran: newLeadIsVeteran,
        isSenior55Plus: newLeadIsSenior,
      },
      contact: {
        fullName: newLeadName,
        phone: newLeadPhone || '(555) 000-0000',
        email: newLeadEmail || 'applicant@example.com',
        preferredContactMethod: 'email',
        currentAddress: 'Pending Entry',
        emergencyContactName: 'Family Contact',
        emergencyContactPhone: '(555) 000-0000',
        emergencyContactRelation: 'Contact on file',
      },
      preferences: {
        desiredMoveInDate: new Date().toISOString().split('T')[0],
        propertyType: 'Single Family',
        preferredBedrooms: '1',
        preferredBathrooms: 'Private Bath Required',
        budgetMin: 1000,
        budgetMax: newLeadMaxBudget,
        preferredAreas: 'Metro Area',
        leaseTermMonths: 12,
      },
      contactHistory: [
        {
          id: `ch-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          type: 'Inquiry Email',
          notes: 'Direct web intake profile submitted to prospect archive.',
          agentName: 'System Intake Portal',
        },
      ],
      employment: {
        employer: newLeadEmployer || 'Self-Employed',
        position: 'Professional',
        supervisor: 'HR / Personnel Dept',
        workPhone: '(555) 000-0000',
        durationMonths: 12,
        monthlyGrossIncome: newLeadGrossIncome,
        additionalIncomeSource: 'None',
        additionalIncomeAmount: 0,
        monthlyDebts: 200,
        maxRentBudget: newLeadMaxBudget,
        proofOfIncomeUploaded: true,
      },
      backgroundCheck: {
        consentSigned: true,
        consentDate: new Date().toISOString().split('T')[0],
        creditScoreEstimate: 720,
        evictionHistory: false,
        criminalRecord: false,
        status: 'Passed',
      },
      rentalHistory: [],
      employmentHistory: [],
      fees: {
        applicationFeeAmount: 50,
        applicationFeePaid: true,
        adminFeeAmount: 150,
        adminFeePaid: false,
        paymentMethod: 'ACH',
        paymentReference: `REF-${Date.now()}`,
        datePaid: new Date().toISOString().split('T')[0],
      },
      securityDeposit: {
        requiredDepositAmount: newLeadMaxBudget,
        holdingDepositPaid: false,
        holdingDepositAmount: 0,
        depositStatus: 'Unpaid',
      },
      status: 'under_review',
      adminApprovalNotes: 'Intake received. Ready for qualification background review.',
    };

    onAddNewLead?.(created);
    setShowNewLeadModal(false);
    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadEmail('');
  };

  // Find co-tenants currently assigned to the same unit
  const assignedUnitInfo = properties
    .find((p) => p.id === lead.assignedPropertyId)
    ?.units?.find((u) => u.id === lead.assignedUnitId);

  const coTenants = effectiveLeads.filter(
    (l) =>
      l.id !== lead.id &&
      l.assignedPropertyId === lead.assignedPropertyId &&
      l.assignedUnitId === lead.assignedUnitId &&
      l.status === 'approved_by_admin'
  );

  const isApproved = lead.status === 'approved_by_admin' && !!lead.assignedPropertyId && !!lead.assignedUnitId;

  return (
    <div id="section-a-client-information" className="space-y-6">
      
      {/* Section Header & Lead Archive Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-wider">
              Section A
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Client Information & Prospect Lead Profile
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intake record processing to lead archive. Only qualified & owner-approved clients unlock Sections B through E.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Lead Switcher Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-2">Applicant:</span>
            <select
              id="lead-selector-dropdown"
              value={lead.id}
              onChange={(e) => onSelectLead?.(e.target.value)}
              className="text-xs font-bold px-2 py-1 rounded-lg border-0 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs cursor-pointer"
            >
              {effectiveLeads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.contact.fullName} ({l.status === 'approved_by_admin' ? '✓ Approved' : l.status === 'qualified' ? 'Qualified' : 'Under Review'})
                </option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <span 
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isApproved 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800' 
                  : lead.status === 'qualified'
                  ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
              }`}
            >
              {isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {isApproved ? 'Approved & Assigned' : lead.status === 'qualified' ? 'Qualified' : 'Under Review'}
            </span>
          </div>

          <button
            id="open-new-lead-intake-modal-btn"
            onClick={() => setShowNewLeadModal(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Intake</span>
          </button>

          <button
            id="toggle-edit-section-a-button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Info'}
          </button>
        </div>
      </div>

      {/* Demographic & Occupant Classification Bar */}
      <div className="p-4 rounded-2xl bg-linear-to-r from-slate-50 via-indigo-50/40 to-slate-50 dark:from-slate-800/40 dark:via-indigo-950/20 dark:to-slate-800/40 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Occupant & Demographic Classifications
          </h4>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            Special Accommodations & Protections
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          
          {/* Occupant Type */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Occupant Type</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 capitalize flex items-center gap-1.5 mt-0.5">
              <User className="w-3 h-3 text-indigo-500" />
              {lead.demographics.occupantType} Occupant
            </span>
          </div>

          {/* Emotional Support Pets */}
          <div className={`p-2.5 rounded-xl border ${lead.demographics.emotionalSupportPets ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] text-slate-400 block font-medium">Emotional Support Pet</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 mt-0.5 ${lead.demographics.emotionalSupportPets ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500'}`}>
              <PawPrint className="w-3 h-3" />
              {lead.demographics.emotionalSupportPets ? 'Verified ESA' : 'None'}
            </span>
          </div>

          {/* Standard Pets */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Pets Status</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
              <PawPrint className="w-3 h-3 text-amber-500" />
              {lead.demographics.pets ? `${lead.demographics.petCount} Pet(s)` : 'No Pets'}
            </span>
          </div>

          {/* Veteran Status */}
          <div className={`p-2.5 rounded-xl border ${lead.demographics.isVeteran ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] text-slate-400 block font-medium">Veteran Status</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 mt-0.5 ${lead.demographics.isVeteran ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500'}`}>
              <Award className="w-3 h-3 text-blue-600" />
              {lead.demographics.isVeteran ? 'U.S. Veteran' : 'Non-Veteran'}
            </span>
          </div>

          {/* Senior 55+ */}
          <div className={`p-2.5 rounded-xl border ${lead.demographics.isSenior55Plus ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            <span className="text-[10px] text-slate-400 block font-medium">Senior Community</span>
            <span className={`text-xs font-bold flex items-center gap-1.5 mt-0.5 ${lead.demographics.isSenior55Plus ? 'text-amber-700 dark:text-amber-300' : 'text-slate-500'}`}>
              <HeartHandshake className="w-3 h-3 text-amber-600" />
              {lead.demographics.isSenior55Plus ? 'Senior (55+)' : 'Standard'}
            </span>
          </div>

          {/* Income-to-Rent Ratio */}
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Rent-to-Income Multiplier</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <DollarSign className="w-3 h-3" />
              {(lead.employment.monthlyGrossIncome / (lead.employment.maxRentBudget || 1200)).toFixed(1)}x Coverage
            </span>
          </div>

        </div>

        {lead.demographics.petDetails && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 px-1">
            <strong>Pet / ESA Details on file:</strong> {lead.demographics.petDetails}
          </p>
        )}
      </div>

      {/* Main 2-Column Grid of Section A Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Column 1 */}
        <div className="space-y-6">

          {/* 1. Contact Info */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Contact Info
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Full Name</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">{lead.contact.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Preferred Contact</span>
                <span className="font-semibold text-slate-900 dark:text-white capitalize">{lead.contact.preferredContactMethod}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Phone</span>
                  <a href={`tel:${lead.contact.phone}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    {lead.contact.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Email</span>
                  <a href={`mailto:${lead.contact.email}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    {lead.contact.email}
                  </a>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-start gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[10px]">Current Address</span>
                  <span className="text-slate-700 dark:text-slate-300">{lead.contact.currentAddress}</span>
                </div>
              </div>
              <div className="sm:col-span-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-[11px]">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Emergency Contact</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {lead.contact.emergencyContactName} ({lead.contact.emergencyContactRelation}) - {lead.contact.emergencyContactPhone}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Real Estate Preferences */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Real Estate Preferences
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Desired Move-in</span>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.preferences.desiredMoveInDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Property Type</span>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.preferences.propertyType}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Lease Term</span>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.preferences.leaseTermMonths} Months</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Bedrooms</span>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.preferences.preferredBedrooms} Bed</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Bathrooms</span>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.preferences.preferredBathrooms}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Budget Range</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                  ${lead.preferences.budgetMin} - ${lead.preferences.budgetMax}/mo
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Preferred Neighborhoods / Proximity</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{lead.preferences.preferredAreas}</span>
              </div>
            </div>
          </div>

          {/* 3. Contact History */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Contact History & Tour Log
              </h3>
              <button
                id="add-contact-log-button"
                onClick={() => setShowAddLog(!showAddLog)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Log Interaction
              </button>
            </div>

            {showAddLog && (
              <form onSubmit={handleAddContactLog} className="p-3 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex gap-2">
                  <select
                    value={newLogType}
                    onChange={(e: any) => setNewLogType(e.target.value)}
                    className="text-xs p-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="Inquiry Email">Inquiry Email</option>
                    <option value="Text SMS">Text SMS</option>
                    <option value="Scheduled Tour">Scheduled Tour</option>
                    <option value="In-Person Meeting">In-Person Meeting</option>
                  </select>
                  <input
                    type="text"
                    required
                    placeholder="Log summary note..."
                    value={newLogNotes}
                    onChange={(e) => setNewLogNotes(e.target.value)}
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {lead.contactHistory.map((item) => (
                <div key={item.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
                  <div className="flex items-center justify-between font-medium text-slate-800 dark:text-slate-200 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      {item.type}
                    </span>
                    <span className="text-[10px] text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">{item.notes}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Logged by: {item.agentName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Employment & Income/Budget */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Employment & Income / Budget Verification
            </h3>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">Current Employer</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{lead.employment.employer}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Position / Title</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{lead.employment.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Supervisor & Work Phone</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {lead.employment.supervisor} ({lead.employment.workPhone})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Employment Duration</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {Math.floor(lead.employment.durationMonths / 12)} yrs {lead.employment.durationMonths % 12} mos
                  </span>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Monthly Gross</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                    ${lead.employment.monthlyGrossIncome.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Add'l Income</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-sm">
                    +${lead.employment.additionalIncomeAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Monthly Debts</span>
                  <span className="font-bold text-rose-500 font-mono text-sm">
                    -${lead.employment.monthlyDebts.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Max Rent Budget</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                    ${lead.employment.maxRentBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>Income Source: {lead.employment.additionalIncomeSource || 'Primary Salary'}</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <FileCheck className="w-3.5 h-3.5" /> Proof of Income Verified
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Column 2 */}
        <div className="space-y-6">

          {/* 5. Background Check */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                Background Check & Credit
              </h3>
              <span 
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  lead.backgroundCheck.status === 'Passed'
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : lead.backgroundCheck.status === 'Flagged'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                }`}
              >
                {lead.backgroundCheck.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-3">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Credit Score</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
                  {lead.backgroundCheck.creditScoreEstimate}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Consent Signed</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {lead.backgroundCheck.consentDate}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Eviction Records</span>
                <span className={`font-semibold ${lead.backgroundCheck.evictionHistory ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  {lead.backgroundCheck.evictionHistory ? 'Record Found' : 'None Clean'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-[10px] text-slate-400 block">Criminal Record</span>
                <span className={`font-semibold ${lead.backgroundCheck.criminalRecord ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                  {lead.backgroundCheck.criminalRecord ? 'Flagged' : 'None Clean'}
                </span>
              </div>
            </div>
          </div>

          {/* 6. Rental History & Employment History */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Home className="w-4 h-4 text-indigo-600" />
              Rental History & References
            </h3>

            {lead.rentalHistory.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-1 mb-2">
                <div className="flex justify-between items-center font-medium text-slate-900 dark:text-white">
                  <span>Landlord: {item.landlordName}</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{item.landlordPhone}</span>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Address: {item.rentalAddress} • Tenancy: {item.datesOfTenancy}
                </div>
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span>Monthly Rent: ${item.monthlyRent}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold">
                    Payment History: {item.onTimePaymentHistory}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic">Reason for leaving: {item.reasonForLeaving}</p>
              </div>
            ))}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Employment History</h4>
              {lead.employmentHistory.map((eh, i) => (
                <div key={i} className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                  <span><strong>{eh.company}</strong> — {eh.role} ({eh.yearsEmployed} yrs)</span>
                  <span className="font-mono">${eh.previousSalary.toLocaleString()}/yr</span>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Application & Admin Fees + Security Deposit */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Application Fees & Security Deposit Holding
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400">App Fee ($50)</span>
                  <span className={`font-bold ${lead.fees.applicationFeePaid ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {lead.fees.applicationFeePaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Admin Fee ($150)</span>
                  <span className={`font-bold ${lead.fees.adminFeePaid ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {lead.fees.adminFeePaid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-2">
                  Ref: {lead.fees.paymentReference || 'N/A'} via {lead.fees.paymentMethod}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px]">Security Deposit</span>
                <span className="text-base font-bold font-mono text-slate-900 dark:text-white block mt-0.5">
                  ${lead.securityDeposit.requiredDepositAmount.toLocaleString()}
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold">
                  Status: {lead.securityDeposit.depositStatus}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* ADMINISTRATIVE PROPERTY OWNER APPROVAL & UNIT ASSIGNMENT GATE */}
      {/* ========================================================= */}
      <div 
        id="admin-approval-gate-card"
        className={`p-6 rounded-2xl border transition-all ${
          isApproved 
            ? 'bg-linear-to-br from-emerald-50/70 via-white to-slate-50 dark:from-emerald-950/20 dark:via-slate-900 dark:to-slate-900 border-emerald-300 dark:border-emerald-800' 
            : 'bg-linear-to-br from-amber-50/80 via-white to-slate-50 dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-900 border-amber-300 dark:border-amber-700'
        } shadow-sm`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isApproved ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                {isApproved ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Administrative Property Owner Approval & Unit Assignment Gate
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              *Only qualified and approved clients will trigger Sections B, C, D, and E. The administrative property owner must approve the application and assign this tenant to an active property, unit, and room.*
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isApproved 
              ? 'bg-emerald-600 text-white' 
              : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
          }`}>
            {isApproved ? 'Gate Unlocked: Sections Active' : 'Gate Locked: Approval Required'}
          </span>
        </div>

        {/* Approval Form Controls */}
        {!isApproved ? (
          <div className="space-y-4 pt-3 border-t border-amber-200/60 dark:border-amber-800/40">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Select Property */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Assign Property
                </label>
                <select
                  id="admin-assign-property-select"
                  value={selectedPropId}
                  onChange={(e) => {
                    setSelectedPropId(e.target.value);
                    const prop = properties.find((p) => p.id === e.target.value);
                    if (prop && prop.units.length > 0) {
                      setSelectedUnitId(prop.units[0].id);
                      if (prop.units[0].rooms.length > 0) {
                        setSelectedRoomId(prop.units[0].rooms[0].id);
                      }
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.address} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Unit */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Assign Unit
                </label>
                <select
                  id="admin-assign-unit-select"
                  value={selectedUnitId}
                  onChange={(e) => {
                    setSelectedUnitId(e.target.value);
                    const unit = activeProperty?.units.find((u) => u.id === e.target.value);
                    if (unit && unit.rooms.length > 0) {
                      setSelectedRoomId(unit.rooms[0].id);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {activeProperty?.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.unitNumber} ({u.totalRooms} Rooms total)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Room */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                  Assign Room Allocation
                </label>
                <select
                  id="admin-assign-room-select"
                  value={selectedRoomId}
                  onChange={(e) => setSelectedRoomId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                >
                  {activeUnit?.rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.squareFeet} sqft • ${r.calculatedRent}/mo) {r.assignedTenantId ? '⚠️ Occupied' : '✅ Available'}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold text-xs mb-1">
                Property Owner Endorsement Notes
              </label>
              <input
                id="admin-approval-notes-input"
                type="text"
                placeholder="e.g., Background verified, verified income exceeds 3x rent, pet documentation cleared."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Assigning activates inventory allocation, automated lease drafting, and payment ledger.</span>
              </div>
              <button
                id="approve-and-assign-button"
                onClick={handleApproveAndAssignAction}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Approve Application & Assign to Unit
              </button>
            </div>
          </div>
        ) : (
          /* Approved Unit & Roommates Roster */
          <div className="space-y-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/40">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                  Assigned Placement
                </span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {properties.find((p) => p.id === lead.assignedPropertyId)?.address} — {assignedUnitInfo?.unitNumber}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 block">
                  Room: <strong>{assignedUnitInfo?.rooms.find((r) => r.id === lead.assignedRoomId)?.name || 'Assigned Suite'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="jump-to-section-b-btn"
                  onClick={() => onUnlockSection?.('B')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  View Section B
                </button>
                <button
                  id="jump-to-section-c-btn"
                  onClick={() => onUnlockSection?.('C')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  View Lease (Section C)
                </button>
              </div>
            </div>

            {/* Roommate / Co-Tenants Roster in Unit with General Contacts & Private In-Software Messaging */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Unit Resident Roster ({assignedUnitInfo?.unitNumber})
                </h4>
                <span className="text-[11px] text-slate-500">
                  General phone & email shown for portal access + private in-software messaging
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Active Tenant Card */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      {lead.contact.fullName} (Active Profile)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                      {assignedUnitInfo?.rooms.find((r) => r.id === lead.assignedRoomId)?.name || 'Room'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                    <div>Phone: <strong>{lead.contact.phone}</strong></div>
                    <div>Email: <strong>{lead.contact.email}</strong></div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                    <button
                      id={`private-msg-self-${lead.id}`}
                      onClick={() => handlePrivateMessageAction(lead.contact.fullName, lead.contact.email, lead.contact.phone, assignedUnitInfo?.unitNumber || '', lead.id)}
                      className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" /> Private Message
                    </button>
                  </div>
                </div>

                {/* Other Co-Tenants / Roommates living in the unit */}
                {coTenants.length > 0 ? (
                  coTenants.map((cotenant) => (
                    <div key={cotenant.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          {cotenant.contact.fullName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                          Roommate
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5">
                        <div>Phone: <strong>{cotenant.contact.phone}</strong></div>
                        <div>Email: <strong>{cotenant.contact.email}</strong></div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                        <button
                          id={`private-msg-cotenant-${cotenant.id}`}
                          onClick={() => handlePrivateMessageAction(cotenant.contact.fullName, cotenant.contact.email, cotenant.contact.phone, assignedUnitInfo?.unitNumber || '', cotenant.id)}
                          className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" /> Direct Message
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                    <span>Other rooms currently vacant or pending move-in</span>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>

      {/* New Lead Intake Modal */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Plus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    New Prospect Profile Intake
                  </h3>
                  <p className="text-xs text-slate-500">
                    Process to archive of prospective client leads
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewLeadSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Miller"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Occupant Type</label>
                  <select
                    value={newLeadOccupantType}
                    onChange={(e) => setNewLeadOccupantType(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="single">Single Occupant</option>
                    <option value="couple">Couple</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Contact</label>
                  <input
                    type="tel"
                    placeholder="(555) 555-0178"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="jordan@example.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Current Employer</label>
                  <input
                    type="text"
                    placeholder="Company or Organization"
                    value={newLeadEmployer}
                    onChange={(e) => setNewLeadEmployer(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Monthly Gross Income ($)</label>
                  <input
                    type="number"
                    value={newLeadGrossIncome}
                    onChange={(e) => setNewLeadGrossIncome(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Max Rent Budget ($)</label>
                  <input
                    type="number"
                    value={newLeadMaxBudget}
                    onChange={(e) => setNewLeadMaxBudget(Number(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Checkbox Protections */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLeadIsVeteran}
                    onChange={(e) => setNewLeadIsVeteran(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>U.S. Veteran</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLeadIsSenior}
                    onChange={(e) => setNewLeadIsSenior(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Senior (55+)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLeadHasESA}
                    onChange={(e) => setNewLeadHasESA(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Verified ESA</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-2xs"
                >
                  <Check className="w-4 h-4" /> Save to Prospect Archive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

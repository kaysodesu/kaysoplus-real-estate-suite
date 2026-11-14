export type OccupantType = 'single' | 'couple';

export interface DemographicInfo {
  occupantType: OccupantType;
  emotionalSupportPets: boolean;
  pets: boolean;
  petCount: number;
  petDetails: string;
  isVeteran: boolean;
  isSenior55Plus: boolean;
}

export interface ClientContactInfo {
  fullName: string;
  phone: string;
  email: string;
  preferredContactMethod: 'phone' | 'email' | 'text';
  currentAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

export interface RealEstatePreferences {
  desiredMoveInDate: string;
  propertyType: 'Single Family' | 'Multi-Family' | 'Duplex' | 'Apartment' | 'Townhouse' | 'Co-living';
  preferredBedrooms: string;
  preferredBathrooms: string;
  budgetMin: number;
  budgetMax: number;
  preferredAreas: string;
  leaseTermMonths: number;
}

export interface ContactHistoryItem {
  id: string;
  date: string;
  type: 'Phone Call' | 'Inquiry Email' | 'Text SMS' | 'Scheduled Tour' | 'In-Person Meeting';
  notes: string;
  agentName: string;
}

export interface EmploymentInfo {
  employer: string;
  position: string;
  supervisor: string;
  workPhone: string;
  durationMonths: number;
  monthlyGrossIncome: number;
  additionalIncomeSource: string;
  additionalIncomeAmount: number;
  monthlyDebts: number;
  maxRentBudget: number;
  proofOfIncomeUploaded: boolean;
}

export interface BackgroundCheck {
  consentSigned: boolean;
  consentDate: string;
  creditScoreEstimate: number;
  evictionHistory: boolean;
  evictionDetails?: string;
  criminalRecord: boolean;
  criminalDetails?: string;
  status: 'Pending' | 'Passed' | 'Flagged';
}

export interface RentalHistoryItem {
  landlordName: string;
  landlordPhone: string;
  rentalAddress: string;
  datesOfTenancy: string;
  monthlyRent: number;
  reasonForLeaving: string;
  onTimePaymentHistory: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface EmploymentHistoryItem {
  company: string;
  role: string;
  yearsEmployed: number;
  previousSalary: number;
}

export interface ApplicationFees {
  applicationFeeAmount: number;
  applicationFeePaid: boolean;
  adminFeeAmount: number;
  adminFeePaid: boolean;
  paymentMethod: string;
  paymentReference: string;
  datePaid: string;
}

export interface SecurityDepositInfo {
  requiredDepositAmount: number;
  holdingDepositPaid: boolean;
  holdingDepositAmount: number;
  depositStatus: 'Unpaid' | 'Partial' | 'Held in Escrow' | 'Refunded';
}

export type ApplicationStatus = 
  | 'lead'
  | 'submitted'
  | 'under_review'
  | 'qualified'
  | 'approved_by_admin'
  | 'declined';

export interface ProspectLead {
  id: string;
  createdAt: string;
  demographics: DemographicInfo;
  contact: ClientContactInfo;
  preferences: RealEstatePreferences;
  contactHistory: ContactHistoryItem[];
  employment: EmploymentInfo;
  backgroundCheck: BackgroundCheck;
  rentalHistory: RentalHistoryItem[];
  employmentHistory: EmploymentHistoryItem[];
  fees: ApplicationFees;
  securityDeposit: SecurityDepositInfo;
  status: ApplicationStatus;
  adminApprovalNotes?: string;
  assignedPropertyId?: string;
  assignedUnitId?: string;
  assignedRoomId?: string;
}

export interface RoomInventory {
  id: string;
  name: string;
  squareFeet: number;
  bathroomType: 'shared' | 'private';
  privateAccessDoor: 'none' | 'front_door' | 'back_door' | 'side_door';
  calculatedRent: number;
  assignedTenantId?: string;
  assignedTenantName?: string;
}

export interface UnitInfo {
  id: string;
  unitNumber: string;
  totalRooms: number;
  rooms: RoomInventory[];
}

export interface PropertyInventory {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'Single Family' | 'Multi-Family' | 'Duplex' | 'Apartment' | 'Townhouse' | 'Co-living';
  squareFeet: number;
  amenities: string[];
  utilitiesIncluded: {
    water: boolean;
    electric: boolean;
    gas: boolean;
    trash: boolean;
    internet: boolean;
    sewer: boolean;
  };
  washerDryerOption: 'In-Unit' | 'On-Site/Shared' | 'Hookups Only' | 'None';
  feeResponsibilities: {
    pestControl: 'Tenant' | 'Property Owner' | 'Homeowner';
    lawnMaintenance: 'Tenant' | 'Property Owner' | 'Homeowner';
    applianceRepairReplacement: 'Tenant' | 'Property Owner' | 'Homeowner';
  };
  securityDepositAmount: number;
  totalHomeRent: number;
  units: UnitInfo[];
}

export interface OfficialDocument {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'Signed Form';
  fileSize: string;
  uploadedAt: string;
  status: 'Draft' | 'Sent for Signature' | 'Fully Executed';
  downloadUrl?: string;
}

export interface LeaseRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  propertyId: string;
  propertyAddress: string;
  unitNumber: string;
  roomName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDepositPaid: number;
  renewalAlerts: {
    days60Sent: boolean;
    days30Sent: boolean;
    days14Sent: boolean;
    dayBeforeSent: boolean;
  };
  officialDocuments: OfficialDocument[];
  signatureMethod: 'email_link' | 'text_link' | 'portal_in_person_agent';
  signatureStatus: 'Sent' | 'Viewed' | 'Signed & Finalized';
  signedTimestamp?: string;
  archiveYear: number;
  notes?: string;
}

export type PayFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'quarterly' 
  | 'semi-annual' 
  | 'annual';

export type PaymentMethod = 
  | 'Venmo' 
  | 'CashApp' 
  | 'Zelle' 
  | 'ACH' 
  | 'Cash' 
  | 'Debit/Credit';

export interface LedgerTransaction {
  id: string;
  date: string;
  tenantId: string;
  tenantName: string;
  accountOnFile: string;
  amount: number;
  type: 'Rent Payment' | 'Late Fee' | 'Rent Credit' | 'Deduction';
  method: PaymentMethod;
  notes: string;
  deductionReason?: string;
  dateReceivedManually?: string;
  status: 'Completed' | 'Pending' | 'Disputed';
}

export interface RentCalendarEntry {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  unitNumber: string;
  dueDay: number; // Day of month (e.g., 1, 5)
  monthYear: string; // e.g., '2026-09'
  rentAmount: number;
  status: 'Unpaid' | 'Pending' | 'Paid';
  method: PaymentMethod;
  lateFeePending24h: boolean;
  lateFeeAmount: number;
  agreementWithTenant?: string;
  dateReceived?: string;
}

export interface CommunicationLog {
  id: string;
  timestamp: string;
  recipientScope: 'Individual Tenant' | 'Property House' | 'All Tenants (Mass Broadcast)';
  targetTenantId?: string;
  targetTenantName?: string;
  targetPropertyId?: string;
  channel: 'Phone Call' | 'SMS Text' | 'Email' | 'Private Portal Message';
  commonSubject: 
    | 'Rent Payment Reminder'
    | 'Scheduled Maintenance Inspection'
    | 'Quiet Hours & Noise Advisory'
    | 'Lease Renewal Discussion'
    | 'Utility Bill Split Notification'
    | 'Parking Space Regulations'
    | 'Package Delivery Notice'
    | 'Emergency Weather Alert'
    | 'Direct Administrative Message';
  details: string;
  senderName: string;
}

export interface MaintenanceTicket {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyAddress: string;
  unitNumber: string;
  category: 'Plumbing' | 'Electrical' | 'HVAC' | 'Appliance' | 'Structural' | 'Pest Control' | 'General';
  priority: 'Emergency' | 'High' | 'Normal' | 'Low';
  description: string;
  entryPermissionGranted: boolean;
  preferredTime: string;
  status: 'Reported' | 'Dispatched' | 'In Progress' | 'Resolved';
  assignedVendor?: string;
  repairCost?: number;
  appliedAsRentDeduction?: boolean;
  reportedDate: string;
  resolvedDate?: string;
}

export interface LocalVendor {
  id: string;
  businessName: string;
  category: 'Plumbing' | 'HVAC' | 'Electrician' | 'Handyman' | 'Appliance Specialist' | 'Pest Exterminator' | 'Lawn & Grounds';
  contactPerson: string;
  phone: string;
  email: string;
  rating: number;
  insuredAndBonded: boolean;
  rateEstimate: string;
  notes: string;
}

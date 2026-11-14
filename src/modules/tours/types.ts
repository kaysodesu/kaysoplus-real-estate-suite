export type PaymentFrequency = 'weekly' | 'bi-weekly' | 'monthly';

export interface Room {
  id: string;
  roomNumber: string;
  name: string;
  sqft: number;
  monthlyPrice: number;
  isVacant: boolean;
  description: string;
  amenities: string[];
  currentTenantId?: string;
  bathType: 'Ensuite' | 'Shared' | 'Private Hallway';
}

export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  propertyId: string;
  roomId: string;
  roomName: string;
  moveInDate: string;
  leaseEndDate: string;
  leaseAgreementId: string;
  paymentFrequency: PaymentFrequency;
  customBaseMonthlyRent: number;
  paymentStatus: 'Paid' | 'Upcoming' | 'Overdue' | 'Processing';
  nextDueDate: string;
  avatarUrl?: string;
}

export interface LeaseAgreement {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  propertyName: string;
  propertyAddress: string;
  roomNumber: string;
  roomName: string;
  startDate: string;
  endDate: string;
  securityDeposit: number;
  paymentFrequency: PaymentFrequency;
  paymentAmount: number; // calculated according to frequency
  monthlyBaseRent: number;
  status: 'Active' | 'Pending Renewal' | 'Terminated' | 'Draft';
  signedDate: string;
  landlordSigned: boolean;
  tenantSigned: boolean;
  pdfDownloadUrl?: string;
  termsAndConditions: string[];
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  propertyName: string;
  roomId?: string;
  roomName?: string;
  tenantId?: string;
  tenantName?: string;
  title: string;
  description: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Scheduled' | 'Completed';
  createdAt: string;
  estimatedCost: number;
  assignedVendor?: string;
  category: 'Plumbing' | 'HVAC' | 'Electrical' | 'Appliance' | 'Structural' | 'Lock & Security';
}

export interface Property {
  id: string;
  name: string; // e.g., "Home A"
  address: string; // "123 Main Street"
  city: string; // "Orlando"
  state: string; // "Florida (FL)"
  zipCode: string; // "32801"
  formattedLocation: string; // "Home A 123 Main Street, Orlando, Florida (FL) 32801"
  beds: number;
  baths: number;
  sqft: number;
  totalRent: number; // Target / sum monthly rent e.g. $8,450
  imageUrl: string;
  rooms: Room[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredPropertyId: string;
  preferredPropertyName: string;
  budgetMonthly: number;
  targetMoveInDate: string;
  status: 'New Inquiry' | 'Tour Scheduled' | 'Application Review' | 'Background Check' | 'Lease Sent';
  notes: string;
  createdAt: string;
  preferredPaymentFrequency?: PaymentFrequency;
}

export interface MessageItem {
  id: string;
  sender: 'tenant' | 'manager' | 'lead';
  senderName: string;
  recipientId: string;
  recipientName: string;
  propertyId?: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface FinancialRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  tenantId?: string;
  tenantName?: string;
  date: string;
  type: 'Income' | 'Expense';
  category: 'Rent Payment' | 'Maintenance' | 'Utilities' | 'Insurance' | 'Mortgage' | 'Cleaning';
  amount: number;
  status: 'Completed' | 'Pending' | 'Overdue';
  paymentFrequency?: PaymentFrequency;
  notes?: string;
}

export interface VirtualMeeting {
  id: string;
  title: string;
  propertyId: string;
  propertyName: string;
  participantName: string;
  participantEmail: string;
  participantRole: 'Tenant' | 'Lead' | 'Vendor';
  date: string;
  time: string;
  durationMinutes: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  meetingLink: string;
  purpose: 'Room Video Tour' | 'Move-in Orientation' | 'Lease Review' | 'Maintenance Inspection';
}

export type SidebarSection = 
  | 'Leads'
  | 'Properties'
  | 'Messages'
  | 'Ledger'
  | 'Settings'
  | 'Virtual Meeting'
  | 'Calendar';

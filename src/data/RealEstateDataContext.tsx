// One shared store for the whole suite: prospects, properties, leases, ledger, rent calendar,
// communications, maintenance and vendors. Property Operations edits it; Virtual Tours and the
// Listing Studio read the same properties, so nothing is entered twice. Saved in this browser.
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ProspectLead, PropertyInventory, LeaseRecord, LedgerTransaction, RentCalendarEntry,
  CommunicationLog, MaintenanceTicket, LocalVendor,
} from '../modules/property-ops/types';
import {
  INITIAL_LEADS, INITIAL_PROPERTIES, INITIAL_LEASES, INITIAL_TRANSACTIONS,
  INITIAL_CALENDAR_ENTRIES, INITIAL_COMMUNICATIONS, INITIAL_MAINTENANCE, INITIAL_VENDORS,
} from '../modules/property-ops/data/mockData';

type Setter<T> = React.Dispatch<React.SetStateAction<T>>;

interface RealEstateData {
  prospects: ProspectLead[]; setProspects: Setter<ProspectLead[]>;
  properties: PropertyInventory[]; setProperties: Setter<PropertyInventory[]>;
  leases: LeaseRecord[]; setLeases: Setter<LeaseRecord[]>;
  transactions: LedgerTransaction[]; setTransactions: Setter<LedgerTransaction[]>;
  calendarEntries: RentCalendarEntry[]; setCalendarEntries: Setter<RentCalendarEntry[]>;
  communications: CommunicationLog[]; setCommunications: Setter<CommunicationLog[]>;
  maintenanceTickets: MaintenanceTicket[]; setMaintenanceTickets: Setter<MaintenanceTicket[]>;
  vendors: LocalVendor[]; setVendors: Setter<LocalVendor[]>;
}

const RealEstateDataContext = createContext<RealEstateData | null>(null);

function usePersistedState<T>(key: string, initial: T): [T, Setter<T>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }, [key, value]);
  return [value, setValue];
}

export function RealEstateDataProvider({ children }: { children: React.ReactNode }) {
  const [prospects, setProspects] = usePersistedState('kp_prospects', INITIAL_LEADS);
  const [properties, setProperties] = usePersistedState('kp_properties', INITIAL_PROPERTIES);
  const [leases, setLeases] = usePersistedState('kp_leases', INITIAL_LEASES);
  const [transactions, setTransactions] = usePersistedState('kp_transactions', INITIAL_TRANSACTIONS);
  const [calendarEntries, setCalendarEntries] = usePersistedState('kp_rent_calendar', INITIAL_CALENDAR_ENTRIES);
  const [communications, setCommunications] = usePersistedState('kp_communications', INITIAL_COMMUNICATIONS);
  const [maintenanceTickets, setMaintenanceTickets] = usePersistedState('kp_maintenance', INITIAL_MAINTENANCE);
  const [vendors, setVendors] = usePersistedState('kp_vendors', INITIAL_VENDORS);

  return (
    <RealEstateDataContext.Provider value={{
      prospects, setProspects, properties, setProperties, leases, setLeases,
      transactions, setTransactions, calendarEntries, setCalendarEntries,
      communications, setCommunications, maintenanceTickets, setMaintenanceTickets,
      vendors, setVendors,
    }}>
      {children}
    </RealEstateDataContext.Provider>
  );
}

export function useRealEstateData(): RealEstateData {
  const ctx = useContext(RealEstateDataContext);
  if (!ctx) throw new Error('useRealEstateData must be used inside RealEstateDataProvider');
  return ctx;
}

/** Short display name for a property, used across modules. */
export const propertyLabel = (p: PropertyInventory) => `${p.address}, ${p.city}`;

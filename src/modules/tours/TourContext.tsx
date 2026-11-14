// Adapter that gives EstatePulse's Virtual Tours and Policies screens the same `useProperty()`
// API they were written for, backed by the suite's shared property inventory and prospects.
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { VirtualMeeting } from './types';
import { useRealEstateData, propertyLabel } from '../../data/RealEstateDataContext';

type ToastType = 'success' | 'info' | 'warning';

interface TourContextValue {
  properties: { id: string; name: string }[];
  virtualMeetings: VirtualMeeting[];
  scheduleMeeting: (meeting: Omit<VirtualMeeting, 'id' | 'meetingLink' | 'status'>) => void;
  showToast: (message: string, type?: ToastType) => void;
}

const TourContext = createContext<TourContextValue | null>(null);
const STORAGE_KEY = 'kp_virtual_meetings';

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { properties, prospects } = useRealEstateData();
  const [virtualMeetings, setVirtualMeetings] = useState<VirtualMeeting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch { /* storage unavailable */ }
    // Starter example tied to the first real property and prospect in the inventory
    const p = properties[0];
    const lead = prospects[0];
    if (!p || !lead) return [];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    return [{
      id: 'meet-sample', title: `Room video tour with ${lead.contact.fullName}`, propertyId: p.id, propertyName: propertyLabel(p),
      participantName: lead.contact.fullName, participantEmail: lead.contact.email, participantRole: 'Lead',
      date: tomorrow, time: '10:00', durationMinutes: 30, status: 'Scheduled',
      meetingLink: 'https://meet.example.com/meet-sample', purpose: 'Room Video Tour',
    }];
  });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(virtualMeetings)); } catch { /* storage unavailable */ }
  }, [virtualMeetings]);

  const showToast = (message: string, type: ToastType = 'success') => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  };

  const scheduleMeeting: TourContextValue['scheduleMeeting'] = (data) => {
    const id = `meet-${Date.now()}`;
    setVirtualMeetings(prev => [{ ...data, id, status: 'Scheduled', meetingLink: `https://meet.example.com/${id}` }, ...prev]);
  };

  return (
    <TourContext.Provider value={{
      properties: properties.map(p => ({ id: p.id, name: propertyLabel(p) })),
      virtualMeetings, scheduleMeeting, showToast,
    }}>
      {children}
      {toast && (
        <div role="status" className={`fixed bottom-5 right-5 z-[60] px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${
          toast.type === 'warning' ? 'bg-amber-600' : toast.type === 'info' ? 'bg-sky-600' : 'bg-emerald-600'
        }`}>
          {toast.message}
        </div>
      )}
    </TourContext.Provider>
  );
}

/** Same name and shape as EstatePulse's hook, so its components work unchanged. */
export function useProperty(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useProperty must be used inside TourProvider');
  return ctx;
}

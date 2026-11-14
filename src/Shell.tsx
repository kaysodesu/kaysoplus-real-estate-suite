import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Building2, Video, Sparkles, SlidersHorizontal, Menu, X, Home } from 'lucide-react';
import { RealEstateDataProvider } from './data/RealEstateDataContext';
import { TourProvider } from './modules/tours/TourContext';

const PropertyOpsApp = lazy(() => import('./modules/property-ops/PropertyOpsApp'));
const ListingStudioApp = lazy(() => import('./modules/listing-studio/ListingStudioApp'));
const VirtualMeetingView = lazy(() =>
  import('./modules/tours/components/VirtualMeetingView').then(m => ({ default: m.VirtualMeetingView }))
);
const SettingsView = lazy(() =>
  import('./modules/tours/components/SettingsView').then(m => ({ default: m.SettingsView }))
);

type SectionKey = 'operations' | 'tours' | 'listings' | 'policies';

const SECTIONS: { key: SectionKey; label: string; detail: string; icon: React.ElementType; origin: string }[] = [
  { key: 'operations', label: 'Property Operations', detail: 'Prospects, inventory, leases, rent ledger, support', icon: Building2, origin: 'Prospect & Property Portal' },
  { key: 'tours', label: 'Virtual Tours', detail: 'Video tours, walkthroughs, move-in orientations', icon: Video, origin: 'EstatePulse' },
  { key: 'listings', label: 'Listing Studio', detail: 'AI listing copy, client CRM, PDF flyers', icon: Sparkles, origin: 'PropScript CRM + PropScribe AI' },
  { key: 'policies', label: 'Policies & Automation', detail: 'Co-living rules, rent reminders, payment schedules', icon: SlidersHorizontal, origin: 'EstatePulse' },
];

const STORAGE_KEY = 'kp_active_section';

function readSection(): SectionKey {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as SectionKey | null;
    if (saved && SECTIONS.some(s => s.key === saved)) return saved;
  } catch { /* storage unavailable */ }
  return 'operations';
}

export default function Shell() {
  const [section, setSection] = useState<SectionKey>(readSection);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, section); } catch { /* storage unavailable */ }
  }, [section]);

  const current = SECTIONS.find(s => s.key === section)!;

  const nav = (
    <nav aria-label="Suite sections" className="space-y-1">
      {SECTIONS.map(s => {
        const Icon = s.icon;
        const active = s.key === section;
        return (
          <button
            key={s.key}
            type="button"
            onClick={() => { setSection(s.key); setMenuOpen(false); }}
            aria-current={active ? 'page' : undefined}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex gap-3 items-start transition-colors cursor-pointer ${
              active ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{s.label}</span>
              <span className={`block text-[11px] leading-snug ${active ? 'text-blue-100' : 'text-slate-500'}`}>{s.detail}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shrink-0">
        <Home className="w-5 h-5 text-white" />
      </span>
      <span>
        <span className="block text-sm font-extrabold text-white leading-tight">KaysoPlus</span>
        <span className="block text-[11px] text-slate-400 leading-tight">Real Estate Suite</span>
      </span>
    </div>
  );

  return (
    <RealEstateDataProvider>
      <TourProvider>
        <div className="h-screen flex flex-col md:flex-row bg-slate-50">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between bg-[#0b1120] p-4 border-r border-slate-800">
            <div className="space-y-6">
              {brand}
              {nav}
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Beta · Developed by Cason Point Network. Use made-up information only.
            </p>
          </aside>

          {/* Mobile top bar */}
          <header className="md:hidden flex items-center justify-between bg-[#0b1120] px-4 py-3">
            {brand}
            <button type="button" onClick={() => setMenuOpen(o => !o)} aria-label="Open sections menu" className="p-2 text-slate-200 cursor-pointer">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </header>
          {menuOpen && <div className="md:hidden bg-[#0b1120] px-3 pb-4 border-b border-slate-800">{nav}</div>}

          {/* Active section */}
          <main className="flex-1 min-w-0 overflow-y-auto" aria-label={current.label}>
            <Suspense fallback={<p className="p-8 text-sm text-slate-500">Loading {current.label}…</p>}>
              {section === 'operations' && <PropertyOpsApp />}
              {section === 'listings' && <ListingStudioApp />}
              {(section === 'tours' || section === 'policies') && (
                <div className="min-h-full bg-[#0a0a0b] text-zinc-200 p-4 md:p-8">
                  {section === 'tours' ? <VirtualMeetingView /> : <SettingsView />}
                </div>
              )}
            </Suspense>
          </main>
        </div>
      </TourProvider>
    </RealEstateDataProvider>
  );
}

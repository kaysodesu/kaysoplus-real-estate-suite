import React, { useState } from 'react';
import { 
  Settings, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Home, 
  CheckCircle2,
  Clock,
  Save
} from 'lucide-react';
import { useProperty } from '../TourContext';

export const SettingsView: React.FC = () => {
  const { showToast } = useProperty();

  const [allowWeekly, setAllowWeekly] = useState(true);
  const [allowBiWeekly, setAllowBiWeekly] = useState(true);
  const [allowMonthly, setAllowMonthly] = useState(true);
  const [gracePeriodDays, setGracePeriodDays] = useState(3);
  const [lateFeeAmount, setLateFeeAmount] = useState(50);
  const [quietHoursStart, setQuietHoursStart] = useState('22:00');
  const [quietHoursEnd, setQuietHoursEnd] = useState('07:00');
  const [cleaningDay, setCleaningDay] = useState('Thursday');
  const [autoSmsReminders, setAutoSmsReminders] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Platform settings saved successfully!');
  };

  return (
    <div id="settings-view-container" className="max-w-4xl space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-[#18181B] p-5 rounded-2xl border border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 text-zinc-300 flex items-center justify-center border border-zinc-700">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Platform Settings & Co-Living Policies</h1>
            <p className="text-xs text-zinc-400">
              Configure flexible payment rules, house covenants, and notification automation.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        
        {/* Flexible Payment Scheduling Settings */}
        <div className="bg-[#18181B] p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-100">Flexible Payment Scheduling Policies</h2>
          </div>

          <p className="text-xs text-zinc-400">
            Determine which payment intervals are available for tenants to select on their room lease agreements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-[#121214] cursor-pointer hover:border-zinc-700 transition">
              <input 
                type="checkbox" 
                checked={allowWeekly} 
                onChange={e => setAllowWeekly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-zinc-700 bg-zinc-900 focus:ring-blue-500" 
              />
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Weekly Rent</span>
                <span className="text-[11px] text-zinc-500">Mondays automatic debit</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-[#121214] cursor-pointer hover:border-zinc-700 transition">
              <input 
                type="checkbox" 
                checked={allowBiWeekly} 
                onChange={e => setAllowBiWeekly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-zinc-700 bg-zinc-900 focus:ring-blue-500" 
              />
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Bi-Weekly Rent</span>
                <span className="text-[11px] text-zinc-500">Every 2 weeks (payroll aligned)</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-[#121214] cursor-pointer hover:border-zinc-700 transition">
              <input 
                type="checkbox" 
                checked={allowMonthly} 
                onChange={e => setAllowMonthly(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-zinc-700 bg-zinc-900 focus:ring-blue-500" 
              />
              <div>
                <span className="text-xs font-bold text-zinc-200 block">Monthly Rent</span>
                <span className="text-[11px] text-zinc-500">1st of calendar month</span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Grace Period (Days)</label>
              <input 
                type="number"
                min={0}
                max={10}
                value={gracePeriodDays}
                onChange={e => setGracePeriodDays(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Standard Late Fee ($)</label>
              <input 
                type="number"
                step={5}
                value={lateFeeAmount}
                onChange={e => setLateFeeAmount(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Co-Living House Covenants & Cleaning */}
        <div className="bg-[#18181B] p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Home className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-100">Co-Living House Standards</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quiet Hours Start</label>
              <input 
                type="time"
                value={quietHoursStart}
                onChange={e => setQuietHoursStart(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quiet Hours End</label>
              <input 
                type="time"
                value={quietHoursEnd}
                onChange={e => setQuietHoursEnd(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Common Area Cleaning</label>
              <select
                value={cleaningDay}
                onChange={e => setCleaningDay(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              >
                <option value="Monday">Every Monday</option>
                <option value="Wednesday">Every Wednesday</option>
                <option value="Thursday">Every Thursday</option>
                <option value="Friday">Every Friday</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications & Automation */}
        <div className="bg-[#18181B] p-6 rounded-2xl border border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Bell className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-zinc-100">Automated Resident Communications</h2>
          </div>

          <label className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-[#121214] cursor-pointer hover:border-zinc-700 transition">
            <div>
              <span className="text-xs font-bold text-zinc-200 block">Automatic Rent Reminders</span>
              <span className="text-[11px] text-zinc-500">Send reminder 3 days before scheduled payment debit</span>
            </div>
            <input 
              type="checkbox" 
              checked={autoSmsReminders} 
              onChange={e => setAutoSmsReminders(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-zinc-700 bg-zinc-900 focus:ring-blue-500" 
            />
          </label>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings & Apply to Agreements</span>
          </button>
        </div>

      </form>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Mic, 
  MicOff, 
  VideoOff, 
  Share2, 
  PhoneOff, 
  MessageSquare, 
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Camera
} from 'lucide-react';
import { useProperty } from '../TourContext';
import { VirtualMeeting } from '../types';

export const VirtualMeetingView: React.FC = () => {
  const { virtualMeetings, scheduleMeeting, properties, showToast } = useProperty();

  const [isMeetingLive, setIsMeetingLive] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState<VirtualMeeting | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Scheduling Form
  const [title, setTitle] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantRole, setParticipantRole] = useState<VirtualMeeting['participantRole']>('Lead');
  const [propertyId, setPropertyId] = useState(properties[0]?.id || '');
  const [date, setDate] = useState('2026-09-08');
  const [time, setTime] = useState('2:00 PM EDT');
  const [duration, setDuration] = useState(30);
  const [purpose, setPurpose] = useState<VirtualMeeting['purpose']>('Room Video Tour');

  const handleStartCall = (meeting: VirtualMeeting) => {
    setActiveMeeting(meeting);
    setIsMeetingLive(true);
    showToast(`Connected to virtual room: ${meeting.title}`);
  };

  const handleEndCall = () => {
    setIsMeetingLive(false);
    setActiveMeeting(null);
    showToast('Virtual meeting session ended', 'info');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !participantName) return;

    const prop = properties.find(p => p.id === propertyId);

    scheduleMeeting({
      title,
      propertyId,
      propertyName: prop ? prop.name : 'Home A',
      participantName,
      participantEmail,
      participantRole,
      date,
      time,
      durationMinutes: duration,
      purpose,
    });

    setShowScheduleModal(false);
    setTitle('');
    setParticipantName('');
    setParticipantEmail('');
  };

  return (
    <div id="virtual-meeting-view-container" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#18181B] p-5 rounded-2xl border border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-100">Virtual Meeting & Video Tours</h1>
            <p className="text-xs text-zinc-400">
              Host high-definition remote room walkthroughs, tenant orientation sessions, and lease signings.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Virtual Tour</span>
        </button>
      </div>

      {/* Live Call Interface (When Call is Active) */}
      {isMeetingLive && activeMeeting ? (
        <div className="bg-[#0A0A0B] rounded-2xl p-6 text-white shadow-2xl border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">{activeMeeting.title}</h3>
                <p className="text-xs text-zinc-400">
                  Connected with {activeMeeting.participantName} ({activeMeeting.participantRole}) • {activeMeeting.purpose}
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-700 rounded-full font-mono text-emerald-400">
              00:04:18 (Live 1080p)
            </span>
          </div>

          {/* Video Frames Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-80 sm:h-96">
            
            {/* Primary Feed: Room Video Tour Feed */}
            <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center group">
              <img 
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20800%20500%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23cbd5e1%27%2F%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%2399f6e4%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%27800%27%20height%3D%27500%27%20fill%3D%27url(%23g)%27%2F%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23475569%27%20stroke-width%3D%2714%27%20stroke-linejoin%3D%27round%27%20opacity%3D%27.55%27%3E%3Crect%20x%3D%27310%27%20y%3D%27170%27%20width%3D%27180%27%20height%3D%27140%27%20rx%3D%2714%27%2F%3E%3Cpath%20d%3D%27M320%20290l55-60%2040%2040%2030-25%2045%2045%27%2F%3E%3Ccircle%20cx%3D%27440%27%20cy%3D%27210%27%20r%3D%2714%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" 
                alt="Room Tour Live Feed"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute top-3 left-3 bg-[#0A0A0B]/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 border border-zinc-800">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                <span>Room Walkthrough Cam • Home A Suite</span>
              </div>
              <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-zinc-950 px-2 py-0.5 rounded text-[10px] font-bold">
                Tour Mode: Active
              </div>
            </div>

            {/* Secondary Feed: Remote Participant Feed */}
            <div className="relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <img 
                src="data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%20800%20500%27%3E%3Cdefs%3E%3ClinearGradient%20id%3D%27g%27%20x1%3D%270%27%20y1%3D%270%27%20x2%3D%271%27%20y2%3D%271%27%3E%3Cstop%20offset%3D%270%27%20stop-color%3D%27%23cbd5e1%27%2F%3E%3Cstop%20offset%3D%271%27%20stop-color%3D%27%2399f6e4%27%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Crect%20width%3D%27800%27%20height%3D%27500%27%20fill%3D%27url(%23g)%27%2F%3E%3Cg%20fill%3D%27none%27%20stroke%3D%27%23475569%27%20stroke-width%3D%2714%27%20stroke-linejoin%3D%27round%27%20opacity%3D%27.55%27%3E%3Crect%20x%3D%27310%27%20y%3D%27170%27%20width%3D%27180%27%20height%3D%27140%27%20rx%3D%2714%27%2F%3E%3Cpath%20d%3D%27M320%20290l55-60%2040%2040%2030-25%2045%2045%27%2F%3E%3Ccircle%20cx%3D%27440%27%20cy%3D%27210%27%20r%3D%2714%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E" 
                alt="Participant" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#0A0A0B]/80 backdrop-blur-md px-2.5 py-1 rounded text-xs font-semibold border border-zinc-800">
                {activeMeeting.participantName}
              </div>
            </div>

          </div>

          {/* In-Call Controls Bar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-full transition ${
                isMuted ? 'bg-rose-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3 rounded-full transition ${
                !isVideoOn ? 'bg-rose-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsScreenSharing(!isScreenSharing);
                showToast(isScreenSharing ? 'Stopped floor plan share' : 'Sharing interactive floor plan', 'info');
              }}
              className={`p-3 rounded-full transition ${
                isScreenSharing ? 'bg-blue-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
              }`}
              title="Share Co-Living Floorplan"
            >
              <Share2 className="w-5 h-5" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-5 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-rose-900/40"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Tour</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Upcoming Scheduled Virtual Meetings List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-zinc-200">Upcoming Virtual Video Tours & Consultations</h2>
          <span className="text-xs text-zinc-500">{virtualMeetings.length} Scheduled Sessions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {virtualMeetings.map(meet => (
            <div 
              key={meet.id}
              className="bg-[#18181B] rounded-xl border border-zinc-800 p-5 shadow-xs hover:border-zinc-700 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {meet.purpose}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {meet.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-zinc-100">{meet.title}</h3>

                <div className="p-3 bg-[#121214] rounded-lg border border-zinc-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{meet.date} at {meet.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Duration: {meet.durationMinutes} minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-400">
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    <span>With: <strong className="text-zinc-200">{meet.participantName}</strong> ({meet.participantRole})</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-zinc-500 font-mono truncate">
                  {meet.meetingLink.replace('https://', '')}
                </span>

                <button
                  id={`btn-launch-meeting-${meet.id}`}
                  onClick={() => handleStartCall(meet)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Launch Room</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#18181B] rounded-2xl max-w-md w-full shadow-2xl border border-zinc-800 overflow-hidden">
            <div className="px-6 py-4 bg-[#121214] border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100">Schedule Virtual Walkthrough / Sync</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-6 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Room 102 Video Tour & Q&A"
                  className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-500 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Participant Name *</label>
                  <input
                    type="text"
                    required
                    value={participantName}
                    onChange={e => setParticipantName(e.target.value)}
                    placeholder="e.g. Rachel Gallagher"
                    className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-500 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Role</label>
                  <select
                    value={participantRole}
                    onChange={e => setParticipantRole(e.target.value as any)}
                    className="w-full text-xs px-2.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Lead">Lead / Prospect</option>
                    <option value="Tenant">Active Tenant</option>
                    <option value="Vendor">Maintenance Vendor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Participant Email</label>
                <input
                  type="email"
                  value={participantEmail}
                  onChange={e => setParticipantEmail(e.target.value)}
                  placeholder="rachel@example.com"
                  className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-500 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 2:30 PM EDT"
                    className="w-full text-xs px-3 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-500 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tour-property" className="block text-xs font-semibold text-zinc-300 mb-1">Property</label>
                <select
                  id="tour-property"
                  value={propertyId}
                  onChange={e => setPropertyId(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Session Purpose</label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Room Video Tour">Room Video Tour (Vacant Room)</option>
                  <option value="Lease Review">Lease Review & House Rules</option>
                  <option value="Move-in Orientation">Move-in Orientation</option>
                  <option value="Maintenance Inspection">Maintenance Inspection</option>
                </select>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                >
                  Confirm Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

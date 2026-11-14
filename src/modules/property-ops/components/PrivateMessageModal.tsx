import React, { useState } from 'react';
import { X, Send, Lock, MessageSquare, Check, Shield } from 'lucide-react';

interface PrivateMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  unitOrRoomInfo?: string;
  onSendMessage: (message: string, subject: string) => void;
}

export const PrivateMessageModal: React.FC<PrivateMessageModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  recipientEmail,
  recipientPhone,
  unitOrRoomInfo,
  onSendMessage,
}) => {
  const [subject, setSubject] = useState('Private Administrative Notice');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(message, subject);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div 
        id="private-message-modal"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Direct In-Portal Private Message
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5" /> End-to-End Logged
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                To: <span className="font-medium text-slate-800 dark:text-slate-200">{recipientName}</span> {unitOrRoomInfo ? `(${unitOrRoomInfo})` : ''}
              </p>
            </div>
          </div>
          <button
            id="close-private-message-button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contact Strip */}
        <div className="px-5 py-2.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-wrap items-center justify-between text-xs text-slate-600 dark:text-slate-300 gap-2">
          <span>Phone: <strong>{recipientPhone}</strong></span>
          <span>Email: <strong>{recipientEmail}</strong></span>
        </div>

        {/* Body */}
        {sentSuccess ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Private Message Dispatched</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notification routed to tenant portal & mirrored to registered SMS/Email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                id="private-msg-subject-select"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Private Administrative Notice">Private Administrative Notice</option>
                <option value="Unit Roommate Coordination">Unit Roommate Coordination</option>
                <option value="Quiet Hours & Shared Space Etiquette">Quiet Hours & Shared Space Etiquette</option>
                <option value="Maintenance Access Permission">Maintenance Access Permission</option>
                <option value="Utility Split Question">Utility Split Question</option>
                <option value="Confidential Property Owner Note">Confidential Property Owner Note</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Message Content
              </label>
              <textarea
                id="private-msg-content-input"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your secure message here. This will be stored in the communications archive..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 resize-none"
              />
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                All internal portal messages are permanently archived in the tenant's Contact History log for audit and security compliance.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                id="cancel-private-message-button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="send-private-message-button"
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Send Secure Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

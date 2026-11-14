import React, { useState } from 'react';
import { ClientRecord } from '../types';
import { Plus, Search, Building2, Trash2, Tag, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  clients: Record<string, ClientRecord>;
  currentClientKey: string;
  onSelectClient: (key: string) => void;
  onOpenIntakeModal: () => void;
  onDeleteClient: (key: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  clients,
  currentClientKey,
  onSelectClient,
  onOpenIntakeModal,
  onDeleteClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const clientList: ClientRecord[] = Object.values(clients);
  const filteredClients = clientList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-80 bg-[#0b1120] text-slate-100 flex flex-col h-screen border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-[#080d19]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-bold text-lg">
            🏡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                PropScript
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  CRM
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 font-medium">Real Estate Prompt Studio</p>
          </div>
        </div>
      </div>

      {/* Search & Intake Trigger */}
      <div className="p-4 border-b border-slate-800/60 flex flex-col gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search clients or addresses..."
            className="w-full bg-slate-900/90 text-xs text-slate-200 pl-8 pr-3 py-2 rounded-lg border border-slate-700/60 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
          />
        </div>

        <div className="sidebar-header-row flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <h3>Active Clients ({clientList.length})</h3>
          </div>
          <button
            id="add-client-btn"
            onClick={onOpenIntakeModal}
            className="btn-add-client px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shadow-sm transition-all cursor-pointer active:scale-95"
            title="Open client questionnaire"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        <ul id="client-list" className="space-y-1.5">
          {filteredClients.length === 0 ? (
            <li className="p-4 text-center text-xs text-slate-500 italic bg-slate-900/30 rounded-lg border border-dashed border-slate-800">
              No matching client records found.
            </li>
          ) : (
            filteredClients.map((client) => {
              const isActive = client.id === currentClientKey;
              return (
                <li
                  key={client.id}
                  onClick={() => onSelectClient(client.id)}
                  className={`client-item group relative p-3 rounded-xl cursor-pointer transition-all duration-150 border ${
                    isActive
                      ? 'active bg-slate-800/90 text-white border-blue-500/60 shadow-md shadow-blue-500/5'
                      : 'bg-slate-900/40 text-slate-300 border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="client-name font-semibold text-sm truncate flex items-center gap-1.5 text-white">
                        {client.name}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shrink-0" />
                        )}
                      </div>
                      <div className="client-property text-xs text-slate-400 truncate mt-0.5">
                        {client.property}
                      </div>

                      {client.tags && client.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-2 flex-wrap">
                          {client.tags.slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {clientList.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Remove client record for ${client.name}?`)) {
                            onDeleteClient(client.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-opacity"
                        title="Delete client"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Footer Info */}
      <div className="sidebar-footer p-4 border-t border-slate-800/80 bg-[#080d19] text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium text-slate-300">Prompt Studio Active</span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">Ready</span>
      </div>
    </aside>
  );
};

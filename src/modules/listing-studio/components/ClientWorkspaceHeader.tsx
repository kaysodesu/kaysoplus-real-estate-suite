import React from 'react';
import { ClientRecord } from '../types';
import { Building, MapPin, Sparkles, Tag } from 'lucide-react';

interface ClientWorkspaceHeaderProps {
  client: ClientRecord;
}

export const ClientWorkspaceHeader: React.FC<ClientWorkspaceHeaderProps> = ({ client }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1
            id="current-client-title"
            className="text-xl font-extrabold tracking-tight text-slate-900"
          >
            Client Workspace: {client.name}
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Active File
          </span>
        </div>
        <p
          id="current-property-subtitle"
          className="text-xs text-slate-500 font-medium flex items-center gap-1.5"
        >
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {client.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {client.tags &&
          client.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium border border-slate-200 flex items-center gap-1"
            >
              <Tag className="w-3 h-3 text-slate-400" />
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

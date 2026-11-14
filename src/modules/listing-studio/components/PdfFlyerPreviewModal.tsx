import React, { useState } from 'react';
import { PropertySample } from '../flyerTypes';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Sparkles,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Phone,
  Mail,
  QrCode,
} from 'lucide-react';

interface PdfFlyerPreviewModalProps {
  property: PropertySample | null;
  onClose: () => void;
}

export const PdfFlyerPreviewModal: React.FC<PdfFlyerPreviewModalProps> = ({
  property,
  onClose,
}) => {
  const [brokerName, setBrokerName] = useState('Your Brokerage Name');
  const [agentName, setAgentName] = useState('Agent Name, REALTOR®');
  const [agentPhone, setAgentPhone] = useState('(555) 010-0000');
  const [isDownloaded, setIsDownloaded] = useState(false);

  if (!property) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSimulateDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white font-['Outfit',sans-serif]">
                Automated High-Resolution PDF Flyer Generator
              </h3>
              <p className="text-xs text-slate-400">
                Ready for color offset printing, digital open house distribution & buyer packets
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Flyer</span>
            </button>
            <button
              onClick={handleSimulateDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloaded ? 'Downloaded PDF!' : 'Download 300-DPI PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Customization Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Brokerage Name:</span>
            <input
              type="text"
              value={brokerName}
              onChange={(e) => setBrokerName(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Agent:</span>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Phone:</span>
            <input
              type="text"
              value={agentPhone}
              onChange={(e) => setAgentPhone(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Scrollable Realistic 8.5x11 PDF Sheet Preview */}
        <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-200">
          <div className="w-full max-w-[720px] bg-white shadow-2xl border border-slate-300 rounded-sm p-8 text-slate-900 print:p-0 print:border-none print:shadow-none font-sans">
            {/* Flyer Header */}
            <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 block">
                  EXCLUSIVE PROPERTY SHOWCASE
                </span>
                <h1 className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                  {property.title}
                </h1>
                <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {property.location}
                </p>
              </div>

              <div className="text-right">
                <span className="font-['Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold text-indigo-700 block">
                  {property.price}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  {property.propertyType}
                </span>
              </div>
            </div>

            {/* Flyer Main Image */}
            <div className="relative rounded-lg overflow-hidden mb-6 border border-slate-200">
              <img
                src={property.imageUrl}
                alt={property.title}
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1 rounded text-xs font-semibold">
                Multimodal AI Analyzed • Pristine Quality
              </div>
            </div>

            {/* Quick Specs Matrix */}
            <div className="grid grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-6 text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Bedrooms</span>
                <strong className="text-sm font-bold text-slate-900">{property.specs.beds} Beds</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Bathrooms</span>
                <strong className="text-sm font-bold text-slate-900">{property.specs.baths} Baths</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Square Feet</span>
                <strong className="text-sm font-bold text-slate-900">{property.specs.sqft.toLocaleString()} SF</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Year Built</span>
                <strong className="text-sm font-bold text-slate-900">{property.specs.yearBuilt || '—'}</strong>
              </div>
            </div>

            {/* Description & Key Feature Bullets */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Property Highlights & Architectural Description
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed text-justify">
                  {property.mlsDescription}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                  Key Amenities & Millwork
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                  {property.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent / Brokerage Footer Card */}
            <div className="mt-8 pt-4 border-t-2 border-slate-900 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-950">{agentName}</h4>
                <p className="text-xs font-semibold text-indigo-700">{brokerName}</p>
                <p className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" /> Direct: {agentPhone}
                </p>
              </div>

              <div className="flex items-center gap-3 text-right">
                <div className="text-[10px] text-slate-500">
                  <p>Scan for 3D Virtual Tour & Private Showing</p>
                  <p className="font-mono text-slate-400">Equal Housing Opportunity</p>
                </div>
                <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

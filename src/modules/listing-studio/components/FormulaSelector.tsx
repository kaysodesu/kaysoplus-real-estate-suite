import React, { useState } from 'react';
import { Crown, KeyRound, Share2, SearchCheck, Sparkles, Wand2, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { FormulaKey } from '../types';
import { FORMULA_DEFINITIONS } from '../data/initialClients';

interface FormulaSelectorProps {
  selectedFormula: FormulaKey;
  onSelectFormula: (formula: FormulaKey) => void;
  onGenerateAI: (options: {
    formula: FormulaKey;
    tone: string;
    length: string;
    targetAudience: string;
    customPrompt?: string;
  }) => void;
  isGenerating: boolean;
}

export const FormulaSelector: React.FC<FormulaSelectorProps> = ({
  selectedFormula,
  onSelectFormula,
  onGenerateAI,
  isGenerating,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tone, setTone] = useState('Opulent & Sensory');
  const [length, setLength] = useState('medium');
  const [targetAudience, setTargetAudience] = useState('Affluent / High Net Worth');
  const [customPrompt, setCustomPrompt] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-4 h-4 text-amber-600" />;
      case 'KeyRound':
        return <KeyRound className="w-4 h-4 text-emerald-600" />;
      case 'Share2':
        return <Share2 className="w-4 h-4 text-sky-600" />;
      case 'SearchCheck':
      default:
        return <SearchCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>⚡ Prompt Formula Engine</span>
            <span className="text-[10px] uppercase font-extrabold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md">
              4 Formats
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a tailored copy formula or generate fresh iterations with Gemini AI
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>AI Parameters</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* 4 Formula Archetype Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {FORMULA_DEFINITIONS.map((def) => {
          const isSelected = selectedFormula === def.key;
          return (
            <button
              key={def.key}
              type="button"
              onClick={() => onSelectFormula(def.key)}
              className={`text-left p-3.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-white shadow-xs border border-slate-200">
                    {getIcon(def.iconName)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                    {def.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">{def.label}</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                  {def.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className={`font-semibold ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                  {isSelected ? '● Active Formula' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advanced AI Generation Drawer */}
      {showAdvanced && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Gemini Studio Customization
            </span>
            <span className="text-[11px] text-slate-400">Powered by Gemini 3.7 Flash</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Tone & Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Opulent & Sensory">Opulent & Sensory</option>
                <option value="Warm, Welcoming & Friendly">Warm, Welcoming & Friendly</option>
                <option value="Punchy & High Urgency">Punchy & High Urgency</option>
                <option value="Investor & ROI Focused">Investor & ROI Focused</option>
                <option value="Storytelling & Architectural">Storytelling & Architectural</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Length
              </label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="concise">Concise (~100 words)</option>
                <option value="medium">Standard (~200-250 words)</option>
                <option value="detailed">Comprehensive (~350+ words)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Affluent / High Net Worth">Affluent / High Net Worth</option>
                <option value="First-Time Homebuyers">First-Time Homebuyers</option>
                <option value="Growing Families">Growing Families</option>
                <option value="Real Estate Investors">Real Estate Investors</option>
                <option value="Relocation / Tech Executives">Relocation / Tech Executives</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              Custom Prompt Directives (Optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Emphasize sunset terrace and proximity to Michelin-starred dining..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() =>
                onGenerateAI({
                  formula: selectedFormula,
                  tone,
                  length,
                  targetAudience,
                  customPrompt,
                })
              }
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Copy with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Generate New AI Variant</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

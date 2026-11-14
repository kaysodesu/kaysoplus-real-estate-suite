import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Sparkles,
  Zap,
  Flame,
  Hash,
  ListOrdered,
  FileText,
  Layers,
  Save,
  RotateCcw
} from 'lucide-react';
import { ClientRecord, FormulaKey } from '../types';
import { PdfFlyerPreviewModal } from './PdfFlyerPreviewModal';
import { clientToFlyerProperty } from '../flyerTypes';

/** Copies text, falling back to a hidden textarea when the Clipboard API is unavailable or blocked. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

interface OutputConsoleProps {
  client: ClientRecord;
  selectedFormula: FormulaKey;
  outputText: string;
  onChangeOutputText: (text: string) => void;
  onRefineCopy: (action: string) => void;
  onSaveVariantToClient: (formula: FormulaKey, text: string) => void;
  onResetToOriginalFormula: () => void;
  isRefining: boolean;
}

export const OutputConsole: React.FC<OutputConsoleProps> = ({
  client,
  selectedFormula,
  outputText,
  onChangeOutputText,
  onRefineCopy,
  onSaveVariantToClient,
  onResetToOriginalFormula,
  isRefining,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFlyer, setShowFlyer] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'all-formulas'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const words = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;
  const chars = outputText.length;
  const readTimeSeconds = Math.ceil(words / 3.5); // ~200-250 wpm

  const handleCopy = () => {
    if (!outputText) return;
    copyText(outputText).then(ok => {
      if (!ok) { alert('Copy failed. Select the text and press Ctrl+C instead.'); return; }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = (format: 'txt' | 'md' | 'json') => {
    let content = outputText;
    let filename = `${client.name.replace(/\s+/g, '_')}_${selectedFormula}_listing`;
    let type = 'text/plain';

    if (format === 'md') {
      content = `# ${client.property}\n**Client:** ${client.name}\n**Formula:** ${selectedFormula}\n**Specs:** ${client.sqft} | ${client.beds}\n\n---\n\n${outputText}`;
      filename += '.md';
      type = 'text/markdown';
    } else if (format === 'json') {
      content = JSON.stringify(
        {
          client: client.name,
          property: client.property,
          sqft: client.sqft,
          beds: client.beds,
          features: client.features,
          selectedFormula,
          copy: outputText,
          allFormulas: client.outputs,
        },
        null,
        2
      );
      filename += '.json';
      type = 'application/json';
    } else {
      filename += '.txt';
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToClient = () => {
    onSaveVariantToClient(selectedFormula, outputText);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2200);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Console Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
            <span>Listing Output & Prompt Staging</span>
            <span className="text-[10px] font-semibold bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              Active: {selectedFormula.replace('_', ' ').toUpperCase()}
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="bg-slate-800 p-0.5 rounded-lg flex items-center border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                viewMode === 'editor'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Studio Editor
            </button>
            <button
              onClick={() => setViewMode('all-formulas')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                viewMode === 'all-formulas'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>All 4 Formats</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            disabled={!outputText}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 disabled:opacity-50'
            }`}
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>

          <button
            onClick={() => setShowFlyer(true)}
            disabled={!outputText}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            title="Preview a printable listing flyer with this copy"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Flyer</span>
          </button>

          <div className="relative group">
            <button
              disabled={!outputText}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:flex flex-col bg-slate-900 border border-slate-800 rounded-lg shadow-xl z-20 py-1 min-w-[120px]">
              <button
                onClick={() => handleDownload('txt')}
                className="text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Plain Text (.txt)
              </button>
              <button
                onClick={() => handleDownload('md')}
                className="text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Markdown (.md)
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                CRM JSON (.json)
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'editor' ? (
        <>
          {/* Main Textarea */}
          <div className="p-4 flex-1 flex flex-col bg-slate-50/50">
            <textarea
              id="output-text"
              rows={11}
              value={outputText}
              onChange={(e) => onChangeOutputText(e.target.value)}
              placeholder={`Awaiting prompt formula selection for ${client.name}...`}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y shadow-inner"
            />

            {/* Quick Metrics Bar */}
            <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 px-1">
              <div className="flex items-center gap-3">
                <span>
                  <strong className="text-slate-700">{words}</strong> words
                </span>
                <span>•</span>
                <span>
                  <strong className="text-slate-700">{chars}</strong> characters
                </span>
                <span>•</span>
                <span>
                  Est. Read: <strong className="text-slate-700">{readTimeSeconds}s</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onResetToOriginalFormula}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px] font-medium"
                  title="Reset to template default formula"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Default</span>
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleSaveToClient}
                  className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                    savedSuccess ? 'text-emerald-600' : 'text-blue-600 hover:text-blue-800'
                  }`}
                  title="Save current custom copy into client object"
                >
                  {savedSuccess ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
                  <span>{savedSuccess ? 'Saved to Client Record!' : 'Save to Client Profile'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick AI Refine Toolbar */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Refine Actions:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={isRefining || !outputText}
                onClick={() => onRefineCopy('make_punchier')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                title="Trim filler words, boost impact"
              >
                <Zap className="w-3 h-3 text-amber-600" />
                <span>Make Punchier</span>
              </button>

              <button
                type="button"
                disabled={isRefining || !outputText}
                onClick={() => onRefineCopy('elevate_luxury')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                title="Bespoke luxury terminology"
              >
                <Flame className="w-3 h-3 text-rose-500" />
                <span>Elevate Luxury</span>
              </button>

              <button
                type="button"
                disabled={isRefining || !outputText}
                onClick={() => onRefineCopy('shorten_bullet_points')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                title="Format into clear bullet points"
              >
                <ListOrdered className="w-3 h-3 text-blue-600" />
                <span>Clean Bullets</span>
              </button>

              <button
                type="button"
                disabled={isRefining || !outputText}
                onClick={() => onRefineCopy('add_hashtags')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs rounded-lg font-medium flex items-center gap-1 transition-colors"
                title="Add SEO hashtags & Social CTA"
              >
                <Hash className="w-3 h-3 text-indigo-600" />
                <span>Add SEO Hashtags</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Multi-Formula Comparator View */
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 max-h-[560px] overflow-y-auto">
          {(['luxury', 'first_time', 'social_thread', 'zillow_optimized'] as FormulaKey[]).map((fKey) => {
            const copyContent = client.outputs[fKey] || 'No copy mapped.';
            const isCurrent = selectedFormula === fKey;
            return (
              <div
                key={fKey}
                className={`p-4 rounded-xl bg-white border transition-all flex flex-col justify-between ${
                  isCurrent ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900 uppercase">
                      {fKey.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => {
                        copyText(copyContent).then(ok =>
                          alert(ok ? `Copied ${fKey} script!` : 'Copy failed. Select the text and press Ctrl+C instead.')
                        );
                      }}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed line-clamp-8">
                    {copyContent}
                  </pre>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => {
                      onChangeOutputText(copyContent);
                      setViewMode('editor');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Open in Main Editor →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showFlyer && (
        <PdfFlyerPreviewModal
          property={clientToFlyerProperty(client, outputText)}
          onClose={() => setShowFlyer(false)}
        />
      )}
    </div>
  );
};

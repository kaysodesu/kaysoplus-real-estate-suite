import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { IntakeModal } from './components/IntakeModal';
import { ClientWorkspaceHeader } from './components/ClientWorkspaceHeader';
import { PropertySpecsEditor } from './components/PropertySpecsEditor';
import { FormulaSelector } from './components/FormulaSelector';
import { OutputConsole } from './components/OutputConsole';
import { ClientRecord, FormulaKey } from './types';
import { INITIAL_CLIENTS } from './data/initialClients';

export default function App() {
  // Load initial clients
  const [clients, setClients] = useState<Record<string, ClientRecord>>(() => {
    try {
      const saved = localStorage.getItem('propscript_crm_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not load stored clients from localStorage', e);
    }
    return INITIAL_CLIENTS;
  });

  const [currentClientKey, setCurrentClientKey] = useState<string>('jane');
  const [selectedFormula, setSelectedFormula] = useState<FormulaKey>('luxury');
  const [outputText, setOutputText] = useState<string>('');
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('propscript_crm_clients', JSON.stringify(clients));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
  }, [clients]);

  // Current client object
  const currentClient: ClientRecord = clients[currentClientKey] || Object.values(clients)[0];

  // When client changes or formula changes, populate outputText
  useEffect(() => {
    if (currentClient) {
      const copy = currentClient.outputs?.[selectedFormula] || '';
      setOutputText(copy);
    }
  }, [currentClientKey, selectedFormula]);

  // Client Selection Handler
  const handleSelectClient = (clientKey: string) => {
    setCurrentClientKey(clientKey);
    const client = clients[clientKey];
    if (client) {
      setOutputText(client.outputs?.[selectedFormula] || '');
    }
  };

  // Add New Client Handler
  const handleSaveClient = (newClient: ClientRecord) => {
    setClients((prev) => ({
      ...prev,
      [newClient.id]: newClient,
    }));
    setCurrentClientKey(newClient.id);
    setSelectedFormula('luxury');
    setOutputText(newClient.outputs.luxury || '');
  };

  // Delete Client Handler
  const handleDeleteClient = (keyToDelete: string) => {
    setClients((prev) => {
      const copy = { ...prev };
      delete copy[keyToDelete];
      return copy;
    });

    const remainingKeys = Object.keys(clients).filter((k) => k !== keyToDelete);
    if (remainingKeys.length > 0) {
      setCurrentClientKey(remainingKeys[0]);
    }
  };

  // Live update client specs
  const handleUpdateClientSpecs = (updatedSpecs: {
    sqft: string;
    beds: string;
    features: string;
  }) => {
    if (!currentClient) return;

    setClients((prev) => {
      const client = prev[currentClientKey];
      if (!client) return prev;

      // Re-map updated specs dynamically
      const updatedClient: ClientRecord = {
        ...client,
        sqft: updatedSpecs.sqft,
        beds: updatedSpecs.beds,
        features: updatedSpecs.features,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        [currentClientKey]: updatedClient,
      };
    });
  };

  // Save current customized variant back into client profile
  const handleSaveVariantToClient = (formula: FormulaKey, text: string) => {
    if (!currentClient) return;

    setClients((prev) => {
      const client = prev[currentClientKey];
      if (!client) return prev;

      return {
        ...prev,
        [currentClientKey]: {
          ...client,
          outputs: {
            ...client.outputs,
            [formula]: text,
          },
        },
      };
    });
  };

  // Reset to original formula template
  const handleResetToOriginalFormula = () => {
    if (!currentClient) return;
    const p = currentClient.property || '123 Maple St';
    const s = currentClient.sqft || 'Custom Size';
    const b = currentClient.beds || 'Premium Count';
    const f = currentClient.features || 'Elite custom detailing throughout.';

    let defaultCopy = '';
    switch (selectedFormula) {
      case 'luxury':
        defaultCopy = `✨ ICONIC STATEMENT RESIDENCE: TOURS OPEN ✨\n\nIntroducing a masterfully tailored living experience at ${p}.\n\nSpecs Checklist:\n• Architectural Blueprint: ${s}\n• Layout Masterwork: ${b}\n\nCore Lifestyle Elements:\n${f}\n\nThis curated inventory block sets a new standard for luxury operational design. Connect for calendar booking rules.`;
        break;
      case 'first_time':
        defaultCopy = `🔑 COMPACT SOVEREIGNTY ARCHITECTURE 🔑\n\nStop missing out on real equity growth. Welcome home to ${p}!\n\nThis turn-key asset provides an optimal footprint of ${s} and a gorgeous ${b} layout configuration.\n\nHighlights Include:\n📌 ${f}\n\nBuilt for high-turnover productivity. Own your tomorrow.`;
        break;
      case 'social_thread':
        defaultCopy = `1/ Big news for real estate acquisition teams. A pristine high-volume opportunity has hit the board at ${p}. Full breakdown on the design assets below 👇\n\n2/ Space breakdown: Leveraging an expansive footprint of ${s} with an optimized ${b}.\n\n3/ The critical value driver here lies in the feature matrix: ${f}\n\n4/ DM the studio queue right now to lock down priority file review paths. This inventory asset is moving fast.`;
        break;
      case 'zillow_optimized':
      default:
        defaultCopy = `Exceptional opportunity to capture premium real estate tracking values at ${p}. Spanning an efficient ${s} with ${b}. Highlight features include: ${f} Turn-key and market optimized.`;
        break;
    }

    setOutputText(defaultCopy);
  };

  // Generate AI copy with Gemini API
  const handleGenerateAI = async (options: {
    formula: FormulaKey;
    tone: string;
    length: string;
    targetAudience: string;
    customPrompt?: string;
  }) => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: currentClient.name,
          property: currentClient.property,
          sqft: currentClient.sqft,
          beds: currentClient.beds,
          features: currentClient.features,
          formula: options.formula,
          tone: options.tone,
          length: options.length,
          targetAudience: options.targetAudience,
          customPrompt: options.customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.copy) {
        setOutputText(data.copy);
      } else {
        throw new Error(data.error || 'Failed to generate copy');
      }
    } catch (err: any) {
      console.warn('AI generation failed, applying local formula:', err);
      handleResetToOriginalFormula();
    } finally {
      setIsGenerating(false);
    }
  };

  // Local refine used when the AI server or key isn't available
  const applyLocalRefine = (action: string) => {
        // Fallback local transformations if API key is not connected yet
        if (action === 'make_punchier') {
          const refined = outputText
            .replace(/Introducing a masterfully tailored living experience/gi, 'Direct listing spotlight')
            .replace(/Exceptional opportunity to capture/gi, 'Prime acquisition target at');
          setOutputText(refined);
        } else if (action === 'add_hashtags') {
          const tags = `\n\n#RealEstate #LuxuryHomes #PropertyListing #${currentClient.name.replace(/\s+/g, '')} #DreamHome #JustListed #ExclusiveProperty`;
          setOutputText(outputText + tags);
        } else if (action === 'shorten_bullet_points') {
          const lines = outputText.split('\n').filter(Boolean);
          const bullets = lines.map((l) => (l.startsWith('•') || l.startsWith('📌') ? l : `• ${l}`)).join('\n');
          setOutputText(bullets);
        }
  };

  // Quick Refine with AI
  const handleRefineCopy = async (action: string) => {
    if (!outputText) return;
    setIsRefining(true);
    try {
      const res = await fetch('/api/refine-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCopy: outputText,
          action,
        }),
      });

      const data = await res.json();
      if (data.success && data.copy) {
        setOutputText(data.copy);
      } else {
        applyLocalRefine(action);
      }
    } catch (err) {
      // No server (e.g. the static demo site): refine locally instead
      console.warn('Refinement error, applying local refine:', err);
      applyLocalRefine(action);
    } finally {
      setIsRefining(false);
    }
  };

  if (!currentClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-400">No active clients in workspace.</p>
          <button
            onClick={() => setIsIntakeModalOpen(true)}
            className="px-4 py-2 bg-blue-600 rounded-lg text-xs font-semibold"
          >
            + Add Client
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar
        clients={clients}
        currentClientKey={currentClientKey}
        onSelectClient={handleSelectClient}
        onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
        onDeleteClient={handleDeleteClient}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto bg-slate-100/60 p-6 space-y-5">
        {/* Client Workspace Header */}
        <ClientWorkspaceHeader client={currentClient} />

        {/* Specs & AI Context Editor */}
        <PropertySpecsEditor
          client={currentClient}
          onUpdateClientSpecs={handleUpdateClientSpecs}
        />

        {/* Prompt Formula Engine */}
        <FormulaSelector
          selectedFormula={selectedFormula}
          onSelectFormula={(f) => setSelectedFormula(f)}
          onGenerateAI={handleGenerateAI}
          isGenerating={isGenerating}
        />

        {/* Output Console & AI Refinement */}
        <OutputConsole
          client={currentClient}
          selectedFormula={selectedFormula}
          outputText={outputText}
          onChangeOutputText={setOutputText}
          onRefineCopy={handleRefineCopy}
          onSaveVariantToClient={handleSaveVariantToClient}
          onResetToOriginalFormula={handleResetToOriginalFormula}
          isRefining={isRefining}
        />
      </main>

      {/* New Client Intake Modal Popup */}
      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSaveClient={handleSaveClient}
      />
    </div>
  );
}

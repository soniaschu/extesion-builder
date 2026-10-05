import React from 'react';
import { 
  Palette, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  Check, 
  X, 
  RefreshCw, 
  FolderGit2, 
  HelpCircle,
  Compass,
  Eye,
  Shield,
  FileCode,
  Send,
  GitCommit,
  CheckCircle2,
  Terminal,
  Code2,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { ActiveStudioMode, VSCodeThemeConfig, OpenChamberExtensionConfig } from '../../types';
import { THEME_PRESETS } from '../../data/presets';
import { OPENCHAMBER_TEMPLATES } from '../../data/openchamberTemplates';
import { OPENCODE_PLUGIN_TEMPLATES } from '../../data/opencodePluginTemplates';

interface ProjectWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: ActiveStudioMode) => void;
  onApplyTheme: (theme: VSCodeThemeConfig) => void;
  onSyncThemeToOpenChamber: (theme: VSCodeThemeConfig) => void;
  onSelectExtensionTemplate: (templateId: string) => void;
  onSelectPluginTemplate?: (templateId: string) => void;
}

export const ProjectWorkflowModal: React.FC<ProjectWorkflowModalProps> = ({
  isOpen,
  onClose,
  onSelectMode,
  onApplyTheme,
  onSyncThemeToOpenChamber,
  onSelectExtensionTemplate,
  onSelectPluginTemplate,
}) => {
  const [step, setStep] = React.useState<'choose_type' | 'theme_sync_question' | 'openchamber_setup' | 'opencode_setup'>('choose_type');
  const [selectedTheme, setSelectedTheme] = React.useState<VSCodeThemeConfig>(THEME_PRESETS[0]);
  const [syncToOpenChamber, setSyncToOpenChamber] = React.useState<boolean>(true);
  const [hoveredTemplateId, setHoveredTemplateId] = React.useState<string>('prompt-booster');
  const [hoveredPluginId, setHoveredPluginId] = React.useState<string>('tool-guard');

  if (!isOpen) return null;

  const handleChooseType = (type: 'vscode' | 'openchamber' | 'opencode' | 'combined') => {
    if (type === 'vscode') {
      setStep('theme_sync_question');
    } else if (type === 'openchamber') {
      setStep('openchamber_setup');
    } else if (type === 'opencode') {
      setStep('opencode_setup');
    } else {
      // Combined: sync theme and open studio
      onApplyTheme(selectedTheme);
      onSyncThemeToOpenChamber(selectedTheme);
      onSelectMode('vscode-theme');
      onClose();
    }
  };

  const handleFinishThemeSetup = () => {
    onApplyTheme(selectedTheme);
    if (syncToOpenChamber) {
      onSyncThemeToOpenChamber(selectedTheme);
    }
    onSelectMode('vscode-theme');
    onClose();
  };

  const handleFinishOpenChamberSetup = (templateId: string) => {
    onSelectExtensionTemplate(templateId);
    onSelectMode('openchamber');
    onClose();
  };

  const handleFinishOpenCodeSetup = (pluginId: string) => {
    if (onSelectPluginTemplate) {
      onSelectPluginTemplate(pluginId);
    }
    onSelectMode('opencode-plugin');
    onClose();
  };

  const activeHoveredTemplate = OPENCHAMBER_TEMPLATES[hoveredTemplateId] || OPENCHAMBER_TEMPLATES['prompt-booster'];
  const activeHoveredPlugin = OPENCODE_PLUGIN_TEMPLATES[hoveredPluginId] || OPENCODE_PLUGIN_TEMPLATES['tool-guard'];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl sm:max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Project Creation Wizard</h2>
              <p className="text-[11px] text-slate-400">
                Choose your developer target: VS Code Theme, OpenChamber SDK, or OpenCode Plugin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* STEP 1: What do you want to build? (3 Workflows + Combined) */}
          {step === 'choose_type' && (
            <div className="space-y-4">
              <div className="text-center pb-1">
                <h3 className="text-base font-bold text-slate-100">What would you like to build today?</h3>
                <p className="text-slate-400 text-xs mt-1">
                  Select an individual target or build them synced together in the Combined Suite.
                </p>
              </div>

              {/* 3 Columns for 3 Workflows */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Workflow 1: VS Code Theme */}
                <button
                  onClick={() => handleChooseType('vscode')}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900/90 transition text-left flex flex-col justify-between gap-3 group shadow-md"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Palette className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                      Workflow 1
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                      VS Code Theme & Icons
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Custom workbench colors, TextMate syntax tokens, WCAG AA compliance, and 30+ vector file/folder icons.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Configure Theme</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Workflow 2: OpenChamber Extension */}
                <button
                  onClick={() => handleChooseType('openchamber')}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/80 hover:bg-slate-900/90 transition text-left flex flex-col justify-between gap-3 group shadow-md"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      Workflow 2
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                      OpenChamber Extension
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      Interactive sidebar panel for OpenChamber agentic IDE using <code className="text-emerald-400">@openchamber/sdk</code>.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Configure Extension</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>

                {/* Workflow 3: OpenCode Plugin (zenobi-us/opencode-plugin-template) */}
                <button
                  onClick={() => handleChooseType('opencode')}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-900/90 transition text-left flex flex-col justify-between gap-3 group shadow-md"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/40">
                      Workflow 3
                    </span>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      OpenCode Plugin
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      AI agent plugin using <code className="text-indigo-300">opencode-plugin-template</code>: tool interception, guards & hooks.
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                    <span>Configure Plugin</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              </div>

              {/* Combined Option */}
              <button
                onClick={() => handleChooseType('combined')}
                className="w-full p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-fuchsia-950/40 border border-indigo-800/40 hover:border-indigo-500/80 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-fuchsia-400 group-hover:animate-spin" />
                  <div className="text-left">
                    <span className="font-bold text-slate-200 block text-xs">Combined ChamberCraft Suite</span>
                    <span className="text-[11px] text-slate-400">
                      Build VS Code Theme, OpenChamber Extension, and OpenCode Plugin with synced palettes & nested ZIPs
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-fuchsia-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* STEP 2: Theme Selected -> Ask to adopt theme for OpenChamber */}
          {step === 'theme_sync_question' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Step 2: Theme Setup & Extension Synchronization</h3>
                <p className="text-slate-400 text-xs mt-1">
                  You selected <strong>VS Code Theme</strong>. Choose your starting palette:
                </p>
              </div>

              {/* Theme Selector */}
              <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {THEME_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTheme(p)}
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition ${
                      selectedTheme.id === p.id
                        ? 'bg-slate-900 border-cyan-400 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                      style={{ backgroundColor: p.colors['editor.background'] || '#121212' }}
                    />
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate text-[11px]">{p.displayName}</div>
                      <div className="text-[9px] text-slate-500 truncate">{p.colors['focusBorder']}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ask whether they want to adopt the theme for OpenChamber / OpenCode */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs">
                      Möchten Sie dieses Theme auch für die OpenChamber Extension & OpenCode Plugins übernehmen?
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      (Would you like to adopt this theme's colors for your extensions & CLI plugins too?)
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSyncToOpenChamber(true)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                      syncToOpenChamber
                        ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      syncToOpenChamber ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
                    }`}>
                      {syncToOpenChamber && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-[11px]">Ja, Theme übernehmen</div>
                      <div className="text-[9px] text-slate-500 font-normal">Sync colors & dark mode variables</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSyncToOpenChamber(false)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition ${
                      !syncToOpenChamber
                        ? 'bg-slate-800 border-cyan-500/80 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      !syncToOpenChamber ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                    }`}>
                      {!syncToOpenChamber && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-[11px]">Nein, unabhängig lassen</div>
                      <div className="text-[9px] text-slate-500 font-normal">Keep extension colors separate</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStep('choose_type')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Back
                </button>
                <button
                  onClick={handleFinishThemeSetup}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
                >
                  <span>Launch Theme Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OpenChamber Selected with Live Visual Preview Thumbnail on Hover */}
          {step === 'openchamber_setup' && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Step 2: Choose OpenChamber Extension Template</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40 font-normal">
                    Hover over list to preview
                  </span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Hover over any extension template to see a live visual thumbnail preview of its panel interface:
                </p>
              </div>

              {/* 2-Column Layout: Left List + Right Visual Preview Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                {/* Left: Template Selector List */}
                <div className="md:col-span-5 space-y-2 flex flex-col justify-start">
                  {Object.values(OPENCHAMBER_TEMPLATES).map((tmpl) => {
                    const isHovered = hoveredTemplateId === tmpl.id;

                    return (
                      <div
                        key={tmpl.id}
                        onMouseEnter={() => setHoveredTemplateId(tmpl.id)}
                        onClick={() => handleFinishOpenChamberSetup(tmpl.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between group ${
                          isHovered
                            ? 'bg-slate-950 border-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition ${
                              isHovered 
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' 
                                : 'bg-slate-900 text-slate-400 border-slate-800'
                            }`}
                            dangerouslySetInnerHTML={{ __html: tmpl.svgIcon }}
                          />
                          <div className="min-w-0">
                            <div className={`font-semibold truncate transition-colors text-xs ${
                              isHovered ? 'text-emerald-300' : 'text-slate-200'
                            }`}>
                              {tmpl.manifest.title}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {tmpl.manifest.categories.join(', ')}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <span className={`text-[10px] font-semibold transition ${
                            isHovered ? 'text-emerald-400' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                          }`}>
                            Select
                          </span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                            isHovered ? 'text-emerald-400 translate-x-0.5' : 'text-slate-600'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Rich Visual Preview Thumbnail */}
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5 overflow-hidden shadow-inner">
                  {/* Visual Preview Header */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        OpenChamber Rail: {activeHoveredTemplate.manifest.title}
                      </span>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
                      Visual Preview
                    </span>
                  </div>

                  {/* Render Mock Panel Thumbnail */}
                  <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg p-3 overflow-hidden flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 text-emerald-400 shrink-0"
                          dangerouslySetInnerHTML={{ __html: activeHoveredTemplate.svgIcon }}
                        />
                        <span className="font-bold text-slate-100 text-xs">
                          {activeHoveredTemplate.manifest.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                        v{activeHoveredTemplate.manifest.version}
                      </span>
                    </div>

                    {activeHoveredTemplate.id === 'prompt-booster' && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-400 text-[10px] uppercase font-bold">Session Target:</span>
                          <span className="font-mono text-cyan-400 text-[10px]">Dev-Main (Claude 3.7 / Gemini)</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300 font-mono">
                          🧪 Test-Driven Refactor: Write unit tests first
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <div className="py-1 text-center rounded bg-slate-800 text-slate-200 text-[10px] font-medium">
                            Insert to Chat
                          </div>
                          <div className="py-1 text-center rounded bg-cyan-600 text-slate-950 text-[10px] font-bold">
                            ⚡ Send Prompt
                          </div>
                        </div>
                      </div>
                    )}

                    {activeHoveredTemplate.id === 'diff-inspector' && (
                      <div className="space-y-2 text-[11px]">
                        <div className="grid grid-cols-3 gap-1.5 text-center">
                          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                            <div className="font-mono font-bold text-xs text-slate-200">3</div>
                            <div className="text-[9px] text-slate-500 uppercase">Files</div>
                          </div>
                          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                            <div className="font-mono font-bold text-xs text-emerald-400">+142</div>
                            <div className="text-[9px] text-slate-500 uppercase">Added</div>
                          </div>
                          <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                            <div className="font-mono font-bold text-xs text-rose-400">-38</div>
                            <div className="text-[9px] text-slate-500 uppercase">Removed</div>
                          </div>
                        </div>
                        <div className="py-1 text-center rounded bg-emerald-500 text-slate-950 text-[10px] font-bold">
                          🔍 Request OpenCode Review
                        </div>
                      </div>
                    )}

                    {activeHoveredTemplate.id === 'task-runner' && (
                      <div className="space-y-2 text-[11px]">
                        <div className="p-1.5 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px]">
                          <span className="text-slate-200 font-medium">Verify TypeScript Types</span>
                          <span className="text-emerald-400 bg-emerald-950/80 px-1 rounded text-[9px]">Completed</span>
                        </div>
                        <div className="py-1 text-center rounded bg-cyan-600 text-slate-950 text-[10px] font-bold">
                          + Attach Task to Session
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleFinishOpenChamberSetup(activeHoveredTemplate.id)}
                    className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/30 text-xs"
                  >
                    <span>Use "{activeHoveredTemplate.manifest.title}" Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                <button
                  onClick={() => setStep('choose_type')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: OpenCode Selected with Visual Preview Thumbnail on Hover */}
          {step === 'opencode_setup' && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span>Step 2: Choose OpenCode Plugin Template</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-800/40 font-normal">
                    Template: zenobi-us/opencode-plugin-template
                  </span>
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Hover over any plugin template to see its live architecture, hooks, and simulated terminal execution:
                </p>
              </div>

              {/* 2-Column Layout: Left List + Right Visual Preview Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
                {/* Left: Template Selector List */}
                <div className="md:col-span-5 space-y-2 flex flex-col justify-start">
                  {Object.values(OPENCODE_PLUGIN_TEMPLATES).map((tmpl) => {
                    const isHovered = hoveredPluginId === tmpl.id;

                    return (
                      <div
                        key={tmpl.id}
                        onMouseEnter={() => setHoveredPluginId(tmpl.id)}
                        onClick={() => handleFinishOpenCodeSetup(tmpl.id)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-center justify-between group ${
                          isHovered
                            ? 'bg-slate-950 border-indigo-500 shadow-md shadow-indigo-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition ${
                            isHovered
                              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            <Terminal className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className={`font-semibold truncate transition-colors text-xs ${
                              isHovered ? 'text-indigo-300' : 'text-slate-200'
                            }`}>
                              {tmpl.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {tmpl.name} · {tmpl.hooks.length} hooks
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <span className={`text-[10px] font-semibold transition ${
                            isHovered ? 'text-indigo-400' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                          }`}>
                            Select
                          </span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                            isHovered ? 'text-indigo-400 translate-x-0.5' : 'text-slate-600'
                          }`} />
                        </div>
                      </div>
                    );
                  })}

                  <div className="p-2.5 rounded-lg bg-slate-950/40 border border-slate-850 text-[11px] text-slate-400 space-y-1">
                    <div className="text-slate-300 font-medium">💡 Official OpenCode Plugin Architecture</div>
                    <div>Compatible with Bun runtime, TypeScript, and `@opencode-ai/plugin` interface.</div>
                  </div>
                </div>

                {/* Right: Rich Visual Preview Thumbnail */}
                <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col gap-2.5 overflow-hidden shadow-inner">
                  {/* Visual Preview Header */}
                  <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        OpenCode CLI Mock: {activeHoveredPlugin.name}
                      </span>
                    </div>

                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/40">
                      Plugin Architecture Preview
                    </span>
                  </div>

                  {/* Render Visual Mockup of the hovered plugin */}
                  <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-lg p-3 overflow-hidden flex flex-col gap-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="font-bold text-slate-100 text-xs font-sans">
                          {activeHoveredPlugin.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded">
                        v{activeHoveredPlugin.version}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Active Hooks:</span>
                        <span className="text-cyan-400">{activeHoveredPlugin.hooks.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Runtime Target:</span>
                        <span className="text-emerald-400">Bun + Node.js (TypeScript)</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Base Template:</span>
                        <span className="text-indigo-300">zenobi-us/opencode-plugin-template</span>
                      </div>
                    </div>

                    {/* Simulated terminal preview box */}
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1 text-[10px]">
                      <div className="text-slate-500">// OpenCode Simulated Event Log</div>
                      <div className="text-indigo-400">
                        &gt; [Plugin] Loaded {activeHoveredPlugin.name}
                      </div>
                      {activeHoveredPlugin.id === 'tool-guard' && (
                        <div className="text-emerald-400">
                          ✓ Enforcing command safety: blocked 0 unsafe executions
                        </div>
                      )}
                      {activeHoveredPlugin.id === 'theme-bridge' && (
                        <div className="text-emerald-400">
                          ✓ Synchronized ANSI palette with VS Code theme
                        </div>
                      )}
                      {activeHoveredPlugin.id === 'git-commit-assistant' && (
                        <div className="text-emerald-400">
                          ✓ Watching worktree diff for semantic conventional commits
                        </div>
                      )}
                    </div>
                  </div>

                  {/* One-click launch button */}
                  <button
                    onClick={() => handleFinishOpenCodeSetup(activeHoveredPlugin.id)}
                    className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-950/30 text-xs"
                  >
                    <span>Use "{activeHoveredPlugin.title}" Plugin Template</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                <button
                  onClick={() => setStep('choose_type')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

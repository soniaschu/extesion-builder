import React from 'react';
import { 
  Palette, 
  Layers, 
  Sparkles, 
  Download, 
  FolderGit2, 
  BookOpen, 
  RotateCcw,
  Check,
  ChevronDown,
  Github,
  MessageSquare,
  Compass,
  FileArchive
} from 'lucide-react';
import { ActiveStudioMode, VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig } from '../types';
import { THEME_PRESETS } from '../data/presets';
import { 
  downloadVSCodeExtensionZip, 
  downloadOpenChamberZip, 
  downloadIconPackZip,
  downloadGitHubRepoZip 
} from '../utils/zipExporter';

interface NavbarProps {
  activeMode: ActiveStudioMode;
  setActiveMode: (mode: ActiveStudioMode) => void;
  currentTheme: VSCodeThemeConfig;
  iconConfig: IconThemeConfig;
  extension: OpenChamberExtensionConfig;
  onSelectPreset: (theme: VSCodeThemeConfig) => void;
  onOpenAiModal: () => void;
  onOpenAiChat: () => void;
  onOpenWorkflowModal: () => void;
  onOpenExportModal: () => void;
  onResetTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMode,
  setActiveMode,
  currentTheme,
  iconConfig,
  extension,
  onSelectPreset,
  onOpenAiModal,
  onOpenAiChat,
  onOpenWorkflowModal,
  onOpenExportModal,
  onResetTheme,
}) => {
  const [presetDropdownOpen, setPresetDropdownOpen] = React.useState(false);
  const [zipDropdownOpen, setZipDropdownOpen] = React.useState(false);

  return (
    <header className="bg-slate-950 border-b border-slate-850 px-4 py-2 flex items-center justify-between select-none sticky top-0 z-40">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <span className="font-mono text-xs font-black text-cyan-400">&lt;/&gt;</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-slate-100 tracking-tight">ChamberCraft</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 font-semibold">
                Studio
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              VS Code Themes & OpenChamber SDK Extensions
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="h-6 w-px bg-slate-800 hidden md:block" />

        {/* Mode Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveMode('vscode-theme')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeMode === 'vscode-theme'
                ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme Studio</span>
          </button>

          <button
            onClick={() => setActiveMode('openchamber')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeMode === 'openchamber'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>OpenChamber SDK</span>
          </button>

          <button
            onClick={() => setActiveMode('icons')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeMode === 'icons'
                ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Icon Pack ({iconConfig.icons.length}+)</span>
          </button>

          <button
            onClick={() => setActiveMode('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeMode === 'github'
                ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Export</span>
          </button>

          <button
            onClick={() => setActiveMode('export')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeMode === 'export'
                ? 'bg-slate-800 text-fuchsia-400 shadow-sm border border-slate-700/60'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Packaging</span>
          </button>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Project Wizard Button */}
        <button
          onClick={onOpenWorkflowModal}
          className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-indigo-300 hover:text-indigo-200 hover:border-indigo-600 transition"
          title="New Project Workflow Wizard"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>New Project</span>
        </button>

        {/* AI Chat (3 Proposals) Trigger */}
        <button
          onClick={onOpenAiChat}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-fuchsia-500/20 via-pink-500/20 to-cyan-500/20 border border-fuchsia-500/40 text-fuchsia-300 hover:text-fuchsia-100 hover:border-fuchsia-400 text-xs font-semibold transition shadow-xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-fuchsia-400 animate-bounce" />
          <span>AI Chat (3 Proposals)</span>
        </button>

        {/* Preset Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-slate-100 hover:border-slate-700 transition"
          >
            <span className="text-slate-400">Preset:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[100px]">{currentTheme.displayName}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {presetDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-800/80">
                Preset Palettes
              </div>
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    onSelectPreset(preset);
                    setPresetDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between group transition"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0 shadow-xs"
                      style={{ backgroundColor: preset.colors['editor.background'] || '#1e1e1e' }}
                    />
                    <div>
                      <div className="text-slate-200 font-medium group-hover:text-cyan-400 transition-colors">
                        {preset.displayName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[160px]">
                        {preset.description}
                      </div>
                    </div>
                  </div>
                  {currentTheme.id === preset.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Theme + Icons Generator Button */}
        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-fuchsia-500/20 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 hover:border-cyan-400 text-xs font-semibold transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AI Theme + Icons</span>
        </button>

        {/* Instant ZIP Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setZipDropdownOpen(!zipDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-950/50 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
            <ChevronDown className="w-3 h-3 text-slate-950" />
          </button>

          {zipDropdownOpen && (
            <div className="absolute right-0 mt-1 w-64 rounded-lg bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                Direct ZIP Downloads
              </div>
              <button
                onClick={() => {
                  downloadVSCodeExtensionZip(currentTheme, iconConfig);
                  setZipDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 group transition"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <div>
                  <div className="text-slate-200 font-semibold group-hover:text-cyan-400">VS Code Extension ZIP</div>
                  <div className="text-[10px] text-slate-500">Includes theme JSON & all vector icons</div>
                </div>
              </button>

              <button
                onClick={() => {
                  downloadGitHubRepoZip(currentTheme, iconConfig, extension, {
                    repoName: `vsc-theme-${currentTheme.name}`,
                    owner: '',
                    description: currentTheme.description,
                    isPrivate: false,
                    includeActions: true,
                    includeOpenChamber: true,
                    includeContributing: true,
                    branch: 'main',
                  });
                  setZipDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 group transition"
              >
                <Github className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <div className="text-slate-200 font-semibold group-hover:text-emerald-400">GitHub Repository ZIP</div>
                  <div className="text-[10px] text-slate-500">With Actions, LICENSE, CONTRIBUTING</div>
                </div>
              </button>

              <button
                onClick={() => {
                  downloadOpenChamberZip(extension);
                  setZipDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 group transition"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <div className="text-slate-200 font-semibold group-hover:text-emerald-400">OpenChamber SDK ZIP</div>
                  <div className="text-[10px] text-slate-500">Panel files, manifest, SDK script</div>
                </div>
              </button>

              <button
                onClick={() => {
                  downloadIconPackZip(iconConfig);
                  setZipDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 group transition border-t border-slate-800/80"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                <div>
                  <div className="text-slate-200 font-semibold group-hover:text-amber-400">Icon Pack Only ZIP</div>
                  <div className="text-[10px] text-slate-500">All {iconConfig.icons.length}+ SVGs and icon-theme.json</div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

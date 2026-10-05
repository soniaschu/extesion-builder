import React from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  FileCode, 
  Layers, 
  Sparkles, 
  Terminal, 
  ExternalLink,
  Archive,
  ChevronRight
} from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig } from '../../types';
import { 
  downloadVSCodeExtensionZip, 
  downloadOpenChamberZip, 
  downloadFullStudioBundle,
  downloadGitHubRepoZip,
  downloadIconPackZip
} from '../../utils/zipExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: VSCodeThemeConfig;
  iconConfig: IconThemeConfig;
  extension: OpenChamberExtensionConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  theme,
  iconConfig,
  extension,
}) => {
  const [copiedSettings, setCopiedSettings] = React.useState(false);
  const [copiedThemeJson, setCopiedThemeJson] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'packages' | 'snippets' | 'install'>('packages');

  if (!isOpen) return null;

  // Generate settings.json snippet
  const settingsSnippet = JSON.stringify(
    {
      'workbench.colorCustomizations': theme.colors,
      'editor.tokenColorCustomizations': {
        textMateRules: theme.tokenColors,
      },
    },
    null,
    2
  );

  // Generate full theme json
  const fullThemeJson = JSON.stringify(
    {
      $schema: 'vscode://schemas/color-theme',
      name: theme.displayName,
      type: theme.type,
      colors: theme.colors,
      tokenColors: theme.tokenColors,
    },
    null,
    2
  );

  const handleCopySettings = () => {
    navigator.clipboard.writeText(settingsSnippet);
    setCopiedSettings(true);
    setTimeout(() => setCopiedSettings(false), 2000);
  };

  const handleCopyThemeJson = () => {
    navigator.clipboard.writeText(fullThemeJson);
    setCopiedThemeJson(true);
    setTimeout(() => setCopiedThemeJson(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">Packaging & Export Center</h2>
              <p className="text-[11px] text-slate-400">
                Production packages for VS Code, Cursor, and OpenChamber SDK
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

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4">
          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition ${
              activeTab === 'packages'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📦 Ready-to-Run Packages
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition ${
              activeTab === 'snippets'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Direct JSON Snippets
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`py-2 px-3 text-xs font-medium border-b-2 transition ${
              activeTab === 'install'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📖 Installation Guide
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'packages' && (
            <div className="space-y-3">
              {/* VS Code Extension Package */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{theme.displayName} Extension</div>
                    <div className="text-[11px] text-slate-400">
                      Complete package with manifest, theme JSON, full SVG icons, and README.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadVSCodeExtensionZip(theme, iconConfig)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP</span>
                </button>
              </div>

              {/* OpenChamber Extension Package */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">{extension.manifest.title}</div>
                    <div className="text-[11px] text-slate-400">
                      OpenChamber SDK extension: manifest, index.html, main.js, style.css & icon.svg.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadOpenChamberZip(extension)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP</span>
                </button>
              </div>

              {/* GitHub Repository Package */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-950/70 border border-emerald-800 flex items-center justify-center text-emerald-400 shrink-0 font-mono text-xs font-bold">
                    GH
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">GitHub Repository Archive</div>
                    <div className="text-[11px] text-slate-400">
                      Production repo with GitHub Actions workflows, LICENSE, CONTRIBUTING, and release CI.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadGitHubRepoZip(theme, iconConfig, extension, {
                    repoName: `vsc-theme-${theme.name}`,
                    owner: '',
                    description: theme.description,
                    isPrivate: false,
                    includeActions: true,
                    includeOpenChamber: true,
                    includeContributing: true,
                    branch: 'main',
                  })}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP</span>
                </button>
              </div>

              {/* Icon Pack Only Package */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 shrink-0 font-mono text-xs font-bold">
                    SVG
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Vector Icon Pack ({iconConfig.icons.length}+ Symbols)</div>
                    <div className="text-[11px] text-slate-400">
                      Standalone icon set with <code className="text-amber-400">icon-theme.json</code> and all SVG files.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadIconPackZip(iconConfig)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download ZIP</span>
                </button>
              </div>

              {/* Combined Bundle */}
              <div className="p-3.5 rounded-lg bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-fuchsia-950/40 border border-cyan-800/50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-200">Combined ChamberCraft Suite</div>
                    <div className="text-[11px] text-slate-400">
                      Everything in one archive: VS Code theme, icon set, and OpenChamber extension.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadFullStudioBundle(theme, iconConfig, extension)}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-cyan-950/50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Bundle</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'snippets' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200">
                    Instant VS Code <code className="text-cyan-400">settings.json</code> Snippet
                  </span>
                  <button
                    onClick={handleCopySettings}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    {copiedSettings ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSettings ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Paste directly into your user or workspace <code className="text-slate-300">.vscode/settings.json</code> to apply this theme immediately without installing!
                </p>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg max-h-48 overflow-y-auto text-[11px] font-mono text-slate-300">
                  {settingsSnippet}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-200">
                    Raw Color Theme JSON (<code className="text-cyan-400">{theme.name}-color-theme.json</code>)
                  </span>
                  <button
                    onClick={handleCopyThemeJson}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    {copiedThemeJson ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedThemeJson ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg max-h-48 overflow-y-auto text-[11px] font-mono text-slate-300">
                  {fullThemeJson}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4 leading-relaxed">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>How to install in VS Code / Cursor:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
                  <li>Download the VS Code Extension ZIP from the <strong>Packages</strong> tab.</li>
                  <li>Unzip the archive into your extensions folder:
                    <div className="p-2 bg-slate-900 rounded font-mono text-cyan-300 mt-1 select-text">
                      # macOS/Linux:<br/>
                      mkdir -p ~/.vscode/extensions/{theme.name}<br/>
                      cp -r {theme.id}-vscode/* ~/.vscode/extensions/{theme.name}/<br/><br/>
                      # Windows (PowerShell):<br/>
                      Copy-Item -Recurse {theme.id}-vscode $env:USERPROFILE\.vscode\extensions\{theme.name}
                    </div>
                  </li>
                  <li>Open VS Code, press <code className="text-cyan-400">Ctrl+K Ctrl+T</code> (or <code className="text-cyan-400">Cmd+K Cmd+T</code>) and select <strong>"{theme.displayName}"</strong>!</li>
                </ol>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <div className="font-semibold text-emerald-400 mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-4 h-4" />
                  <span>How to install in OpenChamber:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px]">
                  <li>Download the OpenChamber Extension ZIP.</li>
                  <li>Place the folder into OpenChamber extensions:
                    <div className="p-2 bg-slate-900 rounded font-mono text-emerald-300 mt-1 select-text">
                      mkdir -p ~/.openchamber/extensions/{extension.manifest.name}<br/>
                      cp -r {extension.manifest.name}/* ~/.openchamber/extensions/{extension.manifest.name}/
                    </div>
                  </li>
                  <li>Open OpenChamber → <strong>Settings → Extensions</strong> to enable your panel. The custom rail icon will appear in the right sidebar!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            WCAG AA Compliant · Standard VS Code TextMate & OpenChamber SDK
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

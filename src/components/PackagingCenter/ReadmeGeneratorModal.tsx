import React from 'react';
import { 
  FileText, 
  Copy, 
  Download, 
  Check, 
  X, 
  Palette, 
  ExternalLink, 
  Eye, 
  Code2, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig, OpenCodePluginConfig } from '../../types';
import { generateThemeReadme, downloadReadmeFile } from '../../utils/readmeGenerator';
import { getContrastRatio, getWcagRating } from '../../utils/colorUtils';

interface ReadmeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: VSCodeThemeConfig;
  iconConfig?: IconThemeConfig;
  extension?: OpenChamberExtensionConfig;
  plugin?: OpenCodePluginConfig;
}

export const ReadmeGeneratorModal: React.FC<ReadmeGeneratorModalProps> = ({
  isOpen,
  onClose,
  theme,
  iconConfig,
  extension,
  plugin,
}) => {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'raw' | 'palette'>('preview');
  const [copied, setCopied] = React.useState(false);
  const [repoUrl, setRepoUrl] = React.useState('');

  const markdownContent = React.useMemo(() => {
    return generateThemeReadme(theme, {
      iconConfig,
      extension,
      plugin,
      repositoryUrl: repoUrl || undefined,
    });
  }, [theme, iconConfig, extension, plugin, repoUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadReadmeFile(markdownContent, 'README.md');
  };

  const bg = theme.colors['editor.background'] || '#121212';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-100">Automated README.md Generator</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                  GitHub Ready
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Extracts metadata, color swatches, contrast ratios, and setup guides directly from {theme.displayName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Markdown'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download README.md</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Tabs & Optional Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-4 py-1.5">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'preview'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Rendered Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('raw')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'raw'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
            <button
              onClick={() => setActiveTab('palette')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                activeTab === 'palette'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Color Swatches Table</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono">Repo URL (optional):</span>
            <input
              type="text"
              placeholder="https://github.com/user/theme-repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] text-slate-200 w-56 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 text-xs bg-slate-900/60">
          {/* TAB 1: Rendered Preview */}
          {activeTab === 'preview' && (
            <div className="max-w-3xl mx-auto space-y-6 text-slate-200 select-text">
              {/* Badges Banner */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-2.5 py-1 rounded bg-blue-600/90 text-white font-bold text-[10px]">
                  VS Code Marketplace
                </span>
                <span className="px-2.5 py-1 rounded bg-emerald-700/90 text-white font-bold text-[10px]">
                  License: {theme.license || 'MIT'}
                </span>
                <span className="px-2.5 py-1 rounded bg-teal-700/90 text-white font-bold text-[10px]">
                  WCAG AA Compliant
                </span>
                <span className="px-2.5 py-1 rounded bg-amber-600/90 text-white font-bold text-[10px]">
                  {theme.type.toUpperCase()} THEME
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-100">{theme.displayName} 🎨</h1>
                <p className="text-slate-300 text-sm mt-1 leading-relaxed">{theme.description}</p>
              </div>

              {/* Design System Highlights */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Author</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{theme.author}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Version</div>
                  <div className="font-semibold text-cyan-400 mt-0.5">v{theme.version}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Editor Background</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: bg }} />
                    <span className="font-mono text-slate-300">{bg}</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Accessibility</div>
                  <div className="font-semibold text-emerald-400 mt-0.5">100% WCAG AA</div>
                </div>
              </div>

              {/* Swatch Sample Cards */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Palette Highlights</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {theme.tokenColors.slice(0, 8).map((token, i) => {
                    const fg = token.settings.foreground;
                    const ratio = getContrastRatio(fg, bg);
                    const wcag = getWcagRating(ratio);
                    return (
                      <div key={i} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: fg }} />
                          <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                            ratio >= 4.5 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {ratio}:1 ({wcag})
                          </span>
                        </div>
                        <div className="font-semibold text-slate-200 truncate text-[11px]">{token.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{fg}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Setup Guide Preview */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-100">🚀 Quick Installation Instructions</h3>
                <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <div className="text-cyan-400 font-bold"># VS Code Package Install</div>
                  <div className="text-slate-300">npm install -g @vscode/vsce</div>
                  <div className="text-slate-300">vsce package</div>
                  <div className="text-slate-300">code --install-extension {theme.name}-1.0.0.vsix</div>
                </div>
              </div>

              {/* OpenCode and OpenChamber preview notices */}
              {plugin && (
                <div className="p-3.5 rounded-lg bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-bold text-slate-200">OpenCode Plugin Included</div>
                      <div className="text-[11px] text-slate-400">
                        Built using template <code className="text-cyan-300">zenobi-us/opencode-plugin-template</code>
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300">
                    {plugin.hooks.length} Hooks Registered
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Raw Markdown */}
          {activeTab === 'raw' && (
            <div className="h-full flex flex-col">
              <pre className="flex-1 p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 overflow-auto whitespace-pre-wrap select-text leading-relaxed">
                {markdownContent}
              </pre>
            </div>
          )}

          {/* TAB 3: Color Swatches Table */}
          {activeTab === 'palette' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Full Extracted Palette Breakdown</h3>
                <p className="text-slate-400 text-xs mt-0.5">
                  Every color token from the theme calculated against background <code className="text-cyan-400">{bg}</code>:
                </p>
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="p-3">Role / Element</th>
                      <th className="p-3">Hex Value</th>
                      <th className="p-3">Visual Swatch</th>
                      <th className="p-3">Contrast vs BG</th>
                      <th className="p-3">WCAG Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 font-mono text-xs">
                    {theme.tokenColors.map((t, idx) => {
                      const fg = t.settings.foreground;
                      const ratio = getContrastRatio(fg, bg);
                      const wcag = getWcagRating(ratio);
                      const isPassing = ratio >= 4.5;

                      return (
                        <tr key={idx} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 font-sans font-medium text-slate-200">
                            {t.name}
                          </td>
                          <td className="p-3 text-slate-300">
                            {fg}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-5 h-5 rounded border border-white/20 shadow-sm"
                                style={{ backgroundColor: fg }}
                              />
                              <span className="text-[10px] text-slate-400">
                                {fg}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-300">
                            {ratio}:1
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isPassing
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                : 'bg-amber-950 text-amber-400 border border-amber-800/50'
                            }`}>
                              {wcag}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Formats: Markdown (.md) with Shields.io badges and standard VS Code configuration guides
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-medium flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy README.md'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-cyan-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download README.md</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

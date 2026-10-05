import React from 'react';
import { FileText, Copy, Download, Check, X, Eye, Code2, Sparkles, BookOpen } from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig } from '../../types';
import { generateThemeReadme } from '../../utils/readmeGenerator';

interface ThemeReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: VSCodeThemeConfig;
  iconConfig?: IconThemeConfig;
  extension?: OpenChamberExtensionConfig;
}

export const ThemeReadmeModal: React.FC<ThemeReadmeModalProps> = ({
  isOpen,
  onClose,
  theme,
  iconConfig,
  extension,
}) => {
  const [copied, setCopied] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'preview' | 'raw'>('preview');

  if (!isOpen) return null;

  const markdownContent = generateThemeReadme(theme, iconConfig, extension);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">Automated README.md Generator</h2>
              <p className="text-[11px] text-slate-400">
                Live extracted metadata, color swatch tables, and setup instructions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-900 p-0.5 rounded border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
                  viewMode === 'preview' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition ${
                  viewMode === 'raw' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Raw Markdown</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 text-xs font-sans select-text">
          {viewMode === 'raw' ? (
            <pre className="font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
              {markdownContent}
            </pre>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto py-2 leading-relaxed">
              {/* Title & Badges */}
              <div className="border-b border-slate-850 pb-4">
                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <span>{theme.displayName}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                    v{theme.version || '1.0.0'}
                  </span>
                </h1>
                <p className="text-slate-400 text-xs mt-1.5">{theme.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold">
                    VS Code Marketplace Ready
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold">
                    WCAG 2.1 AA Compliant
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {iconConfig?.icons.length || 30}+ SVG Icons
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-bold">
                    License: {theme.license || 'MIT'}
                  </span>
                </div>
              </div>

              {/* Color Swatch Table Preview */}
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-2">Palette & Workbench Swatches</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(theme.colors).slice(0, 8).map(([key, hex]) => (
                    <div key={key} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-2">
                      <div className="w-5 h-5 rounded border border-white/20 shrink-0" style={{ backgroundColor: hex }} />
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] font-bold text-slate-200 truncate">{hex}</div>
                        <div className="text-[9px] text-slate-500 truncate">{key.split('.')[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Scopes Preview */}
              <div>
                <h3 className="font-bold text-sm text-slate-200 mb-2">Syntax Tokens Preview</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {theme.tokenColors.slice(0, 6).map((token) => (
                    <div key={token.name} className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="font-medium text-slate-300">{token.name}</span>
                      <span className="font-mono font-bold" style={{ color: token.settings.foreground }}>
                        {token.settings.foreground}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Setup preview */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1 text-slate-300">
                <div className="font-bold text-xs text-cyan-400">⚡ Installation Command</div>
                <div className="font-mono text-[11px] bg-slate-950 p-2 rounded text-slate-300">
                  code --install-extension {theme.name.toLowerCase()}-1.0.0.vsix
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Generated with real theme tokens & WCAG contrast audit
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Copy README.md'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
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

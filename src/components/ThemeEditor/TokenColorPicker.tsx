import React from 'react';
import { VSCodeThemeConfig } from '../../types';
import { getContrastRatio, getWcagRating } from '../../utils/colorUtils';
import { Bold, Italic, Check, AlertTriangle } from 'lucide-react';

interface TokenColorPickerProps {
  theme: VSCodeThemeConfig;
  onTokenChange: (index: number, foreground: string, fontStyle?: string) => void;
}

export const TokenColorPicker: React.FC<TokenColorPickerProps> = ({
  theme,
  onTokenChange,
}) => {
  const editorBg = theme.colors['editor.background'] || '#1e1e1e';

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800 text-xs select-none">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="font-semibold text-slate-200">Syntax Tokens</div>
          <div className="text-[10px] text-slate-400">TextMate Scopes & Highlighting</div>
        </div>
        <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Bg: <span className="text-cyan-400">{editorBg}</span>
        </div>
      </div>

      {/* Token List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {theme.tokenColors.map((token, index) => {
          const fg = token.settings.foreground;
          const ratio = getContrastRatio(fg, editorBg);
          const rating = getWcagRating(ratio);
          const isItalic = token.settings.fontStyle?.includes('italic');
          const isBold = token.settings.fontStyle?.includes('bold');

          return (
            <div
              key={token.name}
              className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition flex flex-col gap-2"
            >
              {/* Token Name and WCAG score */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-200">{token.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${rating.badgeClass}`}>
                  {ratio.toFixed(1)}:1 {rating.scoreText}
                </span>
              </div>

              {/* Scopes info */}
              <div className="text-[10px] text-slate-500 font-mono truncate" title={Array.isArray(token.scope) ? token.scope.join(', ') : token.scope}>
                {Array.isArray(token.scope) ? token.scope.join(', ') : token.scope}
              </div>

              {/* Controls row */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                {/* Font Style Toggles */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const newStyle = isBold ? (isItalic ? 'italic' : '') : isItalic ? 'bold italic' : 'bold';
                      onTokenChange(index, fg, newStyle);
                    }}
                    className={`p-1 rounded text-[11px] transition ${
                      isBold
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const newStyle = isItalic ? (isBold ? 'bold' : '') : isBold ? 'bold italic' : 'italic';
                      onTokenChange(index, fg, newStyle);
                    }}
                    className={`p-1 rounded text-[11px] transition ${
                      isItalic
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60 italic'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Toggle Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color input */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex items-center">
                    <input
                      type="color"
                      value={fg.startsWith('#') ? fg : '#ffffff'}
                      onChange={(e) => onTokenChange(index, e.target.value, token.settings.fontStyle)}
                      className="w-6 h-6 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                      title="Pick token color"
                    />
                    <div
                      className="w-6 h-6 rounded border border-slate-700 shadow-inner"
                      style={{ backgroundColor: fg }}
                    />
                  </div>

                  <input
                    type="text"
                    value={fg}
                    onChange={(e) => onTokenChange(index, e.target.value, token.settings.fontStyle)}
                    className="w-18 bg-slate-900 border border-slate-800 rounded px-1.5 py-0.5 text-[11px] font-mono text-slate-300 uppercase focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

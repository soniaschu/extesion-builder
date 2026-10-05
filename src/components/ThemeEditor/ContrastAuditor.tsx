import React from 'react';
import { VSCodeThemeConfig } from '../../types';
import { getContrastRatio, getWcagRating, adjustBrightness } from '../../utils/colorUtils';
import { ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

interface ContrastAuditorProps {
  theme: VSCodeThemeConfig;
  onAutoFixContrast: () => void;
}

export const ContrastAuditor: React.FC<ContrastAuditorProps> = ({
  theme,
  onAutoFixContrast,
}) => {
  const editorBg = theme.colors['editor.background'] || '#1e1e1e';

  let totalTokens = theme.tokenColors.length;
  let aaPassCount = 0;
  let aaaPassCount = 0;
  const issues: { name: string; ratio: number; fg: string }[] = [];

  theme.tokenColors.forEach((token) => {
    const ratio = getContrastRatio(token.settings.foreground, editorBg);
    if (ratio >= 4.5) aaPassCount++;
    if (ratio >= 7.0) aaaPassCount++;
    if (ratio < 4.5) {
      issues.push({ name: token.name, ratio, fg: token.settings.foreground });
    }
  });

  const passPercentage = Math.round((aaPassCount / totalTokens) * 100);

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">WCAG Accessibility Audit</span>
        </div>
        <span
          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
            passPercentage >= 90
              ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
              : 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
          }`}
        >
          {passPercentage}% Compliant
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            passPercentage >= 90 ? 'bg-emerald-500' : passPercentage >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
          style={{ width: `${passPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
        <div>WCAG AA (4.5:1): <strong className="text-slate-200">{aaPassCount}/{totalTokens}</strong></div>
        <div>WCAG AAA (7.0:1): <strong className="text-slate-200">{aaaPassCount}/{totalTokens}</strong></div>
      </div>

      {issues.length > 0 ? (
        <div className="mt-1 pt-2 border-t border-slate-800 flex flex-col gap-2">
          <div className="flex items-center justify-between text-amber-400 text-[11px]">
            <span className="flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {issues.length} tokens need higher contrast
            </span>
            <button
              onClick={onAutoFixContrast}
              className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition text-[10px] font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              Auto-Boost Contrast
            </button>
          </div>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {issues.map((issue) => (
              <div key={issue.name} className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-950/40 px-2 py-1 rounded">
                <span>{issue.name}</span>
                <span className="font-mono text-rose-400">{issue.ratio.toFixed(2)}:1</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pt-1 border-t border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          All syntax tokens satisfy WCAG AA contrast standards!
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { GitBranch, AlertCircle, CheckCircle2, Bell, Radio } from 'lucide-react';

interface StatusBarProps {
  bg: string;
  fg: string;
  language: string;
  lineCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  bg,
  fg,
  language,
  lineCount,
}) => {
  return (
    <footer
      className="h-6 flex items-center justify-between px-3 text-[11px] select-none shrink-0 font-sans border-t border-black/10"
      style={{ backgroundColor: bg, color: fg }}
    >
      {/* Left items */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
          <GitBranch className="w-3 h-3" />
          <span>main*</span>
        </div>

        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
          <span className="flex items-center gap-0.5">
            <AlertCircle className="w-3 h-3 text-amber-400" />
            <span>0</span>
          </span>
          <span className="flex items-center gap-0.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>0</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 opacity-70">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>OpenChamber SDK Active</span>
        </div>
      </div>

      {/* Right items */}
      <div className="flex items-center gap-3">
        <span>Ln 14, Col 28</span>
        <span className="hidden md:inline">Spaces: 2</span>
        <span className="hidden sm:inline">UTF-8</span>
        <span className="capitalize font-medium">{language}</span>
        <Bell className="w-3 h-3 cursor-pointer hover:opacity-80" />
      </div>
    </footer>
  );
};

import React from 'react';
import { 
  Files, 
  Search, 
  GitPullRequest, 
  Play, 
  Blocks, 
  Settings, 
  X, 
  Terminal as TerminalIcon,
  ChevronRight,
  Maximize2,
  Minimize2,
  Columns,
  Layers,
  Sparkles
} from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig } from '../../types';
import { CODE_SAMPLES, CodeSample } from '../../data/sampleCode';
import { FileTree } from './FileTree';
import { StatusBar } from './StatusBar';

interface VSCodeEditorProps {
  theme: VSCodeThemeConfig;
  iconConfig: IconThemeConfig;
  onOpenOpenChamber?: () => void;
}

export const VSCodeEditor: React.FC<VSCodeEditorProps> = ({
  theme,
  iconConfig,
  onOpenOpenChamber,
}) => {
  const [activeFileId, setActiveFileId] = React.useState<string>('typescript');
  const [openTabs, setOpenTabs] = React.useState<string[]>(['typescript', 'python', 'json']);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showTerminal, setShowTerminal] = React.useState(false);
  const [activeActivityItem, setActiveActivityItem] = React.useState<'files' | 'search' | 'git' | 'openchamber'>('files');

  const currentSample = CODE_SAMPLES.find((s) => s.id === activeFileId) || CODE_SAMPLES[0];

  const handleSelectFile = (fileId: string) => {
    setActiveFileId(fileId);
    if (!openTabs.includes(fileId)) {
      setOpenTabs([...openTabs, fileId]);
    }
  };

  const handleCloseTab = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = openTabs.filter((id) => id !== fileId);
    setOpenTabs(remaining);
    if (activeFileId === fileId && remaining.length > 0) {
      setActiveFileId(remaining[remaining.length - 1]);
    }
  };

  // Helper to get token color
  const getTokenStyle = (category: string) => {
    const match = theme.tokenColors.find((t) => {
      const scopes = Array.isArray(t.scope) ? t.scope : [t.scope];
      return scopes.some((s) => s.toLowerCase().includes(category.toLowerCase()));
    });
    return {
      color: match?.settings.foreground || theme.colors['editor.foreground'] || '#e2e8f0',
      fontStyle: match?.settings.fontStyle?.includes('italic') ? 'italic' : 'normal',
      fontWeight: match?.settings.fontStyle?.includes('bold') ? 'bold' : 'normal',
    };
  };

  const cKeyword = getTokenStyle('keyword');
  const cFunction = getTokenStyle('function');
  const cString = getTokenStyle('string');
  const cComment = getTokenStyle('comment');
  const cNumber = getTokenStyle('numeric');
  const cType = getTokenStyle('type');
  const cConstant = getTokenStyle('constant');
  const cVariable = getTokenStyle('variable');
  const cOperator = getTokenStyle('operator');
  const cTag = getTokenStyle('tag');

  // Realistic tokenized code renderer
  const renderHighlightedLine = (line: string, lineIndex: number) => {
    if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
      return <span style={cComment}>{line}</span>;
    }

    // Split line into tokens using regex
    const tokens = line.split(/(\b(?:import|export|class|const|let|var|function|return|private|readonly|constructor|public|async|await|def|from|self|struct|impl|pub|fn|use|true|false)\b|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b\d+\b|[{}()[\];,]|(?:\b[A-Z][a-zA-Z0-9_]*\b)|[=><+*-]+)/g);

    return tokens.map((part, i) => {
      if (!part) return null;

      // Keywords
      if (/^(import|export|class|const|let|var|function|return|private|readonly|constructor|public|async|await|def|from|self|struct|impl|pub|fn|use)$/.test(part)) {
        return <span key={i} style={cKeyword}>{part}</span>;
      }

      // Booleans
      if (/^(true|false|None|null|undefined)$/.test(part)) {
        return <span key={i} style={cConstant}>{part}</span>;
      }

      // Strings
      if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'")) || (part.startsWith('`') && part.endsWith('`'))) {
        return <span key={i} style={cString}>{part}</span>;
      }

      // Numbers
      if (/^\d+$/.test(part)) {
        return <span key={i} style={cNumber}>{part}</span>;
      }

      // Types / Classes (starts with Capital)
      if (/^[A-Z][a-zA-Z0-9_]*$/.test(part)) {
        return <span key={i} style={cType}>{part}</span>;
      }

      // Operators
      if (/^[=><+*-]+$/.test(part)) {
        return <span key={i} style={cOperator}>{part}</span>;
      }

      return <span key={i} style={{ color: theme.colors['editor.foreground'] || '#e2e8f0' }}>{part}</span>;
    });
  };

  const lines = currentSample.code.split('\n');

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden font-sans select-none border border-slate-800 rounded-xl shadow-2xl">
      {/* Title Bar */}
      <div
        className="h-9 px-3 flex items-center justify-between text-xs border-b border-black/20 shrink-0"
        style={{
          backgroundColor: theme.colors['titleBar.activeBackground'] || '#181824',
          color: theme.colors['titleBar.activeForeground'] || '#94a3b8',
        }}
      >
        {/* Window controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:bg-rose-500 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-500 cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 cursor-pointer" />
          </div>
          <span className="ml-2 font-mono text-[11px] opacity-75 hidden sm:inline">
            chambercraft-workspace — {theme.displayName}
          </span>
        </div>

        {/* Center Search / Command Palette preview */}
        <div className="flex-1 max-w-sm mx-4">
          <div className="w-full bg-black/20 border border-white/10 rounded-md px-3 py-1 text-[11px] text-center flex items-center justify-center gap-2 text-slate-400 cursor-pointer hover:bg-black/30 transition">
            <Search className="w-3 h-3" />
            <span>ChamberCraft: Quick Open (Ctrl+P / ⌘P)</span>
          </div>
        </div>

        {/* Right window actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`p-1 rounded hover:bg-white/10 transition ${showTerminal ? 'text-cyan-400' : 'opacity-70'}`}
            title="Toggle Integrated Terminal"
          >
            <TerminalIcon className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-1 rounded hover:bg-white/10 transition ${showSidebar ? 'text-cyan-400' : 'opacity-70'}`}
            title="Toggle Sidebar"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Studio Body (Activity Bar + Sidebar + Editor) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div
          className="w-12 flex flex-col items-center py-2 justify-between shrink-0 border-r border-black/20"
          style={{
            backgroundColor: theme.colors['activityBar.background'] || '#12121a',
            color: theme.colors['activityBar.foreground'] || '#00f0ff',
          }}
        >
          {/* Top Activity Icons */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Explorer */}
            <button
              onClick={() => {
                setActiveActivityItem('files');
                setShowSidebar(true);
              }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition relative ${
                activeActivityItem === 'files'
                  ? 'text-cyan-400 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Explorer"
            >
              <Files className="w-5 h-5" />
            </button>

            {/* Search */}
            <button
              onClick={() => setActiveActivityItem('search')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                activeActivityItem === 'search' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Source Control with Badge */}
            <div className="relative">
              <button
                onClick={() => setActiveActivityItem('git')}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                  activeActivityItem === 'git' ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Source Control"
              >
                <GitPullRequest className="w-5 h-5" />
              </button>
              <span
                className="absolute top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-bold font-mono"
                style={{
                  backgroundColor: theme.colors['activityBarBadge.background'] || '#ff0055',
                  color: theme.colors['activityBarBadge.foreground'] || '#ffffff',
                }}
              >
                3
              </span>
            </div>

            {/* OpenChamber Extension Shortcut */}
            <button
              onClick={onOpenOpenChamber}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 transition relative group"
              title="OpenChamber Extension SDK (Click to open panel builder)"
            >
              <Layers className="w-5 h-5 animate-pulse" />
              <div className="absolute left-12 bg-slate-900 border border-slate-700 text-emerald-300 text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition z-50">
                OpenChamber SDK Panel
              </div>
            </button>
          </div>

          {/* Bottom Settings Icon */}
          <div className="flex flex-col items-center gap-2">
            <button className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 transition">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar (Explorer) */}
        {showSidebar && (
          <div
            className="w-56 shrink-0 border-r border-black/20 flex flex-col"
            style={{
              backgroundColor: theme.colors['sideBar.background'] || '#161622',
              color: theme.colors['sideBar.foreground'] || '#94a3b8',
            }}
          >
            <FileTree
              activeFileId={activeFileId}
              onSelectFile={handleSelectFile}
              iconConfig={iconConfig}
              sidebarBg={theme.colors['sideBar.background']}
              sidebarFg={theme.colors['sideBar.foreground']}
              listSelectionBg={theme.colors['list.activeSelectionBackground']}
              listSelectionFg={theme.colors['list.activeSelectionForeground']}
            />
          </div>
        )}

        {/* Editor Area */}
        <div
          className="flex-1 flex flex-col overflow-hidden"
          style={{
            backgroundColor: theme.colors['editor.background'] || '#101018',
          }}
        >
          {/* Tabs Bar */}
          <div
            className="h-9 flex items-center overflow-x-auto no-scrollbar border-b border-black/20"
            style={{
              backgroundColor: theme.colors['editorGroupHeader.tabsBackground'] || '#12121a',
            }}
          >
            {openTabs.map((tabId) => {
              const sample = CODE_SAMPLES.find((s) => s.id === tabId);
              if (!sample) return null;
              const isActive = tabId === activeFileId;

              return (
                <div
                  key={tabId}
                  onClick={() => setActiveFileId(tabId)}
                  className={`h-full flex items-center gap-2 px-3 border-r border-black/20 text-xs cursor-pointer transition select-none group ${
                    isActive ? 'font-medium' : 'opacity-70 hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? theme.colors['tab.activeBackground'] || '#1a1a24'
                      : theme.colors['tab.inactiveBackground'] || '#12121a',
                    color: isActive
                      ? theme.colors['tab.activeForeground'] || '#ffffff'
                      : theme.colors['tab.inactiveForeground'] || '#64748b',
                    borderTop: isActive ? `2px solid ${theme.colors['focusBorder'] || '#00f0ff'}` : '2px solid transparent',
                  }}
                >
                  <span className="font-mono text-[11px] uppercase opacity-80">{sample.language}</span>
                  <span className="truncate max-w-[120px]">{sample.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(tabId, e)}
                    className="p-0.5 rounded hover:bg-white/10 opacity-40 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs Bar */}
          <div className="px-4 py-1 flex items-center gap-1.5 text-[11px] text-slate-500 border-b border-white/5 font-mono select-none">
            <span>workspace</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span>src</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-slate-300">{currentSample.name}</span>
          </div>

          {/* Code Canvas */}
          <div
            className="flex-1 overflow-auto p-3 font-mono text-[13px] leading-6 select-text"
            style={{
              backgroundColor: theme.colors['editor.background'] || '#101018',
              color: theme.colors['editor.foreground'] || '#e2e8f0',
            }}
          >
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = lineNum === 14;

              return (
                <div
                  key={idx}
                  className="flex items-center hover:bg-white/[0.02] rounded px-1 transition-colors"
                  style={{
                    backgroundColor: isCurrentLine
                      ? theme.colors['editor.lineHighlightBackground'] || 'rgba(255,255,255,0.05)'
                      : 'transparent',
                  }}
                >
                  {/* Line Number */}
                  <span
                    className="w-10 shrink-0 text-right pr-4 select-none text-[12px]"
                    style={{
                      color: isCurrentLine
                        ? theme.colors['editorLineNumber.activeForeground'] || '#00f0ff'
                        : theme.colors['editorLineNumber.foreground'] || '#475569',
                    }}
                  >
                    {lineNum}
                  </span>

                  {/* Line Content with Token Highlighting */}
                  <span className="whitespace-pre">
                    {renderHighlightedLine(line, idx)}
                    {isCurrentLine && (
                      <span
                        className="inline-block w-2 h-4 align-middle ml-0.5 animate-pulse"
                        style={{ backgroundColor: theme.colors['editorCursor.foreground'] || '#00f0ff' }}
                      />
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Collapsible Integrated Terminal */}
          {showTerminal && (
            <div
              className="h-44 border-t border-black/20 flex flex-col text-xs font-mono"
              style={{
                backgroundColor: theme.colors['terminal.background'] || '#0a0c10',
                color: theme.colors['terminal.foreground'] || '#e2e8f0',
              }}
            >
              <div className="px-3 py-1.5 border-b border-white/10 flex items-center justify-between text-[11px] opacity-80">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-cyan-400">TERMINAL: bash</span>
                  <span className="text-slate-500">node v22.14.0</span>
                </div>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-1 text-[12px] leading-5">
                <div className="text-slate-400">$ vsce package</div>
                <div className="text-emerald-400">DONE Packaged: {theme.name}-1.0.0.vsix (2 files, 14.2 KB)</div>
                <div className="text-slate-400">$ openchamber dev --extension .</div>
                <div className="text-cyan-400">[OpenChamber] Loaded SDK Guest panel into right rail!</div>
                <div className="text-slate-400">$ npm run lint</div>
                <div className="text-emerald-400">✓ 0 errors, 0 warnings. WCAG AA compliance verified.</div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="text-cyan-400">developer@chambercraft:~/project$</span>
                  <span className="w-2 h-4 bg-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        bg={theme.colors['statusBar.background'] || '#0d0e14'}
        fg={theme.colors['statusBar.foreground'] || '#94a3b8'}
        language={currentSample.language}
        lineCount={lines.length}
      />
    </div>
  );
};

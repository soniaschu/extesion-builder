import React from 'react';
import { 
  OpenCodePluginConfig, 
  VSCodeThemeConfig 
} from '../../types';
import { OPENCODE_PLUGIN_TEMPLATES } from '../../data/opencodePluginTemplates';
import { downloadOpenCodePluginZip } from '../../utils/zipExporter';
import { 
  Terminal, 
  Play, 
  ShieldAlert, 
  CheckCircle2, 
  FileCode, 
  Download, 
  RotateCcw, 
  ExternalLink, 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Layers, 
  Bug,
  AlertTriangle,
  ArrowRight,
  GitCommit
} from 'lucide-react';

interface OpenCodeWorkspaceProps {
  plugin: OpenCodePluginConfig;
  theme: VSCodeThemeConfig;
  onUpdatePlugin: (updated: Partial<OpenCodePluginConfig>) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const OpenCodeWorkspace: React.FC<OpenCodeWorkspaceProps> = ({
  plugin,
  theme,
  onUpdatePlugin,
  onSelectTemplate,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<keyof OpenCodePluginConfig['files']>('indexTs');
  const [activeTab, setActiveTab] = React.useState<'editor' | 'runner'>('editor');
  const [copiedFile, setCopiedFile] = React.useState(false);
  
  // Interactive test terminal state
  const [simulatedCommand, setSimulatedCommand] = React.useState('run_command: rm -rf /');
  const [terminalLogs, setTerminalLogs] = React.useState<Array<{
    timestamp: string;
    type: 'info' | 'warn' | 'error' | 'success';
    message: string;
    hook?: string;
  }>>([
    {
      timestamp: '14:20:01',
      type: 'info',
      message: `OpenCode CLI started with plugin: ${plugin.name} (v${plugin.version})`,
    },
    {
      timestamp: '14:20:02',
      type: 'success',
      message: `Registered hooks: [${plugin.hooks.join(', ')}]`,
    },
    {
      timestamp: '14:20:03',
      type: 'info',
      message: `Template provenance: https://github.com/zenobi-us/opencode-plugin-template`,
    },
  ]);

  const [isRunningTest, setIsRunningTest] = React.useState(false);

  const handleCopyCurrentFile = () => {
    const content = plugin.files[selectedFile];
    navigator.clipboard.writeText(content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleExecuteSimulatedHook = (testCase: 'dangerous_rm' | 'safe_test' | 'secret_env' | 'custom_tool') => {
    setIsRunningTest(true);
    const now = new Date().toLocaleTimeString();

    if (testCase === 'dangerous_rm') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: now,
          type: 'info',
          message: `[Event] Dispatched tool.execute.before for: run_command { command: "rm -rf /tmp/data && rm -rf /" }`,
          hook: 'tool.execute.before',
        },
        {
          timestamp: now,
          type: 'error',
          message: `⛔ [SECURITY INTERCEPTED] Policy Guard prevented execution of prohibited destructive command: "rm -rf /"`,
          hook: 'tool.execute.before',
        },
      ]);
    } else if (testCase === 'safe_test') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: now,
          type: 'info',
          message: `[Event] Dispatched tool.execute.before for: run_command { command: "bun test" }`,
          hook: 'tool.execute.before',
        },
        {
          timestamp: now,
          type: 'success',
          message: `✓ [Guard Passed] Command approved in 12ms. Execution proceeded without errors.`,
          hook: 'tool.execute.after',
        },
      ]);
    } else if (testCase === 'secret_env') {
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: now,
          type: 'warn',
          message: `⚠️ [AUDIT WARNING] Attempting to write sensitive keys to '.env.production'. Flagged for user approval.`,
          hook: 'tool.execute.before',
        },
      ]);
    } else if (testCase === 'custom_tool') {
      const toolName = plugin.tools?.[0]?.name || 'custom_tool';
      setTerminalLogs((prev) => [
        ...prev,
        {
          timestamp: now,
          type: 'info',
          message: `[OpenCode LLM] Invoked plugin tool: '${toolName}'`,
        },
        {
          timestamp: now,
          type: 'success',
          message: `✓ Tool '${toolName}' executed successfully in 45ms: { status: "clean", violationsFound: 0 }`,
        },
      ]);
    }

    setTimeout(() => setIsRunningTest(false), 300);
  };

  const handleClearLogs = () => {
    setTerminalLogs([
      {
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: `Logs cleared. Terminal ready for OpenCode test events.`,
      },
    ]);
  };

  // Sync theme palette colors into plugin
  const handleAdoptThemeColors = () => {
    const bg = theme.colors['editor.background'] || '#0f172a';
    const fg = theme.colors['editor.foreground'] || '#f8fafc';
    const accent = theme.colors['focusBorder'] || '#38bdf8';

    const updatedCustomTool = plugin.files.customToolTs.replace(
      /accentColor:\s*'[^']+'/,
      `accentColor: '${accent}'`
    ).replace(
      /background:\s*'[^']+'/,
      `background: '${bg}'`
    ).replace(
      /foreground:\s*'[^']+'/,
      `foreground: '${fg}'`
    );

    onUpdatePlugin({
      files: {
        ...plugin.files,
        customToolTs: updatedCustomTool,
      },
    });

    setTerminalLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        type: 'success',
        message: `🎨 Synchronized VS Code theme (${theme.displayName}) into OpenCode plugin tool variables!`,
      },
    ]);
  };

  const fileLabels: Record<keyof OpenCodePluginConfig['files'], string> = {
    indexTs: 'src/index.ts (Main Hook)',
    customToolTs: 'src/tools/customTool.ts',
    packageJson: 'package.json (Manifest)',
    testTs: 'tests/index.test.ts',
    tsconfigJson: 'tsconfig.json',
    readmeMd: 'README.md',
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden h-full">
      {/* Left Column: Template Chooser & File Tree */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Template Header */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">OpenCode Plugin Studio</div>
              <div className="text-[10px] text-slate-400">Template: zenobi-us/opencode-plugin-template</div>
            </div>
          </div>
          <a
            href="https://github.com/zenobi-us/opencode-plugin-template"
            target="_blank"
            rel="noreferrer"
            className="p-1 text-slate-400 hover:text-cyan-400 transition"
            title="View Official Template Repository"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Template Selector List */}
        <div className="p-2 border-b border-slate-800 bg-slate-950/60 space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold px-1">
            Choose Plugin Architecture:
          </div>
          <div className="space-y-1">
            {Object.values(OPENCODE_PLUGIN_TEMPLATES).map((tmpl) => {
              const isSelected = plugin.id === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onSelectTemplate(tmpl.id)}
                  className={`w-full p-2 rounded-lg text-left transition flex items-center justify-between border ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold truncate">{tmpl.title}</div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">
                      {tmpl.hooks.join(', ')}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* File Switcher Tabs */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-950/30">
          <div className="text-[10px] font-mono uppercase text-slate-500 font-bold px-1 mb-1">
            Plugin Source Files:
          </div>
          {(Object.keys(fileLabels) as Array<keyof OpenCodePluginConfig['files']>).map((fKey) => {
            const isActive = selectedFile === fKey;
            return (
              <button
                key={fKey}
                onClick={() => setSelectedFile(fKey)}
                className={`w-full p-2 rounded-lg text-left text-xs transition flex items-center gap-2 border ${
                  isActive
                    ? 'bg-slate-800 border-cyan-500/60 text-cyan-300 font-semibold'
                    : 'bg-slate-950/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate text-[11px]">{fileLabels[fKey]}</span>
              </button>
            );
          })}
        </div>

        {/* Theme Sync Quick Action */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 space-y-2">
          <button
            onClick={handleAdoptThemeColors}
            className="w-full py-1.5 px-2.5 rounded-lg bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-800/60 text-indigo-300 transition text-[11px] font-semibold flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Adopt VS Code Theme Colors</span>
          </button>
          <button
            onClick={() => downloadOpenCodePluginZip(plugin)}
            className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-950/50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Plugin ZIP</span>
          </button>
        </div>
      </div>

      {/* Right Column: Code Editor & Interactive Test Terminal */}
      <div className="flex-1 flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Top Control Bar */}
        <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-300 font-bold">
              {fileLabels[selectedFile]}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-800/50">
              Bun / TypeScript
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCurrentFile}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-xs flex items-center gap-1.5"
            >
              {copiedFile ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedFile ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={() => setActiveTab(activeTab === 'editor' ? 'runner' : 'editor')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'runner'
                  ? 'bg-emerald-600 text-slate-950'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{activeTab === 'runner' ? 'Show Code Editor' : 'Open Test Console'}</span>
            </button>
          </div>
        </div>

        {/* Workspace Body: Split or Tabs */}
        {activeTab === 'editor' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Code Textarea / Viewer */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">
              <textarea
                value={plugin.files[selectedFile]}
                onChange={(e) => {
                  onUpdatePlugin({
                    files: {
                      ...plugin.files,
                      [selectedFile]: e.target.value,
                    },
                  });
                }}
                className="w-full h-full p-4 bg-transparent text-slate-200 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Quick Interactive Mini-Test Bar */}
            <div className="p-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px]">Interactive Hook Verification:</span>
                <button
                  onClick={() => handleExecuteSimulatedHook('dangerous_rm')}
                  className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-[11px] font-semibold transition"
                >
                  Trigger "rm -rf /" (Test Guard)
                </button>
                <button
                  onClick={() => handleExecuteSimulatedHook('safe_test')}
                  className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold transition"
                >
                  Run "bun test" (Pass)
                </button>
              </div>

              <button
                onClick={() => setActiveTab('runner')}
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>View Full Test Terminal</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          /* Live Terminal / Agent Runner Simulator */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 font-mono text-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-200">OpenCode Runtime Simulator</span>
                <span className="text-slate-500">(@opencode-ai/plugin mock host)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearLogs}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Test Trigger Panel */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[11px] text-slate-400 font-sans">
                Simulate events dispatched by OpenCode agent sessions:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleExecuteSimulatedHook('dangerous_rm')}
                  className="px-3 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 transition flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Test Destructive Command Hook</span>
                </button>
                <button
                  onClick={() => handleExecuteSimulatedHook('safe_test')}
                  className="px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>Test Normal Command Hook</span>
                </button>
                <button
                  onClick={() => handleExecuteSimulatedHook('secret_env')}
                  className="px-3 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900 transition flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Test Secret File Interceptor</span>
                </button>
                <button
                  onClick={() => handleExecuteSimulatedHook('custom_tool')}
                  className="px-3 py-1 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 hover:bg-indigo-900 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Test Registered Tool</span>
                </button>
              </div>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg p-3 overflow-y-auto space-y-1.5">
              {terminalLogs.map((log, index) => {
                let color = 'text-slate-300';
                if (log.type === 'error') color = 'text-rose-400 font-bold';
                if (log.type === 'warn') color = 'text-amber-300';
                if (log.type === 'success') color = 'text-emerald-400';

                return (
                  <div key={index} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                    {log.hook && (
                      <span className="px-1 py-0.2 rounded bg-slate-900 text-indigo-400 border border-slate-800 text-[10px] shrink-0">
                        {log.hook}
                      </span>
                    )}
                    <span className={`${color} whitespace-pre-wrap break-all`}>
                      {log.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

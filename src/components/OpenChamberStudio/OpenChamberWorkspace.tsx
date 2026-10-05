import React from 'react';
import { 
  OpenChamberExtensionConfig, 
  OpenChamberSession, 
  OpenChamberChatMessage, 
  OpenChamberTask,
  VSCodeThemeConfig 
} from '../../types';
import { 
  Bot, 
  User, 
  Send, 
  ChevronRight, 
  Terminal, 
  GitBranch, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  X,
  ExternalLink,
  Layers,
  FileCode,
  Bell
} from 'lucide-react';

interface OpenChamberWorkspaceProps {
  extension: OpenChamberExtensionConfig;
  theme: VSCodeThemeConfig;
}

export const OpenChamberWorkspace: React.FC<OpenChamberWorkspaceProps> = ({
  extension,
  theme,
}) => {
  const [panelOpen, setPanelOpen] = React.useState(true);
  const [chatInput, setChatInput] = React.useState('');
  const [notification, setNotification] = React.useState<{ message: string; type: string } | null>(null);

  // Active OpenChamber session state
  const [session, setSession] = React.useState<OpenChamberSession>({
    id: 'ses_984f12',
    title: 'Agentic Dev Session',
    model: 'gemini-3.8-flash',
    branch: 'feat/openchamber-sdk',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Add an automated test suite and review all exports in src/services/auth.ts.',
        timestamp: '10:42 AM',
      },
      {
        id: '2',
        role: 'assistant',
        content: "I have examined `src/services/auth.ts` and identified 4 test cases covering token expiration, RSA signature verification, and RBAC role resolution. Here are the diffs generated for the suite.",
        timestamp: '10:43 AM',
        toolCall: {
          tool: 'write_to_file',
          args: { path: 'tests/auth.test.ts', lines: 112 },
        },
      },
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Run TypeScript compiler check',
        description: 'Verify no type regression in auth services',
        status: 'completed',
        timestamp: '10:44 AM',
      },
      {
        id: 'task-2',
        title: 'Execute test runner',
        description: 'npm test -- auth.test.ts',
        status: 'running',
        timestamp: '10:45 AM',
      },
    ],
    modifiedFiles: [
      { path: 'src/services/auth.ts', status: 'modified', linesAdded: 45, linesRemoved: 12 },
      { path: 'tests/auth.test.ts', status: 'added', linesAdded: 112, linesRemoved: 0 },
    ],
  });

  const showNotification = (message: string, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    const userMsg: OpenChamberChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsg: OpenChamberChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Received instruction from OpenChamber panel: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}". Executing agentic workflow...`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg, aiMsg],
    }));

    setChatInput('');
  };

  const handleAttachTask = (taskData: { title: string; description?: string }) => {
    const newTask: OpenChamberTask = {
      id: `task-${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      status: 'pending',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSession((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
    }));

    showNotification(`Attached task: ${taskData.title}`, 'success');
  };

  // Simulated extension guest sandbox inside an iframe with postMessage bridge
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Send host state to iframe
  const syncHostState = React.useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage(
      {
        type: 'OPENCHAMBER_HOST_SYNC',
        session: {
          id: session.id,
          title: session.title,
          model: session.model,
          branch: session.branch,
        },
        files: session.modifiedFiles,
        theme: {
          bg: theme.colors['editor.background'] || '#11141c',
          text: theme.colors['editor.foreground'] || '#e2e8f0',
          accent: theme.colors['focusBorder'] || '#38bdf8',
        },
      },
      '*'
    );
  }, [session, theme]);

  // Listen to postMessage from the extension iframe
  React.useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'OPENCHAMBER_SEND_PROMPT') {
        handleSendPrompt(data.prompt);
      } else if (data.type === 'OPENCHAMBER_INSERT_PROMPT') {
        setChatInput(data.prompt);
        showNotification('Prompt inserted into chat input', 'info');
      } else if (data.type === 'OPENCHAMBER_ATTACH_TASK') {
        handleAttachTask(data.task);
      } else if (data.type === 'OPENCHAMBER_SHOW_NOTIFICATION') {
        showNotification(data.message, data.notificationType || 'info');
      } else if (data.type === 'OPENCHAMBER_READY') {
        syncHostState();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [syncHostState]);

  // Build the sandboxed HTML bundle with the @openchamber/sdk simulator shim
  const sandboxedHtml = React.useMemo(() => {
    const shimJs = `
      // Mock OpenChamber Guest SDK Bridge
      window.__openchamber_host = {
        async getProject() {
          return { name: 'demo-workspace', rootPath: '/workspace' };
        },
        async getSession() {
          return window.__current_session || { id: 'ses_preview', title: 'OpenChamber Session', model: 'OpenCode' };
        },
        async sendPrompt(prompt) {
          window.parent.postMessage({ type: 'OPENCHAMBER_SEND_PROMPT', prompt }, '*');
        },
        async insertPrompt(prompt) {
          window.parent.postMessage({ type: 'OPENCHAMBER_INSERT_PROMPT', prompt }, '*');
        },
        async attachTask(task) {
          window.parent.postMessage({ type: 'OPENCHAMBER_ATTACH_TASK', task }, '*');
        },
        async showNotification({ message, type }) {
          window.parent.postMessage({ type: 'OPENCHAMBER_SHOW_NOTIFICATION', message, notificationType: type }, '*');
        },
        async getFiles() {
          return window.__current_files || [];
        },
        onThemeChange(cb) {
          window.__theme_listeners = window.__theme_listeners || [];
          window.__theme_listeners.push(cb);
          return () => {
            window.__theme_listeners = window.__theme_listeners.filter(l => l !== cb);
          };
        }
      };

      window.addEventListener('message', (e) => {
        if (e.data?.type === 'OPENCHAMBER_HOST_SYNC') {
          window.__current_session = e.data.session;
          window.__current_files = e.data.files;
          if (window.__theme_listeners) {
            window.__theme_listeners.forEach(cb => cb(e.data.theme));
          }
        }
      });

      // Signal ready
      window.parent.postMessage({ type: 'OPENCHAMBER_READY' }, '*');
    `;

    // Process user JS to redirect import { connectHost } from '@openchamber/sdk' to the shim
    const processedJs = extension.js
      .replace(/import\s*\{[^}]*\}\s*from\s*['"]@openchamber\/sdk['"];?/g, '')
      .replace(/const\s+host\s*=\s*await\s+connectHost\(\);?/g, 'const host = window.__openchamber_host;')
      .replace(/connectHost\(\)/g, 'Promise.resolve(window.__openchamber_host)');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    :root {
      --chamber-bg: ${theme.colors['editor.background'] || '#11141c'};
      --chamber-text: ${theme.colors['editor.foreground'] || '#e2e8f0'};
      --chamber-accent: ${theme.colors['focusBorder'] || '#38bdf8'};
      --chamber-border: #1e2638;
      --chamber-surface: #192030;
      --chamber-card-bg: #141a27;
      --chamber-input-bg: #121722;
    }
    ${extension.css}
  </style>
  <script>${shimJs}</script>
</head>
<body>
  ${extension.html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/i, '').replace(/<\/body>[\s\S]*?<\/html>/i, '')}
  <script type="module">
    ${processedJs}
  </script>
</body>
</html>`;
  }, [extension, theme]);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden font-sans border border-slate-800 rounded-xl shadow-2xl relative select-none">
      {/* Toast Notification Container */}
      {notification && (
        <div className="absolute top-12 right-16 z-50 bg-slate-900 border border-slate-700 text-slate-100 text-xs px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <Bell className="w-3.5 h-3.5 text-cyan-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top OpenChamber Header */}
      <div className="h-10 px-4 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 tracking-tight">OpenChamber</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              Agentic IDE
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Active Session & Model */}
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="text-slate-200 font-medium">{session.title}</span>
            <span className="text-slate-600">/</span>
            <span className="font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
              {session.model}
            </span>
            <span className="text-slate-600">/</span>
            <span className="flex items-center gap-1 text-slate-400">
              <GitBranch className="w-3 h-3" />
              <span>{session.branch}</span>
            </span>
          </div>
        </div>

        {/* Right Info Link */}
        <div className="flex items-center gap-3">
          <a
            href="https://docs.openchamber.dev/sdk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition"
          >
            <span>docs.openchamber.dev/sdk</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Center Layout: OpenCode AI Session + Right Extension Rail & Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* OpenCode AI Session Workspace */}
        <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
          {/* Messages Timeline */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Session Intro Card */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-200">OpenChamber Agentic Development Environment</div>
                <div className="text-slate-400 mt-1">
                  Active OpenCode session running alongside your code. Third-party panels created with <code className="text-emerald-400">@openchamber/sdk</code> communicate via host bridge.
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            {session.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-xl p-3 select-text leading-5 ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div>{msg.content}</div>

                  {msg.toolCall && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 font-mono text-[11px] text-emerald-400 flex items-center gap-2">
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{msg.toolCall.tool} ({msg.toolCall.args.path})</span>
                    </div>
                  )}

                  <div className={`text-[10px] mt-1.5 opacity-60 ${msg.role === 'user' ? 'text-slate-900' : 'text-slate-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Session Tasks Drawer preview */}
          {session.tasks.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">Tasks:</span>
              {session.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] shrink-0 text-slate-300"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-amber-400 animate-spin" />
                  )}
                  <span>{task.title}</span>
                </div>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(chatInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask OpenCode agent or type a prompt..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Live Guest Extension Panel (Collapsible) */}
        {panelOpen && (
          <div className="w-80 md:w-96 border-l border-slate-800 bg-slate-950 flex flex-col shrink-0 animate-in slide-in-from-right duration-200">
            {/* Panel Header */}
            <div className="h-9 px-3 border-b border-slate-800 flex items-center justify-between bg-slate-900 text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 text-emerald-400 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: extension.svgIcon }}
                />
                <span className="font-semibold text-slate-200">{extension.manifest.title}</span>
                <span className="text-[10px] text-slate-500 font-mono">v{extension.manifest.version}</span>
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sandbox Iframe Running Guest Panel */}
            <div className="flex-1 relative overflow-hidden bg-slate-950">
              <iframe
                ref={iframeRef}
                srcDoc={sandboxedHtml}
                title="OpenChamber Extension Guest Panel"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-forms allow-modals"
              />
            </div>
          </div>
        )}

        {/* OpenChamber Right Rail (Always Visible) */}
        <div className="w-12 border-l border-slate-800 bg-slate-950 flex flex-col items-center py-2 justify-between shrink-0">
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Extension Rail Icon (Custom SVG) */}
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition relative ${
                panelOpen
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
              title={`${extension.manifest.title} (OpenChamber Extension)`}
            >
              <div
                className="w-5 h-5 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: extension.svgIcon }}
              />
              {panelOpen && (
                <div className="absolute right-0 top-2 bottom-2 w-0.5 bg-emerald-400 rounded-l" />
              )}
            </button>

            {/* Built-in Rail Icons */}
            <button
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
              title="Terminal Panel"
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[9px] font-mono text-slate-600 rotate-90 select-none pb-2">
            RAIL
          </div>
        </div>
      </div>
    </div>
  );
};

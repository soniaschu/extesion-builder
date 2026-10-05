import React from 'react';
import { OpenChamberExtensionConfig } from '../../types';
import { OPENCHAMBER_TEMPLATES } from '../../data/openchamberTemplates';
import { 
  FileCode, 
  FileText, 
  Globe, 
  Code2, 
  Image, 
  Sparkles, 
  Check, 
  Copy, 
  Wand2, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { buildOpenChamberPackageJson, toKebabCase } from '../../utils/openchamberUtils';

interface ExtensionCodeEditorProps {
  extension: OpenChamberExtensionConfig;
  onUpdateExtension: (updated: Partial<OpenChamberExtensionConfig>) => void;
  onSelectTemplate: (templateId: string) => void;
}

type ExtensionFileTab = 'package.json' | 'panel/index.html' | 'panel/main.js' | 'panel/style.css' | 'icon.svg' | 'README.md';

const EXTENSION_IDEAS = [
  'A Git conflict resolver that lists merge conflicts, offers quick diffs, and prompts OpenCode to resolve them',
  'A test runner panel that checks code coverage and prompts the agent to add missing edge case tests',
  'A prompt & persona injector that provides curated system prompts for security, clean code, and refactoring',
  'A Pomodoro timer with task tracker attached to OpenChamber sessions via host.attachTask',
  'An API mock explorer that tests REST payloads and validates JSON schemas against responses',
];

export const ExtensionCodeEditor: React.FC<ExtensionCodeEditorProps> = ({
  extension,
  onUpdateExtension,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = React.useState<ExtensionFileTab>('panel/main.js');
  const [copied, setCopied] = React.useState(false);
  const [showAiBuilder, setShowAiBuilder] = React.useState(true);
  const [aiPrompt, setAiPrompt] = React.useState('');
  const [generating, setGenerating] = React.useState(false);
  const [generateError, setGenerateError] = React.useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = React.useState<string | null>(null);

  const getFileContent = (tab: ExtensionFileTab): string => {
    switch (tab) {
      case 'package.json':
        return JSON.stringify(buildOpenChamberPackageJson(extension), null, 2);
      case 'panel/index.html':
        return extension.html;
      case 'panel/main.js':
        return extension.js;
      case 'panel/style.css':
        return extension.css;
      case 'icon.svg':
        return extension.svgIcon;
      case 'README.md':
        return extension.readme;
    }
  };

  const setFileContent = (tab: ExtensionFileTab, content: string) => {
    switch (tab) {
      case 'package.json':
        try {
          const parsed = JSON.parse(content);
          if (parsed.openchamber) {
            const rawPanelId = parsed.openchamber.panel?.id || parsed.openchamber.name || 'test-panel';
            const panelId = toKebabCase(rawPanelId, 'test-panel');
            onUpdateExtension({
              manifest: {
                ...extension.manifest,
                name: toKebabCase(parsed.name || extension.manifest.name),
                title: parsed.openchamber.panel?.title || parsed.openchamber.title || extension.manifest.title,
                description: parsed.description || extension.manifest.description,
                permissions: parsed.openchamber.permissions || extension.manifest.permissions,
                version: parsed.version || extension.manifest.version,
                panel: {
                  id: panelId,
                  title: parsed.openchamber.panel?.title || extension.manifest.title,
                  entry: parsed.openchamber.panel?.entry || extension.manifest.entry,
                  icon: parsed.openchamber.panel?.icon || extension.manifest.icon,
                },
              },
            });
          }
        } catch {
          // invalid json while typing, ignore
        }
        break;
      case 'panel/index.html':
        onUpdateExtension({ html: content });
        break;
      case 'panel/main.js':
        onUpdateExtension({ js: content });
        break;
      case 'panel/style.css':
        onUpdateExtension({ css: content });
        break;
      case 'icon.svg':
        onUpdateExtension({ svgIcon: content });
        break;
      case 'README.md':
        onUpdateExtension({ readme: content });
        break;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFileContent(activeTab));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateExtension = async () => {
    if (!aiPrompt.trim()) return;

    setGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(null);

    try {
      const response = await fetch('/api/ai/build-extension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, currentConfig: extension }),
      });

      const data = await response.json();

      if (response.ok && data.extension) {
        const ext = data.extension;
        onUpdateExtension({
          id: ext.name || 'custom-extension',
          manifest: {
            name: ext.name || 'custom-extension',
            title: ext.title || 'Custom Extension',
            version: ext.version || '1.0.0',
            description: ext.description || aiPrompt,
            author: 'ChamberCraft User',
            entry: 'panel/index.html',
            icon: 'icon.svg',
            permissions: ext.permissions || ['session:read', 'prompt:send', 'notifications'],
            categories: ['AI Tools', 'Productivity'],
          },
          html: ext.html,
          js: ext.js,
          css: ext.css,
          svgIcon: ext.svgIcon || `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
          readme: ext.readme || `# ${ext.title}\n\n${aiPrompt}`,
        });

        setGenerateSuccess(`Extension "${ext.title}" generated and loaded into OpenChamber!`);
        setTimeout(() => setGenerateSuccess(null), 3500);
      } else {
        synthesizeProceduralCustomExtension(aiPrompt);
      }
    } catch (err: any) {
      console.warn('Network error during extension build, using procedural generator:', err);
      synthesizeProceduralCustomExtension(aiPrompt);
    } finally {
      setGenerating(false);
    }
  };

  // Smart procedural generator if server is offline or missing key
  const synthesizeProceduralCustomExtension = (promptText: string) => {
    const slug = promptText.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 24);
    const title = promptText.split(' ').slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="panel-container">
    <header class="panel-header">
      <h2>${title}</h2>
      <span class="badge">OpenChamber SDK</span>
    </header>

    <div class="card">
      <div class="label">Extension Objective</div>
      <p class="desc">${promptText}</p>
    </div>

    <div class="action-box">
      <input type="text" id="action-input" placeholder="Type prompt or command..." />
      <button id="btn-trigger" class="btn btn-primary">⚡ Execute Agent Action</button>
    </div>

    <div class="status-box" id="status-box">
      Waiting for host interaction...
    </div>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>`;

    const css = `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0f131c; color: #e2e8f0; font-size: 13px; }
.panel-container { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e2638; padding-bottom: 10px; }
h2 { font-size: 13px; font-weight: 600; color: #38bdf8; }
.badge { font-size: 10px; background: #38bdf822; color: #38bdf8; padding: 2px 6px; border-radius: 4px; }
.card { background: #141a27; border: 1px solid #222d42; border-radius: 6px; padding: 10px; }
.label { font-size: 10px; text-transform: uppercase; color: #64748b; font-weight: 700; margin-bottom: 4px; }
.desc { font-size: 12px; color: #94a3b8; line-height: 1.4; }
.action-box { display: flex; flex-direction: column; gap: 8px; }
input { width: 100%; background: #111622; border: 1px solid #243046; border-radius: 6px; padding: 8px; color: #fff; font-size: 12px; outline: none; }
input:focus { border-color: #38bdf8; }
.btn { padding: 8px; border-radius: 6px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #38bdf8; color: #070d17; }
.status-box { background: #121724; border: 1px dashed #28364f; border-radius: 6px; padding: 8px; font-family: monospace; font-size: 11px; color: #34d399; }`;

    const js = `import { connectHost } from '@openchamber/sdk';

let host;
const actionInput = document.getElementById('action-input');
const btnTrigger = document.getElementById('btn-trigger');
const statusBox = document.getElementById('status-box');

async function init() {
  try {
    host = await connectHost();
    statusBox.textContent = 'Connected to OpenChamber host bridge.';
  } catch (err) {
    statusBox.textContent = 'Preview mode active (outside host).';
  }
}

btnTrigger.addEventListener('click', async () => {
  const text = actionInput.value.trim() || '${promptText}';
  if (host && typeof host.sendPrompt === 'function') {
    await host.sendPrompt(text);
    await host.showNotification?.({ message: 'Dispatched action to OpenCode agent', type: 'success' });
    statusBox.textContent = 'Action dispatched to OpenCode!';
  } else {
    alert('Prompt dispatched:\\n' + text);
    statusBox.textContent = 'Prompt triggered in preview: ' + text.slice(0, 30) + '...';
  }
});

init();`;

    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
</svg>`;

    onUpdateExtension({
      id: slug,
      manifest: {
        name: `openchamber-${slug}`,
        title,
        version: '1.0.0',
        description: promptText,
        author: 'ChamberCraft Studio',
        entry: 'panel/index.html',
        icon: 'icon.svg',
        permissions: ['session:read', 'prompt:send', 'notifications'],
        categories: ['AI Tools'],
      },
      html,
      js,
      css,
      svgIcon,
      readme: `# ${title}\n\n${promptText}\n\nBuilt with OpenChamber SDK.`,
    });

    setGenerateSuccess(`Extension "${title}" synthesized and loaded!`);
    setTimeout(() => setGenerateSuccess(null), 3500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-xs select-none">
      {/* AI Extension Builder Banner (Where user describes their extension!) */}
      <div className="border-b border-slate-800 bg-slate-950 p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Wand2 className="w-4 h-4" />
            <span>AI Extension Builder</span>
          </div>
          <button
            onClick={() => setShowAiBuilder(!showAiBuilder)}
            className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <span>{showAiBuilder ? 'Hide' : 'Describe Extension'}</span>
            {showAiBuilder ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAiBuilder && (
          <div className="flex flex-col gap-2 pt-1 animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-400">
              Describe the extension you want to build and the AI will write the manifest, panel HTML, CSS, JavaScript using <code className="text-emerald-400">@openchamber/sdk</code>, and custom SVG icon:
            </p>

            <textarea
              rows={2}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. A tool that analyzes modified files, highlights test gaps, and prompts OpenCode to generate tests..."
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-[12px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none font-sans"
            />

            {/* Inspiration tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] text-slate-500 uppercase font-semibold shrink-0">Ideas:</span>
              {EXTENSION_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setAiPrompt(idea)}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 hover:border-emerald-800 text-slate-300 hover:text-emerald-300 whitespace-nowrap transition"
                >
                  {idea.split(' ')[0]} {idea.split(' ')[1]}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-500 font-mono">
                Complies with docs.openchamber.dev/sdk/
              </span>

              <button
                onClick={handleGenerateExtension}
                disabled={generating || !aiPrompt.trim()}
                className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-950/40 text-xs"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Building Extension...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Build with AI</span>
                  </>
                )}
              </button>
            </div>

            {generateSuccess && (
              <div className="p-2 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>{generateSuccess}</span>
              </div>
            )}

            {generateError && (
              <div className="p-2 rounded bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                <span>{generateError}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Template Selector Bar */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-2">
        <span className="font-semibold text-slate-200">Extension Files</span>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px]">Preset:</span>
          <select
            value={extension.id}
            onChange={(e) => onSelectTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
          >
            <option value="prompt-booster">Prompt & Context Booster</option>
            <option value="diff-inspector">Diff & Health Inspector</option>
            <option value="task-runner">MCP Task Orchestrator</option>
          </select>
        </div>
      </div>

      {/* Manifest Quick Meta */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/30 grid grid-cols-2 gap-2 text-[11px]">
        <div>
          <label className="text-slate-400 text-[10px] uppercase font-semibold">Title (Rail tooltip)</label>
          <input
            type="text"
            value={extension.manifest.title}
            onChange={(e) =>
              onUpdateExtension({
                manifest: { ...extension.manifest, title: e.target.value },
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-medium focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-slate-400 text-[10px] uppercase font-semibold">Package Name</label>
          <input
            type="text"
            value={extension.manifest.name}
            onChange={(e) =>
              onUpdateExtension({
                manifest: { ...extension.manifest, name: e.target.value },
              })
            }
            className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* File Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/80 overflow-x-auto no-scrollbar">
        {(['panel/main.js', 'panel/index.html', 'panel/style.css', 'package.json', 'icon.svg', 'README.md'] as ExtensionFileTab[]).map(
          (tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] whitespace-nowrap font-mono transition border-b-2 ${
                  isActive
                    ? 'border-emerald-400 text-emerald-300 bg-slate-900/80 font-medium'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'panel/main.js' && <Code2 className="w-3 h-3 text-amber-400" />}
                {tab === 'panel/index.html' && <Globe className="w-3 h-3 text-cyan-400" />}
                {tab === 'panel/style.css' && <FileCode className="w-3 h-3 text-sky-400" />}
                {tab === 'package.json' && <FileText className="w-3 h-3 text-emerald-400" />}
                {tab === 'icon.svg' && <Image className="w-3 h-3 text-fuchsia-400" />}
                {tab === 'README.md' && <FileText className="w-3 h-3 text-slate-400" />}
                <span>{tab}</span>
              </button>
            );
          }
        )}
      </div>

      {/* Editor toolbar */}
      <div className="px-3 py-1.5 bg-slate-950 border-b border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono">{activeTab}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-slate-200 transition"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Textarea */}
      <div className="flex-1 relative overflow-hidden bg-slate-950">
        <textarea
          value={getFileContent(activeTab)}
          onChange={(e) => setFileContent(activeTab, e.target.value)}
          spellCheck={false}
          className="w-full h-full p-3 font-mono text-[12px] leading-5 text-slate-200 bg-transparent resize-none focus:outline-none selection:bg-emerald-500/20"
        />
      </div>

      {/* SVG Icon Visual Preview when icon.svg is selected */}
      {activeTab === 'icon.svg' && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center gap-3">
          <div className="text-[11px] text-slate-400">Rail Icon Preview (24x24):</div>
          <div
            className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 p-1"
            dangerouslySetInnerHTML={{ __html: extension.svgIcon }}
          />
          <div className="text-[10px] text-slate-500">
            Rendered inside OpenChamber right rail toolbar.
          </div>
        </div>
      )}
    </div>
  );
};

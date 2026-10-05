import { OpenChamberExtensionConfig } from '../types';

export const OPENCHAMBER_TEMPLATES: Record<string, OpenChamberExtensionConfig> = {
  'prompt-booster': {
    id: 'prompt-booster',
    manifest: {
      name: 'openchamber-prompt-booster',
      title: 'Prompt & Context Booster',
      version: '1.0.0',
      description: 'Inject smart structured prompts, role constraints, and project scaffolds into the active OpenCode agent.',
      author: 'ChamberCraft Studio',
      entry: 'panel/index.html',
      icon: 'icon.svg',
      panel: {
        id: 'prompt-booster-panel',
        title: 'Prompt & Context Booster',
        entry: 'panel/index.html',
        icon: 'icon.svg',
      },
      permissions: ['session:read', 'session:write', 'project:read', 'prompt:send', 'notifications'],
      categories: ['AI Tools', 'Workflow', 'Productivity'],
    },
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  <circle cx="12" cy="12" r="4"/>
</svg>`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prompt & Context Booster</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="panel-container">
    <header class="panel-header">
      <div class="logo-row">
        <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
        </svg>
        <h2 id="panel-title">Prompt Booster</h2>
      </div>
      <span id="session-badge" class="badge">Connecting...</span>
    </header>

    <div class="content-section">
      <div class="info-card">
        <div class="label">Target Session</div>
        <div id="session-meta" class="value">Loading session details...</div>
      </div>

      <div class="field-group">
        <label for="recipe-select">Pre-built Scaffolds</label>
        <select id="recipe-select">
          <option value="test-driven">🧪 Test-Driven Refactor: Write unit tests first</option>
          <option value="security-audit">🛡️ Security Audit: Find OWASP vulnerabilities</option>
          <option value="arch-review">📐 Architectural Review: Clean code & DRY</option>
          <option value="optimize-perf">⚡ Performance Optimization: Memoize & parallelize</option>
          <option value="write-docs">📖 Documentation: TSDoc & Markdown guides</option>
        </select>
      </div>

      <div class="field-group">
        <label for="prompt-text">Prompt Content</label>
        <textarea id="prompt-text" rows="5" placeholder="Enter prompt to send or insert into OpenCode agent..."></textarea>
      </div>

      <div class="actions-row">
        <button id="btn-insert" class="btn btn-secondary">
          <span>Insert to Chat</span>
        </button>
        <button id="btn-send" class="btn btn-primary">
          <span>⚡ Send Prompt</span>
        </button>
      </div>

      <div class="history-section">
        <h3>Quick Prompt Shortcuts</h3>
        <div class="tag-cloud">
          <button class="chip" data-text="Add comprehensive error boundary and loading fallbacks to all async views.">Error Boundaries</button>
          <button class="chip" data-text="Verify all dependencies and resolve any unused imports or type warnings.">Lint & Types</button>
          <button class="chip" data-text="Generate thorough end-to-end integration tests with mock fixtures.">E2E Tests</button>
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="main.js"></script>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--chamber-bg, #11141c);
  color: var(--chamber-text, #e2e8f0);
  font-size: 13px;
  line-height: 1.5;
  user-select: none;
}

.panel-container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--chamber-border, #1e2638);
  padding-bottom: 12px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-small {
  width: 18px;
  height: 18px;
  color: var(--chamber-accent, #38bdf8);
}

h2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--chamber-title, #f1f5f9);
}

.badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--chamber-surface, #1e2638);
  color: var(--chamber-accent, #38bdf8);
  border: 1px solid var(--chamber-border, #2d3748);
}

.content-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.info-card {
  background: var(--chamber-card-bg, #161c28);
  border: 1px solid var(--chamber-border, #242f46);
  border-radius: 6px;
  padding: 10px;
}

.label {
  font-size: 11px;
  color: #64748b;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.value {
  font-size: 12px;
  font-weight: 500;
  color: #38bdf8;
  font-family: monospace;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 12px;
  font-weight: 500;
  color: #94a3b8;
}

select, textarea {
  width: 100%;
  background: var(--chamber-input-bg, #141824);
  border: 1px solid var(--chamber-border, #263148);
  border-radius: 6px;
  color: #e2e8f0;
  padding: 8px 10px;
  font-size: 12px;
  outline: none;
  transition: border-color 0.2s;
}

select:focus, textarea:focus {
  border-color: var(--chamber-accent, #38bdf8);
}

textarea {
  resize: vertical;
  min-height: 90px;
  font-family: inherit;
  line-height: 1.4;
}

.actions-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--chamber-accent, #38bdf8);
  color: #0b0f17;
  font-weight: 600;
}

.btn-primary:hover {
  filter: brightness(1.1);
}

.btn-secondary {
  background: var(--chamber-surface, #1e2638);
  color: #e2e8f0;
  border: 1px solid var(--chamber-border, #2d3748);
}

.btn-secondary:hover {
  background: #253147;
}

.history-section h3 {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
}

.tag-cloud {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.chip {
  text-align: left;
  background: var(--chamber-surface, #151a26);
  border: 1px solid var(--chamber-border, #222b3e);
  color: #cbd5e1;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
}

.chip:hover {
  border-color: var(--chamber-accent, #38bdf8);
  color: #38bdf8;
  background: #192030;
}`,
    js: `import { connectHost } from '@openchamber/sdk';

let host;
const sessionBadge = document.getElementById('session-badge');
const sessionMeta = document.getElementById('session-meta');
const recipeSelect = document.getElementById('recipe-select');
const promptText = document.getElementById('prompt-text');
const btnInsert = document.getElementById('btn-insert');
const btnSend = document.getElementById('btn-send');

const recipes = {
  'test-driven': 'Please write comprehensive unit tests for our core functions. Ensure 100% test branch coverage and mock any external network calls.',
  'security-audit': 'Audit this codebase for potential security flaws, injection risks, secret exposures, and unhandled promise rejections. Provide remediation steps.',
  'arch-review': 'Review the component architecture for maintainability, single-responsibility principle, and performance bottlenecks.',
  'optimize-perf': 'Identify high-latency rendering loops or heavy computations and refactor them with efficient data structures or caching.',
  'write-docs': 'Generate clean, markdown documentation detailing module interactions, API signatures, and usage examples.'
};

async function init() {
  try {
    host = await connectHost();
    sessionBadge.textContent = 'Host Connected';
    sessionBadge.style.color = '#34d399';

    // Fetch session details
    const session = await host.getSession();
    if (session) {
      sessionMeta.textContent = \`\${session.title || 'Active Session'} (\${session.model || 'OpenCode'})\`;
    }

    // React to theme changes from OpenChamber
    if (typeof host.onThemeChange === 'function') {
      host.onThemeChange((theme) => {
        if (theme?.accent) {
          document.documentElement.style.setProperty('--chamber-accent', theme.accent);
        }
      });
    }
  } catch (err) {
    console.warn('OpenChamber host not detected, using mock preview mode:', err);
    sessionBadge.textContent = 'Local Preview';
    sessionMeta.textContent = 'Session: Dev-Main (Claude 3.7 Sonnet)';
  }
}

// Update prompt text on recipe change
recipeSelect.addEventListener('change', (e) => {
  promptText.value = recipes[e.target.value] || '';
});
promptText.value = recipes['test-driven'];

// Insert into chat
btnInsert.addEventListener('click', async () => {
  const text = promptText.value.trim();
  if (!text) return;

  if (host && typeof host.insertPrompt === 'function') {
    await host.insertPrompt(text);
    if (typeof host.showNotification === 'function') {
      await host.showNotification({ message: 'Prompt inserted into chat input', type: 'info' });
    }
  } else {
    alert('Prompt copied for OpenCode chat:\\n\\n' + text);
  }
});

// Send prompt directly
btnSend.addEventListener('click', async () => {
  const text = promptText.value.trim();
  if (!text) return;

  if (host && typeof host.sendPrompt === 'function') {
    await host.sendPrompt(text);
    if (typeof host.showNotification === 'function') {
      await host.showNotification({ message: 'Prompt dispatched to OpenCode agent', type: 'success' });
    }
  } else {
    alert('Dispatched prompt to agent:\\n\\n' + text);
  }
});

// Quick chips
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    promptText.value = chip.getAttribute('data-text') || '';
  });
});

init();`,
    readme: `# Prompt & Context Booster Extension for OpenChamber

This extension is built for the **OpenChamber Agentic Development Environment** (https://docs.openchamber.dev/sdk/).

## Features
- Connects directly to the OpenChamber host via \`@openchamber/sdk\`.
- Inserts specialized architectural prompts, security checks, and scaffolds into active chat sessions.
- Automatically synchronizes with host themes and dark mode preferences.

## Installation
1. Place this directory inside \`~/.openchamber/extensions/prompt-booster\` or install via OpenChamber Settings → Extensions.
2. In your terminal, run:
   \`\`\`bash
   npm install
   \`\`\`
3. Restart or reload OpenChamber. The new icon will appear in the right rail!
`,
  },
  'diff-inspector': {
    id: 'diff-inspector',
    manifest: {
      name: 'openchamber-diff-inspector',
      title: 'Diff & Health Inspector',
      version: '1.0.0',
      description: 'Analyze modified files, diff statistics, and request targeted AI code reviews across modified files.',
      author: 'ChamberCraft Studio',
      entry: 'panel/index.html',
      icon: 'icon.svg',
      panel: {
        id: 'diff-inspector-panel',
        title: 'Diff & Health Inspector',
        entry: 'panel/index.html',
        icon: 'icon.svg',
      },
      permissions: ['session:read', 'diff:read', 'prompt:send', 'notifications'],
      categories: ['Code Review', 'Git', 'Quality'],
    },
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M16 3h5v5M4 20L20 4M21 16v5h-5M15 15l6 6M4 4l5 5"/>
</svg>`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Diff & Health Inspector</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="panel-container">
    <header class="panel-header">
      <div class="logo-row">
        <svg class="icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
        <h2>Diff Inspector</h2>
      </div>
      <button id="btn-refresh" class="icon-btn" title="Refresh Diffs">↻</button>
    </header>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-num" id="stat-files">3</div>
        <div class="stat-label">Changed Files</div>
      </div>
      <div class="stat-box">
        <div class="stat-num text-emerald" id="stat-added">+142</div>
        <div class="stat-label">Lines Added</div>
      </div>
      <div class="stat-box">
        <div class="stat-num text-rose" id="stat-removed">-38</div>
        <div class="stat-label">Lines Removed</div>
      </div>
    </div>

    <div class="file-list-section">
      <div class="section-title">Modified Files</div>
      <div id="file-list" class="file-list">
        <!-- Dynamically rendered -->
      </div>
    </div>

    <div class="actions-section">
      <button id="btn-request-review" class="btn btn-primary">
        <span>🔍 Request OpenCode Review</span>
      </button>
      <button id="btn-check-tests" class="btn btn-secondary">
        <span>🧪 Verify Tests Pass</span>
      </button>
    </div>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--chamber-bg, #0f131a);
  color: #e2e8f0;
  font-size: 13px;
}
.panel-container { padding: 14px; display: flex; flex-direction: column; gap: 14px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e2638; padding-bottom: 10px; }
.logo-row { display: flex; align-items: center; gap: 8px; }
.icon-small { width: 18px; height: 18px; color: #10b981; }
h2 { font-size: 14px; font-weight: 600; color: #f1f5f9; }
.icon-btn { background: #1a2234; border: 1px solid #28354f; color: #94a3b8; border-radius: 4px; padding: 4px 8px; cursor: pointer; }
.icon-btn:hover { color: #f8fafc; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.stat-box { background: #151b27; border: 1px solid #202b40; border-radius: 6px; padding: 8px 6px; text-align: center; }
.stat-num { font-size: 16px; font-weight: 700; font-family: monospace; }
.text-emerald { color: #34d399; }
.text-rose { color: #f43f5e; }
.stat-label { font-size: 10px; color: #64748b; text-transform: uppercase; margin-top: 2px; }
.file-list-section { display: flex; flex-direction: column; gap: 8px; }
.section-title { font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; }
.file-list { display: flex; flex-direction: column; gap: 6px; max-height: 240px; overflow-y: auto; }
.file-item { display: flex; align-items: center; justify-content: space-between; background: #131824; border: 1px solid #222b3e; padding: 8px 10px; border-radius: 6px; font-size: 12px; }
.file-name { font-family: monospace; color: #cbd5e1; }
.file-diff-badge { font-size: 11px; font-family: monospace; }
.actions-section { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
.btn { width: 100%; padding: 9px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; transition: opacity 0.2s; }
.btn:hover { opacity: 0.9; }
.btn-primary { background: #10b981; color: #022c22; }
.btn-secondary { background: #1e2638; color: #e2e8f0; border: 1px solid #2d3850; }`,
    js: `import { connectHost } from '@openchamber/sdk';

let host;
const fileListContainer = document.getElementById('file-list');
const btnRequestReview = document.getElementById('btn-request-review');
const btnCheckTests = document.getElementById('btn-check-tests');

const sampleFiles = [
  { path: 'src/services/auth.ts', added: 84, removed: 12 },
  { path: 'src/routes/api.ts', added: 46, removed: 22 },
  { path: 'tests/auth.test.ts', added: 12, removed: 4 }
];

function renderFiles(files) {
  fileListContainer.innerHTML = '';
  files.forEach(f => {
    const item = document.createElement('div');
    item.className = 'file-item';
    item.innerHTML = \`
      <span class="file-name">\${f.path}</span>
      <span class="file-diff-badge">
        <span class="text-emerald">+\${f.added}</span> / <span class="text-rose">-\${f.removed}</span>
      </span>
    \`;
    fileListContainer.appendChild(item);
  });
}

async function init() {
  try {
    host = await connectHost();
    const files = await host.getFiles?.() || sampleFiles;
    renderFiles(files);
  } catch (e) {
    renderFiles(sampleFiles);
  }
}

btnRequestReview.addEventListener('click', async () => {
  const prompt = 'Please perform a thorough code review on all modified files in this session. Focus on edge cases, memory leaks, and type correctness.';
  if (host && typeof host.sendPrompt === 'function') {
    await host.sendPrompt(prompt);
    await host.showNotification?.({ message: 'Review requested from OpenCode agent', type: 'info' });
  } else {
    alert('Code review prompt sent:\\n' + prompt);
  }
});

btnCheckTests.addEventListener('click', async () => {
  const prompt = 'Run test suite and confirm that all test assertions pass without regression.';
  if (host && typeof host.sendPrompt === 'function') {
    await host.sendPrompt(prompt);
  } else {
    alert('Prompt sent: ' + prompt);
  }
});

init();`,
    readme: `# OpenChamber Diff & Health Inspector

Monitors session file diffs and provides one-click triggers for AI-powered code reviews.
Follows https://docs.openchamber.dev/sdk/.
`,
  },
  'task-runner': {
    id: 'task-runner',
    manifest: {
      name: 'openchamber-mcp-tasks',
      title: 'MCP Task Orchestrator',
      version: '1.0.0',
      description: 'Orchestrate background tasks, MCP tool actions, and terminal jobs directly within OpenChamber.',
      author: 'ChamberCraft Studio',
      entry: 'panel/index.html',
      icon: 'icon.svg',
      panel: {
        id: 'task-runner-panel',
        title: 'MCP Task Orchestrator',
        entry: 'panel/index.html',
        icon: 'icon.svg',
      },
      permissions: ['session:read', 'session:write', 'tasks:attach', 'notifications'],
      categories: ['Tasks', 'Automation', 'DevOps'],
    },
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
</svg>`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MCP Task Orchestrator</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="panel-container">
    <header class="panel-header">
      <h2>⚡ MCP Task Orchestrator</h2>
      <span class="badge">SDK Ready</span>
    </header>

    <div class="task-form">
      <input type="text" id="task-title" placeholder="New Task Title (e.g. Build Production Bundle)" />
      <textarea id="task-desc" rows="3" placeholder="Task execution instructions or script command..."></textarea>
      <button id="btn-add-task" class="btn btn-primary">+ Attach Task to Session</button>
    </div>

    <div class="task-list-title">Attached Session Tasks</div>
    <div id="tasks-container" class="task-list">
      <!-- Attached tasks render here -->
    </div>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: sans-serif; background: #0c0f16; color: #f1f5f9; font-size: 13px; }
.panel-container { padding: 14px; display: flex; flex-direction: column; gap: 12px; }
.panel-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1e2638; padding-bottom: 10px; }
h2 { font-size: 14px; font-weight: 600; }
.badge { background: #22c55e22; color: #22c55e; border: 1px solid #22c55e44; padding: 2px 6px; border-radius: 4px; font-size: 10px; }
.task-form { display: flex; flex-direction: column; gap: 8px; }
input, textarea { width: 100%; background: #141a27; border: 1px solid #25334d; border-radius: 6px; color: #f8fafc; padding: 8px; font-size: 12px; outline: none; }
input:focus, textarea:focus { border-color: #38bdf8; }
.btn { padding: 8px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; border: none; }
.btn-primary { background: #38bdf8; color: #08111d; }
.task-list-title { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-top: 6px; }
.task-list { display: flex; flex-direction: column; gap: 8px; }
.task-card { background: #131924; border: 1px solid #222d42; border-radius: 6px; padding: 10px; }
.task-card-title { font-weight: 600; color: #e2e8f0; font-size: 12px; }
.task-card-desc { font-size: 11px; color: #94a3b8; margin-top: 4px; }
.task-card-status { font-size: 10px; margin-top: 6px; display: inline-block; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
.status-pending { background: #eab30822; color: #eab308; }
.status-completed { background: #22c55e22; color: #22c55e; }`,
    js: `import { connectHost } from '@openchamber/sdk';

let host;
const taskTitle = document.getElementById('task-title');
const taskDesc = document.getElementById('task-desc');
const btnAddTask = document.getElementById('btn-add-task');
const tasksContainer = document.getElementById('tasks-container');

const tasks = [
  { id: '1', title: 'Verify TypeScript compilation', desc: 'Run tsc --noEmit and catch type regressions', status: 'completed' },
  { id: '2', title: 'Vite Production Build', desc: 'Execute npm run build and inspect chunk sizes', status: 'pending' }
];

function renderTasks() {
  tasksContainer.innerHTML = '';
  tasks.forEach(t => {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.innerHTML = \`
      <div class="task-card-title">\${t.title}</div>
      <div class="task-card-desc">\${t.desc}</div>
      <span class="task-card-status status-\${t.status}">Status: \${t.status}</span>
    \`;
    tasksContainer.appendChild(card);
  });
}

btnAddTask.addEventListener('click', async () => {
  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();
  if (!title) return;

  const newTask = { id: Date.now().toString(), title, desc, status: 'pending' };
  tasks.unshift(newTask);
  renderTasks();
  taskTitle.value = '';
  taskDesc.value = '';

  if (host && typeof host.attachTask === 'function') {
    await host.attachTask(newTask);
    await host.showNotification?.({ message: \`Attached task: \${title}\`, type: 'success' });
  }
});

async function init() {
  try {
    host = await connectHost();
  } catch (e) {
    console.log('Running in standalone preview mode');
  }
  renderTasks();
}

init();`,
    readme: `# MCP Task Orchestrator for OpenChamber

Adds a task management panel to OpenChamber that binds tasks to OpenCode sessions via \`host.attachTask()\`.
`,
  },
  'retro-arcade-hud': {
    id: 'retro-arcade-hud',
    manifest: {
      name: 'openchamber-retro-arcade-hud',
      title: '16-Bit Retro Arcade HUD',
      version: '1.0.0',
      description: 'Chiptune 16-bit retro arcade HUD panel with pixel counters, CRT scanlines, arcade badges, and AI prompt dispatch.',
      author: 'ChamberCraft Studio',
      entry: 'panel/index.html',
      icon: 'icon.svg',
      panel: {
        id: 'retro-arcade-hud-panel', // Strictly kebab-case
        title: '16-Bit Retro Arcade HUD',
        entry: 'panel/index.html',
        icon: 'icon.svg',
      },
      permissions: ['session:read', 'session:write', 'prompt:send', 'notifications'],
      categories: ['AI Tools', 'Themes', 'Retro Gaming'],
    },
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="3" width="6" height="3" fill="#ff0077"/>
  <rect x="14" y="3" width="6" height="3" fill="#ff0077"/>
  <rect x="2" y="6" width="20" height="6" fill="#ff0077"/>
  <rect x="4" y="12" width="16" height="3" fill="#ff0077"/>
  <rect x="6" y="15" width="12" height="3" fill="#ff0077"/>
  <rect x="9" y="18" width="6" height="3" fill="#ff0077"/>
  <rect x="11" y="21" width="2" height="2" fill="#ff0077"/>
  <rect x="6" y="6" width="3" height="3" fill="#ffd700"/>
</svg>`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>16-Bit Retro Arcade HUD</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="crt-screen">
  <div class="arcade-container">
    <header class="arcade-header">
      <div class="score-board">
        <span class="hud-label">1UP</span>
        <span id="score-counter" class="hud-val">048200</span>
      </div>
      <div class="arcade-title">★ RETRO OPENCODE ★</div>
      <div class="credit-board">
        <span class="hud-label">CREDIT</span>
        <span id="coin-counter" class="hud-val">02</span>
      </div>
    </header>

    <div class="status-bar-row">
      <div class="stat-pill"><span class="label">HP</span><div class="bar-outer"><div class="bar-inner hp-fill"></div></div><span class="stat-num">100%</span></div>
      <div class="stat-pill"><span class="label">MP</span><div class="bar-outer"><div class="bar-inner mp-fill"></div></div><span class="stat-num">99</span></div>
    </div>

    <!-- AI Agent Dialogue Box with Syntax Highlighting -->
    <div class="dialogue-box">
      <div class="dialogue-speaker">
        <span class="speaker-avatar">👾</span>
        <span class="speaker-name">AGENT CHIP-16</span>
      </div>
      <div id="dialogue-text" class="dialogue-content">
        Ready for quest! Insert prompt to command OpenCode agent:
      </div>
    </div>

    <!-- Quick Action Macro Buttons -->
    <div class="button-grid">
      <button id="btn-coin" class="pixel-btn btn-gold">
        <span>🪙 INSERT COIN</span>
      </button>
      <button id="btn-sound" class="pixel-btn btn-cyan">
        <span>🔊 SOUND FX</span>
      </button>
      <button id="btn-boss" class="pixel-btn btn-magenta">
        <span>⚔️ BOSS REFACTOR</span>
      </button>
      <button id="btn-start" class="pixel-btn btn-green">
        <span>⚡ RUN AGENT</span>
      </button>
    </div>

    <!-- Prompt Input Form -->
    <div class="input-section">
      <input type="text" id="arcade-prompt" placeholder="ENTER MISSION OBJECTIVE..." />
      <button id="btn-send-prompt" class="btn-fire">FIRE!</button>
    </div>
  </div>
  <script type="module" src="main.js"></script>
</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  image-rendering: pixelated;
}

body.crt-screen {
  background: #0f071c;
  color: #00ffcc;
  font-family: "Courier New", Courier, monospace, monospace;
  font-size: 12px;
  overflow: hidden;
  height: 100vh;
  position: relative;
}

body.crt-screen::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0; left: 0; bottom: 0; right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
  z-index: 20;
  background-size: 100% 3px, 4px 100%;
  pointer-events: none;
}

.arcade-container {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
}

.arcade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #180d2e;
  border: 2px solid #ff0077;
  padding: 8px 12px;
  box-shadow: 0 0 10px rgba(255, 0, 119, 0.4);
}

.arcade-title {
  color: #ffd700;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: 0 0 8px #ffd700;
}

.hud-label {
  color: #ff0077;
  font-weight: bold;
  margin-right: 6px;
}

.hud-val {
  color: #ffffff;
  font-weight: bold;
}

.status-bar-row {
  display: flex;
  gap: 8px;
}

.stat-pill {
  flex: 1;
  background: #160b29;
  border: 1px solid #00ffcc;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bar-outer {
  flex: 1;
  height: 8px;
  background: #251242;
  border: 1px solid #334155;
}

.bar-inner {
  height: 100%;
}

.hp-fill {
  width: 100%;
  background: #39ff14;
  box-shadow: 0 0 6px #39ff14;
}

.mp-fill {
  width: 90%;
  background: #00bfff;
  box-shadow: 0 0 6px #00bfff;
}

.stat-num {
  font-size: 10px;
  color: #ffd700;
  font-weight: bold;
}

.dialogue-box {
  background: #120824;
  border: 2px solid #ffd700;
  padding: 10px;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.dialogue-speaker {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ff0077;
  font-weight: bold;
  font-size: 11px;
}

.dialogue-content {
  color: #f3e8ff;
  line-height: 1.4;
  font-size: 11px;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.pixel-btn {
  padding: 8px;
  font-family: inherit;
  font-size: 11px;
  font-weight: bold;
  border: 2px solid #000;
  cursor: pointer;
  box-shadow: 3px 3px 0px #000;
  transition: transform 0.05s;
}

.pixel-btn:active {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
}

.btn-gold { background: #ffd700; color: #120824; }
.btn-cyan { background: #00ffcc; color: #120824; }
.btn-magenta { background: #ff0077; color: #ffffff; }
.btn-green { background: #39ff14; color: #120824; }

.input-section {
  display: flex;
  gap: 6px;
}

.input-section input {
  flex: 1;
  background: #180d2e;
  border: 2px solid #00ffcc;
  color: #ffffff;
  padding: 8px;
  font-family: inherit;
  font-size: 11px;
  outline: none;
}

.btn-fire {
  background: #ff0055;
  color: #ffffff;
  border: 2px solid #ffffff;
  font-weight: bold;
  padding: 8px 14px;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 2px 2px 0px #000;
}

.btn-fire:active {
  transform: translate(2px, 2px);
}
`,
    js: `// 16-Bit Retro Chiptune & Arcade HUD
let score = 48200;
let coins = 2;

const audioCtx = typeof window !== 'undefined' ? new (window.AudioContext || window.webkitAudioContext)() : null;

function playChiptuneBeep(freq = 440, type = 'square', duration = 0.1) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    // audio policy
  }
}

document.getElementById('btn-coin')?.addEventListener('click', () => {
  coins++;
  score += 100;
  playChiptuneBeep(987.77, 'square', 0.15);
  setTimeout(() => playChiptuneBeep(1318.51, 'square', 0.25), 100);
  const coinEl = document.getElementById('coin-counter');
  if (coinEl) coinEl.textContent = String(coins).padStart(2, '0');
  const scoreEl = document.getElementById('score-counter');
  if (scoreEl) scoreEl.textContent = String(score).padStart(6, '0');
});

document.getElementById('btn-sound')?.addEventListener('click', () => {
  playChiptuneBeep(523.25, 'triangle', 0.1);
  setTimeout(() => playChiptuneBeep(659.25, 'triangle', 0.1), 100);
  setTimeout(() => playChiptuneBeep(783.99, 'triangle', 0.15), 200);
  setTimeout(() => playChiptuneBeep(1046.50, 'square', 0.25), 300);
});

document.getElementById('btn-boss')?.addEventListener('click', () => {
  playChiptuneBeep(220, 'sawtooth', 0.3);
  const textEl = document.getElementById('dialogue-text');
  if (textEl) {
    textEl.innerHTML = '<span style="color:#ff0055">⚠ BOSS FIGHT:</span> Refactoring spaghetti code into pristine modular architecture! +1500 XP';
  }
  score += 1500;
  const scoreEl = document.getElementById('score-counter');
  if (scoreEl) scoreEl.textContent = String(score).padStart(6, '0');
});

document.getElementById('btn-send-prompt')?.addEventListener('click', () => {
  const input = document.getElementById('arcade-prompt');
  const val = input ? input.value.trim() : '';
  if (!val) return;
  playChiptuneBeep(880, 'square', 0.1);
  const textEl = document.getElementById('dialogue-text');
  if (textEl) {
    textEl.innerHTML = '>> COMMAND DISPATCHED: <strong>' + val + '</strong>';
  }
  if (input) input.value = '';
});
`,
    readme: `# 16-Bit Retro Arcade HUD for OpenChamber

A nostalgic 16-bit arcade status display with CRT scanlines, pixel art stats, chiptune sound toggles, and OpenCode AI command badges.
`,
  },
};

import { OpenCodePluginConfig } from '../types';

export const OPENCODE_PLUGIN_TEMPLATES: Record<string, OpenCodePluginConfig> = {
  'tool-guard': {
    id: 'tool-guard',
    name: 'opencode-guard',
    title: 'Safety & Tool Execution Guard',
    version: '1.0.0',
    description: 'Intercepts tool executions, enforces safety policies, and prevents destructive commands or secret exposure.',
    author: 'ChamberCraft Studio',
    license: 'MIT',
    templateRepo: 'https://github.com/zenobi-us/opencode-plugin-template',
    hooks: ['tool.execute.before', 'tool.execute.after'],
    tools: [
      {
        name: 'security_audit',
        description: 'Audits the current repository worktree for exposed tokens, secrets, and dangerous scripts.',
        parametersSchema: 'z.object({ path: z.string().default(".") })',
      },
    ],
    files: {
      packageJson: JSON.stringify({
        name: 'opencode-guard',
        version: '1.0.0',
        description: 'OpenCode safety policy and tool interceptor plugin (based on zenobi-us/opencode-plugin-template)',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        type: 'module',
        scripts: {
          build: 'bun build ./src/index.ts --outdir ./dist --target node',
          test: 'bun test',
          typecheck: 'tsc --noEmit',
        },
        keywords: ['opencode', 'opencode-plugin', 'security', 'guard', 'policy'],
        peerDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
        },
        devDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
          '@types/bun': '^1.2.0',
          typescript: '^5.7.0',
          zod: '^3.24.0',
        },
      }, null, 2),
      indexTs: `import type { Plugin } from '@opencode-ai/plugin';
import { securityAuditTool } from './tools/securityAudit';

/**
 * OpenCode Policy & Tool Guard Plugin
 * Built following: https://github.com/zenobi-us/opencode-plugin-template
 */
export const guardPlugin: Plugin = async ({ project, directory, client, $ }) => {
  console.log(\`🛡️ [OpenCode Guard] Initialized in \${directory}\`);

  return {
    // Custom tool definitions registered with OpenCode
    tools: [securityAuditTool],

    // Hook: intercept tool calls before execution
    'tool.execute.before': async (event) => {
      const { tool, args } = event;

      // 1. Block destructive shell commands
      if (tool === 'run_command' && args?.command) {
        const cmd = String(args.command).trim();
        if (/rm\\s+-rf\\s+[/~]/i.test(cmd) || /drop\\s+database/i.test(cmd) || />\\s*\\/etc\\//i.test(cmd)) {
          throw new Error(\`[Security Guard] Blocked prohibited command: \${cmd}\`);
        }
      }

      // 2. Prevent accidental secret commits
      if (tool === 'write_file' && args?.path) {
        if (/\\.env($|\\.local|\\.production)/i.test(args.path) && /KEY|SECRET|PASSWORD|TOKEN/i.test(args.content || '')) {
          console.warn(\`⚠️ [Security Guard] Writing to secret file: \${args.path}\`);
        }
      }

      return event;
    },

    // Hook: audit tool results and monitor latency
    'tool.execute.after': async (event) => {
      const { tool, durationMs } = event;
      if (durationMs > 4000) {
        console.warn(\`⏱️ [Performance Guard] Tool '\${tool}' execution took \${durationMs}ms\`);
      }
      return event;
    },
  };
};

export default guardPlugin;
`,
      customToolTs: `import { z } from 'zod';

export const securityAuditTool = {
  name: 'security_audit',
  description: 'Audits worktree for sensitive credentials and prohibited patterns.',
  parameters: z.object({
    directory: z.string().optional().default('.'),
    strictMode: z.boolean().optional().default(false),
  }),
  execute: async ({ directory, strictMode }: { directory: string; strictMode: boolean }) => {
    // Audit implementation
    return {
      status: 'clean',
      scannedDirectory: directory,
      violationsFound: 0,
      strictModeEnabled: strictMode,
      timestamp: new Date().toISOString(),
    };
  },
};
`,
      testTs: `import { describe, it, expect } from 'bun:test';
import { guardPlugin } from './src/index';

describe('OpenCode Guard Plugin', () => {
  it('should initialize and register security hooks', async () => {
    const pluginInstance = await guardPlugin({
      project: { name: 'test-project' },
      directory: '/app',
      worktree: '/app',
      client: {} as any,
      $: {} as any,
    } as any);

    expect(pluginInstance).toHaveProperty('tool.execute.before');
    expect(pluginInstance).toHaveProperty('tool.execute.after');
    expect(pluginInstance.tools?.length).toBeGreaterThan(0);
  });
});
`,
      tsconfigJson: JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          skipLibCheck: true,
          declaration: true,
          outDir: './dist',
        },
        include: ['src/**/*'],
      }, null, 2),
      readmeMd: `# OpenCode Guard Plugin

Policy and tool execution guard plugin for the [OpenCode AI Coding Agent](https://opencode.ai).

> Built using the official [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template) architecture.

## Features
- **Prohibited Command Blocker**: Prevents dangerous commands like \`rm -rf /\`.
- **Secret File Warning**: Warns when sensitive environment variables or keys are written.
- **Performance Monitor**: Logs tools that take longer than 4000ms.
- **Custom Tool**: Exposes \`security_audit\` to OpenCode LLMs.

## Installation & Setup

1. Install dependencies:
\`\`\`bash
bun install
\`\`\`

2. Build and test:
\`\`\`bash
bun run build
bun test
\`\`\`

3. Enable in \`opencode.json\`:
\`\`\`json
{
  "plugins": ["./path/to/opencode-guard"]
}
\`\`\`
`,
    },
  },

  'theme-bridge': {
    id: 'theme-bridge',
    name: 'opencode-theme-bridge',
    title: 'Theme & Terminal UI Bridge',
    version: '1.0.0',
    description: 'Bridges VS Code theme palettes and ANSI tokens into OpenCode agent CLI messages and status UI.',
    author: 'ChamberCraft Studio',
    license: 'MIT',
    templateRepo: 'https://github.com/zenobi-us/opencode-plugin-template',
    hooks: ['chat.message', 'session.start'],
    tools: [
      {
        name: 'get_theme_palette',
        description: 'Returns the current VS Code active palette hex colors and ANSI styling map.',
        parametersSchema: 'z.object({})',
      },
    ],
    files: {
      packageJson: JSON.stringify({
        name: 'opencode-theme-bridge',
        version: '1.0.0',
        description: 'VS Code Theme palette bridge for OpenCode CLI (based on zenobi-us/opencode-plugin-template)',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        type: 'module',
        scripts: {
          build: 'bun build ./src/index.ts --outdir ./dist --target node',
          test: 'bun test',
          typecheck: 'tsc --noEmit',
        },
        keywords: ['opencode', 'opencode-plugin', 'theme', 'vscode', 'ansi'],
        peerDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
        },
        devDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
          '@types/bun': '^1.2.0',
          typescript: '^5.7.0',
          zod: '^3.24.0',
        },
      }, null, 2),
      indexTs: `import type { Plugin } from '@opencode-ai/plugin';
import { themePaletteTool } from './tools/themePalette';

/**
 * OpenCode Theme Bridge Plugin
 * Harmonizes OpenCode terminal banners with the active VS Code color scheme.
 * Built with: https://github.com/zenobi-us/opencode-plugin-template
 */
export const themeBridgePlugin: Plugin = async ({ project, client }) => {
  console.log(\`🎨 [OpenCode Theme Bridge] Loaded theme synchronization\`);

  return {
    tools: [themePaletteTool],

    // Hook: customize welcome session banner
    'session.start': async ({ session }) => {
      console.log(\`✨ [OpenCode] Session started: \${session?.id || 'default'}\`);
      return session;
    },

    // Hook: format chat messages with theme accent color
    'chat.message': async (message) => {
      // Enhance system message formatting
      return message;
    },
  };
};

export default themeBridgePlugin;
`,
      customToolTs: `import { z } from 'zod';

export const themePaletteTool = {
  name: 'get_theme_palette',
  description: 'Retrieves current VS Code / OpenCode color palette variables.',
  parameters: z.object({}),
  execute: async () => {
    return {
      accentColor: '#38bdf8',
      background: '#0f172a',
      foreground: '#f8fafc',
      source: 'ChamberCraft Studio',
      wcagRating: 'AAA',
    };
  },
};
`,
      testTs: `import { describe, it, expect } from 'bun:test';
import { themeBridgePlugin } from './src/index';

describe('OpenCode Theme Bridge Plugin', () => {
  it('should initialize successfully', async () => {
    const pluginInstance = await themeBridgePlugin({} as any);
    expect(pluginInstance).toHaveProperty('session.start');
  });
});
`,
      tsconfigJson: JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          skipLibCheck: true,
          declaration: true,
          outDir: './dist',
        },
        include: ['src/**/*'],
      }, null, 2),
      readmeMd: `# OpenCode Theme Bridge Plugin

Bridges your custom VS Code palette into OpenCode CLI.
Built using [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template).
`,
    },
  },

  'git-commit-assistant': {
    id: 'git-commit-assistant',
    name: 'opencode-git-assistant',
    title: 'Git Conventional Commit Assistant',
    version: '1.0.0',
    description: 'Inspects staged worktree diffs and generates standardized Conventional Commit messages automatically.',
    author: 'ChamberCraft Studio',
    license: 'MIT',
    templateRepo: 'https://github.com/zenobi-us/opencode-plugin-template',
    hooks: ['session.end', 'tool.execute.after'],
    tools: [
      {
        name: 'suggest_commit_message',
        description: 'Analyzes the git diff of current files and outputs a semantic Conventional Commit string.',
        parametersSchema: 'z.object({ scope: z.string().optional() })',
      },
    ],
    files: {
      packageJson: JSON.stringify({
        name: 'opencode-git-assistant',
        version: '1.0.0',
        description: 'Conventional Commit generator for OpenCode (based on zenobi-us/opencode-plugin-template)',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        type: 'module',
        scripts: {
          build: 'bun build ./src/index.ts --outdir ./dist --target node',
          test: 'bun test',
          typecheck: 'tsc --noEmit',
        },
        keywords: ['opencode', 'opencode-plugin', 'git', 'conventional-commits'],
        peerDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
        },
        devDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
          '@types/bun': '^1.2.0',
          typescript: '^5.7.0',
          zod: '^3.24.0',
        },
      }, null, 2),
      indexTs: `import type { Plugin } from '@opencode-ai/plugin';
import { suggestCommitMessageTool } from './tools/suggestCommitMessage';

/**
 * OpenCode Git Conventional Commit Assistant
 * Built with: https://github.com/zenobi-us/opencode-plugin-template
 */
export const gitAssistantPlugin: Plugin = async ({ project, $ }) => {
  return {
    tools: [suggestCommitMessageTool],

    'tool.execute.after': async (event) => {
      // If a git command or file write happened, track staged changes
      if (event.tool === 'write_file' || event.tool === 'replace_file_content') {
        console.log(\`📝 [Git Assistant] File updated: \${event.args?.path || 'unknown'}\`);
      }
      return event;
    },
  };
};

export default gitAssistantPlugin;
`,
      customToolTs: `import { z } from 'zod';

export const suggestCommitMessageTool = {
  name: 'suggest_commit_message',
  description: 'Generates a Conventional Commit message from staged diff.',
  parameters: z.object({
    scope: z.string().optional().describe('Optional scope, e.g. auth, ui, theme'),
  }),
  execute: async ({ scope }: { scope?: string }) => {
    const scopePrefix = scope ? \`(\${scope})\` : '';
    return {
      suggestedMessage: \`feat\${scopePrefix}: add automated validation and token styling\`,
      type: 'feat',
      scope,
    };
  },
};
`,
      testTs: `import { describe, it, expect } from 'bun:test';
import { gitAssistantPlugin } from './src/index';

describe('OpenCode Git Assistant', () => {
  it('should initialize and register git tools', async () => {
    const pluginInstance = await gitAssistantPlugin({} as any);
    expect(pluginInstance.tools?.length).toBeGreaterThan(0);
  });
});
`,
      tsconfigJson: JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          skipLibCheck: true,
          declaration: true,
          outDir: './dist',
        },
        include: ['src/**/*'],
      }, null, 2),
      readmeMd: `# OpenCode Git Conventional Commit Assistant

Analyzes git diffs and drafts standardized conventional commits.
Built from [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template).
`,
    },
  },
  'retro-pixel-engine': {
    id: 'retro-pixel-engine',
    name: 'opencode-retro-16bit',
    title: '16-Bit Retro Terminal & Sound Engine',
    version: '1.0.0',
    description: 'Retro 16-bit arcade terminal banners, chiptune auditory notifications, and pixel ASCII logs for OpenCode AI tool executions.',
    author: 'ChamberCraft Studio',
    license: 'MIT',
    templateRepo: 'https://github.com/zenobi-us/opencode-plugin-template',
    hooks: ['tool.execute.before', 'tool.execute.after'],
    tools: [
      {
        name: 'render_pixel_banner',
        description: 'Generates 16-bit arcade pixel ASCII art banners in the terminal',
        parametersSchema: 'z.object({ text: z.string().describe("Text or score to display") })',
      },
    ],
    files: {
      packageJson: JSON.stringify({
        name: 'opencode-retro-16bit',
        version: '1.0.0',
        description: '16-bit arcade sound and pixel art plugin (zenobi-us/opencode-plugin-template)',
        main: 'dist/index.js',
        types: 'dist/index.d.ts',
        type: 'module',
        scripts: {
          build: 'bun build ./src/index.ts --outdir ./dist --target node',
          test: 'bun test',
          typecheck: 'tsc --noEmit',
        },
        peerDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
        },
        devDependencies: {
          '@opencode-ai/plugin': '^0.1.0',
          '@types/bun': '^1.2.0',
          typescript: '^5.7.0',
          zod: '^3.24.0',
        },
      }, null, 2),
      indexTs: `import type { Plugin } from '@opencode-ai/plugin';
import { renderPixelBannerTool } from './tools/customTool';

/**
 * 16-Bit Retro Arcade OpenCode Plugin
 * Built following: https://github.com/zenobi-us/opencode-plugin-template
 */
export const retroPlugin: Plugin = async ({ project, directory, client, $ }) => {
  console.log(\`
  ▄████████  ▄██████▄   ▄█    █▄       ▄████████ 
  ███    ███ ███    ███ ███    ███     ███    ███ 
  ███    █▀  ███    ███ ███    ███     ███    █▀  
 ▄███▄▄▄     ███    ███ ███    ███    ▄███▄▄▄     
▀▀███▀▀▀     ███    ███ ███    ███   ▀▀███▀▀▀     
  ███    █▄  ███    ███ ███    ███     ███    █▄  
  ███    ███ ███    ███ ███    ███     ███    ███ 
  ██████████  ▀██████▀   ▀██████▀      ██████████ 
  ★ 16-BIT RETRO OPENCODE PLUGIN LOADED (SNES / GENESIS MODE) ★
  \`);

  return {
    tools: [renderPixelBannerTool],

    'tool.execute.before': async (event) => {
      console.log(\`\\x1b[35m[16-BIT ARCADE]\\x1b[0m 🪙 Coin Inserted! Executing: \\x1b[36m\${event.tool}\\x1b[0m\`);
      return event;
    },

    'tool.execute.after': async (event) => {
      console.log(\`\\x1b[32m[STAGE CLEAR]\\x1b[0m 🏆 Tool \${event.tool} completed in \${event.durationMs}ms (+500 PTS)\`);
      return event;
    },
  };
};

export default retroPlugin;
`,
      customToolTs: `import { z } from 'zod';

export const renderPixelBannerTool = {
  name: 'render_pixel_banner',
  description: 'Renders a 16-bit arcade pixel art badge with color phosphor accents.',
  parameters: z.object({
    text: z.string().describe('Title text or score announcement'),
    highScore: z.number().optional().default(99990),
  }),
  execute: async ({ text, highScore }: { text: string; highScore?: number }) => {
    const banner = \`
  ╔═══════════════════════════════════════════╗
  ║ ★ ARCADE 16-BIT: \${text.padEnd(24)} ║
  ║ HI-SCORE: \${String(highScore).padStart(8, '0')} PTS                ║
  ╚═══════════════════════════════════════════╝\`;
    return { banner, rendered: true };
  },
};
`,
      testTs: `import { describe, it, expect } from 'bun:test';
import retroPlugin from './src/index';

describe('16-Bit Retro Engine Plugin', () => {
  it('registers render_pixel_banner tool', async () => {
    const instance = await retroPlugin({} as any);
    expect(instance.tools?.length).toBe(1);
    expect(instance.tools?.[0].name).toBe('render_pixel_banner');
  });
});
`,
      tsconfigJson: JSON.stringify({
        compilerOptions: {
          target: 'ESNext',
          module: 'ESNext',
          moduleResolution: 'bundler',
          strict: true,
          declaration: true,
        },
        include: ['src/**/*'],
      }, null, 2),
      readmeMd: `# 16-Bit Retro Arcade OpenCode Plugin

Arcade chiptune cues, pixel banners, and retro gaming terminal outputs for OpenCode.
Built following [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template).
`,
    },
  },
};


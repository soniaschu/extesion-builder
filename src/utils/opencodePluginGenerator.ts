import { OpenCodePluginConfig } from '../types';

export interface PluginBuildOptions {
  name: string;
  title: string;
  description: string;
  author: string;
  githubOwner: string;
  version: string;
  license: string;
  hooks: string[];
  tools: {
    name: string;
    description: string;
    parametersSchema: string;
    handlerBody?: string;
  }[];
}

/**
 * Creates an entire OpenCode plugin project modeled strictly on:
 * https://github.com/zenobi-us/opencode-plugin-template
 */
export function buildOpenCodePluginProject(options: PluginBuildOptions): OpenCodePluginConfig {
  const safeName = options.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-opencode-plugin';

  const owner = options.githubOwner || 'zenobi-us';
  const author = options.author || 'ChamberCraft Developer';
  const version = options.version || '1.0.0';
  const license = options.license || 'MIT';

  // package.json modeled on zenobi-us/opencode-plugin-template
  const packageJson = JSON.stringify(
    {
      name: safeName,
      version: version,
      description: options.description || 'OpenCode extension plugin',
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      type: 'module',
      author: author,
      license: license,
      repository: {
        type: 'git',
        url: `https://github.com/${owner}/${safeName}.git`,
      },
      scripts: {
        build: 'bun build ./src/index.ts --outdir ./dist --target node',
        test: 'bun test',
        typecheck: 'tsc --noEmit',
        lint: 'eslint src/ tests/',
        format: 'prettier --write "src/**/*.{ts,js,json}"',
      },
      keywords: ['opencode', 'opencode-plugin', 'ai-agent', 'bun', 'tools'],
      peerDependencies: {
        '@opencode-ai/plugin': '^0.1.0',
      },
      devDependencies: {
        '@opencode-ai/plugin': '^0.1.0',
        '@types/bun': '^1.2.0',
        typescript: '^5.7.0',
        zod: '^3.24.0',
      },
    },
    null,
    2
  );

  // tsconfig.json
  const tsconfigJson = JSON.stringify(
    {
      compilerOptions: {
        target: 'ESNext',
        module: 'ESNext',
        moduleResolution: 'bundler',
        lib: ['ESNext'],
        strict: true,
        declaration: true,
        outDir: './dist',
        skipLibCheck: true,
        types: ['bun-types'],
      },
      include: ['src/**/*', 'tests/**/*'],
    },
    null,
    2
  );

  // src/tools/customTool.ts
  const toolsCode = options.tools && options.tools.length > 0
    ? `import { z } from 'zod';

${options.tools.map((t) => `
export const ${t.name.replace(/[^a-zA-Z0-9_]/g, '_')}Tool = {
  name: '${t.name}',
  description: '${t.description.replace(/'/g, "\\'")}',
  parameters: ${t.parametersSchema || 'z.object({})'},
  execute: async (args: any) => {
    ${t.handlerBody || `console.log('[${t.name}] Executed with args:', args);
    return { success: true, timestamp: new Date().toISOString(), result: args };`}
  },
};
`).join('\n')}
`
    : `import { z } from 'zod';

export const sampleTool = {
  name: 'sample_tool',
  description: 'A sample tool registered by the OpenCode plugin',
  parameters: z.object({
    message: z.string().describe('Message to echo back'),
  }),
  execute: async ({ message }: { message: string }) => {
    return { echo: message, timestamp: new Date().toISOString() };
  },
};
`;

  // src/index.ts
  const hookRegistrations: string[] = [];

  if (options.hooks.includes('tool.execute.before')) {
    hookRegistrations.push(`    // Hook: intercept tool calls before execution
    'tool.execute.before': async (event) => {
      const { tool, args } = event;
      console.log(\`[${safeName}] tool.execute.before: \${tool}\`);

      // Security check: prohibit dangerous root commands
      if (tool === 'run_command' && args?.command) {
        const cmd = String(args.command).trim();
        if (/rm\\s+-rf\\s+[/~]/i.test(cmd) || /drop\\s+database/i.test(cmd)) {
          throw new Error(\`[Security Guard] Prohibited destructive command: \${cmd}\`);
        }
      }

      return event;
    },`);
  }

  if (options.hooks.includes('tool.execute.after')) {
    hookRegistrations.push(`    // Hook: inspect or log tool results after execution
    'tool.execute.after': async (event) => {
      const { tool, durationMs } = event;
      if (durationMs > 3000) {
        console.warn(\`[Performance] Tool \${tool} took \${durationMs}ms\`);
      }
      return event;
    },`);
  }

  if (options.hooks.includes('session.compact.before')) {
    hookRegistrations.push(`    // Hook: process session transcripts prior to context compaction
    'session.compact.before': async (event) => {
      console.log(\`[${safeName}] Session compaction starting. Transcript length: \${event.messages?.length || 0}\`);
      return event;
    },`);
  }

  if (options.hooks.includes('prompt.transform')) {
    hookRegistrations.push(`    // Hook: transform or enrich user prompts before LLM dispatch
    'prompt.transform': async (event) => {
      console.log(\`[${safeName}] Transforming user prompt\`);
      return event;
    },`);
  }

  if (options.hooks.includes('session.idle')) {
    hookRegistrations.push(`    // Hook: trigger background audit when agent session is idle
    'session.idle': async (event) => {
      console.log(\`[${safeName}] Session idle detected. Ready for next prompt.\`);
      return event;
    },`);
  }

  const primaryToolName = options.tools?.[0]
    ? `${options.tools[0].name.replace(/[^a-zA-Z0-9_]/g, '_')}Tool`
    : 'sampleTool';

  const indexTs = `import type { Plugin } from '@opencode-ai/plugin';
import { ${primaryToolName} } from './tools/customTool';

/**
 * ${options.title}
 * Built following official template: https://github.com/zenobi-us/opencode-plugin-template
 */
export const ${safeName.replace(/[^a-zA-Z0-9]/g, '')}Plugin: Plugin = async ({ project, directory, client, $ }) => {
  console.log(\`🚀 [${options.title}] Initialized in \${directory}\`);

  return {
    // Custom tools available to OpenCode assistant
    tools: [${primaryToolName}],

${hookRegistrations.join('\n\n')}
  };
};

export default ${safeName.replace(/[^a-zA-Z0-9]/g, '')}Plugin;
`;

  // tests/index.test.ts
  const testTs = `import { describe, expect, it } from 'bun:test';
import plugin from '../src/index';

describe('${options.title}', () => {
  it('initializes plugin with expected hooks and tools', async () => {
    const mockContext: any = {
      project: { name: 'test-project' },
      directory: '/workspace/test',
      client: {},
      $: async () => ({ stdout: '' }),
    };

    const instance = await plugin(mockContext);
    expect(instance).toBeDefined();
    expect(Array.isArray(instance.tools)).toBe(true);
    expect(instance.tools.length).toBeGreaterThan(0);
  });

  ${options.hooks.includes('tool.execute.before') ? `it('intercepts dangerous rm commands', async () => {
    const mockContext: any = { directory: '/test' };
    const instance = await plugin(mockContext);
    const hook = (instance as any)['tool.execute.before'];

    if (hook) {
      await expect(
        hook({
          tool: 'run_command',
          args: { command: 'rm -rf /' },
        })
      ).rejects.toThrow();
    }
  });` : ''}
});
`;

  // setup.sh (from zenobi-us/opencode-plugin-template)
  const setupSh = `#!/usr/bin/env bash
# Official setup script adapted from zenobi-us/opencode-plugin-template
set -e

echo "🚀 Setting up ${options.title} (${safeName})..."

# Check for bun
if ! command -v bun &> /dev/null; then
  echo "⚠️  Bun not detected. Install bun via: curl -fsSL https://bun.sh/install | bash"
fi

echo "📦 Installing plugin dependencies..."
bun install

echo "🧪 Running test suite..."
bun test

echo "✅ OpenCode plugin '${safeName}' configured successfully!"
echo "Add to your opencode.json:"
echo "  { \"plugins\": [\"./${safeName}\"] }"
`;

  // README.md
  const readmeMd = `# ${options.title} ⚡

> ${options.description}

[![Built with zenobi-us/opencode-plugin-template](https://img.shields.io/badge/template-zenobi--us%2Fopencode--plugin--template-blue?style=flat-square&logo=github)](https://github.com/zenobi-us/opencode-plugin-template)
[![Bun](https://img.shields.io/badge/runtime-bun-f472b6?style=flat-square&logo=bun)](https://bun.sh)
[![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-emerald?style=flat-square)]()

## 🛠️ Features & Hooks
- **Hooks Active**: \`${options.hooks.join('`, `')}\`
- **Registered Tools**: \`${options.tools?.map((t) => t.name).join('`, `') || 'None'}\`
- **TypeScript Support**: Full strict mode with types and Bun test suite.

## 🚀 Quick Start

\`\`\`bash
# 1. Run setup script
chmod +x setup.sh
./setup.sh

# 2. Run unit tests
bun test

# 3. Build plugin
bun run build
\`\`\`

## 📦 How to Use in OpenCode
Add this plugin to your active \`opencode.json\` or project configuration:

\`\`\`json
{
  "$schema": "https://opencode.ai/schema.json",
  "plugins": [
    "./${safeName}"
  ]
}
\`\`\`

## 📄 License
${license} © [${author}]
`;

  // .github/workflows/ci.yml
  const ciYml = `name: Plugin CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install
      - run: bun run typecheck
      - run: bun test
`;

  return {
    id: safeName,
    name: safeName,
    title: options.title,
    version: version,
    description: options.description,
    author: author,
    githubOwner: owner,
    license: license,
    templateRepo: 'https://github.com/zenobi-us/opencode-plugin-template',
    hooks: options.hooks,
    tools: options.tools?.map((t) => ({
      name: t.name,
      description: t.description,
      parametersSchema: t.parametersSchema,
    })),
    files: {
      packageJson,
      tsconfigJson,
      indexTs,
      customToolTs: toolsCode,
      testTs,
      setupSh,
      readmeMd,
      ciYml,
    },
  };
}

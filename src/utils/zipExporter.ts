import JSZip from 'jszip';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig, GitHubExportConfig } from '../types';
import { buildIconThemePack } from './svgIconGenerator';

export function triggerBrowserDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Builds and downloads a ready-to-run VS Code Theme & Icon extension ZIP.
 */
export async function downloadVSCodeExtensionZip(
  theme: VSCodeThemeConfig,
  iconConfig?: IconThemeConfig
) {
  const zip = new JSZip();
  const rootDir = `${theme.id}-vscode`;

  // VS Code package.json
  const contributesThemes = [
    {
      label: theme.displayName,
      uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
      path: `./themes/${theme.name}-color-theme.json`,
    },
  ];

  const contributesIconThemes = iconConfig
    ? [
        {
          id: iconConfig.id,
          label: iconConfig.displayName,
          path: './icons/icon-theme.json',
        },
      ]
    : [];

  const manifest = {
    name: theme.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    displayName: theme.displayName,
    description: theme.description,
    version: theme.version || '1.0.0',
    publisher: theme.author.toLowerCase().replace(/[^a-z0-9]/g, '') || 'chambercraft',
    engines: {
      vscode: '^1.85.0',
    },
    categories: ['Themes'],
    keywords: ['theme', 'color-theme', 'dark-theme', 'syntax-highlighting', 'icons', 'openchamber'],
    contributes: {
      themes: contributesThemes,
      ...(contributesIconThemes.length > 0 ? { iconThemes: contributesIconThemes } : {}),
    },
  };

  zip.file(`${rootDir}/package.json`, JSON.stringify(manifest, null, 2));

  // Color theme JSON
  const colorThemeJson = {
    $schema: 'vscode://schemas/color-theme',
    name: theme.displayName,
    type: theme.type,
    colors: theme.colors,
    tokenColors: theme.tokenColors,
    semanticHighlighting: true,
  };
  zip.file(`${rootDir}/themes/${theme.name}-color-theme.json`, JSON.stringify(colorThemeJson, null, 2));

  // Icon pack
  if (iconConfig) {
    const pack = buildIconThemePack(iconConfig);
    zip.file(`${rootDir}/icons/icon-theme.json`, pack.iconThemeJson);
    Object.entries(pack.definitions).forEach(([fileName, svgContent]) => {
      zip.file(`${rootDir}/icons/${fileName}`, svgContent);
    });
  }

  // README.md
  const readmeContent = `# ${theme.displayName}

${theme.description}

## Quick Installation

### Method 1: Drop into VS Code extensions folder
1. Extract this folder.
2. Copy the folder into your VS Code extensions directory:
   - **macOS/Linux**: \`~/.vscode/extensions/${theme.name}\`
   - **Windows**: \`%USERPROFILE%\\.vscode\\extensions\\${theme.name}\`
3. Restart VS Code and press \`Ctrl+K Ctrl+T\` (or \`Cmd+K Cmd+T\` on macOS) to activate **"${theme.displayName}"**.

### Method 2: Package with vsce (.vsix)
\`\`\`bash
npm install -g @vscode/vsce
vsce package
code --install-extension ${theme.name}-1.0.0.vsix
\`\`\`

## Included Token Highlighting & Symbols
- Hand-tuned syntax scopes for TypeScript, JavaScript, Python, Rust, Go, HTML, CSS, JSON, and Markdown.
- WCAG AA compliant contrast ratio against editor background.
${iconConfig ? `- Integrated vector icon pack with ${iconConfig.icons.length} custom file symbols and folder icons.` : ''}

Generated with **ChamberCraft Studio**.
`;
  zip.file(`${rootDir}/README.md`, readmeContent);

  // .vscodeignore
  zip.file(
    `${rootDir}/.vscodeignore`,
    `.vscode/**
.git/**
.gitignore
node_modules/**
vsc-extension-quickstart.md
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `${theme.id}-vscode-extension.zip`);
}

/**
 * Builds and downloads a complete OpenChamber SDK extension ZIP.
 */
export async function downloadOpenChamberZip(ext: OpenChamberExtensionConfig) {
  const zip = new JSZip();
  const rootDir = `${ext.manifest.name}-openchamber`;

  // package.json with openchamber block
  const packageJson = {
    name: ext.manifest.name,
    version: ext.manifest.version,
    description: ext.manifest.description,
    author: ext.manifest.author,
    main: ext.manifest.entry,
    openchamber: {
      name: ext.manifest.name,
      title: ext.manifest.title,
      entry: ext.manifest.entry,
      icon: ext.manifest.icon,
      permissions: ext.manifest.permissions,
      categories: ext.manifest.categories,
    },
    dependencies: {
      '@openchamber/sdk': '^1.0.0',
    },
  };

  zip.file(`${rootDir}/package.json`, JSON.stringify(packageJson, null, 2));
  zip.file(`${rootDir}/panel/index.html`, ext.html);
  zip.file(`${rootDir}/panel/main.js`, ext.js);
  zip.file(`${rootDir}/panel/style.css`, ext.css);
  zip.file(`${rootDir}/icon.svg`, ext.svgIcon);
  zip.file(`${rootDir}/README.md`, ext.readme || `# ${ext.manifest.title}\n\n${ext.manifest.description}`);

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `${ext.manifest.name}-openchamber.zip`);
}

/**
 * Builds and downloads an isolated Icon Pack ZIP with full SVGs and icon-theme.json.
 */
export async function downloadIconPackZip(iconConfig: IconThemeConfig) {
  const zip = new JSZip();
  const rootDir = `${iconConfig.id}-iconpack`;

  const pack = buildIconThemePack(iconConfig);
  zip.file(`${rootDir}/icon-theme.json`, pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([fileName, svgContent]) => {
    zip.file(`${rootDir}/${fileName}`, svgContent);
  });

  zip.file(
    `${rootDir}/README.md`,
    `# ${iconConfig.displayName}

Contains ${iconConfig.icons.length} vector symbol icons and folder graphics.
Installable into any VS Code extension by referencing \`icon-theme.json\` in \`package.json\`.
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `${iconConfig.id}.zip`);
}

/**
 * Builds and downloads a complete GitHub repository ZIP archive ready for `git push`.
 */
export async function downloadGitHubRepoZip(
  theme: VSCodeThemeConfig,
  iconConfig: IconThemeConfig,
  ext: OpenChamberExtensionConfig,
  githubConfig: GitHubExportConfig
) {
  const zip = new JSZip();
  const repoName = githubConfig.repoName || `${theme.name}-suite`;

  // VS Code package.json
  const contributesThemes = [
    {
      label: theme.displayName,
      uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
      path: `./themes/${theme.name}-color-theme.json`,
    },
  ];
  const contributesIconThemes = [
    {
      id: iconConfig.id,
      label: iconConfig.displayName,
      path: './icons/icon-theme.json',
    },
  ];

  const packageJson = {
    name: repoName,
    displayName: theme.displayName,
    description: theme.description,
    version: theme.version || '1.0.0',
    publisher: githubConfig.owner || theme.author.toLowerCase().replace(/[^a-z0-9]/g, '') || 'chambercraft',
    repository: {
      type: 'git',
      url: `https://github.com/${githubConfig.owner || 'developer'}/${repoName}.git`,
    },
    engines: {
      vscode: '^1.85.0',
    },
    categories: ['Themes'],
    keywords: ['theme', 'color-theme', 'dark-theme', 'icons', 'openchamber'],
    contributes: {
      themes: contributesThemes,
      iconThemes: contributesIconThemes,
    },
    scripts: {
      package: 'vsce package',
      publish: 'vsce publish',
    },
  };

  zip.file(`${repoName}/package.json`, JSON.stringify(packageJson, null, 2));

  // Themes
  zip.file(
    `${repoName}/themes/${theme.name}-color-theme.json`,
    JSON.stringify(
      {
        $schema: 'vscode://schemas/color-theme',
        name: theme.displayName,
        type: theme.type,
        colors: theme.colors,
        tokenColors: theme.tokenColors,
        semanticHighlighting: true,
      },
      null,
      2
    )
  );

  // Icons
  const pack = buildIconThemePack(iconConfig);
  zip.file(`${repoName}/icons/icon-theme.json`, pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([f, c]) => {
    zip.file(`${repoName}/icons/${f}`, c);
  });

  // OpenChamber Extension companion directory
  if (githubConfig.includeOpenChamber) {
    const chamberDir = `${repoName}/openchamber-extension`;
    zip.file(
      `${chamberDir}/package.json`,
      JSON.stringify(
        {
          name: ext.manifest.name,
          version: ext.manifest.version,
          description: ext.manifest.description,
          main: ext.manifest.entry,
          openchamber: ext.manifest,
          dependencies: { '@openchamber/sdk': '^1.0.0' },
        },
        null,
        2
      )
    );
    zip.file(`${chamberDir}/panel/index.html`, ext.html);
    zip.file(`${chamberDir}/panel/main.js`, ext.js);
    zip.file(`${chamberDir}/panel/style.css`, ext.css);
    zip.file(`${chamberDir}/icon.svg`, ext.svgIcon);
    zip.file(`${chamberDir}/README.md`, ext.readme);
  }

  // GitHub Actions Workflows
  if (githubConfig.includeActions) {
    const publishWorkflow = `name: Publish VS Code Extension & OpenVSX

on:
  release:
    types: [created]
  workflow_dispatch:

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Dependencies
        run: npm install -g @vscode/vsce ovsx

      - name: Package VSIX
        run: vsce package

      - name: Publish to VS Code Marketplace
        if: env.VSCE_PAT != ''
        run: vsce publish -p \${{ secrets.VSCE_PAT }}
        env:
          VSCE_PAT: \${{ secrets.VSCE_PAT }}

      - name: Publish to Open VSX Registry
        if: env.OVSX_PAT != ''
        run: ovsx publish -p \${{ secrets.OVSX_PAT }}
        env:
          OVSX_PAT: \${{ secrets.OVSX_PAT }}
`;
    zip.file(`${repoName}/.github/workflows/publish-marketplace.yml`, publishWorkflow);

    const ciWorkflow = `name: Theme CI & Validation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Validate Theme JSON Syntax
        run: |
          node -e "JSON.parse(require('fs').readFileSync('themes/${theme.name}-color-theme.json', 'utf8')); console.log('Theme JSON is valid!');"
          node -e "JSON.parse(require('fs').readFileSync('icons/icon-theme.json', 'utf8')); console.log('Icon Theme JSON is valid!');"
`;
    zip.file(`${repoName}/.github/workflows/ci.yml`, ciWorkflow);
  }

  // README with Shields.io badges
  const readmeMd = `# ${theme.displayName} 🎨

![Visual Studio Marketplace Version](https://img.shields.io/badge/vs%20code-marketplace-blue?style=flat-square&logo=visualstudiocode)
![Open VSX Version](https://img.shields.io/badge/open%20vsx-registry-purple?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![WCAG](https://img.shields.io/badge/WCAG-AA%20Compliant-teal?style=flat-square)

${theme.description}

## 🌟 Highlights
- **Engineered for Endurance**: High-contrast, WCAG AA compliant palette reducing eye strain.
- **30+ Vector File Symbols**: Custom SVG icon pack for TypeScript, React, Python, Rust, Docker, and folders.
- **OpenChamber SDK Integration**: Companion extension for [OpenChamber Agentic IDE](https://docs.openchamber.dev/sdk/).

## 🚀 Quick Start

### Install from Marketplace / VSIX
\`\`\`bash
npm install -g @vscode/vsce
vsce package
code --install-extension ${repoName}-1.0.0.vsix
\`\`\`

### Manual Local Install
\`\`\`bash
# Linux/macOS
mkdir -p ~/.vscode/extensions/${repoName}
cp -r themes icons package.json ~/.vscode/extensions/${repoName}/

# Windows (PowerShell)
Copy-Item -Recurse themes, icons, package.json $env:USERPROFILE\\.vscode\\extensions\\${repoName}
\`\`\`

## 🛠️ Contributing
Pull requests are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License
MIT © [${githubConfig.owner || 'ChamberCraft'}]
`;
  zip.file(`${repoName}/README.md`, readmeMd);

  // LICENSE (MIT)
  const licenseContent = `MIT License

Copyright (c) ${new Date().getFullYear()} ${githubConfig.owner || 'ChamberCraft'}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
`;
  zip.file(`${repoName}/LICENSE`, licenseContent);

  // CONTRIBUTING.md
  if (githubConfig.includeContributing) {
    const contributingMd = `# Contributing to ${theme.displayName}

Thank you for your interest in improving this theme and icon pack!

## How to Test Changes
1. Open this repository in VS Code.
2. Press \`F5\` to launch an **Extension Development Host** window with the theme loaded.
3. Test syntax highlighting against different languages in the test workspace.
4. Verify WCAG AA contrast ratio (minimum 4.5:1 text contrast).
`;
    zip.file(`${repoName}/CONTRIBUTING.md`, contributingMd);
  }

  // CHANGELOG.md
  zip.file(
    `${repoName}/CHANGELOG.md`,
    `# Change Log

## [1.0.0] - ${new Date().toISOString().split('T')[0]}
- Initial release of **${theme.displayName}**.
- Integrated full SVG icon pack for 30+ language symbols.
- Added OpenChamber SDK extension panel support.
`
  );

  // .gitignore
  zip.file(
    `${repoName}/.gitignore`,
    `node_modules/
.vscode-test/
*.vsix
.DS_Store
dist/
`
  );

  // .vscodeignore
  zip.file(
    `${repoName}/.vscodeignore`,
    `.vscode/**
.github/**
openchamber-extension/**
CONTRIBUTING.md
.gitignore
`
  );

  // Helper bash script to push to GitHub in one command
  const pushScript = `#!/usr/bin/env bash
# Push to GitHub helper script
git init -b main
git add .
git commit -m "feat: initial commit of ${theme.displayName} with full icon pack"
gh repo create ${githubConfig.owner ? `${githubConfig.owner}/` : ''}${repoName} ${githubConfig.isPrivate ? '--private' : '--public'} --source=. --remote=origin --push
echo "Repository published to https://github.com/${githubConfig.owner || 'username'}/${repoName}"
`;
  zip.file(`${repoName}/scripts/publish-to-github.sh`, pushScript);

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `${repoName}-github-repo.zip`);
}

/**
 * Downloads a combined bundle with VS Code theme + OpenChamber extension.
 */
export async function downloadFullStudioBundle(
  theme: VSCodeThemeConfig,
  iconConfig: IconThemeConfig,
  ext: OpenChamberExtensionConfig
) {
  const zip = new JSZip();
  const rootDir = `chambercraft-${theme.id}-bundle`;

  // VS Code extension inside vscode-theme/
  const vscodeDir = `${rootDir}/vscode-theme`;
  const contributesThemes = [
    {
      label: theme.displayName,
      uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
      path: `./themes/${theme.name}-color-theme.json`,
    },
  ];
  const manifest = {
    name: theme.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    displayName: theme.displayName,
    description: theme.description,
    version: theme.version,
    publisher: 'chambercraft',
    engines: { vscode: '^1.85.0' },
    categories: ['Themes'],
    contributes: {
      themes: contributesThemes,
      iconThemes: [{ id: iconConfig.id, label: iconConfig.displayName, path: './icons/icon-theme.json' }],
    },
  };

  zip.file(`${vscodeDir}/package.json`, JSON.stringify(manifest, null, 2));
  zip.file(`${vscodeDir}/themes/${theme.name}-color-theme.json`, JSON.stringify({
    name: theme.displayName,
    type: theme.type,
    colors: theme.colors,
    tokenColors: theme.tokenColors,
  }, null, 2));

  const pack = buildIconThemePack(iconConfig);
  zip.file(`${vscodeDir}/icons/icon-theme.json`, pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([f, c]) => {
    zip.file(`${vscodeDir}/icons/${f}`, c);
  });

  // OpenChamber Extension inside openchamber-extension/
  const chamberDir = `${rootDir}/openchamber-extension`;
  zip.file(`${chamberDir}/package.json`, JSON.stringify({
    name: ext.manifest.name,
    version: ext.manifest.version,
    description: ext.manifest.description,
    main: ext.manifest.entry,
    openchamber: ext.manifest,
    dependencies: { '@openchamber/sdk': '^1.0.0' },
  }, null, 2));
  zip.file(`${chamberDir}/panel/index.html`, ext.html);
  zip.file(`${chamberDir}/panel/main.js`, ext.js);
  zip.file(`${chamberDir}/panel/style.css`, ext.css);
  zip.file(`${chamberDir}/icon.svg`, ext.svgIcon);

  // Bundle README
  zip.file(`${rootDir}/README.md`, `# ChamberCraft Combined Suite

Contains:
1. **vscode-theme**: Complete VS Code theme & 30+ icon pack ready for VS Code / VSCodium / Cursor.
2. **openchamber-extension**: Fully runnable OpenChamber extension following https://docs.openchamber.dev/sdk/.
`);

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `chambercraft-complete-suite.zip`);
}

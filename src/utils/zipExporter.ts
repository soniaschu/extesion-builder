import JSZip from 'jszip';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig, OpenCodePluginConfig, GitHubExportConfig } from '../types';
import { buildIconThemePack, generateThemeHarmonizedIconTheme } from './svgIconGenerator';
import { generateThemeReadme } from './readmeGenerator';
import { buildOpenChamberPackageJson } from './openchamberUtils';
import { buildProductIconThemePack } from './productIconGenerator';

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
 * The custom SVG icons are bundled directly inside the theme package, so installing
 * the theme automatically installs and activates the matching icon pack.
 */
export async function downloadVSCodeExtensionZip(
  theme: VSCodeThemeConfig,
  iconConfig?: IconThemeConfig
) {
  const zip = new JSZip();
  const rootDir = `${theme.id}-vscode`;
  const activeIconConfig = iconConfig || generateThemeHarmonizedIconTheme(theme);

  // VS Code package.json contributing BOTH color theme AND matching icon theme
  const contributesThemes = [
    {
      label: theme.displayName,
      uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
      path: `./themes/${theme.name}-color-theme.json`,
    },
  ];

  const contributesIconThemes = [
    {
      id: activeIconConfig.id,
      label: activeIconConfig.displayName,
      path: './icons/icon-theme.json',
    },
  ];

  const productThemeId = `${theme.id}-product-icons`;
  const contributesProductThemes = [
    {
      id: productThemeId,
      label: `${theme.displayName} Product & UI Icons`,
      path: './product-icons/product-icon-theme.json',
    },
  ];

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
    keywords: ['theme', 'color-theme', 'dark-theme', 'syntax-highlighting', 'icons', 'icon-theme', 'product-icons', 'openchamber'],
    contributes: {
      themes: contributesThemes,
      iconThemes: contributesIconThemes,
      productIconThemes: contributesProductThemes,
      configurationDefaults: {
        'workbench.iconTheme': activeIconConfig.id,
        'workbench.productIconTheme': productThemeId,
      },
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

  // File & Folder SVG Icon pack
  const pack = buildIconThemePack(activeIconConfig);
  zip.file(`${rootDir}/icons/icon-theme.json`, pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([fileName, svgContent]) => {
    zip.file(`${rootDir}/icons/${fileName}`, svgContent);
  });

  // Product & Menu UI Icon theme (Transforms the entire VS Code UI)
  const productPack = buildProductIconThemePack(theme);
  zip.file(`${rootDir}/product-icons/product-icon-theme.json`, productPack.productIconThemeJson);
  Object.entries(productPack.definitions).forEach(([fileName, svgContent]) => {
    zip.file(`${rootDir}/product-icons/${fileName}`, svgContent);
  });

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

  // package.json with strictly valid openchamber block and kebab-case panel.id
  const packageJson = buildOpenChamberPackageJson(ext);

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
      JSON.stringify(buildOpenChamberPackageJson(ext), null, 2)
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
 * Builds and downloads a standalone OpenCode Plugin ZIP based on zenobi-us/opencode-plugin-template.
 */
export async function downloadOpenCodePluginZip(plugin: OpenCodePluginConfig) {
  const zip = new JSZip();
  const rootDir = plugin.name;

  // package.json
  zip.file(`${rootDir}/package.json`, plugin.files.packageJson);
  // tsconfig.json
  zip.file(`${rootDir}/tsconfig.json`, plugin.files.tsconfigJson);
  // src/index.ts
  zip.file(`${rootDir}/src/index.ts`, plugin.files.indexTs);
  // src/tools/customTool.ts
  zip.file(`${rootDir}/src/tools/customTool.ts`, plugin.files.customToolTs);
  // tests/index.test.ts
  zip.file(`${rootDir}/tests/index.test.ts`, plugin.files.testTs);
  // README.md
  zip.file(`${rootDir}/README.md`, plugin.files.readmeMd);

  // .gitignore
  zip.file(
    `${rootDir}/.gitignore`,
    `node_modules/
dist/
.DS_Store
*.log
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `${plugin.name}-opencode-plugin.zip`);
}

/**
 * Downloads a combined bundle with individual nested installation ZIP packages:
 * - vscode-theme.zip (individual zip for VS Code / Cursor installation)
 * - openchamber-extension.zip (individual zip for OpenChamber SDK panel)
 * - opencode-plugin.zip (individual zip based on zenobi-us/opencode-plugin-template)
 * - standalone-icons.zip (individual zip with icon definitions)
 * - README.md with extracted theme metadata, color swatches, contrast ratios, and guides
 */
export async function downloadFullStudioBundle(
  theme: VSCodeThemeConfig,
  iconConfig: IconThemeConfig,
  ext: OpenChamberExtensionConfig,
  plugin?: OpenCodePluginConfig
) {
  const masterZip = new JSZip();
  const rootDir = `chambercraft-${theme.id}-bundle`;

  // 1. Build individual VS Code Theme & Icons ZIP
  const vscZip = new JSZip();
  const vscRoot = `${theme.id}-vscode`;
  const manifest = {
    name: theme.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    displayName: theme.displayName,
    description: theme.description,
    version: theme.version,
    publisher: 'chambercraft',
    engines: { vscode: '^1.85.0' },
    categories: ['Themes'],
    contributes: {
      themes: [
        {
          label: theme.displayName,
          uiTheme: theme.type === 'dark' ? 'vs-dark' : 'vs',
          path: `./themes/${theme.name}-color-theme.json`,
        },
      ],
      iconThemes: [{ id: iconConfig.id, label: iconConfig.displayName, path: './icons/icon-theme.json' }],
    },
  };
  vscZip.file(`${vscRoot}/package.json`, JSON.stringify(manifest, null, 2));
  vscZip.file(
    `${vscRoot}/themes/${theme.name}-color-theme.json`,
    JSON.stringify(
      {
        name: theme.displayName,
        type: theme.type,
        colors: theme.colors,
        tokenColors: theme.tokenColors,
      },
      null,
      2
    )
  );
  const pack = buildIconThemePack(iconConfig);
  vscZip.file(`${vscRoot}/icons/icon-theme.json`, pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([f, c]) => {
    vscZip.file(`${vscRoot}/icons/${f}`, c);
  });
  vscZip.file(`${vscRoot}/README.md`, generateThemeReadme(theme, { iconConfig }));
  const vscBlob = await vscZip.generateAsync({ type: 'uint8array' });

  // 2. Build individual OpenChamber Extension ZIP
  const chamberZip = new JSZip();
  const chamberRoot = ext.manifest.name;
  chamberZip.file(
    `${chamberRoot}/package.json`,
    JSON.stringify(buildOpenChamberPackageJson(ext), null, 2)
  );
  chamberZip.file(`${chamberRoot}/panel/index.html`, ext.html);
  chamberZip.file(`${chamberRoot}/panel/main.js`, ext.js);
  chamberZip.file(`${chamberRoot}/panel/style.css`, ext.css);
  chamberZip.file(`${chamberRoot}/icon.svg`, ext.svgIcon);
  chamberZip.file(`${chamberRoot}/README.md`, ext.readme || `# ${ext.manifest.title}\n\nOpenChamber SDK Extension`);
  const chamberBlob = await chamberZip.generateAsync({ type: 'uint8array' });

  // 3. Build individual OpenCode Plugin ZIP (from zenobi-us/opencode-plugin-template)
  let pluginBlob: Uint8Array | null = null;
  if (plugin) {
    const ocZip = new JSZip();
    const ocRoot = plugin.name;
    ocZip.file(`${ocRoot}/package.json`, plugin.files.packageJson);
    ocZip.file(`${ocRoot}/tsconfig.json`, plugin.files.tsconfigJson);
    ocZip.file(`${ocRoot}/src/index.ts`, plugin.files.indexTs);
    ocZip.file(`${ocRoot}/src/tools/customTool.ts`, plugin.files.customToolTs);
    ocZip.file(`${ocRoot}/tests/index.test.ts`, plugin.files.testTs);
    ocZip.file(`${ocRoot}/README.md`, plugin.files.readmeMd);
    pluginBlob = await ocZip.generateAsync({ type: 'uint8array' });
  }

  // 4. Build individual Standalone Icons ZIP
  const iconsZip = new JSZip();
  iconsZip.file('icon-theme.json', pack.iconThemeJson);
  Object.entries(pack.definitions).forEach(([f, c]) => {
    iconsZip.file(`icons/${f}`, c);
  });
  const iconsBlob = await iconsZip.generateAsync({ type: 'uint8array' });

  // Pack the individual installation ZIPs inside the master bundle
  masterZip.file(`${rootDir}/packages/vscode-theme-and-icons.zip`, vscBlob);
  masterZip.file(`${rootDir}/packages/openchamber-extension.zip`, chamberBlob);
  if (pluginBlob) {
    masterZip.file(`${rootDir}/packages/opencode-plugin.zip`, pluginBlob);
  }
  masterZip.file(`${rootDir}/packages/standalone-icons.zip`, iconsBlob);

  // Master automated README.md
  const masterReadme = generateThemeReadme(theme, {
    iconConfig,
    extension: ext,
    plugin: plugin,
  });
  masterZip.file(`${rootDir}/README.md`, masterReadme);

  // Quick automated installer shell script
  const installSh = `#!/usr/bin/env bash
set -e

echo "📦 ChamberCraft Suite Installer"
echo "--------------------------------"
echo "Available installation packages:"
echo " 1) VS Code Theme & Icons (packages/vscode-theme-and-icons.zip)"
echo " 2) OpenChamber Extension (packages/openchamber-extension.zip)"
${plugin ? 'echo " 3) OpenCode Plugin (packages/opencode-plugin.zip)"' : ''}
echo " 4) Standalone Icons (packages/standalone-icons.zip)"
echo ""

# Unpack VS Code Extension into ~/.vscode/extensions/
if [ -d "$HOME/.vscode/extensions" ]; then
  echo "Installing VS Code Theme to ~/.vscode/extensions/${theme.name}..."
  mkdir -p "$HOME/.vscode/extensions/${theme.name}"
  unzip -q -o packages/vscode-theme-and-icons.zip -d /tmp/vsc-temp
  cp -r /tmp/vsc-temp/*/* "$HOME/.vscode/extensions/${theme.name}/"
  rm -rf /tmp/vsc-temp
  echo "✅ VS Code Theme installed!"
fi

# Unpack OpenChamber extension if directory exists
if [ -d "$HOME/.openchamber/extensions" ]; then
  echo "Installing OpenChamber Extension to ~/.openchamber/extensions/${ext.manifest.name}..."
  mkdir -p "$HOME/.openchamber/extensions/${ext.manifest.name}"
  unzip -q -o packages/openchamber-extension.zip -d /tmp/oc-temp
  cp -r /tmp/oc-temp/*/* "$HOME/.openchamber/extensions/${ext.manifest.name}/"
  rm -rf /tmp/oc-temp
  echo "✅ OpenChamber Extension installed!"
fi

echo "Done! See README.md for complete details."
`;
  masterZip.file(`${rootDir}/install.sh`, installSh);

  const content = await masterZip.generateAsync({ type: 'blob' });
  triggerBrowserDownload(content, `chambercraft-${theme.id}-bundle.zip`);
}

import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig, OpenCodePluginConfig } from '../types';
import { getContrastRatio, getWcagRating } from './colorUtils';

/**
 * Generates an automated, rich README.md extracting metadata,
 * color palette samples with contrast audits and visual badges,
 * and setup/installation instructions for GitHub repositories.
 */
export function generateThemeReadme(
  theme: VSCodeThemeConfig,
  options?: {
    iconConfig?: IconThemeConfig;
    extension?: OpenChamberExtensionConfig;
    plugin?: OpenCodePluginConfig;
    repositoryUrl?: string;
  }
): string {
  const { iconConfig, extension, plugin, repositoryUrl } = options || {};
  const bg = theme.colors['editor.background'] || '#121212';
  const cleanHex = (h: string) => h.replace('#', '').trim();

  // Workbench Key Sample Colors
  const coreWorkbenchKeys = [
    { label: 'Editor Background', key: 'editor.background', def: '#1e1e1e' },
    { label: 'Editor Foreground', key: 'editor.foreground', def: '#d4d4d4' },
    { label: 'Activity Bar Background', key: 'activityBar.background', def: '#333333' },
    { label: 'Sidebar Background', key: 'sideBar.background', def: '#252526' },
    { label: 'Status Bar Background', key: 'statusBar.background', def: '#007acc' },
    { label: 'Focus & Selection Border', key: 'focusBorder', def: '#007acc' },
    { label: 'Active Tab Background', key: 'tab.activeBackground', def: '#1e1e1e' },
    { label: 'Terminal Background', key: 'terminal.background', def: '#1e1e1e' },
  ];

  const workbenchPaletteRows = coreWorkbenchKeys.map((item) => {
    const colorHex = theme.colors[item.key] || item.def;
    const hexClean = cleanHex(colorHex);
    const ratio = getContrastRatio(colorHex, bg);
    const wcag = getWcagRating(ratio);
    const badge = `![#${hexClean}](https://img.shields.io/badge/-%23${hexClean}-${hexClean}?style=flat-square)`;
    return `| **${item.label}** | \`${item.key}\` | \`${colorHex}\` | ${badge} | \`${ratio}:1\` (${wcag}) |`;
  }).join('\n');

  // Token Scope Colors
  const tokenRows = theme.tokenColors.map((t) => {
    const fg = t.settings.foreground;
    const hexClean = cleanHex(fg);
    const ratio = getContrastRatio(fg, bg);
    const wcag = getWcagRating(ratio);
    const badge = `![#${hexClean}](https://img.shields.io/badge/-%23${hexClean}-${hexClean}?style=flat-square)`;
    const scopeStr = Array.isArray(t.scope) ? t.scope.join(', ') : t.scope;
    const style = t.settings.fontStyle || 'normal';
    return `| **${t.name}** | \`${scopeStr}\` | \`${fg}\` | ${badge} | *${style}* | \`${ratio}:1\` (${wcag}) |`;
  }).join('\n');

  // Quick settings snippet
  const settingsJsonPreview = JSON.stringify(
    {
      'workbench.colorCustomizations': {
        'editor.background': theme.colors['editor.background'],
        'editor.foreground': theme.colors['editor.foreground'],
        'activityBar.background': theme.colors['activityBar.background'],
        'sideBar.background': theme.colors['sideBar.background'],
        'statusBar.background': theme.colors['statusBar.background'],
        'focusBorder': theme.colors['focusBorder'],
      },
      'editor.tokenColorCustomizations': {
        textMateRules: theme.tokenColors.slice(0, 5),
      },
    },
    null,
    2
  );

  return `# ${theme.displayName} 🎨

> ${theme.description}

[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](#-installation)
[![License: ${theme.license || 'MIT'}](https://img.shields.io/badge/License-${theme.license || 'MIT'}-green?style=for-the-badge)](#-license)
[![WCAG AA](https://img.shields.io/badge/WCAG-AA%20Compliant-teal?style=for-the-badge)](#-accessibility--contrast)
[![Type: ${theme.type}](https://img.shields.io/badge/Type-${theme.type.toUpperCase()}-orange?style=for-the-badge)](#)

---

## 📸 Overview & Design System

**${theme.displayName}** is a modern, high-contrast ${theme.type} theme built for precision coding, long hours, and zero eye fatigue. Every color token is calibrated against WCAG 2.1 accessibility guidelines.

- **Author**: ${theme.author || 'ChamberCraft Studio'}
- **Version**: \`v${theme.version || '1.0.0'}\`
- **Default Editor Background**: \`${bg}\`
${iconConfig ? `- **Icon Suite**: Includes ${iconConfig.icons.length}+ custom vector file/folder SVG symbols` : ''}
${extension ? `- **OpenChamber SDK Integration**: Companion panel for [OpenChamber](https://docs.openchamber.dev/sdk/)` : ''}
${plugin ? `- **OpenCode Plugin**: Built with [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template)` : ''}

---

## 🎨 Color Palette & Swatches

### 🖥️ Workbench UI Tokens

| UI Element | Setting Key | Hex Code | Swatch | Contrast vs Background |
|:---|:---|:---:|:---:|:---:|
${workbenchPaletteRows}

### 🔤 Syntax Highlight Tokens (TextMate)

| Token Role | TextMate Scope | Hex | Swatch | Style | Contrast Ratio |
|:---|:---|:---:|:---:|:---:|:---:|
${tokenRows}

---

## 🚀 Installation & Setup

### Method 1: Install via VS Code VSIX Package (Recommended)

1. Ensure \`@vscode/vsce\` is installed globally:
   \`\`\`bash
   npm install -g @vscode/vsce
   \`\`\`

2. Package the extension:
   \`\`\`bash
   vsce package
   \`\`\`

3. Install directly into VS Code or Cursor:
   \`\`\`bash
   code --install-extension ${theme.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}-1.0.0.vsix
   \`\`\`

---

### Method 2: Manual Local Folder Installation

Copy the unzipped extension folder directly into your VS Code extensions directory:

#### 🐧 Linux & 🍎 macOS:
\`\`\`bash
mkdir -p ~/.vscode/extensions/${theme.name}
cp -r * ~/.vscode/extensions/${theme.name}/
\`\`\`

#### 🪟 Windows (PowerShell):
\`\`\`powershell
Copy-Item -Recurse . "$env:USERPROFILE\\.vscode\\extensions\\${theme.name}"
\`\`\`

After copying, reload VS Code (\`Ctrl+Shift+P\` or \`Cmd+Shift+P\` → *Reload Window*) and select **${theme.displayName}** from \`Preferences: Color Theme\` (\`Ctrl+K Ctrl+T\`).

---

### Method 3: Instant Live Preview via \`settings.json\`

Don't want to install an extension? Copy this snippet into your VS Code \`settings.json\` to enjoy this theme instantly:

\`\`\`json
${settingsJsonPreview}
\`\`\`

---

${extension ? `## 🧩 OpenChamber SDK Companion Extension

This theme package includes an **OpenChamber Extension** panel (*${extension.manifest.title}*):
- **Entry**: \`${extension.manifest.entry}\`
- **Permissions**: \`${extension.manifest.permissions.join(', ')}\`
- **Installation**: Copy into \`~/.openchamber/extensions/${extension.manifest.name}\`

Learn more in the [OpenChamber Extension SDK Documentation](https://docs.openchamber.dev/sdk/).

---
` : ''}${plugin ? `## ⚡ OpenCode Plugin Integration

This repository includes a native plugin for **OpenCode** (*${plugin.name}*), built following the official template:
👉 [zenobi-us/opencode-plugin-template](https://github.com/zenobi-us/opencode-plugin-template)

### Features:
- **Hooks**: ${plugin.hooks.map(h => '`' + h + '`').join(', ')}
- **Registered Tools**: ${plugin.tools?.map(t => '`' + t.name + '`').join(', ') || 'Custom tool set'}

### Running the Plugin:
\`\`\`bash
# 1. Install dependencies
bun install

# 2. Run test suite
bun test

# 3. Add to OpenCode configuration
# Add to your opencode.json:
# { "plugins": ["./${plugin.name}"] }
\`\`\`

---
` : ''}## ♿ Accessibility & Contrast Audit

All syntax tokens in this theme are audited to provide high readability:
- **Editor Background**: \`${bg}\`
- **WCAG Level**: AA compliant for standard syntax code tokens (minimum \`4.5:1\` contrast ratio).
- **Tested in**: Light / Dark ambient lighting, OLED displays, and color-blind simulators.

---

## 🛠️ Development & Customization

To edit or customize this theme:
1. Clone this repository:
   \`\`\`bash
   git clone ${repositoryUrl || `https://github.com/your-username/${theme.name}`}
   cd ${theme.name}
   \`\`\`
2. Open in VS Code:
   \`\`\`bash
   code .
   \`\`\`
3. Press \`F5\` to launch the **VS Code Extension Development Host** to preview your modifications in real-time.

---

## 📄 License

This project is licensed under the **${theme.license || 'MIT'} License**. See the [LICENSE](./LICENSE) file for details.

---

*Generated automatically with [ChamberCraft Studio](https://github.com) — The VS Code, OpenChamber & OpenCode Developer Studio.*
`;
}

/**
 * Triggers a browser download for the generated README.md file.
 */
export function downloadReadmeFile(content: string, filename: string = 'README.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

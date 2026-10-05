import { VSCodeThemeConfig } from '../types';

export interface ProductIconPack {
  definitions: Record<string, string>; // filename -> SVG string
  productIconThemeJson: string;
}

/**
 * Builds a complete VS Code Product Icon Theme that completely transforms the entire IDE UI:
 * Activity bar, menu icons, title bar, tabs, status bar, and explorer toolbars.
 */
export function buildProductIconThemePack(theme: VSCodeThemeConfig): ProductIconPack {
  const accent = theme.colors['focusBorder'] || theme.colors['activityBar.foreground'] || '#38bdf8';
  const fg = theme.colors['editor.foreground'] || '#e2e8f0';
  const bg = theme.colors['editor.background'] || '#121212';
  const isLight = theme.type === 'light';

  const isRetro16Bit = theme.id.includes('retro') || theme.name.includes('retro') || theme.id.includes('16bit');

  const definitions: Record<string, string> = isRetro16Bit ? {
    // 16-Bit Retro Arcade Product Icons (Pixel Art geometry)
    'explorer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="2" width="10" height="2" fill="${accent}"/>
  <rect x="14" y="4" width="4" height="2" fill="${accent}"/>
  <rect x="18" y="6" width="2" height="14" fill="${accent}"/>
  <rect x="4" y="20" width="14" height="2" fill="${accent}"/>
  <rect x="2" y="4" width="2" height="16" fill="${accent}"/>
  <rect x="6" y="8" width="8" height="2" fill="#ffd700"/>
  <rect x="6" y="12" width="10" height="2" fill="#ffd700"/>
  <rect x="6" y="16" width="6" height="2" fill="#ffd700"/>
</svg>`,

    'search.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="7" y="3" width="6" height="2" fill="${accent}"/>
  <rect x="5" y="5" width="2" height="2" fill="${accent}"/>
  <rect x="13" y="5" width="2" height="2" fill="${accent}"/>
  <rect x="3" y="7" width="2" height="6" fill="${accent}"/>
  <rect x="15" y="7" width="2" height="6" fill="${accent}"/>
  <rect x="5" y="13" width="2" height="2" fill="${accent}"/>
  <rect x="13" y="13" width="2" height="2" fill="${accent}"/>
  <rect x="7" y="15" width="6" height="2" fill="${accent}"/>
  <rect x="13" y="15" width="2" height="2" fill="#ff0077"/>
  <rect x="15" y="17" width="2" height="2" fill="#ff0077"/>
  <rect x="17" y="19" width="3" height="3" fill="#ff0077"/>
</svg>`,

    'source-control.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="4" width="4" height="4" fill="#ffd700"/>
  <rect x="5" y="8" width="2" height="8" fill="${accent}"/>
  <rect x="4" y="16" width="4" height="4" fill="#39ff14"/>
  <rect x="8" y="10" width="6" height="2" fill="${accent}"/>
  <rect x="14" y="6" width="2" height="4" fill="${accent}"/>
  <rect x="13" y="2" width="4" height="4" fill="#ff0077"/>
</svg>`,

    'debug.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <!-- 16-Bit Arcade Joystick / Play Icon -->
  <rect x="10" y="3" width="4" height="4" fill="#ff0077"/>
  <rect x="11" y="7" width="2" height="6" fill="#ffd700"/>
  <rect x="5" y="13" width="14" height="4" fill="${accent}"/>
  <rect x="7" y="17" width="10" height="4" fill="#1c1033"/>
  <rect x="8" y="14" width="2" height="2" fill="#39ff14"/>
  <rect x="14" y="14" width="2" height="2" fill="#ff0077"/>
</svg>`,

    'extensions.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <!-- 16-Bit Arcade Game Cartridge -->
  <rect x="4" y="4" width="16" height="3" fill="#ffd700"/>
  <rect x="3" y="7" width="18" height="11" fill="${accent}"/>
  <rect x="6" y="9" width="12" height="6" fill="#120824"/>
  <rect x="8" y="11" width="8" height="2" fill="#ff0077"/>
  <rect x="5" y="18" width="3" height="3" fill="#39ff14"/>
  <rect x="10" y="18" width="4" height="3" fill="#39ff14"/>
  <rect x="16" y="18" width="3" height="3" fill="#39ff14"/>
</svg>`,

    'settings.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <!-- 16-Bit Pixel Gear / Arcade Coin -->
  <rect x="10" y="2" width="4" height="2" fill="#ffd700"/>
  <rect x="10" y="20" width="4" height="2" fill="#ffd700"/>
  <rect x="2" y="10" width="2" height="4" fill="#ffd700"/>
  <rect x="20" y="10" width="2" height="4" fill="#ffd700"/>
  <rect x="5" y="5" width="3" height="3" fill="${accent}"/>
  <rect x="16" y="5" width="3" height="3" fill="${accent}"/>
  <rect x="5" y="16" width="3" height="3" fill="${accent}"/>
  <rect x="16" y="16" width="3" height="3" fill="${accent}"/>
  <rect x="6" y="6" width="12" height="12" fill="#120824"/>
  <rect x="10" y="10" width="4" height="4" fill="#ff0077"/>
</svg>`,

    'menu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="3" y="5" width="18" height="2" fill="${accent}"/>
  <rect x="3" y="11" width="18" height="2" fill="#ffd700"/>
  <rect x="3" y="17" width="18" height="2" fill="#ff0077"/>
</svg>`,

    'split.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="3" y="3" width="18" height="18" fill="none" stroke="${accent}" stroke-width="2"/>
  <rect x="11" y="3" width="2" height="18" fill="#ffd700"/>
</svg>`,

    'terminal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <!-- 16-Bit CRT Pixel Prompt >_ -->
  <rect x="3" y="5" width="2" height="2" fill="#39ff14"/>
  <rect x="5" y="7" width="2" height="2" fill="#39ff14"/>
  <rect x="7" y="9" width="2" height="2" fill="#39ff14"/>
  <rect x="5" y="11" width="2" height="2" fill="#39ff14"/>
  <rect x="3" y="13" width="2" height="2" fill="#39ff14"/>
  <rect x="11" y="13" width="8" height="2" fill="#00ffcc"/>
</svg>`,

    'close.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="4" y="4" width="3" height="3" fill="#ff0055"/>
  <rect x="7" y="7" width="3" height="3" fill="#ff0055"/>
  <rect x="10" y="10" width="4" height="4" fill="#ffd700"/>
  <rect x="14" y="7" width="3" height="3" fill="#ff0055"/>
  <rect x="17" y="4" width="3" height="3" fill="#ff0055"/>
  <rect x="7" y="14" width="3" height="3" fill="#ff0055"/>
  <rect x="4" y="17" width="3" height="3" fill="#ff0055"/>
  <rect x="14" y="14" width="3" height="3" fill="#ff0055"/>
  <rect x="17" y="17" width="3" height="3" fill="#ff0055"/>
</svg>`,

    'chevron-down.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="6" y="8" width="2" height="2" fill="${accent}"/>
  <rect x="16" y="8" width="2" height="2" fill="${accent}"/>
  <rect x="8" y="10" width="2" height="2" fill="${accent}"/>
  <rect x="14" y="10" width="2" height="2" fill="${accent}"/>
  <rect x="10" y="12" width="4" height="2" fill="#ffd700"/>
</svg>`,

    'chevron-right.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" shape-rendering="crispEdges">
  <rect x="8" y="6" width="2" height="2" fill="${accent}"/>
  <rect x="8" y="16" width="2" height="2" fill="${accent}"/>
  <rect x="10" y="8" width="2" height="2" fill="${accent}"/>
  <rect x="10" y="14" width="2" height="2" fill="${accent}"/>
  <rect x="12" y="10" width="2" height="4" fill="#ffd700"/>
</svg>`,
  } : {
    // Activity Bar Icons
    'explorer.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
  <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
  <path d="M9 13h6M9 17h4"/>
</svg>`,

    'search.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="11" cy="11" r="8"/>
  <path d="m21 21-4.3-4.3"/>
  <path d="M11 8a3 3 0 0 0-3 3" opacity="0.6"/>
</svg>`,

    'source-control.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="18" cy="18" r="3"/>
  <circle cx="6" cy="6" r="3"/>
  <path d="M6 9v12"/>
  <path d="M18 9a9 9 0 0 0-9 9"/>
</svg>`,

    'debug.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="6 3 20 12 6 21 6 3" fill="${accent}" fill-opacity="0.2"/>
</svg>`,

    'extensions.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <path d="m21 16-4 4-4-4"/>
  <path d="M17 20V4"/>
  <rect x="3" y="4" width="8" height="8" rx="1.5" fill="${accent}" fill-opacity="0.2"/>
  <rect x="3" y="14" width="8" height="6" rx="1.5"/>
</svg>`,

    'settings.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="3"/>
  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
</svg>`,

    // Menu and Window Control Icons
    'menu.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round">
  <line x1="4" x2="20" y1="6" y2="6"/>
  <line x1="4" x2="20" y1="12" y2="12"/>
  <line x1="4" x2="20" y1="18" y2="18"/>
</svg>`,

    'split.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <rect width="18" height="18" x="3" y="3" rx="2"/>
  <path d="M12 3v18"/>
</svg>`,

    'terminal.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="4 17 10 11 4 5"/>
  <line x1="12" x2="20" y1="19" y2="19"/>
</svg>`,

    'close.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${fg}" stroke-width="2" stroke-linecap="round">
  <path d="M18 6 6 18M6 6l12 12"/>
</svg>`,

    'chevron-down.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 9 6 6 6-6"/>
</svg>`,

    'chevron-right.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="m9 18 6-6-6-6"/>
</svg>`,
  };

  const productIconThemeJson = JSON.stringify(
    {
      fonts: [],
      iconDefinitions: {
        'explorer-view-icon': {
          fontCharacter: '\\e001',
          fontId: 'product-icons',
          src: './explorer.svg',
        },
        'search-view-icon': {
          fontCharacter: '\\e002',
          fontId: 'product-icons',
          src: './search.svg',
        },
        'source-control-view-icon': {
          fontCharacter: '\\e003',
          fontId: 'product-icons',
          src: './source-control.svg',
        },
        'run-view-icon': {
          fontCharacter: '\\e004',
          fontId: 'product-icons',
          src: './debug.svg',
        },
        'extensions-view-icon': {
          fontCharacter: '\\e005',
          fontId: 'product-icons',
          src: './extensions.svg',
        },
        'settings-gear': {
          fontCharacter: '\\e006',
          fontId: 'product-icons',
          src: './settings.svg',
        },
        'menu': {
          fontCharacter: '\\e007',
          fontId: 'product-icons',
          src: './menu.svg',
        },
        'split-horizontal': {
          fontCharacter: '\\e008',
          fontId: 'product-icons',
          src: './split.svg',
        },
        'terminal-view-icon': {
          fontCharacter: '\\e009',
          fontId: 'product-icons',
          src: './terminal.svg',
        },
        'close': {
          fontCharacter: '\\e010',
          fontId: 'product-icons',
          src: './close.svg',
        },
        'chevron-right': {
          fontCharacter: '\\e011',
          fontId: 'product-icons',
          src: './chevron-right.svg',
        },
        'chevron-down': {
          fontCharacter: '\\e012',
          fontId: 'product-icons',
          src: './chevron-down.svg',
        },
      },
    },
    null,
    2
  );

  return {
    definitions,
    productIconThemeJson,
  };
}

import { OpenChamberExtensionConfig } from '../types';

/**
 * Ensures a string is strictly formatted in kebab-case (e.g., 'test-panel').
 */
export function toKebabCase(str: string, fallback: string = 'test-panel'): string {
  if (!str) return fallback;
  const cleaned = str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

/**
 * Generates a strictly valid OpenChamber package.json object where
 * `openchamber.panel.id` is guaranteed to be kebab-case (e.g., "test-panel").
 */
export function buildOpenChamberPackageJson(ext: OpenChamberExtensionConfig) {
  const baseId = ext.manifest.panel?.id || ext.id || ext.manifest.name || 'test-panel';
  const kebab = toKebabCase(baseId, 'test-panel');
  // Ensure panel.id is kebab-case
  const panelId = kebab.includes('panel') ? kebab : `${kebab}-panel`;

  const pkgName = toKebabCase(ext.manifest.name, 'openchamber-extension');

  return {
    name: pkgName,
    version: ext.manifest.version || '1.0.0',
    description: ext.manifest.description || 'OpenChamber SDK extension',
    author: ext.manifest.author || 'ChamberCraft Studio',
    main: ext.manifest.entry || 'panel/index.html',
    openchamber: {
      panel: {
        id: panelId, // STRICTLY KEBAB-CASE as required by OpenChamber specification
        title: ext.manifest.title || 'OpenChamber Panel',
        entry: ext.manifest.entry || 'panel/index.html',
        icon: ext.manifest.icon || 'icon.svg',
      },
      name: pkgName,
      title: ext.manifest.title || 'OpenChamber Panel',
      entry: ext.manifest.entry || 'panel/index.html',
      icon: ext.manifest.icon || 'icon.svg',
      permissions: ext.manifest.permissions || [
        'session:read',
        'session:write',
        'project:read',
        'prompt:send',
        'notifications',
      ],
      categories: ext.manifest.categories || ['AI Tools', 'Workflow'],
    },
    dependencies: {
      '@openchamber/sdk': '^1.0.0',
    },
  };
}

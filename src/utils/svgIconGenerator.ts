import { IconThemeConfig, IconDefinition } from '../types';

export interface SvgIconPack {
  definitions: Record<string, string>; // filename -> SVG string
  iconThemeJson: string;
}

export function generateSvgIcon(type: string, color: string, style: 'rounded' | 'sharp' | 'minimal' | 'duotone' = 'rounded'): string {
  const rx = style === 'rounded' ? '3' : style === 'minimal' ? '4' : '0';
  const fillOpacity = style === 'duotone' ? '0.25' : style === 'minimal' ? '0.08' : '0.15';
  const strokeWidth = style === 'minimal' ? '1.2' : '1.5';

  switch (type) {
    case 'folder':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" fill="${color}" fill-opacity="${style === 'duotone' ? '0.35' : '0.9'}"/>
  <path d="M3 8h18" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;

    case 'folder-open':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v2H3V6z" fill="${color}" fill-opacity="0.4"/>
  <path d="M2.5 10h19l-2.2 9a2 2 0 0 1-1.95 1.5H6.65a2 2 0 0 1-1.95-1.5L2.5 10z" fill="${color}" fill-opacity="0.95" stroke="${color}" stroke-width="${strokeWidth}"/>
</svg>`;

    case 'folder-src':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" fill="${color}" fill-opacity="0.8"/>
  <path d="m10 12-2 2 2 2m4-4 2 2-2 2" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    case 'folder-tests':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" fill="${color}" fill-opacity="0.8"/>
  <path d="M9 13.5l2 2 4-4" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    case 'file':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="${color}" stroke-width="${strokeWidth}" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}"/>
  <polyline points="14 2 14 8 20 8" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

    case 'typescript':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="900" text-anchor="middle">TS</text>
</svg>`;

    case 'tsx':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">TSX</text>
</svg>`;

    case 'javascript':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="900" text-anchor="middle">JS</text>
</svg>`;

    case 'jsx':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">JSX</text>
</svg>`;

    case 'python':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <path d="M12 5.5c-2.8 0-3.5 1-3.5 2.2v2h7v-.8c0-1.5-.7-3.4-3.5-3.4zm-3.5 7.3v.8c0 1.5.7 3.4 3.5 3.4s3.5-1 3.5-2.2v-2h-7z" fill="${color}"/>
  <circle cx="10" cy="7.2" r="0.8" fill="#ffffff"/>
  <circle cx="14" cy="15.8" r="0.8" fill="#ffffff"/>
</svg>`;

    case 'rust':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <circle cx="12" cy="12" r="6" stroke="${color}" stroke-width="1.2" fill="none"/>
  <text x="12" y="15" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="9" font-weight="900" text-anchor="middle">RS</text>
</svg>`;

    case 'go':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="900" text-anchor="middle">GO</text>
</svg>`;

    case 'java':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <path d="M12 6c-1.5 2-1 3 0 4-1.5 1-1 2 0 3" stroke="${color}" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M8 17c2 1 6 1 8 0" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

    case 'cpp':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">C++</text>
</svg>`;

    case 'csharp':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">C#</text>
</svg>`;

    case 'php':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15.5" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">PHP</text>
</svg>`;

    case 'ruby':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <polygon points="12,5 17,9 15,18 9,18 7,9" fill="${color}" fill-opacity="0.8"/>
</svg>`;

    case 'swift':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <path d="M7 6c3 3 5 8 9 9-4 0-7-2-9-5 2-1 4-2 6-2-3-1-5-1-6-2z" fill="${color}"/>
</svg>`;

    case 'kotlin':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <polygon points="5,5 19,5 12,12 19,19 5,19" fill="${color}" fill-opacity="0.8"/>
</svg>`;

    case 'html':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="900" text-anchor="middle">&lt;&gt;</text>
</svg>`;

    case 'css':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="12" font-weight="900" text-anchor="middle">#</text>
</svg>`;

    case 'json':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="11" font-weight="900" text-anchor="middle">{}</text>
</svg>`;

    case 'yaml':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="15.5" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="8.5" font-weight="900" text-anchor="middle">YML</text>
</svg>`;

    case 'markdown':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <text x="12" y="16" fill="${color}" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="900" text-anchor="middle">MD</text>
</svg>`;

    case 'sql':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <ellipse cx="12" cy="8" rx="6" ry="2.5" fill="none" stroke="${color}" stroke-width="1.4"/>
  <path d="M6 8v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V8m-12 4v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" fill="none" stroke="${color}" stroke-width="1.4"/>
</svg>`;

    case 'graphql':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <polygon points="12,6 18,10 18,16 12,19 6,16 6,10" fill="none" stroke="${color}" stroke-width="1.4"/>
  <circle cx="12" cy="12.5" r="1.5" fill="${color}"/>
</svg>`;

    case 'shell':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <path d="M7 9l3 3-3 3M12 15h4" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

    case 'docker':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" stroke="${color}" stroke-width="${strokeWidth}" fill="${color}" fill-opacity="${fillOpacity}"/>
  <rect x="6" y="10" width="3" height="3" fill="${color}"/>
  <rect x="10.5" y="10" width="3" height="3" fill="${color}"/>
  <rect x="15" y="10" width="3" height="3" fill="${color}"/>
  <rect x="10.5" y="6" width="3" height="3" fill="${color}"/>
</svg>`;

    case 'git':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" stroke="${color}" stroke-width="${strokeWidth}" fill="${color}" fill-opacity="${fillOpacity}"/>
  <circle cx="7" cy="8" r="2" stroke="${color}" stroke-width="1.5"/>
  <circle cx="7" cy="16" r="2" stroke="${color}" stroke-width="1.5"/>
  <circle cx="17" cy="11" r="2" stroke="${color}" stroke-width="1.5"/>
  <path d="M7 10v4M9 8h4a4 4 0 0 1 4 3" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

    case 'env':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <circle cx="9" cy="12" r="3" stroke="${color}" stroke-width="1.4" fill="none"/>
  <path d="M12 12h5m-2-2v4" stroke="${color}" stroke-width="1.4" stroke-linecap="round"/>
</svg>`;

    case 'package':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" stroke="${color}" stroke-width="${strokeWidth}" fill="${color}" fill-opacity="${fillOpacity}"/>
  <polygon points="12,5 18,8.5 18,15.5 12,19 6,15.5 6,8.5" stroke="${color}" stroke-width="1.2"/>
  <line x1="12" y1="12" x2="18" y2="8.5" stroke="${color}" stroke-width="1.2"/>
  <line x1="12" y1="12" x2="6" y2="8.5" stroke="${color}" stroke-width="1.2"/>
  <line x1="12" y1="12" x2="12" y2="19" stroke="${color}" stroke-width="1.2"/>
</svg>`;

    case 'test':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <path d="m8 12.5 3 3 5-6" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`;

    case 'database':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <ellipse cx="12" cy="7.5" rx="5" ry="2" stroke="${color}" stroke-width="1.4" fill="none"/>
  <path d="M7 7.5v4.5c0 1.1 2.2 2 5 2s5-.9 5-2V7.5m-10 4.5v4.5c0 1.1 2.2 2 5 2s5-.9 5-2V12" stroke="${color}" stroke-width="1.4" fill="none"/>
</svg>`;

    case 'image':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <rect width="20" height="20" x="2" y="2" rx="${rx}" fill="${color}" fill-opacity="${fillOpacity}" stroke="${color}" stroke-width="${strokeWidth}"/>
  <circle cx="8.5" cy="8.5" r="1.5" fill="${color}"/>
  <polygon points="6,17 10,12 13,15 15,13 18,17" fill="${color}" fill-opacity="0.8"/>
</svg>`;

    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none">
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="${color}" stroke-width="${strokeWidth}" fill="${color}" fill-opacity="${fillOpacity}"/>
</svg>`;
  }
}

export function buildIconThemePack(config: IconThemeConfig): SvgIconPack {
  const definitions: Record<string, string> = {};

  definitions['folder.svg'] = generateSvgIcon('folder', config.folderColor, config.style);
  definitions['folder-open.svg'] = generateSvgIcon('folder-open', config.folderOpenColor, config.style);
  definitions['folder-src.svg'] = generateSvgIcon('folder-src', config.folderColor, config.style);
  definitions['folder-tests.svg'] = generateSvgIcon('folder-tests', config.folderColor, config.style);
  definitions['file.svg'] = generateSvgIcon('file', config.fileDefaultColor, config.style);

  config.icons.forEach((icon) => {
    definitions[`${icon.id}.svg`] = generateSvgIcon(icon.id, icon.primaryColor, config.style);
  });

  const iconDefMap: Record<string, { iconPath: string }> = {
    _folder: { iconPath: './folder.svg' },
    _folder_open: { iconPath: './folder-open.svg' },
    _folder_src: { iconPath: './folder-src.svg' },
    _folder_tests: { iconPath: './folder-tests.svg' },
    _file: { iconPath: './file.svg' },
  };

  const fileExtensions: Record<string, string> = {};
  const fileNames: Record<string, string> = {
    'package.json': '_file_package',
    'pnpm-lock.yaml': '_file_package',
    'yarn.lock': '_file_package',
    'package-lock.json': '_file_package',
    'Cargo.toml': '_file_rust',
    'Dockerfile': '_file_docker',
    'docker-compose.yml': '_file_docker',
    'docker-compose.yaml': '_file_docker',
    '.gitignore': '_file_git',
    '.gitattributes': '_file_git',
    '.env': '_file_env',
    '.env.local': '_file_env',
    '.env.production': '_file_env',
    'README.md': '_file_markdown',
    'CHANGELOG.md': '_file_markdown',
    'tsconfig.json': '_file_typescript',
  };

  const folderNames: Record<string, string> = {
    src: '_folder_src',
    source: '_folder_src',
    tests: '_folder_tests',
    test: '_folder_tests',
    __tests__: '_folder_tests',
    spec: '_folder_tests',
  };

  config.icons.forEach((icon) => {
    const key = `_file_${icon.id}`;
    iconDefMap[key] = { iconPath: `./${icon.id}.svg` };

    if (icon.pattern.includes(',')) {
      icon.pattern.split(',').forEach((ext) => {
        fileExtensions[ext.trim().replace('.', '')] = key;
      });
    } else {
      fileExtensions[icon.pattern.replace('.', '')] = key;
    }
  });

  const iconThemeData = {
    iconDefinitions: iconDefMap,
    folder: '_folder',
    folderExpanded: '_folder_open',
    folderNames,
    folderNamesExpanded: {
      src: '_folder_open',
      tests: '_folder_open',
    },
    file: '_file',
    fileExtensions,
    fileNames,
    hidesExplorerArrows: false,
  };

  return {
    definitions,
    iconThemeJson: JSON.stringify(iconThemeData, null, 2),
  };
}

export const ALL_SUPPORTED_ICONS: IconDefinition[] = [
  // Web & Scripting
  { id: 'typescript', name: 'TypeScript', pattern: 'ts,d.ts', category: 'language', primaryColor: '#38bdf8', glyph: 'TS' },
  { id: 'tsx', name: 'React TSX', pattern: 'tsx', category: 'language', primaryColor: '#00f0ff', glyph: 'TSX' },
  { id: 'javascript', name: 'JavaScript', pattern: 'js,mjs,cjs', category: 'language', primaryColor: '#facc15', glyph: 'JS' },
  { id: 'jsx', name: 'React JSX', pattern: 'jsx', category: 'language', primaryColor: '#61dafb', glyph: 'JSX' },
  { id: 'html', name: 'HTML', pattern: 'html,htm', category: 'language', primaryColor: '#f97316', glyph: '<>' },
  { id: 'css', name: 'CSS / SCSS', pattern: 'css,scss,sass,less', category: 'language', primaryColor: '#38bdf8', glyph: '#' },
  { id: 'json', name: 'JSON', pattern: 'json', category: 'config', primaryColor: '#fbcfe8', glyph: '{}' },
  { id: 'yaml', name: 'YAML', pattern: 'yaml,yml', category: 'config', primaryColor: '#fb7185', glyph: 'YML' },
  { id: 'markdown', name: 'Markdown', pattern: 'md,mdx', category: 'language', primaryColor: '#a78bfa', glyph: 'MD' },

  // Systems & Backend Languages
  { id: 'python', name: 'Python', pattern: 'py,ipynb', category: 'language', primaryColor: '#34d399', glyph: 'PY' },
  { id: 'rust', name: 'Rust', pattern: 'rs', category: 'language', primaryColor: '#fb923c', glyph: 'RS' },
  { id: 'go', name: 'Go', pattern: 'go', category: 'language', primaryColor: '#00add8', glyph: 'GO' },
  { id: 'java', name: 'Java', pattern: 'java,jar', category: 'language', primaryColor: '#ea580c', glyph: 'JAVA' },
  { id: 'cpp', name: 'C / C++', pattern: 'cpp,c,h,hpp,cc', category: 'language', primaryColor: '#2563eb', glyph: 'C++' },
  { id: 'csharp', name: 'C# / .NET', pattern: 'cs', category: 'language', primaryColor: '#9333ea', glyph: 'C#' },
  { id: 'php', name: 'PHP', pattern: 'php', category: 'language', primaryColor: '#818cf8', glyph: 'PHP' },
  { id: 'ruby', name: 'Ruby', pattern: 'rb,erb', category: 'language', primaryColor: '#e11d48', glyph: 'RB' },
  { id: 'swift', name: 'Swift', pattern: 'swift', category: 'language', primaryColor: '#f97316', glyph: 'SW' },
  { id: 'kotlin', name: 'Kotlin', pattern: 'kt,kts', category: 'language', primaryColor: '#7c3aed', glyph: 'KT' },

  // Data & DevOps
  { id: 'sql', name: 'SQL', pattern: 'sql', category: 'data', primaryColor: '#e2e8f0', glyph: 'SQL' },
  { id: 'graphql', name: 'GraphQL', pattern: 'graphql,gql', category: 'data', primaryColor: '#e10098', glyph: 'GQL' },
  { id: 'database', name: 'Database', pattern: 'sqlite,db', category: 'data', primaryColor: '#0284c7', glyph: 'DB' },
  { id: 'shell', name: 'Shell / Bash', pattern: 'sh,bash,zsh', category: 'system', primaryColor: '#4ade80', glyph: '$' },
  { id: 'docker', name: 'Docker', pattern: 'dockerfile', category: 'config', primaryColor: '#0ea5e9', glyph: 'DC' },
  { id: 'git', name: 'Git Config', pattern: 'git,gitignore', category: 'system', primaryColor: '#f43f5e', glyph: 'GIT' },
  { id: 'env', name: 'Environment', pattern: 'env', category: 'config', primaryColor: '#eab308', glyph: 'ENV' },
  { id: 'package', name: 'Package Mgr', pattern: 'lock', category: 'config', primaryColor: '#c084fc', glyph: 'PKG' },
  { id: 'test', name: 'Unit Tests', pattern: 'test.ts,spec.ts,test.js,spec.js', category: 'system', primaryColor: '#10b981', glyph: 'TEST' },
  { id: 'image', name: 'Images', pattern: 'png,jpg,jpeg,svg,webp,ico', category: 'system', primaryColor: '#f472b6', glyph: 'IMG' },
];

export const DEFAULT_ICON_THEME: IconThemeConfig = {
  id: 'chamber-icons-default',
  name: 'ChamberCraft Fluent Icons',
  displayName: 'ChamberCraft Fluent Icons',
  description: 'Hand-crafted vector icons engineered for dark, light, and high-contrast environments.',
  folderColor: '#e0af68',
  folderOpenColor: '#f59e0b',
  fileDefaultColor: '#94a3b8',
  style: 'rounded',
  icons: ALL_SUPPORTED_ICONS,
};

/**
 * Dynamically harmonizes and adapts all icons to match a specific VS Code theme.
 * The folder colors, file default color, and accent hues automatically sync with the theme.
 */
export function generateThemeHarmonizedIconTheme(
  theme: {
    id: string;
    displayName: string;
    type: 'dark' | 'light';
    colors: Record<string, string>;
  },
  baseConfig: IconThemeConfig = DEFAULT_ICON_THEME
): IconThemeConfig {
  const accent = theme.colors['focusBorder'] || theme.colors['activityBar.foreground'] || '#38bdf8';
  const fg = theme.colors['editor.foreground'] || (theme.type === 'light' ? '#333333' : '#e2e8f0');
  const bg = theme.colors['editor.background'] || (theme.type === 'light' ? '#ffffff' : '#0f172a');
  
  // Decide folder color: prefer warm yellow/amber or theme accent
  const folderColor = theme.colors['terminal.ansiYellow'] || theme.colors['editorWarning.foreground'] || accent;
  const folderOpenColor = theme.colors['terminal.ansiCyan'] || accent;

  const harmonizedIcons = baseConfig.icons.map((icon) => {
    // If language is TS/TSX, harmonize with theme's cyan/blue
    let primary = icon.primaryColor;
    if (theme.type === 'light') {
      // Invert or darken bright yellows for light themes
      if (primary === '#facc15' || primary === '#eab308') primary = '#ca8a04';
      if (primary === '#38bdf8' || primary === '#00f0ff') primary = '#0284c7';
    }
    return {
      ...icon,
      primaryColor: primary,
    };
  });

  return {
    ...baseConfig,
    id: `${theme.id}-icons`,
    name: `${theme.displayName} Icons`,
    displayName: `${theme.displayName} Icons`,
    description: `Matching vector file & folder icon theme adapted specifically for ${theme.displayName}.`,
    folderColor,
    folderOpenColor,
    fileDefaultColor: fg,
    icons: harmonizedIcons,
  };
}

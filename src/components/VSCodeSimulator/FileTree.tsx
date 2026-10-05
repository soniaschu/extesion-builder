import React from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileJson, FileText } from 'lucide-react';
import { IconThemeConfig } from '../../types';
import { generateSvgIcon } from '../../utils/svgIconGenerator';

interface FileTreeProps {
  activeFileId: string;
  onSelectFile: (id: string) => void;
  iconConfig?: IconThemeConfig;
  sidebarBg?: string;
  sidebarFg?: string;
  listSelectionBg?: string;
  listSelectionFg?: string;
}

interface TreeItem {
  id: string;
  name: string;
  type: 'folder' | 'file';
  extension?: string;
  children?: TreeItem[];
}

const PROJECT_STRUCTURE: TreeItem[] = [
  {
    id: 'src-folder',
    name: 'src',
    type: 'folder',
    children: [
      { id: 'typescript', name: 'themeEngine.ts', type: 'file', extension: 'ts' },
      { id: 'python', name: 'agentic_pipeline.py', type: 'file', extension: 'py' },
      { id: 'rust', name: 'token_parser.rs', type: 'file', extension: 'rs' },
      { id: 'go-service', name: 'server.go', type: 'file', extension: 'go' },
      { id: 'components-folder', name: 'components', type: 'folder', children: [
        { id: 'simulator-comp', name: 'Simulator.tsx', type: 'file', extension: 'tsx' },
        { id: 'navbar-comp', name: 'Navbar.tsx', type: 'file', extension: 'tsx' },
      ]},
      { id: 'data-folder', name: 'db', type: 'folder', children: [
        { id: 'schema-sql', name: 'schema.sql', type: 'file', extension: 'sql' },
        { id: 'query-gql', name: 'api.graphql', type: 'file', extension: 'graphql' },
      ]},
    ],
  },
  {
    id: 'tests-folder',
    name: 'tests',
    type: 'folder',
    children: [
      { id: 'unit-test', name: 'theme.test.ts', type: 'file', extension: 'test' },
    ],
  },
  { id: 'json', name: 'package.json', type: 'file', extension: 'json' },
  { id: 'env-file', name: '.env.local', type: 'file', extension: 'env' },
  { id: 'dockerfile', name: 'Dockerfile', type: 'file', extension: 'docker' },
  { id: 'git-ignore', name: '.gitignore', type: 'file', extension: 'git' },
  { id: 'readme-file', name: 'README.md', type: 'file', extension: 'md' },
];

export const FileTree: React.FC<FileTreeProps> = ({
  activeFileId,
  onSelectFile,
  iconConfig,
  sidebarBg = '#181824',
  sidebarFg = '#94a3b8',
  listSelectionBg = '#27293d',
  listSelectionFg = '#00f0ff',
}) => {
  const [openFolders, setOpenFolders] = React.useState<Record<string, boolean>>({
    'src-folder': true,
    'components-folder': true,
  });

  const toggleFolder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderIcon = (item: TreeItem, isOpen: boolean) => {
    if (item.type === 'folder') {
      const folderColor = isOpen
        ? iconConfig?.folderOpenColor || '#f59e0b'
        : iconConfig?.folderColor || '#e0af68';
      const svg = generateSvgIcon(isOpen ? 'folder-open' : 'folder', folderColor, iconConfig?.style || 'rounded');
      return (
        <span
          className="w-4 h-4 shrink-0 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      );
    }

    // File icon
    const ext = item.extension || 'file';
    const foundIconDef = iconConfig?.icons.find(
      (i) => i.id === ext || i.pattern.split(',').map((p) => p.trim()).includes(ext)
    );
    const fileColor = foundIconDef?.primaryColor || iconConfig?.fileDefaultColor || '#94a3b8';
    const svg = generateSvgIcon(ext, fileColor, iconConfig?.style || 'rounded');

    return (
      <span
        className="w-4 h-4 shrink-0 flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  };

  const renderTree = (items: TreeItem[], depth = 0) => {
    return items.map((item) => {
      const isFolder = item.type === 'folder';
      const isOpen = Boolean(openFolders[item.id]);
      const isActive = activeFileId === item.id;

      return (
        <div key={item.id} className="select-none text-xs">
          <div
            onClick={(e) => {
              if (isFolder) {
                toggleFolder(item.id, e);
              } else {
                onSelectFile(item.id);
              }
            }}
            className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors ${
              isActive ? 'font-medium' : 'hover:opacity-80'
            }`}
            style={{
              paddingLeft: `${depth * 14 + 10}px`,
              backgroundColor: isActive ? listSelectionBg : 'transparent',
              color: isActive ? listSelectionFg : sidebarFg,
            }}
          >
            {isFolder ? (
              <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-400">
                {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </span>
            ) : (
              <span className="w-3.5 h-3.5" />
            )}

            {renderIcon(item, isOpen)}

            <span className="truncate">{item.name}</span>
          </div>

          {isFolder && isOpen && item.children && (
            <div>{renderTree(item.children, depth + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className="h-full flex flex-col overflow-y-auto"
      style={{ backgroundColor: sidebarBg, color: sidebarFg }}
    >
      <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between opacity-80 border-b border-white/5">
        <span>Explorer: Workspace</span>
      </div>
      <div className="py-1.5">{renderTree(PROJECT_STRUCTURE)}</div>
    </div>
  );
};

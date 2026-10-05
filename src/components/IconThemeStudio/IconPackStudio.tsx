import React from 'react';
import { IconThemeConfig, IconDefinition, IconStyleType, VSCodeThemeConfig } from '../../types';
import { generateSvgIcon, buildIconThemePack } from '../../utils/svgIconGenerator';
import { Download, Sparkles, Folder, FolderOpen, FileCode, Check, RefreshCw, Search } from 'lucide-react';
import { downloadIconPackZip } from '../../utils/zipExporter';

interface IconPackStudioProps {
  iconConfig: IconThemeConfig;
  theme?: VSCodeThemeConfig;
  onUpdateIconConfig: (config: IconThemeConfig) => void;
  onDownloadIconPack: () => void;
}

export const IconPackStudio: React.FC<IconPackStudioProps> = ({
  iconConfig,
  theme,
  onUpdateIconConfig,
  onDownloadIconPack,
}) => {
  const [selectedIconId, setSelectedIconId] = React.useState<string>('typescript');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [synced, setSynced] = React.useState(false);

  const handleUpdateIconColor = (id: string, color: string) => {
    const updated = iconConfig.icons.map((item) =>
      item.id === id ? { ...item, primaryColor: color } : item
    );
    onUpdateIconConfig({ ...iconConfig, icons: updated });
  };

  const handleUpdateFolderColor = (key: 'folderColor' | 'folderOpenColor' | 'fileDefaultColor', color: string) => {
    onUpdateIconConfig({ ...iconConfig, [key]: color });
  };

  const handleStyleChange = (style: IconStyleType) => {
    onUpdateIconConfig({ ...iconConfig, style });
  };

  // Harmonize all symbols with the active VS Code theme colors
  const handleSyncWithTheme = () => {
    if (!theme) return;
    const accent = theme.colors['focusBorder'] || theme.colors['button.background'] || '#38bdf8';
    const keywordColor = theme.tokenColors.find(t => t.scope.includes('keyword'))?.settings.foreground || '#f43f5e';
    const funcColor = theme.tokenColors.find(t => t.scope.includes('entity.name.function'))?.settings.foreground || '#38bdf8';
    const stringColor = theme.tokenColors.find(t => t.scope.includes('string'))?.settings.foreground || '#fde047';
    const typeColor = theme.tokenColors.find(t => t.scope.includes('entity.name.type'))?.settings.foreground || '#34d399';
    const constColor = theme.tokenColors.find(t => t.scope.includes('constant.numeric'))?.settings.foreground || '#fb923c';

    const syncedIcons = iconConfig.icons.map(icon => {
      let col = icon.primaryColor;
      if (['typescript', 'tsx', 'javascript', 'jsx'].includes(icon.id)) col = funcColor;
      else if (['python', 'rust', 'go'].includes(icon.id)) col = typeColor;
      else if (['html', 'css'].includes(icon.id)) col = constColor;
      else if (['json', 'yaml', 'env'].includes(icon.id)) col = stringColor;
      else if (['git', 'ruby', 'csharp'].includes(icon.id)) col = keywordColor;
      else if (['docker', 'sql', 'database'].includes(icon.id)) col = accent;
      return { ...icon, primaryColor: col };
    });

    onUpdateIconConfig({
      ...iconConfig,
      folderColor: accent,
      folderOpenColor: stringColor,
      icons: syncedIcons,
    });

    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  const filteredIcons = iconConfig.icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          icon.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          icon.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || icon.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedIcon = iconConfig.icons.find((i) => i.id === selectedIconId) || iconConfig.icons[0];
  const selectedSvg = generateSvgIcon(selectedIcon.id, selectedIcon.primaryColor, iconConfig.style);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-slate-950 overflow-hidden font-sans border border-slate-800 rounded-xl shadow-2xl select-none">
      {/* Left Settings & Color Panel */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/90 flex flex-col overflow-y-auto p-4 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-100 text-sm">Icon Theme Studio</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
              {iconConfig.icons.length}+ Symbols
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-1">
            Build pure vector SVG file & folder icon packs matching your theme palette.
          </p>
        </div>

        {/* Global Folder & File Style */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
              Icon Aesthetics
            </div>
            <button
              onClick={handleSyncWithTheme}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              title="Map active theme tokens to icon colors"
            >
              {synced ? <Check className="w-3 h-3 text-emerald-400" /> : <RefreshCw className="w-3 h-3" />}
              <span>{synced ? 'Synced!' : 'Sync Theme'}</span>
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {(['rounded', 'sharp', 'minimal', 'duotone'] as IconStyleType[]).map((st) => (
              <button
                key={st}
                onClick={() => handleStyleChange(st)}
                className={`py-1.5 text-center text-[10px] font-medium capitalize rounded transition ${
                  iconConfig.style === st
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {/* Folder Closed */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                Folder Closed
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={iconConfig.folderColor}
                  onChange={(e) => handleUpdateFolderColor('folderColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
                <span className="font-mono text-[10px] text-slate-400">{iconConfig.folderColor}</span>
              </div>
            </div>

            {/* Folder Open */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-amber-300" />
                Folder Open
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={iconConfig.folderOpenColor}
                  onChange={(e) => handleUpdateFolderColor('folderOpenColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
                <span className="font-mono text-[10px] text-slate-400">{iconConfig.folderOpenColor}</span>
              </div>
            </div>

            {/* Default File */}
            <div className="flex items-center justify-between">
              <span className="text-slate-300 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-400" />
                Default File
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={iconConfig.fileDefaultColor}
                  onChange={(e) => handleUpdateFolderColor('fileDefaultColor', e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
                <span className="font-mono text-[10px] text-slate-400">{iconConfig.fileDefaultColor}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Icon Detail Card */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">{selectedIcon.name}</span>
            <span className="font-mono text-[10px] text-slate-400">.{selectedIcon.pattern}</span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 p-2 flex items-center justify-center shadow-inner shrink-0"
              dangerouslySetInnerHTML={{ __html: selectedSvg }}
            />
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedIcon.primaryColor}
                  onChange={(e) => handleUpdateIconColor(selectedIcon.id, e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
                <input
                  type="text"
                  value={selectedIcon.primaryColor}
                  onChange={(e) => handleUpdateIconColor(selectedIcon.id, e.target.value)}
                  className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] font-mono text-slate-200 uppercase"
                />
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                Category: <span className="capitalize text-slate-400">{selectedIcon.category}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Download Button */}
        <button
          onClick={() => downloadIconPackZip(iconConfig)}
          className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-950/40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Icon Pack ZIP</span>
        </button>
      </div>

      {/* Right Grid of All Supported File Icons */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Filters and search header */}
        <div className="p-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-semibold text-slate-200 whitespace-nowrap">
              Symbol Catalog ({filteredIcons.length} of {iconConfig.icons.length})
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Category tabs */}
            <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800 text-[11px] overflow-x-auto no-scrollbar">
              {['all', 'language', 'config', 'system', 'data'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize transition ${
                    activeCategory === cat ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-36">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-900 border border-slate-800 rounded pl-6 pr-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
            </div>
          </div>
        </div>

        {/* Grid of Icons */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {/* Default Folder Items (shown when viewing all) */}
          {activeCategory === 'all' && (
            <>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 hover:border-slate-700 transition">
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: generateSvgIcon('folder', iconConfig.folderColor, iconConfig.style),
                  }}
                />
                <div className="min-w-0">
                  <div className="font-medium text-slate-200 truncate">Folder (closed)</div>
                  <div className="text-[10px] text-slate-500 font-mono">dir / tree</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 hover:border-slate-700 transition">
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: generateSvgIcon('folder-open', iconConfig.folderOpenColor, iconConfig.style),
                  }}
                />
                <div className="min-w-0">
                  <div className="font-medium text-slate-200 truncate">Folder (open)</div>
                  <div className="text-[10px] text-slate-500 font-mono">active dir</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2.5 hover:border-slate-700 transition">
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{
                    __html: generateSvgIcon('file', iconConfig.fileDefaultColor, iconConfig.style),
                  }}
                />
                <div className="min-w-0">
                  <div className="font-medium text-slate-200 truncate">Default File</div>
                  <div className="text-[10px] text-slate-500 font-mono">*.*</div>
                </div>
              </div>
            </>
          )}

          {/* Languages & Symbols */}
          {filteredIcons.map((icon) => {
            const isSelected = icon.id === selectedIconId;
            const svg = generateSvgIcon(icon.id, icon.primaryColor, iconConfig.style);

            return (
              <div
                key={icon.id}
                onClick={() => setSelectedIconId(icon.id)}
                className={`p-2.5 rounded-lg border flex items-center gap-2.5 cursor-pointer transition ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/80 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-7 h-7 flex items-center justify-center shrink-0"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-200 truncate">{icon.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate">.{icon.pattern}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

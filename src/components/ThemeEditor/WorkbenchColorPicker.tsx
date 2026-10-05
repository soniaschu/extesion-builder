import React from 'react';
import { VSCodeThemeConfig } from '../../types';

interface WorkbenchColorPickerProps {
  theme: VSCodeThemeConfig;
  onColorChange: (key: string, value: string) => void;
}

interface ColorField {
  key: string;
  label: string;
  category: string;
  hint: string;
}

const WORKBENCH_SECTIONS: { category: string; fields: ColorField[] }[] = [
  {
    category: 'Editor Canvas & Text',
    fields: [
      { key: 'editor.background', label: 'Editor Background', category: 'Editor Canvas', hint: 'Primary code writing surface' },
      { key: 'editor.foreground', label: 'Editor Text', category: 'Editor Canvas', hint: 'Default plain code text' },
      { key: 'editorCursor.foreground', label: 'Cursor Color', category: 'Editor Canvas', hint: 'Active typing caret' },
      { key: 'editor.lineHighlightBackground', label: 'Line Highlight', category: 'Editor Canvas', hint: 'Active line tint' },
      { key: 'editor.selectionBackground', label: 'Text Selection', category: 'Editor Canvas', hint: 'Highlighted text range' },
      { key: 'editorLineNumber.foreground', label: 'Line Numbers', category: 'Editor Canvas', hint: 'Gutter line indicators' },
      { key: 'editorLineNumber.activeForeground', label: 'Active Line Number', category: 'Editor Canvas', hint: 'Current line number' },
    ],
  },
  {
    category: 'Activity Bar & Navigation',
    fields: [
      { key: 'activityBar.background', label: 'Activity Bar Bg', category: 'Activity Bar', hint: 'Leftmost vertical tool rail' },
      { key: 'activityBar.foreground', label: 'Active Icon', category: 'Activity Bar', hint: 'Selected rail icon' },
      { key: 'activityBarBadge.background', label: 'Badge Background', category: 'Activity Bar', hint: 'Notification count pill' },
      { key: 'activityBarBadge.foreground', label: 'Badge Text', category: 'Activity Bar', hint: 'Notification count number' },
    ],
  },
  {
    category: 'Sidebar & Explorer',
    fields: [
      { key: 'sideBar.background', label: 'Sidebar Bg', category: 'Sidebar', hint: 'File tree & panels backdrop' },
      { key: 'sideBar.foreground', label: 'Sidebar Text', category: 'Sidebar', hint: 'File names & tree text' },
      { key: 'sideBarTitle.foreground', label: 'Sidebar Title', category: 'Sidebar', hint: 'Explorer header label' },
      { key: 'sideBarSectionHeader.background', label: 'Section Header', category: 'Sidebar', hint: 'Collapsible accordion header' },
      { key: 'list.activeSelectionBackground', label: 'List Selection', category: 'Sidebar', hint: 'Active selected file' },
      { key: 'list.activeSelectionForeground', label: 'List Active Text', category: 'Sidebar', hint: 'Active item font color' },
    ],
  },
  {
    category: 'Tabs & Title Bar',
    fields: [
      { key: 'titleBar.activeBackground', label: 'Title Bar Bg', category: 'Title Bar', hint: 'Top window header' },
      { key: 'titleBar.activeForeground', label: 'Title Bar Text', category: 'Title Bar', hint: 'Project title & menus' },
      { key: 'tab.activeBackground', label: 'Active Tab Bg', category: 'Tabs', hint: 'Currently open file tab' },
      { key: 'tab.activeForeground', label: 'Active Tab Text', category: 'Tabs', hint: 'Currently open tab title' },
      { key: 'tab.inactiveBackground', label: 'Inactive Tab Bg', category: 'Tabs', hint: 'Background tabs' },
      { key: 'tab.inactiveForeground', label: 'Inactive Tab Text', category: 'Tabs', hint: 'Background tab titles' },
    ],
  },
  {
    category: 'Status Bar & Terminal',
    fields: [
      { key: 'statusBar.background', label: 'Status Bar Bg', category: 'Status Bar', hint: 'Bottom status bar' },
      { key: 'statusBar.foreground', label: 'Status Bar Text', category: 'Status Bar', hint: 'Branch, line & encoding' },
      { key: 'statusBar.debuggingBackground', label: 'Debug Status Bg', category: 'Status Bar', hint: 'Status bar when running debugger' },
      { key: 'terminal.background', label: 'Terminal Bg', category: 'Terminal', hint: 'Integrated terminal background' },
      { key: 'terminal.foreground', label: 'Terminal Text', category: 'Terminal', hint: 'CLI standard output' },
      { key: 'focusBorder', label: 'Focus Border', category: 'Global', hint: 'Keyboard focus outline' },
      { key: 'button.background', label: 'Button Accent', category: 'Global', hint: 'Primary action buttons' },
    ],
  },
];

export const WorkbenchColorPicker: React.FC<WorkbenchColorPickerProps> = ({
  theme,
  onColorChange,
}) => {
  const [selectedSection, setSelectedSection] = React.useState(0);
  const [searchQuery, setSearchQuery] = React.useState('');

  const activeSection = WORKBENCH_SECTIONS[selectedSection];

  const filteredFields = searchQuery.trim()
    ? WORKBENCH_SECTIONS.flatMap(s => s.fields).filter(
        f => f.label.toLowerCase().includes(searchQuery.toLowerCase()) || f.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : activeSection.fields;

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800 text-xs select-none">
      {/* Search Header */}
      <div className="p-3 border-b border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-200">Workbench Colors</span>
          <span className="text-[10px] text-slate-400 font-mono">VS Code API</span>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter color keys (e.g. editor, sidebar, tab)..."
          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Section Tabs (only if not searching) */}
      {!searchQuery && (
        <div className="flex border-b border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar">
          {WORKBENCH_SECTIONS.map((section, idx) => (
            <button
              key={section.category}
              onClick={() => setSelectedSection(idx)}
              className={`px-3 py-2 text-[11px] whitespace-nowrap font-medium transition border-b-2 ${
                selectedSection === idx
                  ? 'border-cyan-400 text-cyan-300 bg-slate-900/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {section.category.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Color Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredFields.map((field) => {
          const currentColor = theme.colors[field.key] || '#000000';
          // Clean hex for input[type=color] which requires #rrggbb (no alpha)
          const baseHex = currentColor.length === 9 ? currentColor.slice(0, 7) : currentColor;

          return (
            <div
              key={field.key}
              className="p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-center justify-between gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-slate-200 truncate">{field.label}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate" title={field.key}>
                  {field.key}
                </div>
              </div>

              {/* Color Control */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="relative flex items-center">
                  <input
                    type="color"
                    value={baseHex.startsWith('#') ? baseHex : '#ffffff'}
                    onChange={(e) => onColorChange(field.key, e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer opacity-0 absolute inset-0 z-10"
                    title="Pick color"
                  />
                  <div
                    className="w-7 h-7 rounded border border-slate-700 shadow-inner"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>

                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => onColorChange(field.key, e.target.value)}
                  className="w-18 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[11px] font-mono text-slate-300 uppercase focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { 
  ActiveStudioMode, 
  VSCodeThemeConfig, 
  IconThemeConfig, 
  OpenChamberExtensionConfig 
} from './types';
import { THEME_PRESETS } from './data/presets';
import { DEFAULT_ICON_THEME } from './utils/svgIconGenerator';
import { OPENCHAMBER_TEMPLATES } from './data/openchamberTemplates';
import { adjustBrightness, getContrastRatio } from './utils/colorUtils';
import { downloadVSCodeExtensionZip } from './utils/zipExporter';

import { Navbar } from './components/Navbar';
import { WorkbenchColorPicker } from './components/ThemeEditor/WorkbenchColorPicker';
import { TokenColorPicker } from './components/ThemeEditor/TokenColorPicker';
import { ContrastAuditor } from './components/ThemeEditor/ContrastAuditor';
import { VSCodeEditor } from './components/VSCodeSimulator/VSCodeEditor';
import { OpenChamberWorkspace } from './components/OpenChamberStudio/OpenChamberWorkspace';
import { ExtensionCodeEditor } from './components/OpenChamberStudio/ExtensionCodeEditor';
import { IconPackStudio } from './components/IconThemeStudio/IconPackStudio';
import { GitHubExportPanel } from './components/GitHubExport/GitHubExportPanel';
import { ExportModal } from './components/PackagingCenter/ExportModal';
import { AiThemeGeneratorModal } from './components/AiThemeGeneratorModal';
import { AiThemeChatDrawer } from './components/AiAssistant/AiThemeChatDrawer';
import { ProjectWorkflowModal } from './components/WorkflowWizard/ProjectWorkflowModal';
import { MessageSquare, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [activeMode, setActiveMode] = React.useState<ActiveStudioMode>('vscode-theme');
  const [currentTheme, setCurrentTheme] = React.useState<VSCodeThemeConfig>(THEME_PRESETS[0]);
  const [iconConfig, setIconConfig] = React.useState<IconThemeConfig>(DEFAULT_ICON_THEME);
  const [openchamberExtension, setOpenchamberExtension] = React.useState<OpenChamberExtensionConfig>(
    OPENCHAMBER_TEMPLATES['prompt-booster']
  );

  const [editorSubTab, setEditorSubTab] = React.useState<'workbench' | 'tokens'>('workbench');
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = React.useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = React.useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize VS Code theme colors directly into OpenChamber extension variables
  const handleSyncThemeToOpenChamber = (themeToSync: VSCodeThemeConfig) => {
    const bg = themeToSync.colors['editor.background'] || '#0f131c';
    const text = themeToSync.colors['editor.foreground'] || '#e2e8f0';
    const accent = themeToSync.colors['focusBorder'] || themeToSync.colors['button.background'] || '#38bdf8';
    const border = themeToSync.colors['sideBarSectionHeader.background'] || '#1e2638';

    setOpenchamberExtension((prev) => {
      // Update custom css variables inside style.css
      let updatedCss = prev.css;
      if (updatedCss.includes('--chamber-bg:')) {
        updatedCss = updatedCss
          .replace(/--chamber-bg:\s*[^;]+;/, `--chamber-bg: ${bg};`)
          .replace(/--chamber-text:\s*[^;]+;/, `--chamber-text: ${text};`)
          .replace(/--chamber-accent:\s*[^;]+;/, `--chamber-accent: ${accent};`)
          .replace(/--chamber-border:\s*[^;]+;/, `--chamber-border: ${border};`);
      } else {
        updatedCss = `:root {\n  --chamber-bg: ${bg};\n  --chamber-text: ${text};\n  --chamber-accent: ${accent};\n  --chamber-border: ${border};\n}\n` + updatedCss;
      }

      return {
        ...prev,
        css: updatedCss,
      };
    });

    showToast(`Theme "${themeToSync.displayName}" adopted for OpenChamber Extension!`);
  };

  // Workbench color updater
  const handleWorkbenchColorChange = (key: string, value: string) => {
    setCurrentTheme((prev) => {
      const updatedTheme = {
        ...prev,
        colors: {
          ...prev.colors,
          [key]: value,
        },
      };

      // If user edits editor.background or focusBorder, automatically keep OpenChamber in sync
      if (key === 'editor.background' || key === 'focusBorder' || key === 'editor.foreground') {
        handleSyncThemeToOpenChamber(updatedTheme);
      }

      return updatedTheme;
    });
  };

  // Token color updater
  const handleTokenColorChange = (index: number, foreground: string, fontStyle?: string) => {
    setCurrentTheme((prev) => {
      const updated = [...prev.tokenColors];
      updated[index] = {
        ...updated[index],
        settings: {
          ...updated[index].settings,
          foreground,
          fontStyle: fontStyle !== undefined ? fontStyle : updated[index].settings.fontStyle,
        },
      };
      return { ...prev, tokenColors: updated };
    });
  };

  // Auto-Fix contrast to guarantee WCAG AA 4.5:1
  const handleAutoFixContrast = () => {
    const editorBg = currentTheme.colors['editor.background'] || '#1e1e1e';
    setCurrentTheme((prev) => {
      const updatedTokens = prev.tokenColors.map((token) => {
        let fg = token.settings.foreground;
        let ratio = getContrastRatio(fg, editorBg);
        let attempts = 0;
        // Boost brightness until ratio >= 4.5
        while (ratio < 4.5 && attempts < 15) {
          fg = adjustBrightness(fg, 10);
          ratio = getContrastRatio(fg, editorBg);
          attempts++;
        }
        return {
          ...token,
          settings: { ...token.settings, foreground: fg },
        };
      });

      return { ...prev, tokenColors: updatedTokens };
    });
  };

  const handleSelectPreset = (preset: VSCodeThemeConfig) => {
    setCurrentTheme(preset);
  };

  const handleResetTheme = () => {
    setCurrentTheme(THEME_PRESETS[0]);
  };

  const handleSelectExtensionTemplate = (templateId: string) => {
    if (OPENCHAMBER_TEMPLATES[templateId]) {
      setOpenchamberExtension(OPENCHAMBER_TEMPLATES[templateId]);
    }
  };

  const handleUpdateExtension = (updated: Partial<OpenChamberExtensionConfig>) => {
    setOpenchamberExtension((prev) => ({
      ...prev,
      ...updated,
      manifest: {
        ...prev.manifest,
        ...(updated.manifest || {}),
      },
    }));
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans relative">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/60 text-emerald-300 text-xs px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Top Navbar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={(mode) => {
          if (mode === 'export') {
            setIsExportModalOpen(true);
          } else {
            setActiveMode(mode);
          }
        }}
        currentTheme={currentTheme}
        iconConfig={iconConfig}
        extension={openchamberExtension}
        onSelectPreset={handleSelectPreset}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetTheme={handleResetTheme}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 flex overflow-hidden p-2 gap-2">
        {/* MODE 1: VS Code Theme Studio */}
        {activeMode === 'vscode-theme' && (
          <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden">
            {/* Left Color & Token Controls Column */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              {/* Sub-tab switcher */}
              <div className="flex border-b border-slate-800 bg-slate-950 p-1">
                <button
                  onClick={() => setEditorSubTab('workbench')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    editorSubTab === 'workbench'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Workbench Colors
                </button>
                <button
                  onClick={() => setEditorSubTab('tokens')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    editorSubTab === 'tokens'
                      ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Syntax Tokens
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                {editorSubTab === 'workbench' ? (
                  <WorkbenchColorPicker
                    theme={currentTheme}
                    onColorChange={handleWorkbenchColorChange}
                  />
                ) : (
                  <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                      <TokenColorPicker
                        theme={currentTheme}
                        onTokenChange={handleTokenColorChange}
                      />
                    </div>
                    <div className="p-2 border-t border-slate-800 bg-slate-950/80">
                      <ContrastAuditor
                        theme={currentTheme}
                        onAutoFixContrast={handleAutoFixContrast}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Live VS Code Workspace Simulator */}
            <div className="flex-1 flex overflow-hidden">
              <VSCodeEditor
                theme={currentTheme}
                iconConfig={iconConfig}
                onOpenOpenChamber={() => setActiveMode('openchamber')}
              />
            </div>
          </div>
        )}

        {/* MODE 2: OpenChamber Extension SDK Studio */}
        {activeMode === 'openchamber' && (
          <div className="flex-1 flex flex-col md:flex-row gap-2 overflow-hidden">
            {/* Left Extension File Editor */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col shrink-0 rounded-xl overflow-hidden shadow-xl">
              <ExtensionCodeEditor
                extension={openchamberExtension}
                onUpdateExtension={handleUpdateExtension}
                onSelectTemplate={handleSelectExtensionTemplate}
              />
            </div>

            {/* Right Live OpenChamber Simulator */}
            <div className="flex-1 flex overflow-hidden">
              <OpenChamberWorkspace
                extension={openchamberExtension}
                theme={currentTheme}
              />
            </div>
          </div>
        )}

        {/* MODE 3: Icon Theme Pack Studio */}
        {activeMode === 'icons' && (
          <div className="flex-1 flex overflow-hidden">
            <IconPackStudio
              iconConfig={iconConfig}
              theme={currentTheme}
              onUpdateIconConfig={setIconConfig}
              onDownloadIconPack={() => downloadVSCodeExtensionZip(currentTheme, iconConfig)}
            />
          </div>
        )}

        {/* MODE 4: GitHub Export Studio */}
        {activeMode === 'github' && (
          <div className="flex-1 flex overflow-hidden">
            <GitHubExportPanel
              theme={currentTheme}
              iconConfig={iconConfig}
              extension={openchamberExtension}
            />
          </div>
        )}
      </main>

      {/* Floating AI Chat Trigger Button */}
      <button
        onClick={() => setIsAiChatOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 hover:scale-105 active:scale-95 text-white font-bold text-xs shadow-2xl shadow-fuchsia-500/30 flex items-center gap-2 transition"
      >
        <MessageSquare className="w-4 h-4 animate-bounce" />
        <span>Ask AI (3 Proposals)</span>
      </button>

      {/* AI Interactive Theme Chat Drawer */}
      <AiThemeChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        onApplyTheme={(themeUpdates) => {
          setCurrentTheme((prev) => ({
            ...prev,
            ...themeUpdates,
            colors: { ...prev.colors, ...(themeUpdates.colors || {}) },
            tokenColors: themeUpdates.tokenColors || prev.tokenColors,
          }));
        }}
        onApplyIcons={(iconUpdates) => {
          setIconConfig((prev) => ({
            ...prev,
            ...iconUpdates,
            icons: iconUpdates.icons || prev.icons,
          }));
        }}
      />

      {/* Project Workflow Wizard Modal */}
      <ProjectWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onSelectMode={(mode) => setActiveMode(mode)}
        onApplyTheme={(selected) => setCurrentTheme(selected)}
        onSyncThemeToOpenChamber={handleSyncThemeToOpenChamber}
        onSelectExtensionTemplate={handleSelectExtensionTemplate}
      />

      {/* AI Theme & Extension Generator Modal */}
      <AiThemeGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyTheme={(themeUpdates) => {
          setCurrentTheme((prev) => ({
            ...prev,
            ...themeUpdates,
            colors: { ...prev.colors, ...(themeUpdates.colors || {}) },
            tokenColors: themeUpdates.tokenColors || prev.tokenColors,
          }));
        }}
        onApplyExtension={(extUpdates) => {
          setOpenchamberExtension((prev) => ({
            ...prev,
            ...extUpdates,
            manifest: { ...prev.manifest, ...(extUpdates.manifest || {}) },
          }));
          setActiveMode('openchamber');
        }}
        onApplyIcons={(iconUpdates) => {
          setIconConfig((prev) => ({
            ...prev,
            ...iconUpdates,
            icons: iconUpdates.icons || prev.icons,
          }));
        }}
      />

      {/* Export & Packaging Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        theme={currentTheme}
        iconConfig={iconConfig}
        extension={openchamberExtension}
      />
    </div>
  );
}

export type ThemeType = 'dark' | 'light';

export interface TokenScopeConfig {
  id: string;
  name: string;
  scope: string | string[];
  foreground: string;
  fontStyle?: 'normal' | 'italic' | 'bold' | 'underline';
  description: string;
  category: 'core' | 'syntax' | 'punctuation' | 'markup';
}

export interface WorkbenchColorCategory {
  category: string;
  colors: {
    key: string;
    label: string;
    description: string;
    defaultValue: string;
  }[];
}

export interface VSCodeThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  author: string;
  version: string;
  type: ThemeType;
  license: string;
  colors: Record<string, string>;
  tokenColors: {
    name: string;
    scope: string | string[];
    settings: {
      foreground: string;
      fontStyle?: string;
    };
  }[];
  semanticTokenColors?: Record<string, string>;
  semanticHighlighting?: boolean;
}

export type IconStyleType = 'minimal' | 'duotone' | 'rounded' | 'sharp';

export interface IconDefinition {
  id: string;
  name: string;
  pattern: string; // extension or filename
  category: 'language' | 'config' | 'folder' | 'system' | 'data';
  primaryColor: string;
  secondaryColor?: string;
  glyph: string; // SVG path or identifier
}

export interface IconThemeConfig {
  id: string;
  name: string;
  displayName: string;
  description: string;
  folderColor: string;
  folderOpenColor: string;
  fileDefaultColor: string;
  style: IconStyleType;
  icons: IconDefinition[];
}

export interface OpenChamberManifest {
  name: string;
  title: string;
  version: string;
  description: string;
  author: string;
  entry: string;
  icon: string;
  permissions: string[];
  categories: string[];
}

export interface OpenChamberExtensionConfig {
  id: string;
  manifest: OpenChamberManifest;
  html: string;
  js: string;
  css: string;
  svgIcon: string;
  readme: string;
}

export interface OpenChamberTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: string;
}

export interface OpenChamberChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  toolCall?: {
    tool: string;
    args: any;
    output?: any;
  };
}

export interface OpenChamberSession {
  id: string;
  title: string;
  model: string;
  branch: string;
  messages: OpenChamberChatMessage[];
  tasks: OpenChamberTask[];
  modifiedFiles: {
    path: string;
    status: 'modified' | 'added' | 'deleted';
    linesAdded: number;
    linesRemoved: number;
  }[];
}

export interface GitHubExportConfig {
  repoName: string;
  owner: string;
  description: string;
  isPrivate: boolean;
  includeActions: boolean;
  includeOpenChamber: boolean;
  includeContributing: boolean;
  branch: string;
  token?: string;
}

export type ActiveStudioMode = 'vscode-theme' | 'openchamber' | 'icons' | 'export' | 'github';

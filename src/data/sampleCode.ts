export interface CodeSample {
  id: string;
  name: string;
  language: string;
  icon: string;
  code: string;
}

export const CODE_SAMPLES: CodeSample[] = [
  {
    id: 'typescript',
    name: 'themeEngine.ts',
    language: 'typescript',
    icon: 'ts',
    code: `import { connectHost } from '@openchamber/sdk';
import { VSCodeThemeConfig, WCAGAudit } from '../types';

/**
 * ChamberCraft Core Engine: Generates VS Code themes & OpenChamber SDK panels.
 * Ensures WCAG AA compliance and seamless token synchronization.
 */
export class ChamberStudioEngine {
  private activeTheme: VSCodeThemeConfig;
  private readonly version: string = '2.4.0';

  constructor(initialTheme: VSCodeThemeConfig) {
    this.activeTheme = initialTheme;
    console.log(\`[ChamberCraft] Initialized with theme: \${this.activeTheme.name}\`);
  }

  public auditContrast(bgHex: string, fgHex: string): WCAGAudit {
    const ratio = this.calculateContrastRatio(bgHex, fgHex);
    const passesAA = ratio >= 4.5;
    const passesAAA = ratio >= 7.0;

    return {
      ratio: Number(ratio.toFixed(2)),
      passesAA,
      passesAAA,
      recommendation: passesAA ? 'Compliant' : 'Increase contrast for legibility',
    };
  }

  public async exportVsixPackage(): Promise<{ vsixReady: boolean; totalFiles: number }> {
    const files = await this.packageBundle();
    return { vsixReady: true, totalFiles: files.length };
  }

  private calculateContrastRatio(c1: string, c2: string): number {
    // Luminance calculation
    return 8.42;
  }
}`,
  },
  {
    id: 'python',
    name: 'agentic_pipeline.py',
    language: 'python',
    icon: 'py',
    code: `import os
from typing import Dict, List, Optional
from dataclasses import dataclass

@dataclass
class AgentSession:
    session_id: str
    model: str = "gemini-3.8-flash"
    active_tokens: int = 128_400
    is_active: bool = True

class OpenChamberBridge:
    """Connects external Python tools to the OpenChamber SDK."""
    def __init__(self, api_url: str = "http://localhost:3000"):
        self.endpoint = api_url
        self.session_cache: Dict[str, AgentSession] = {}

    def dispatch_prompt(self, session_id: str, prompt: str) -> bool:
        if not prompt or len(prompt.strip()) == 0:
            raise ValueError("Prompt content cannot be empty")
        
        session = self.session_cache.get(session_id)
        if session and session.is_active:
            print(f"[Agentic] Dispatched to {session.model}: '{prompt[:40]}...'")
            return True
        return False`,
  },
  {
    id: 'rust',
    name: 'token_parser.rs',
    language: 'rust',
    icon: 'rs',
    code: `use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TextMateScope {
    pub name: String,
    pub scope: Vec<String>,
    pub foreground: String,
    pub font_style: Option<String>,
}

pub struct ScopeEngine {
    tokens: HashMap<String, String>,
}

impl ScopeEngine {
    pub fn new() -> Self {
        Self {
            tokens: HashMap::new(),
        }
    }

    pub fn resolve_color(&self, token_name: &str) -> Option<&String> {
        self.tokens.get(token_name)
    }
}`,
  },
  {
    id: 'json',
    name: 'package.json',
    language: 'json',
    icon: 'json',
    code: `{
  "name": "chamber-theme-pro",
  "displayName": "ChamberCraft Theme & SDK",
  "description": "Full-featured VS Code Theme and OpenChamber Extension",
  "version": "1.0.0",
  "publisher": "chambercraft",
  "engines": {
    "vscode": "^1.85.0"
  },
  "categories": [
    "Themes",
    "Productivity"
  ],
  "contributes": {
    "themes": [
      {
        "label": "ChamberCraft Deep Dark",
        "uiTheme": "vs-dark",
        "path": "./themes/chamber-theme.json"
      }
    ],
    "iconThemes": [
      {
        "id": "chamber-icons",
        "label": "ChamberCraft Fluent Icons",
        "path": "./icons/icon-theme.json"
      }
    ]
  },
  "openchamber": {
    "name": "ChamberCraft Booster",
    "entry": "panel/index.html",
    "icon": "icon.svg",
    "permissions": ["session:read", "prompt:send"]
  }
}`,
  },
];

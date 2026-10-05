import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// AI Theme Generator API
app.post('/api/ai/theme', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server',
      fallback: true,
    });
  }

  try {
    const systemInstruction = `You are an expert color designer, VS Code theme creator, and icon designer.
Output ONLY valid JSON (no markdown fences, no explanation) with this exact structure:
{
  "name": "Theme Name",
  "type": "dark",
  "description": "Short description",
  "colors": {
    "activityBar.background": "#...",
    "activityBar.foreground": "#...",
    "activityBarBadge.background": "#...",
    "sideBar.background": "#...",
    "sideBar.foreground": "#...",
    "sideBarSectionHeader.background": "#...",
    "editor.background": "#...",
    "editor.foreground": "#...",
    "editorCursor.foreground": "#...",
    "editor.lineHighlightBackground": "#...",
    "editorLineNumber.foreground": "#...",
    "editorLineNumber.activeForeground": "#...",
    "editor.selectionBackground": "#...",
    "statusBar.background": "#...",
    "statusBar.foreground": "#...",
    "titleBar.activeBackground": "#...",
    "titleBar.activeForeground": "#...",
    "tab.activeBackground": "#...",
    "tab.activeForeground": "#...",
    "tab.inactiveBackground": "#...",
    "tab.inactiveForeground": "#...",
    "terminal.background": "#...",
    "terminal.foreground": "#...",
    "focusBorder": "#...",
    "accent": "#..."
  },
  "tokens": {
    "keywords": "#...",
    "functions": "#...",
    "strings": "#...",
    "comments": "#...",
    "variables": "#...",
    "numbers": "#...",
    "types": "#...",
    "constants": "#...",
    "tags": "#...",
    "punctuation": "#..."
  },
  "icons": {
    "style": "rounded",
    "folderColor": "#...",
    "folderOpenColor": "#...",
    "fileDefaultColor": "#...",
    "symbols": {
      "typescript": "#...",
      "tsx": "#...",
      "javascript": "#...",
      "jsx": "#...",
      "python": "#...",
      "rust": "#...",
      "go": "#...",
      "java": "#...",
      "cpp": "#...",
      "csharp": "#...",
      "php": "#...",
      "ruby": "#...",
      "swift": "#...",
      "kotlin": "#...",
      "html": "#...",
      "css": "#...",
      "json": "#...",
      "yaml": "#...",
      "markdown": "#...",
      "sql": "#...",
      "graphql": "#...",
      "shell": "#...",
      "docker": "#...",
      "git": "#...",
      "env": "#...",
      "package": "#...",
      "test": "#...",
      "database": "#...",
      "image": "#..."
    }
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Create an aesthetically stunning, high-contrast, cohesive VS Code theme AND full matching icon palette for all file/folder symbols based on this prompt: "${prompt}". Ensure WCAG contrast between editor.background and syntax tokens. Output strictly JSON.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json({ success: true, theme: parsed });
  } catch (error: any) {
    console.error('Error generating theme via Gemini:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// AI 3-Theme Proposals Generator (from user prompt or random domains)
app.post('/api/ai/theme-proposals', async (req, res) => {
  const { prompt, isRandom } = req.body;

  const randomDomains = [
    'Deep Sea Bioluminescence with abyssal navy and glowing cyan',
    'Warm Coffee Shop & Vintage Espresso with roasted amber tones',
    'Cyberpunk 2077 Night Market with neon magenta and electric turquoise',
    'Nordic Frozen Glaciers with ice mint, polar silver and frost blue',
    'Autumn Campfire Forest with smoky charcoal and burning gold',
    'Solar Flare Horizon with obsidian black, crimson and blazing sun gold',
    'Clean Japanese Minimalist Paper with slate charcoal and cherry blossom pink',
    'Retro 80s Synthwave Sunset with ultraviolet, hot pink and palm grid'
  ];

  const selectedPrompt = isRandom 
    ? `Generate 3 wildly diverse themes from distinct aesthetic domains: 1) ${randomDomains[Math.floor(Math.random() * randomDomains.length)]}, 2) ${randomDomains[Math.floor(Math.random() * randomDomains.length)]}, 3) ${randomDomains[Math.floor(Math.random() * randomDomains.length)]}`
    : `Generate 3 creative, distinct theme variations exploring this preference: "${prompt}". Make each variation distinct (e.g. one high contrast, one soft balanced, one bold vibrant).`;

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server',
      fallback: true,
    });
  }

  try {
    const systemInstruction = `You are a world-class color theorist, VS Code theme engineer, and UI icon designer.
Generate an array of exactly 3 complete, distinct, beautiful themes with matching icon sets.
Output ONLY valid JSON with this exact schema:
{
  "proposals": [
    {
      "id": "slug-id-1",
      "name": "Creative Theme Name 1",
      "tagline": "Short 1-sentence mood description",
      "domain": "Sci-Fi / Nature / Minimalist / Vintage / etc.",
      "type": "dark",
      "colors": {
        "activityBar.background": "#...",
        "activityBar.foreground": "#...",
        "activityBarBadge.background": "#...",
        "sideBar.background": "#...",
        "sideBar.foreground": "#...",
        "editor.background": "#...",
        "editor.foreground": "#...",
        "editorCursor.foreground": "#...",
        "editor.lineHighlightBackground": "#...",
        "editorLineNumber.foreground": "#...",
        "editorLineNumber.activeForeground": "#...",
        "editor.selectionBackground": "#...",
        "statusBar.background": "#...",
        "statusBar.foreground": "#...",
        "titleBar.activeBackground": "#...",
        "titleBar.activeForeground": "#...",
        "tab.activeBackground": "#...",
        "tab.activeForeground": "#...",
        "terminal.background": "#...",
        "terminal.foreground": "#...",
        "focusBorder": "#...",
        "accent": "#..."
      },
      "tokens": {
        "keywords": "#...",
        "functions": "#...",
        "strings": "#...",
        "comments": "#...",
        "variables": "#...",
        "numbers": "#...",
        "types": "#...",
        "constants": "#...",
        "tags": "#...",
        "punctuation": "#..."
      },
      "icons": {
        "style": "rounded",
        "folderColor": "#...",
        "folderOpenColor": "#...",
        "fileDefaultColor": "#...",
        "symbols": {
          "typescript": "#...",
          "tsx": "#...",
          "javascript": "#...",
          "jsx": "#...",
          "python": "#...",
          "rust": "#...",
          "go": "#...",
          "html": "#...",
          "css": "#...",
          "json": "#...",
          "markdown": "#...",
          "sql": "#...",
          "docker": "#...",
          "git": "#...",
          "env": "#...",
          "test": "#..."
        }
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: selectedPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, proposals: parsed.proposals || [] });
  } catch (error: any) {
    console.error('Error generating proposals via Gemini:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// AI Interactive Chat Assistant
app.post('/api/ai/chat', async (req, res) => {
  const { messages, userMessage } = req.body;
  if (!userMessage && (!messages || messages.length === 0)) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server',
      fallback: true,
    });
  }

  try {
    const systemInstruction = `You are ChamberCraft AI, an elite developer tools designer specializing in VS Code themes and OpenChamber agentic IDE extensions.
When the user describes colors, themes, moods, or extensions they like:
1. Provide a concise, engaging design analysis (under 3 sentences).
2. Create 3 distinct clickable theme proposals matching their taste.

Output strictly JSON:
{
  "reply": "Conversational explanation...",
  "proposals": [
    {
      "id": "slug-1",
      "name": "Theme Name",
      "tagline": "Short mood description",
      "domain": "Domain Name",
      "type": "dark",
      "colors": {
        "activityBar.background": "#...",
        "activityBar.foreground": "#...",
        "sideBar.background": "#...",
        "sideBar.foreground": "#...",
        "editor.background": "#...",
        "editor.foreground": "#...",
        "editorCursor.foreground": "#...",
        "editor.lineHighlightBackground": "#...",
        "editorLineNumber.foreground": "#...",
        "editorLineNumber.activeForeground": "#...",
        "editor.selectionBackground": "#...",
        "statusBar.background": "#...",
        "statusBar.foreground": "#...",
        "titleBar.activeBackground": "#...",
        "tab.activeBackground": "#...",
        "tab.activeForeground": "#...",
        "terminal.background": "#...",
        "terminal.foreground": "#...",
        "focusBorder": "#...",
        "accent": "#..."
      },
      "tokens": {
        "keywords": "#...",
        "functions": "#...",
        "strings": "#...",
        "comments": "#...",
        "variables": "#...",
        "numbers": "#...",
        "types": "#...",
        "constants": "#...",
        "tags": "#...",
        "punctuation": "#..."
      },
      "icons": {
        "style": "rounded",
        "folderColor": "#...",
        "folderOpenColor": "#...",
        "fileDefaultColor": "#...",
        "symbols": {
          "typescript": "#...",
          "tsx": "#...",
          "javascript": "#...",
          "python": "#...",
          "rust": "#...",
          "html": "#...",
          "css": "#...",
          "json": "#...",
          "git": "#...",
          "docker": "#..."
        }
      }
    }
  ]
}`;

    const promptText = `User says: "${userMessage || messages[messages.length - 1]?.content}". Generate 3 personalized theme options and reply.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, reply: parsed.reply, proposals: parsed.proposals || [] });
  } catch (error: any) {
    console.error('Error in AI chat via Gemini:', error);
    return res.status(500).json({ error: error.message || 'Chat generation failed' });
  }
});

// AI OpenChamber Extension Builder (from natural language description)
app.post('/api/ai/build-extension', async (req, res) => {
  const { prompt, currentConfig } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'GEMINI_API_KEY not configured on server',
      fallback: true,
    });
  }

  try {
    const systemInstruction = `You are an expert engineer for OpenChamber (https://docs.openchamber.dev/sdk/).
OpenChamber extensions are guest panels running inside an iframe, communicating with the host via @openchamber/sdk:
import { connectHost } from '@openchamber/sdk';
const host = await connectHost();
// Available host APIs:
// host.getProject(): Promise<{ name: string, rootPath: string }>
// host.getSession(): Promise<{ id: string, title: string, model: string }>
// host.sendPrompt(text: string): Promise<void>
// host.insertPrompt(text: string): Promise<void>
// host.showNotification({ message: string, type: 'info' | 'error' | 'success' }): Promise<void>
// host.attachTask({ title: string, description: string, status: 'pending' | 'running' | 'completed' }): Promise<void>
// host.getFiles(): Promise<Array<{ path: string, modified: boolean }>>
// host.onThemeChange(callback: (theme: any) => void): () => void

Generate a production-ready, fully interactive OpenChamber extension.
Output strictly JSON (no markdown):
{
  "name": "extension-slug",
  "title": "Readable Extension Title",
  "description": "What this extension does",
  "version": "1.0.0",
  "permissions": ["session:read", "session:write", "project:read", "prompt:send", "notifications"],
  "html": "<!DOCTYPE html>...",
  "js": "...",
  "css": "...",
  "svgIcon": "<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"2\\">...</svg>",
  "readme": "# ..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Build a complete, production-grade, interactive OpenChamber extension panel for this specification: "${prompt}". Ensure the HTML/CSS/JS work together with buttons, interactive feedback, and proper @openchamber/sdk calls.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, extension: parsed });
  } catch (error: any) {
    console.error('Error generating extension via Gemini:', error);
    return res.status(500).json({ error: error.message || 'Generation failed' });
  }
});

// Alias for backwards compatibility
app.post('/api/ai/extension', async (req, res) => {
  req.url = '/api/ai/build-extension';
  return app._router.handle(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChamberCraft Studio server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

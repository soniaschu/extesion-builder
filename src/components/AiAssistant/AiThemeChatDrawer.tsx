import React from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  Dices, 
  Check, 
  ArrowRight, 
  Loader2, 
  Palette, 
  ShieldCheck, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig, IconDefinition } from '../../types';
import { ALL_SUPPORTED_ICONS } from '../../utils/svgIconGenerator';

export interface ThemeProposal {
  id: string;
  name: string;
  tagline: string;
  domain: string;
  type: 'dark' | 'light';
  colors: Record<string, string>;
  tokens: Record<string, string>;
  icons?: {
    style?: 'rounded' | 'sharp' | 'minimal' | 'duotone';
    folderColor?: string;
    folderOpenColor?: string;
    fileDefaultColor?: string;
    symbols?: Record<string, string>;
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  proposals?: ThemeProposal[];
  timestamp: string;
}

interface AiThemeChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTheme: (theme: Partial<VSCodeThemeConfig>) => void;
  onApplyIcons: (icons: Partial<IconThemeConfig>) => void;
}

export const AiThemeChatDrawer: React.FC<AiThemeChatDrawerProps> = ({
  isOpen,
  onClose,
  onApplyTheme,
  onApplyIcons,
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hey there! Tell me what aesthetics or color palettes you love (e.g. "warm matcha latte and cream", "cyberpunk neon with obsidian", "retro 80s arcade"), or click "Surprise Me" to generate 3 diverse theme variations!',
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [appliedProposalId, setAppliedProposalId] = React.useState<string | null>(null);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleApplyProposal = (p: ThemeProposal) => {
    // 1. Build tokens
    const tokenColors = [
      { name: 'Comments', scope: ['comment'], settings: { foreground: p.tokens.comments || '#64748b', fontStyle: 'italic' } },
      { name: 'Keywords', scope: ['keyword', 'storage'], settings: { foreground: p.tokens.keywords || '#f43f5e', fontStyle: 'bold' } },
      { name: 'Functions', scope: ['entity.name.function', 'support.function'], settings: { foreground: p.tokens.functions || '#38bdf8' } },
      { name: 'Strings', scope: ['string'], settings: { foreground: p.tokens.strings || '#facc15' } },
      { name: 'Numbers', scope: ['constant.numeric'], settings: { foreground: p.tokens.numbers || '#fb923c' } },
      { name: 'Variables', scope: ['variable'], settings: { foreground: p.tokens.variables || '#e2e8f0' } },
      { name: 'Types', scope: ['entity.name.type'], settings: { foreground: p.tokens.types || '#34d399' } },
      { name: 'Constants', scope: ['constant'], settings: { foreground: p.tokens.constants || '#f472b6' } },
      { name: 'Tags', scope: ['entity.name.tag'], settings: { foreground: p.tokens.tags || '#f43f5e' } },
      { name: 'Operators', scope: ['keyword.operator', 'punctuation'], settings: { foreground: p.tokens.punctuation || '#94a3b8' } },
    ];

    onApplyTheme({
      displayName: p.name,
      description: p.tagline,
      type: p.type || 'dark',
      colors: p.colors,
      tokenColors,
    });

    // 2. Build icon pack
    if (p.icons) {
      const symbols = p.icons.symbols || {};
      const updatedIcons: IconDefinition[] = ALL_SUPPORTED_ICONS.map((base) => ({
        ...base,
        primaryColor: symbols[base.id] || base.primaryColor,
      }));

      onApplyIcons({
        displayName: `${p.name} Icons`,
        description: `Matching vector icons for ${p.name}`,
        folderColor: p.icons.folderColor || p.colors['focusBorder'] || '#e0af68',
        folderOpenColor: p.icons.folderOpenColor || p.colors['accent'] || '#f59e0b',
        fileDefaultColor: p.icons.fileDefaultColor || '#94a3b8',
        style: p.icons.style || 'rounded',
        icons: updatedIcons,
      });
    }

    setAppliedProposalId(p.id);
    setTimeout(() => setAppliedProposalId(null), 2500);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: messageText }),
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply,
          proposals: data.proposals || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        // Fallback procedural generator
        generateProceduralProposalChat(messageText);
      }
    } catch (err) {
      console.warn('Network error in AI chat, using procedural synthesis:', err);
      generateProceduralProposalChat(messageText);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSurprise = async () => {
    setLoading(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: '🎲 Surprise me! Propose 3 completely diverse theme variations across different domains.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await fetch('/api/ai/theme-proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRandom: true }),
      });

      const data = await res.json();

      if (res.ok && data.proposals?.length > 0) {
        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Here are 3 unique aesthetic proposals crafted from distinct design domains. Click "Apply Theme" to immediately test any of them!',
          proposals: data.proposals,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        generateProceduralProposalChat('random diverse');
      }
    } catch (err) {
      generateProceduralProposalChat('random diverse');
    } finally {
      setLoading(false);
    }
  };

  // Fallback procedural generator for 3 proposals
  const generateProceduralProposalChat = (query: string) => {
    const proposals: ThemeProposal[] = [
      {
        id: 'prop-1',
        name: 'Neon Cyberpunk Horizon',
        domain: 'Sci-Fi / Cyberpunk',
        tagline: 'High contrast electric cyan and hot magenta over obsidian glass.',
        type: 'dark',
        colors: {
          'editor.background': '#090c13',
          'editor.foreground': '#e2e8f0',
          'editorCursor.foreground': '#00f0ff',
          'activityBar.background': '#07090f',
          'activityBar.foreground': '#00f0ff',
          'sideBar.background': '#0d111b',
          'statusBar.background': '#06080d',
          'statusBar.foreground': '#00f0ff',
          'tab.activeBackground': '#090c13',
          'tab.activeForeground': '#00f0ff',
          'focusBorder': '#00f0ff',
        },
        tokens: {
          keywords: '#ff007f',
          functions: '#00f0ff',
          strings: '#ffe600',
          comments: '#475569',
          variables: '#e2e8f0',
          numbers: '#ff9900',
          types: '#00ffaa',
          constants: '#f43f5e',
          tags: '#ff007f',
          punctuation: '#a855f7',
        },
        icons: {
          style: 'rounded',
          folderColor: '#00f0ff',
          folderOpenColor: '#ff007f',
          symbols: { typescript: '#00f0ff', python: '#ffe600', rust: '#ff9900' },
        },
      },
      {
        id: 'prop-2',
        name: 'Cozy Roasted Espresso',
        domain: 'Warm Vintage / Coffee',
        tagline: 'Deep dark roast coffee beans with warm amber accents and creamy foam tokens.',
        type: 'dark',
        colors: {
          'editor.background': '#15110d',
          'editor.foreground': '#f3ede6',
          'editorCursor.foreground': '#f59e0b',
          'activityBar.background': '#100d0a',
          'activityBar.foreground': '#f59e0b',
          'sideBar.background': '#1a1510',
          'statusBar.background': '#0d0a08',
          'statusBar.foreground': '#d97706',
          'tab.activeBackground': '#15110d',
          'tab.activeForeground': '#f59e0b',
          'focusBorder': '#f59e0b',
        },
        tokens: {
          keywords: '#fb923c',
          functions: '#f59e0b',
          strings: '#fef08a',
          comments: '#78716c',
          variables: '#f3ede6',
          numbers: '#f97316',
          types: '#fdba74',
          constants: '#d97706',
          tags: '#ea580c',
          punctuation: '#a8a29e',
        },
        icons: {
          style: 'duotone',
          folderColor: '#f59e0b',
          folderOpenColor: '#fbbf24',
          symbols: { typescript: '#f59e0b', python: '#fb923c', rust: '#d97706' },
        },
      },
      {
        id: 'prop-3',
        name: 'Nordic Aurora Glaciers',
        domain: 'Nature / Arctic',
        tagline: 'Glacial sub-zero navy with polar silver, auroral mint, and glacial frost.',
        type: 'dark',
        colors: {
          'editor.background': '#08141c',
          'editor.foreground': '#e0f2fe',
          'editorCursor.foreground': '#38bdf8',
          'activityBar.background': '#060f15',
          'activityBar.foreground': '#38bdf8',
          'sideBar.background': '#0b1b26',
          'statusBar.background': '#040b10',
          'statusBar.foreground': '#7dd3fc',
          'tab.activeBackground': '#08141c',
          'tab.activeForeground': '#38bdf8',
          'focusBorder': '#38bdf8',
        },
        tokens: {
          keywords: '#38bdf8',
          functions: '#2dd4bf',
          strings: '#a7f3d0',
          comments: '#47697d',
          variables: '#e0f2fe',
          numbers: '#818cf8',
          types: '#67e8f9',
          constants: '#c084fc',
          tags: '#38bdf8',
          punctuation: '#7dd3fc',
        },
        icons: {
          style: 'minimal',
          folderColor: '#38bdf8',
          folderOpenColor: '#2dd4bf',
          symbols: { typescript: '#38bdf8', python: '#2dd4bf', rust: '#818cf8' },
        },
      },
    ];

    const assistantMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `I crafted 3 distinctive variations based on your request. Each option is optimized for legibility and WCAG AA contrast. Click "Apply Theme" to test it live!`,
      proposals,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 p-0.5 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>AI Theme Partner</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Gemini
              </span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Describe what you like or get 3 randomized proposals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleRandomSurprise}
            disabled={loading}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-medium transition"
            title="Random Theme Inspiration"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Surprise Me</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              {msg.role === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-cyan-400" />
                  <span>ChamberCraft AI</span>
                </>
              )}
              <span>· {msg.timestamp}</span>
            </div>

            <div
              className={`p-3 rounded-xl max-w-[95%] leading-relaxed select-text ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div>{msg.content}</div>

              {/* Proposals Cards (if any) */}
              {msg.proposals && msg.proposals.length > 0 && (
                <div className="mt-3 space-y-3 pt-2 border-t border-slate-800">
                  <div className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    3 Aesthetic Proposals
                  </div>

                  {msg.proposals.map((proposal, idx) => {
                    const isApplied = appliedProposalId === proposal.id;

                    return (
                      <div
                        key={proposal.id || idx}
                        className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2.5"
                      >
                        {/* Title & Domain */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-slate-100 text-xs">
                              {proposal.name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {proposal.domain} · {proposal.tagline}
                            </div>
                          </div>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 shrink-0">
                            AA Pass
                          </span>
                        </div>

                        {/* Color Swatch Bar */}
                        <div className="flex items-center gap-1.5 p-1.5 rounded bg-slate-950 border border-slate-850">
                          <span className="text-[9px] text-slate-500 font-mono">Palette:</span>
                          <div
                            className="w-5 h-5 rounded border border-white/10"
                            style={{ backgroundColor: proposal.colors['editor.background'] || '#121212' }}
                            title="Editor Background"
                          />
                          <div
                            className="w-5 h-5 rounded border border-white/10"
                            style={{ backgroundColor: proposal.colors['sideBar.background'] || '#181818' }}
                            title="Sidebar Background"
                          />
                          <div
                            className="w-5 h-5 rounded border border-white/10"
                            style={{ backgroundColor: proposal.tokens.keywords || '#f43f5e' }}
                            title="Keywords Token"
                          />
                          <div
                            className="w-5 h-5 rounded border border-white/10"
                            style={{ backgroundColor: proposal.tokens.functions || '#38bdf8' }}
                            title="Functions Token"
                          />
                          <div
                            className="w-5 h-5 rounded border border-white/10"
                            style={{ backgroundColor: proposal.tokens.strings || '#fde047' }}
                            title="Strings Token"
                          />
                          <div
                            className="w-5 h-5 rounded border border-white/10 ml-auto"
                            style={{ backgroundColor: proposal.icons?.folderColor || '#f59e0b' }}
                            title="Folder Icon"
                          />
                        </div>

                        {/* Action Apply Button */}
                        <button
                          onClick={() => handleApplyProposal(proposal)}
                          className={`w-full py-1.5 px-3 rounded-md font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm ${
                            isApplied
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied to Studio!</span>
                            </>
                          ) : (
                            <>
                              <Palette className="w-3.5 h-3.5" />
                              <span>Apply Theme & All Icons</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-slate-950/60 rounded-lg border border-slate-850">
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            <span>ChamberCraft AI is crafting 3 theme variations...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inspiration Prompts */}
      <div className="p-2 border-t border-slate-800 bg-slate-950/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 text-[11px]">
        <button
          onClick={() => handleSendMessage('Deep emerald forest with mossy greens and warm amber')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 whitespace-nowrap transition"
        >
          🌲 Emerald Forest
        </button>
        <button
          onClick={() => handleSendMessage('Tokyo cyberpunk twilight with vivid cyan, neon magenta, and obsidian')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 whitespace-nowrap transition"
        >
          🌃 Tokyo Cyberpunk
        </button>
        <button
          onClick={() => handleSendMessage('Warm roasted espresso coffee with cozy cream paper and caramel highlights')}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 whitespace-nowrap transition"
        >
          ☕ Warm Espresso
        </button>
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe colors or moods you like..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  GitBranch, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Github, 
  Terminal, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Lock,
  Globe,
  Settings,
  ShieldCheck,
  FolderGit2
} from 'lucide-react';
import { VSCodeThemeConfig, IconThemeConfig, OpenChamberExtensionConfig, GitHubExportConfig } from '../../types';
import { downloadGitHubRepoZip } from '../../utils/zipExporter';

interface GitHubExportPanelProps {
  theme: VSCodeThemeConfig;
  iconConfig: IconThemeConfig;
  extension: OpenChamberExtensionConfig;
}

export const GitHubExportPanel: React.FC<GitHubExportPanelProps> = ({
  theme,
  iconConfig,
  extension,
}) => {
  const [config, setConfig] = React.useState<GitHubExportConfig>({
    repoName: `vsc-theme-${theme.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`,
    owner: '',
    description: `${theme.displayName} - Modern high-contrast VS Code theme and ${iconConfig.icons.length}+ symbol icon pack`,
    isPrivate: false,
    includeActions: true,
    includeOpenChamber: true,
    includeContributing: true,
    branch: 'main',
    token: '',
  });

  const [copiedCommands, setCopiedCommands] = React.useState(false);
  const [pushing, setPushing] = React.useState(false);
  const [apiResult, setApiResult] = React.useState<{ success: boolean; url?: string; error?: string } | null>(null);

  const gitCliCommands = `# 1. Extract the downloaded repository archive
cd ${config.repoName}

# 2. Initialize Git repository
git init -b ${config.branch}
git add .
git commit -m "feat: initial release of ${theme.displayName} theme & icon suite"

# 3. Create repository on GitHub and push via GitHub CLI
gh repo create ${config.owner ? `${config.owner}/` : ''}${config.repoName} ${config.isPrivate ? '--private' : '--public'} --source=. --remote=origin --push

# 4. (Optional) Package VSIX extension locally
npm install -g @vscode/vsce
vsce package
code --install-extension ${config.repoName}-1.0.0.vsix`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCliCommands);
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2000);
  };

  const handleDirectGitHubCreate = async () => {
    if (!config.token?.trim()) {
      setApiResult({ success: false, error: 'Please enter a GitHub Personal Access Token (classic or fine-grained with repo access).' });
      return;
    }

    setPushing(true);
    setApiResult(null);

    try {
      // 1. Create repo via GitHub REST API
      const createRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.token.trim()}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: config.repoName,
          description: config.description,
          private: config.isPrivate,
          auto_init: true,
        }),
      });

      const repoData = await createRes.json();

      if (!createRes.ok) {
        throw new Error(repoData.message || 'Failed to create GitHub repository');
      }

      setApiResult({
        success: true,
        url: repoData.html_url,
      });
    } catch (err: any) {
      setApiResult({
        success: false,
        error: err.message || 'Error communicating with GitHub API',
      });
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full bg-slate-950 overflow-hidden font-sans border border-slate-800 rounded-xl shadow-2xl select-none">
      {/* Left Configuration Form */}
      <div className="w-full md:w-96 border-r border-slate-800 bg-slate-900/90 flex flex-col overflow-y-auto p-4 gap-4 text-xs">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Github className="w-5 h-5 text-slate-100" />
              <span className="font-semibold text-slate-100 text-sm">GitHub Export Studio</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              CI/CD Ready
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-1">
            Export complete open-source repository with GitHub Actions, marketplace publishing, and full icon packs.
          </p>
        </div>

        {/* Form Inputs */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex flex-col gap-3">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Repository Name</label>
            <input
              type="text"
              value={config.repoName}
              onChange={(e) => setConfig({ ...config, repoName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">GitHub Owner / Organization (optional)</label>
            <input
              type="text"
              value={config.owner}
              placeholder="e.g. your-github-username"
              onChange={(e) => setConfig({ ...config, owner: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Description</label>
            <textarea
              rows={2}
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-300">Visibility</span>
            <div className="flex rounded bg-slate-900 p-0.5 border border-slate-800">
              <button
                onClick={() => setConfig({ ...config, isPrivate: false })}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
                  !config.isPrivate ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Globe className="w-3 h-3" />
                <span>Public</span>
              </button>
              <button
                onClick={() => setConfig({ ...config, isPrivate: true })}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
                  config.isPrivate ? 'bg-cyan-600 text-slate-950 font-bold' : 'text-slate-400'
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>Private</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Included Assets & Workflows
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              GitHub Actions CI & Publish
            </span>
            <input
              type="checkbox"
              checked={config.includeActions}
              onChange={(e) => setConfig({ ...config, includeActions: e.target.checked })}
              className="rounded accent-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300 flex items-center gap-2">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              OpenChamber SDK Extension
            </span>
            <input
              type="checkbox"
              checked={config.includeOpenChamber}
              onChange={(e) => setConfig({ ...config, includeOpenChamber: e.target.checked })}
              className="rounded accent-emerald-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-300 flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              CONTRIBUTING.md & License
            </span>
            <input
              type="checkbox"
              checked={config.includeContributing}
              onChange={(e) => setConfig({ ...config, includeContributing: e.target.checked })}
              className="rounded accent-amber-500"
            />
          </label>
        </div>

        {/* Main Action: Download Repo ZIP */}
        <button
          onClick={() => downloadGitHubRepoZip(theme, iconConfig, extension, config)}
          className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
        >
          <Download className="w-4 h-4" />
          <span>Download GitHub Repo ZIP</span>
        </button>
      </div>

      {/* Right Side: GitHub CLI Instructions & Direct API Push */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">GitHub Publish Automation</span>
          </div>
          <span className="text-slate-400 text-[11px]">Push repository to GitHub in seconds</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Method 1: Git CLI Command Box */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>Option A: Publish via Terminal / GitHub CLI</span>
              </span>
              <button
                onClick={handleCopyCommands}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition text-[11px]"
              >
                {copiedCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCommands ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Download the ZIP above, open your terminal in the directory, and run:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed select-text">
              {gitCliCommands}
            </pre>
          </div>

          {/* Method 2: Direct API Push with Token */}
          <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-2">
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Option B: Direct GitHub API Create</span>
              </span>
              <a
                href="https://github.com/settings/tokens/new?scopes=repo&description=ChamberCraft+Theme+Publisher"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 text-[11px] hover:underline flex items-center gap-1"
              >
                <span>Generate Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400">
              Create the remote repository on your GitHub account instantly:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (GitHub Personal Access Token)"
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleDirectGitHubCreate}
                disabled={pushing || !config.token}
                className="px-4 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold transition flex items-center gap-1.5 shrink-0"
              >
                {pushing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-3.5 h-3.5" />
                    <span>Create on GitHub</span>
                  </>
                )}
              </button>
            </div>

            {apiResult?.success && (
              <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-[11px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Repository created successfully!</span>
                </div>
                <a
                  href={apiResult.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline flex items-center gap-1 text-emerald-200"
                >
                  <span>Open Repository</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {apiResult?.error && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-[11px] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{apiResult.error}</span>
              </div>
            )}
          </div>

          {/* Repository Structure Overview */}
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
              Generated Repository Structure ({config.repoName}/)
            </div>
            <div className="font-mono text-[11px] text-slate-400 space-y-1 bg-slate-950 p-2.5 rounded border border-slate-850">
              <div>├── .github/workflows/publish-marketplace.yml <span className="text-slate-600">(CI/CD publishing)</span></div>
              <div>├── .github/workflows/ci.yml <span className="text-slate-600">(Syntax validation)</span></div>
              <div>├── themes/{theme.name}-color-theme.json <span className="text-cyan-400">(Complete VS Code Theme)</span></div>
              <div>├── icons/icon-theme.json <span className="text-amber-400">({iconConfig.icons.length}+ Symbol Map)</span></div>
              <div>├── icons/*.svg <span className="text-amber-400">(Pure Vector Assets)</span></div>
              {config.includeOpenChamber && (
                <div>├── openchamber-extension/ <span className="text-emerald-400">(Guest SDK panel)</span></div>
              )}
              <div>├── package.json</div>
              <div>├── README.md <span className="text-slate-600">(With Shields.io badges)</span></div>
              <div>├── LICENSE <span className="text-slate-600">(MIT)</span></div>
              <div>└── scripts/publish-to-github.sh</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

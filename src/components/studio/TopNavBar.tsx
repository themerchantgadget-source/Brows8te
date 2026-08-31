import React, { useState } from 'react';
import {
  Code2,
  Share2,
  Bookmark,
  Sparkles,
  Sun,
  Moon,
  Key,
  ChevronDown,
  Menu,
  Check,
  Zap,
  Layers,
  Table,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import { StudioMode, ThemeMode, StudioParameters } from '../../types/aistudio';
import { GEMINI_MODELS } from '../../constants/models';

interface TopNavBarProps {
  mode: StudioMode;
  onSelectMode: (mode: StudioMode) => void;
  promptTitle: string;
  onChangePromptTitle: (title: string) => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isConfigOpen: boolean;
  onToggleConfig: () => void;
  parameters: StudioParameters;
  onChangeParameters: (params: Partial<StudioParameters>) => void;
  onOpenGetCode: () => void;
  onOpenShare: () => void;
  onOpenApiKey: () => void;
  onRunPrompt: () => void;
  onClearPrompt: () => void;
  isGenerating: boolean;
  totalTokensCount: number;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  mode,
  onSelectMode,
  promptTitle,
  onChangePromptTitle,
  themeMode,
  onToggleTheme,
  isSidebarOpen,
  onToggleSidebar,
  isConfigOpen,
  onToggleConfig,
  parameters,
  onChangeParameters,
  onOpenGetCode,
  onOpenShare,
  onOpenApiKey,
  onRunPrompt,
  onClearPrompt,
  isGenerating,
  totalTokensCount,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  const isDark = themeMode === 'dark';
  const activeModel = GEMINI_MODELS.find((m) => m.id === parameters.model) || GEMINI_MODELS[0];
  const contextLimit = activeModel.contextWindow;
  const tokenPercentage = Math.min(100, Math.max(0.1, (totalTokensCount / contextLimit) * 100));

  return (
    <header
      id="aistudio-top-navbar"
      className={`relative z-40 w-full h-14 border-b flex items-center justify-between px-3 sm:px-4 select-none transition-colors duration-200 ${
        isDark
          ? 'bg-[#131314] border-[#282a2c] text-[#e3e3e3]'
          : 'bg-[#ffffff] border-[#e0e3e7] text-[#1f1f1f]'
      }`}
    >
      {/* Left: Hamburger, Google AI Studio Brand & Editable Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleSidebar}
          className={`p-2 rounded-full transition-colors ${
            isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
          }`}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-2 pr-2 border-r border-current/10">
          <div className="relative flex items-center justify-center">
            {/* Gemini Multi-Color Sparkle */}
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-tr from-[#1a73e8] via-[#8ab4f8] to-[#d96570] text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="hidden md:flex items-baseline gap-1">
            <span className="font-semibold text-[15px] tracking-tight font-sans">
              Google <span className="font-medium text-blue-500">AI Studio</span>
            </span>
          </div>
        </div>

        {/* Editable Title */}
        <div className="flex items-center gap-1.5 min-w-0 max-w-[180px] sm:max-w-xs">
          {isEditingTitle ? (
            <input
              type="text"
              value={promptTitle}
              autoFocus
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              onChange={(e) => {
                onChangePromptTitle(e.target.value);
                setIsSaved(false);
              }}
              className={`px-2 py-0.5 text-sm rounded-md border outline-hidden font-medium ${
                isDark
                  ? 'bg-[#1e1f20] border-[#37393b] text-white focus:border-[#8ab4f8]'
                  : 'bg-[#f0f4f9] border-[#c4c7c5] text-black focus:border-[#1a73e8]'
              }`}
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className={`text-sm font-medium truncate px-2 py-1 rounded-md transition-colors text-left flex items-center gap-1.5 ${
                isDark ? 'hover:bg-[#1e1f20] text-[#e3e3e3]' : 'hover:bg-[#f0f4f9] text-[#1f1f1f]'
              }`}
              title="Click to rename prompt"
            >
              <span className="truncate">{promptTitle || 'Untitled prompt'}</span>
            </button>
          )}

          <div
            className={`hidden sm:flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full border ${
              isDark
                ? 'bg-[#1e1f20] border-[#282a2c] text-[#8e918f]'
                : 'bg-[#f8fafd] border-[#e0e3e7] text-[#5e5e5e]'
            }`}
          >
            <Bookmark className="w-3 h-3 text-blue-500" />
            <span>{isSaved ? 'Saved' : 'Editing'}</span>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher Tabs */}
      <div className="hidden lg:flex items-center p-1 rounded-full border shadow-2xs font-medium text-xs">
        <button
          id="tab-mode-chat"
          onClick={() => onSelectMode('chat')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            mode === 'chat'
              ? isDark
                ? 'bg-[#282a2c] text-[#8ab4f8] shadow-xs'
                : 'bg-[#e8f0fe] text-[#1a73e8] shadow-xs'
              : isDark
              ? 'text-[#c4c7c5] hover:text-white'
              : 'text-[#444746] hover:text-black'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          id="tab-mode-freeform"
          onClick={() => onSelectMode('freeform')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            mode === 'freeform'
              ? isDark
                ? 'bg-[#282a2c] text-[#8ab4f8] shadow-xs'
                : 'bg-[#e8f0fe] text-[#1a73e8] shadow-xs'
              : isDark
              ? 'text-[#c4c7c5] hover:text-white'
              : 'text-[#444746] hover:text-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Freeform</span>
        </button>

        <button
          id="tab-mode-structured"
          onClick={() => onSelectMode('structured')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            mode === 'structured'
              ? isDark
                ? 'bg-[#282a2c] text-[#8ab4f8] shadow-xs'
                : 'bg-[#e8f0fe] text-[#1a73e8] shadow-xs'
              : isDark
              ? 'text-[#c4c7c5] hover:text-white'
              : 'text-[#444746] hover:text-black'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>Structured</span>
        </button>

        <button
          id="tab-mode-tuning"
          onClick={() => onSelectMode('tuning')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
            mode === 'tuning'
              ? isDark
                ? 'bg-[#282a2c] text-[#8ab4f8] shadow-xs'
                : 'bg-[#e8f0fe] text-[#1a73e8] shadow-xs'
              : isDark
              ? 'text-[#c4c7c5] hover:text-white'
              : 'text-[#444746] hover:text-black'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Tune</span>
        </button>
      </div>

      {/* Right: Model Selector, Get Code, Run, Theme & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Model Quick Switcher Dropdown */}
        <div className="relative">
          <button
            id="btn-model-selector"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isDark
                ? 'bg-[#1e1f20] border-[#37393b] hover:border-[#8ab4f8] text-[#e3e3e3]'
                : 'bg-[#f0f4f9] border-[#c4c7c5] hover:border-[#1a73e8] text-[#1f1f1f]'
            }`}
          >
            <span className="font-semibold">{activeModel.name}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {isModelDropdownOpen && (
            <div
              className={`absolute right-0 mt-1.5 w-72 rounded-xl border shadow-xl p-1.5 z-50 transition-all ${
                isDark ? 'bg-[#1e1f20] border-[#37393b]' : 'bg-white border-[#e0e3e7]'
              }`}
            >
              <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8e918f]">
                Select Gemini Model
              </div>
              <div className="space-y-1 max-h-72 overflow-y-auto">
                {GEMINI_MODELS.map((m) => {
                  const isSelected = m.id === parameters.model;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onChangeParameters({ model: m.id });
                        setIsModelDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-start justify-between text-xs ${
                        isSelected
                          ? isDark
                            ? 'bg-[#282a2c] text-[#8ab4f8]'
                            : 'bg-[#e8f0fe] text-[#1a73e8]'
                          : isDark
                          ? 'hover:bg-[#282a2c]/60 text-[#c4c7c5]'
                          : 'hover:bg-[#f0f4f9] text-[#444746]'
                      }`}
                    >
                      <div>
                        <div className="font-medium flex items-center gap-1.5">
                          {m.name}
                          {m.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-500 font-mono">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] opacity-70 truncate max-w-[200px]">
                          {(m.contextWindow / 1000).toLocaleString()}k context · {m.category}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Token Window Usage Gauge */}
        <div
          className={`hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-mono ${
            isDark ? 'bg-[#1e1f20] border-[#282a2c] text-[#c4c7c5]' : 'bg-[#f8fafd] border-[#e0e3e7] text-[#444746]'
          }`}
          title={`Context Usage: ${totalTokensCount.toLocaleString()} / ${contextLimit.toLocaleString()} tokens (${tokenPercentage.toFixed(2)}%)`}
        >
          <div className="w-12 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(3, tokenPercentage)}%` }}
            />
          </div>
          <span className="text-[11px]">{totalTokensCount.toLocaleString()} t</span>
        </div>

        {/* Get Code Button */}
        <button
          id="btn-get-code"
          onClick={onOpenGetCode}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isDark
              ? 'bg-[#1e1f20] border-[#37393b] hover:bg-[#282a2c] text-[#e3e3e3]'
              : 'bg-[#f0f4f9] border-[#c4c7c5] hover:bg-[#e0e3e7] text-[#1f1f1f]'
          }`}
          title="Export prompt as code (Python, JS/TS, cURL, Swift)"
        >
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden md:inline">Get code</span>
        </button>

        {/* Share Button */}
        <button
          id="btn-share-prompt"
          onClick={onOpenShare}
          className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 ${
            isDark
              ? 'bg-[#1e1f20] border-[#37393b] hover:bg-[#282a2c] text-[#e3e3e3]'
              : 'bg-[#f0f4f9] border-[#c4c7c5] hover:bg-[#e0e3e7] text-[#1f1f1f]'
          }`}
          title="Share prompt link"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>

        {/* Theme Toggle */}
        <button
          id="btn-toggle-theme"
          onClick={onToggleTheme}
          className={`p-1.5 rounded-lg border transition-colors ${
            isDark
              ? 'bg-[#1e1f20] border-[#37393b] hover:bg-[#282a2c] text-[#c4c7c5]'
              : 'bg-[#f0f4f9] border-[#c4c7c5] hover:bg-[#e0e3e7] text-[#444746]'
          }`}
          title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
        </button>

        {/* API Key / Cloud Project Status */}
        <button
          id="btn-api-key-status"
          onClick={onOpenApiKey}
          className={`hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-mono transition-colors ${
            isDark
              ? 'bg-[#1e1f20] border-[#282a2c] text-[#8ab4f8] hover:bg-[#282a2c]'
              : 'bg-[#f8fafd] border-[#e0e3e7] text-[#1a73e8] hover:bg-[#e8f0fe]'
          }`}
          title="Google AI Studio Project & API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Key</span>
        </button>

        {/* Config / Parameters Toggle */}
        <button
          id="btn-toggle-config-panel"
          onClick={onToggleConfig}
          className={`p-1.5 rounded-lg border transition-colors ${
            isConfigOpen
              ? isDark
                ? 'bg-[#282a2c] border-[#8ab4f8] text-[#8ab4f8]'
                : 'bg-[#e8f0fe] border-[#1a73e8] text-[#1a73e8]'
              : isDark
              ? 'bg-[#1e1f20] border-[#37393b] hover:bg-[#282a2c] text-[#c4c7c5]'
              : 'bg-[#f0f4f9] border-[#c4c7c5] hover:bg-[#e0e3e7] text-[#444746]'
          }`}
          title="Toggle model parameters panel"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div
          className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-medium text-xs flex items-center justify-center shadow-xs cursor-pointer"
          title="Google Account"
        >
          G
        </div>
      </div>
    </header>
  );
};

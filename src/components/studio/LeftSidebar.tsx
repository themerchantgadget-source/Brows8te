import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Layers,
  Table,
  Sparkles,
  Search,
  Pin,
  Trash2,
  Copy,
  ExternalLink,
  BookOpen,
  Settings,
  KeyRound,
  Zap,
  FolderClosed,
  ChevronDown,
  Clock,
  Compass,
} from 'lucide-react';
import { PromptItem, StudioMode, ThemeMode } from '../../types/aistudio';

interface LeftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  prompts: PromptItem[];
  activePromptId: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onCreateNewPrompt: (mode: StudioMode) => void;
  onDeletePrompt: (id: string) => void;
  onTogglePinPrompt: (id: string) => void;
  onDuplicatePrompt: (prompt: PromptItem) => void;
  onOpenApiKey: () => void;
  themeMode: ThemeMode;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  prompts,
  activePromptId,
  onSelectPrompt,
  onCreateNewPrompt,
  onDeletePrompt,
  onTogglePinPrompt,
  onDuplicatePrompt,
  onOpenApiKey,
  themeMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  const isDark = themeMode === 'dark';

  const filteredPrompts = prompts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedPrompts = filteredPrompts.filter((p) => p.isPinned);
  const recentPrompts = filteredPrompts.filter((p) => !p.isPinned);

  if (!isOpen) return null;

  return (
    <aside
      id="aistudio-left-sidebar"
      className={`fixed lg:static inset-y-0 left-0 z-30 w-72 h-[calc(100vh-3.5rem)] border-r flex flex-col justify-between select-none transition-all duration-200 ${
        isDark
          ? 'bg-[#1e1f20] border-[#282a2c] text-[#e3e3e3]'
          : 'bg-[#f8fafd] border-[#e0e3e7] text-[#1f1f1f]'
      }`}
    >
      {/* Top: Create New Prompt & Search */}
      <div className="p-3 space-y-3">
        {/* Create New Prompt Button & Dropdown */}
        <div className="relative">
          <button
            id="btn-create-prompt-main"
            onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-between shadow-xs transition-all ${
              isDark
                ? 'bg-[#282a2c] hover:bg-[#37393b] text-white border border-[#37393b]'
                : 'bg-[#ffffff] hover:bg-[#f0f4f9] text-[#1f1f1f] border border-[#c4c7c5]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              <span>Create new prompt</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-70" />
          </button>

          {isCreateDropdownOpen && (
            <div
              className={`absolute top-full left-0 right-0 mt-1.5 rounded-xl border shadow-xl p-1.5 z-50 transition-all ${
                isDark ? 'bg-[#282a2c] border-[#37393b]' : 'bg-white border-[#e0e3e7]'
              }`}
            >
              <button
                onClick={() => {
                  onCreateNewPrompt('chat');
                  setIsCreateDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                  isDark ? 'hover:bg-[#37393b] text-white' : 'hover:bg-[#f0f4f9] text-black'
                }`}
              >
                <div className="p-1 rounded-md bg-blue-500/10 text-blue-500">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold">Chat prompt</div>
                  <div className="text-[11px] opacity-60">Multi-turn conversation with system role</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onCreateNewPrompt('freeform');
                  setIsCreateDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                  isDark ? 'hover:bg-[#37393b] text-white' : 'hover:bg-[#f0f4f9] text-black'
                }`}
              >
                <div className="p-1 rounded-md bg-purple-500/10 text-purple-500">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold">Freeform prompt</div>
                  <div className="text-[11px] opacity-60">Open scratchpad with interleaved multimodal</div>
                </div>
              </button>

              <button
                onClick={() => {
                  onCreateNewPrompt('structured');
                  setIsCreateDropdownOpen(false);
                }}
                className={`w-full text-left p-2 rounded-lg text-xs flex items-center gap-2.5 transition-colors ${
                  isDark ? 'hover:bg-[#37393b] text-white' : 'hover:bg-[#f0f4f9] text-black'
                }`}
              >
                <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-500">
                  <Table className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-semibold">Structured prompt</div>
                  <div className="text-[11px] opacity-60">Tabular few-shot input/output examples</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Search Prompts */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border outline-hidden transition-colors ${
              isDark
                ? 'bg-[#131314] border-[#282a2c] text-white placeholder-[#8e918f] focus:border-[#8ab4f8]'
                : 'bg-white border-[#e0e3e7] text-black placeholder-[#8e918f] focus:border-[#1a73e8]'
            }`}
          />
        </div>
      </div>

      {/* Center: My Library (Pinned & Recent Prompts List) */}
      <div className="flex-1 overflow-y-auto px-2 space-y-4 text-xs">
        {/* Pinned Section */}
        {pinnedPrompts.length > 0 && (
          <div>
            <div className="px-2 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#8e918f]">
              <Pin className="w-3 h-3 text-blue-500" />
              <span>Pinned Prompts</span>
            </div>
            <div className="space-y-0.5 mt-1">
              {pinnedPrompts.map((prompt) => (
                <PromptListItem
                  key={prompt.id}
                  prompt={prompt}
                  isActive={prompt.id === activePromptId}
                  onSelect={() => onSelectPrompt(prompt)}
                  onDelete={() => onDeletePrompt(prompt.id)}
                  onTogglePin={() => onTogglePinPrompt(prompt.id)}
                  onDuplicate={() => onDuplicatePrompt(prompt)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Prompts Section */}
        <div>
          <div className="px-2 py-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#8e918f]">
            <Clock className="w-3 h-3" />
            <span>Recent Prompts ({recentPrompts.length})</span>
          </div>
          <div className="space-y-0.5 mt-1">
            {recentPrompts.map((prompt) => (
              <PromptListItem
                key={prompt.id}
                prompt={prompt}
                isActive={prompt.id === activePromptId}
                onSelect={() => onSelectPrompt(prompt)}
                onDelete={() => onDeletePrompt(prompt.id)}
                onTogglePin={() => onTogglePinPrompt(prompt.id)}
                onDuplicate={() => onDuplicatePrompt(prompt)}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: Navigation Links & Studio Settings */}
      <div className={`p-2 border-t text-xs space-y-0.5 ${isDark ? 'border-[#282a2c]' : 'border-[#e0e3e7]'}`}>
        <button
          onClick={onOpenApiKey}
          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
            isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
          }`}
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-blue-500" />
            <span>Get API key & Quota</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500">Free Tier</span>
        </button>

        <a
          href="https://ai.google.dev/gemini-api/docs"
          target="_blank"
          rel="noreferrer"
          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
            isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
          }`}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Documentation & Cookbook</span>
          </div>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>

        <a
          href="https://ai.google.dev/gemini-api/prompts"
          target="_blank"
          rel="noreferrer"
          className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
            isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
          }`}
        >
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prompt Gallery</span>
          </div>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
      </div>
    </aside>
  );
};

interface PromptListItemProps {
  prompt: PromptItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
  onDuplicate: () => void;
  isDark: boolean;
}

const PromptListItem: React.FC<PromptListItemProps> = ({
  prompt,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
  onDuplicate,
  isDark,
}) => {
  const [showActions, setShowActions] = useState(false);

  const getModeIcon = () => {
    switch (prompt.mode) {
      case 'chat':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'freeform':
        return <Layers className="w-3.5 h-3.5 text-purple-500" />;
      case 'structured':
        return <Table className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      className={`group relative w-full flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer transition-all ${
        isActive
          ? isDark
            ? 'bg-[#282a2c] text-white font-medium shadow-xs'
            : 'bg-[#e8f0fe] text-[#1a73e8] font-medium shadow-xs'
          : isDark
          ? 'hover:bg-[#282a2c]/60 text-[#c4c7c5]'
          : 'hover:bg-[#f0f4f9] text-[#444746]'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="shrink-0">{getModeIcon()}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs">{prompt.title}</div>
          <div className="text-[10px] opacity-60 truncate font-mono">{prompt.model}</div>
        </div>
      </div>

      {/* Action buttons (Pin, Duplicate, Delete) */}
      <div
        className={`flex items-center gap-1 shrink-0 ${
          showActions ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        } transition-opacity`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onTogglePin}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
          title={prompt.isPinned ? 'Unpin' : 'Pin prompt'}
        >
          <Pin className={`w-3 h-3 ${prompt.isPinned ? 'text-blue-500 fill-blue-500' : 'opacity-70'}`} />
        </button>
        <button
          onClick={onDuplicate}
          className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10"
          title="Duplicate prompt"
        >
          <Copy className="w-3 h-3 opacity-70" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 rounded hover:bg-red-500/20 hover:text-red-500"
          title="Delete prompt"
        >
          <Trash2 className="w-3 h-3 opacity-70" />
        </button>
      </div>
    </div>
  );
};

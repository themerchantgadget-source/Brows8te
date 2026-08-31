import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, RotateCw, MoreHorizontal, Share2, CircleDot, Shield, Compass, Sparkles, Copy, Check, ExternalLink, SlidersHorizontal, Terminal } from 'lucide-react';
import { BrowserSession, ColorPalette, SessionState, ThemeMode } from '../../types';
import { BrowserViewport } from './BrowserViewport';
import { BrowserSessionToolbar } from './BrowserSessionToolbar';
import { motion, AnimatePresence } from 'motion/react';

interface Brow8teBrowserProps {
  session: BrowserSession;
  palette?: ColorPalette;
  themeMode?: ThemeMode;
  onNavigate: (url: string, title?: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onOpenTools: () => void;
  onTriggerRipple?: (e: React.MouseEvent) => void;
}

export const Brow8teBrowser: React.FC<Brow8teBrowserProps> = ({
  session,
  palette,
  themeMode = 'light',
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onOpenTools,
  onTriggerRipple,
}) => {
  const isLight = themeMode === 'light';
  const activeTab = session.tabs.find((t) => t.id === session.activeTabId) || session.tabs[0];
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlInput, setUrlInput] = useState(activeTab?.url || '');
  const [showMenu, setShowMenu] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const canGoBack = activeTab ? activeTab.historyIndex > 0 : false;
  const canGoForward = activeTab ? activeTab.historyIndex < activeTab.history.length - 1 : false;

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (urlInput.trim()) {
      setIsEditingUrl(false);
      onNavigate(urlInput.trim());
    }
  };

  const handleShare = () => {
    if (activeTab?.url) {
      navigator.clipboard.writeText(activeTab.url);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    }
  };

  // Extract display host
  let displayHost = 'google.com';
  try {
    const parsed = new URL(activeTab?.url || 'https://google.com');
    displayHost = parsed.hostname.replace(/^www\./, '');
    if (parsed.pathname && parsed.pathname !== '/') {
      displayHost += parsed.pathname;
    }
  } catch {
    displayHost = activeTab?.url || 'google.com';
  }

  // STATE B: Connecting / Loading State
  if (session.state === 'connecting' || (activeTab?.isLoading && !activeTab?.url)) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-8 text-center select-none ${
        isLight ? 'bg-white text-[#141413]' : 'bg-[#141414] text-[#E6E1D6]'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center space-y-4"
        >
          {/* Subtle minimal pulsating indicator */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className={`absolute inset-0 rounded-full animate-ping ${
              isLight ? 'bg-[#C48A4F]/20' : 'bg-[#D4A373]/15'
            }`} />
            <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${
              isLight ? 'border-[#C48A4F]' : 'border-[#D4A373]'
            }`} />
          </div>

          <div className="space-y-1">
            <div className={`text-xs font-mono tracking-widest uppercase ${
              isLight ? 'text-[#8C887E]' : 'text-[#8C887E]'
            }`}>
              Connecting Session
            </div>
            <div className={`text-base font-medium ${
              isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'
            }`}>
              {displayHost}
            </div>
          </div>

          <div className={`text-[10px] font-mono ${
            isLight ? 'text-[#A09D95]' : 'text-[#584D3D]'
          }`}>
            VNC Stream Initializing · 60fps
          </div>
        </motion.div>
      </div>
    );
  }

  // STATE C: Live Interactive Browser
  return (
    <div className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none ${
      isLight ? 'bg-[#F9F9F8] text-[#141413]' : 'bg-[#141414] text-[#E6E1D6]'
    }`}>
      {/* 1. Top Browser Chrome */}
      <div
        id="browser-top-chrome"
        className={`w-full px-3 py-2 border-b flex items-center gap-2 z-30 shadow-sm ${
          isLight ? 'bg-white border-[#E7E6E2]' : 'bg-[#1A1A1A] border-[#2D2D2D]'
        }`}
      >
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={onGoBack}
            disabled={!canGoBack}
            className={`p-1.5 rounded-lg transition-colors ${
              canGoBack
                ? isLight
                  ? 'text-[#141413] hover:bg-[#F3EFE9] active:scale-95'
                  : 'text-[#E6E1D6] hover:bg-white/5 active:scale-95'
                : isLight
                ? 'text-[#C8C5BD] cursor-not-allowed'
                : 'text-[#4A4740] cursor-not-allowed'
            }`}
            title="Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onGoForward}
            disabled={!canGoForward}
            className={`p-1.5 rounded-lg transition-colors ${
              canGoForward
                ? isLight
                  ? 'text-[#141413] hover:bg-[#F3EFE9] active:scale-95'
                  : 'text-[#E6E1D6] hover:bg-white/5 active:scale-95'
                : isLight
                ? 'text-[#C8C5BD] cursor-not-allowed'
                : 'text-[#4A4740] cursor-not-allowed'
            }`}
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 min-w-0">
          {isEditingUrl ? (
            <form onSubmit={handleUrlSubmit} className="w-full">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onBlur={() => setIsEditingUrl(false)}
                autoFocus
                className={`w-full px-2.5 py-1 text-xs rounded-xl border outline-none font-mono ${
                  isLight
                    ? 'bg-[#F9F9F8] border-[#C48A4F] text-[#141413]'
                    : 'bg-[#242424] border-[#D4A373]/60 text-[#E6E1D6]'
                }`}
              />
            </form>
          ) : (
            <div
              onClick={() => {
                setUrlInput(activeTab?.url || '');
                setIsEditingUrl(true);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1 rounded-xl border cursor-text transition-all group ${
                isLight
                  ? 'bg-[#F7F7F6] border-[#E7E6E2] hover:border-[#C48A4F]/60'
                  : 'bg-[#222222] border-[#2D2D2D] hover:border-[#D4A373]/40'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <Lock className={`w-3 h-3 flex-shrink-0 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
                <span className={`text-xs font-mono truncate ${isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'}`}>
                  {displayHost}
                </span>
              </div>
              <span className={`text-[10px] font-mono hidden sm:inline ${
                isLight ? 'text-[#9E9B93] group-hover:text-[#6B6862]' : 'text-[#584D3D] group-hover:text-[#8C887E]'
              }`}>
                CDP Live
              </span>
            </div>
          )}
        </div>

        {/* Reload button */}
        <button
          onClick={onReload}
          className={`p-1.5 rounded-lg transition-colors active:scale-95 ${
            isLight
              ? 'text-[#6B6862] hover:text-[#141413] hover:bg-[#F3EFE9]'
              : 'text-[#8C887E] hover:text-[#E6E1D6] hover:bg-white/5'
          }`}
          title="Reload Page"
        >
          <RotateCw className={`w-3.5 h-3.5 ${
            activeTab?.isLoading ? `animate-spin ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}` : ''
          }`} />
        </button>

        {/* Session Options Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight
                ? 'text-[#6B6862] hover:text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#8C887E] hover:text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Browser Menu"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className={`absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 ${
              isLight
                ? 'bg-white border-[#E7E6E2] text-[#141413]'
                : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
            }`}>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onNavigate('https://www.google.com', 'Google');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left ${
                  isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/5'
                }`}
              >
                <span>New Search Tab</span>
                <span className={`text-[10px] ${isLight ? 'text-[#8C887E]' : 'text-[#8C887E]'}`}>⌘T</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onOpenTools();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left ${
                  isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/5'
                }`}
              >
                <span>Inspect DOM & CDP</span>
                <Terminal className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  handleShare();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left ${
                  isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/5'
                }`}
              >
                <span>Copy Page URL</span>
                <Copy className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Live Interactive Browser Viewport */}
      <div
        id="browser-live-viewport"
        className="relative flex-1 w-full h-full overflow-hidden"
        onClick={onTriggerRipple}
      >
        <BrowserViewport
          url={activeTab?.url || 'https://www.google.com'}
          onNavigate={onNavigate}
          onTriggerRipple={onTriggerRipple}
          themeMode={themeMode}
        />

        {/* Copied Toast */}
        <AnimatePresence>
          {copiedNotification && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border text-xs shadow-xl flex items-center gap-2 z-50 font-medium ${
                isLight
                  ? 'bg-white border-[#C48A4F]/60 text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#D4A373]/50 text-[#E6E1D6]'
              }`}
            >
              <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
              <span>URL Copied to Clipboard</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Bottom Dedicated BrowserSessionToolbar */}
      <div className="w-full px-4 py-2 border-t flex items-center justify-center z-30">
        <BrowserSessionToolbar
          session={session}
          isActive={session.state === 'live'}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          isLoading={activeTab?.isLoading}
          currentUrl={activeTab?.url}
          pageTitle={activeTab?.title}
          themeMode={themeMode}
          palette={palette}
          variant="floating"
          onGoBack={onGoBack}
          onGoForward={onGoForward}
          onRefresh={onReload}
          onOpenTools={onOpenTools}
          onNavigate={onNavigate}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

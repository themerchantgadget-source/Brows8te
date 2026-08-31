import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Camera,
  ShieldCheck,
  Share2,
  Lock,
  Copy,
  Check,
  Activity,
  ExternalLink,
  Wifi,
  MoreVertical,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserSession, ColorPalette, ThemeMode } from '../../types';

export interface BrowserSessionToolbarProps {
  session?: BrowserSession | null;
  isActive?: boolean;
  canGoBack?: boolean;
  canGoForward?: boolean;
  isLoading?: boolean;
  currentUrl?: string;
  pageTitle?: string;
  themeMode?: ThemeMode;
  palette?: ColorPalette;
  variant?: 'floating' | 'header' | 'bottom' | 'compact';
  className?: string;
  onGoBack?: () => void;
  onGoForward?: () => void;
  onRefresh?: () => void;
  onOpenTools?: () => void;
  onNavigate?: (url: string, title?: string) => void;
  onTriggerAiSummary?: () => void;
  onCaptureSnapshot?: () => void;
  onShare?: () => void;
}

export const BrowserSessionToolbar: React.FC<BrowserSessionToolbarProps> = ({
  session,
  isActive,
  canGoBack: customCanGoBack,
  canGoForward: customCanGoForward,
  isLoading: customIsLoading,
  currentUrl: customCurrentUrl,
  pageTitle: customPageTitle,
  themeMode = 'light',
  palette,
  variant = 'floating',
  className = '',
  onGoBack,
  onGoForward,
  onRefresh,
  onOpenTools,
  onNavigate,
  onTriggerAiSummary,
  onCaptureSnapshot,
  onShare,
}) => {
  // Determine if a browser session is active
  const isSessionActive = Boolean(
    isActive !== undefined
      ? isActive
      : session && (session.state === 'live' || session.state === 'connecting')
  );

  const isLight = themeMode === 'light';
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Derive active tab data if session object is provided
  const activeTab = session?.tabs?.find((t) => t.id === session.activeTabId) || session?.tabs?.[0];
  const url = customCurrentUrl ?? activeTab?.url ?? 'https://google.com';
  const title = customPageTitle ?? activeTab?.title ?? 'Active Web Page';
  const isLoading = customIsLoading ?? activeTab?.isLoading ?? false;
  const canBack = customCanGoBack !== undefined ? customCanGoBack : activeTab ? activeTab.historyIndex > 0 : false;
  const canForward =
    customCanGoForward !== undefined
      ? customCanGoForward
      : activeTab
      ? activeTab.historyIndex < activeTab.history.length - 1
      : false;

  // Extract display hostname
  let displayHost = 'google.com';
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    displayHost = parsed.hostname.replace(/^www\./, '');
  } catch {
    displayHost = url;
  }

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    if (showToolsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolsMenu]);

  // Handle URL copy
  const handleCopyUrl = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Only appear when a browser session is active
  if (!isSessionActive) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        id="browser-session-toolbar-root"
        data-testid="browser-session-toolbar"
        initial={{ opacity: 0, y: variant === 'floating' ? 12 : -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: variant === 'floating' ? 12 : -10, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`browser-session-toolbar relative z-40 select-none ${className}`}
      >
        <div
          className={`flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl border backdrop-blur-xl transition-all shadow-lg ${
            isLight
              ? 'bg-white/95 border-[#E2DFD8] text-[#141413] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.12),0_0_1px_1px_rgba(0,0,0,0.05)]'
              : 'bg-[#1C1D1F]/95 border-[#2E3033] text-[#E3E3E3] shadow-[0_12px_32px_-4px_rgba(0,0,0,0.5),0_0_1px_1px_rgba(255,255,255,0.06)]'
          }`}
          style={
            palette
              ? {
                  borderColor: palette.borderColor,
                }
              : undefined
          }
        >
          {/* Active Session Indicator Pill */}
          <div
            className={`hidden xs:flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-mono border ${
              isLight
                ? 'bg-[#F4F2EC] border-[#E2DFD8] text-[#6B6862]'
                : 'bg-[#252729] border-[#36383B] text-[#A0A2A5]'
            }`}
            title="Live remote browser session active"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                session?.state === 'connecting'
                  ? 'bg-[#E37400] animate-ping'
                  : isLight
                  ? 'bg-[#188038] animate-pulse'
                  : 'bg-[#81C995] animate-pulse'
              }`}
            />
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              {session?.state === 'connecting' ? 'Connecting' : 'Live CDP'}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden xs:block h-4 w-px bg-current/10 mx-0.5" />

          {/* Back Icon Button */}
          <button
            id="toolbar-btn-back"
            data-testid="toolbar-btn-back"
            onClick={onGoBack}
            disabled={!canBack}
            className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center ${
              canBack
                ? isLight
                  ? 'text-[#141413] hover:bg-[#F3EFE9] active:scale-95'
                  : 'text-[#E3E3E3] hover:bg-white/10 active:scale-95'
                : isLight
                ? 'text-[#C8C5BD] cursor-not-allowed opacity-50'
                : 'text-[#585A5C] cursor-not-allowed opacity-50'
            }`}
            title="Go Back"
            aria-label="Go back"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Forward Icon Button */}
          <button
            id="toolbar-btn-forward"
            data-testid="toolbar-btn-forward"
            onClick={onGoForward}
            disabled={!canForward}
            className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center ${
              canForward
                ? isLight
                  ? 'text-[#141413] hover:bg-[#F3EFE9] active:scale-95'
                  : 'text-[#E3E3E3] hover:bg-white/10 active:scale-95'
                : isLight
                ? 'text-[#C8C5BD] cursor-not-allowed opacity-50'
                : 'text-[#585A5C] cursor-not-allowed opacity-50'
            }`}
            title="Go Forward"
            aria-label="Go forward"
          >
            <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Refresh Icon Button */}
          <button
            id="toolbar-btn-refresh"
            data-testid="toolbar-btn-refresh"
            onClick={onRefresh}
            className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center active:scale-95 ${
              isLight
                ? 'text-[#444746] hover:text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#C4C7C5] hover:text-[#E3E3E3] hover:bg-white/10'
            }`}
            title="Refresh Page"
            aria-label="Refresh page"
          >
            <RotateCw
              className={`w-4 h-4 ${
                isLoading
                  ? `animate-spin ${isLight ? 'text-[#1A73E8]' : 'text-[#8AB4F8]'}`
                  : ''
              }`}
            />
          </button>

          {/* Divider */}
          <div className="h-4 w-px bg-current/10 mx-0.5" />

          {/* URL / Domain Summary Pill */}
          <div
            onClick={handleCopyUrl}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono border cursor-pointer group transition-all ${
              isLight
                ? 'bg-[#FAF8F5] hover:bg-white border-[#E2DFD8] text-[#141413] hover:border-[#1A73E8]/50'
                : 'bg-[#131415] hover:bg-[#1C1D1F] border-[#2E3033] text-[#E3E3E3] hover:border-[#8AB4F8]/50'
            }`}
            title="Click to copy full URL"
          >
            <Lock className={`w-3 h-3 ${isLight ? 'text-[#188038]' : 'text-[#81C995]'}`} />
            <span className="truncate max-w-[140px] lg:max-w-[200px]">{displayHost}</span>
            {copiedUrl ? (
              <Check className="w-3 h-3 text-[#188038]" />
            ) : (
              <Copy className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
            )}
          </div>

          {/* Direct Quick Session-Tool Icon: AI Insights */}
          {onTriggerAiSummary && (
            <button
              id="toolbar-btn-ai-summary"
              data-testid="toolbar-btn-ai-summary"
              onClick={onTriggerAiSummary}
              className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center active:scale-95 ${
                isLight
                  ? 'text-[#1A73E8] hover:bg-[#E8F0FE]'
                  : 'text-[#8AB4F8] hover:bg-[#8AB4F8]/15'
              }`}
              title="AI Page Summary & Insights"
              aria-label="AI page summary"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Direct Quick Session-Tool Icon: Capture Snapshot */}
          {onCaptureSnapshot && (
            <button
              id="toolbar-btn-snapshot"
              data-testid="toolbar-btn-snapshot"
              onClick={onCaptureSnapshot}
              className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center justify-center active:scale-95 ${
                isLight
                  ? 'text-[#444746] hover:text-[#141413] hover:bg-[#F3EFE9]'
                  : 'text-[#C4C7C5] hover:text-[#E3E3E3] hover:bg-white/10'
              }`}
              title="Capture DOM Snapshot"
              aria-label="Capture DOM snapshot"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}

          {/* Main Session-Tools Icon & Popover */}
          <div className="relative" ref={menuRef}>
            <button
              id="toolbar-btn-session-tools"
              data-testid="toolbar-btn-session-tools"
              onClick={() => {
                if (onOpenTools) {
                  onOpenTools();
                } else {
                  setShowToolsMenu(!showToolsMenu);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowToolsMenu(!showToolsMenu);
              }}
              className={`p-1.5 sm:p-2 rounded-xl transition-all flex items-center gap-1 active:scale-95 ${
                showToolsMenu
                  ? isLight
                    ? 'bg-[#1A73E8] text-white shadow-xs'
                    : 'bg-[#8AB4F8] text-[#131314] shadow-xs'
                  : isLight
                  ? 'text-[#1A73E8] hover:bg-[#E8F0FE]'
                  : 'text-[#8AB4F8] hover:bg-[#8AB4F8]/15'
              }`}
              title="Browser Session Tools (CDP, AI Insights, Network, Inspector)"
              aria-label="Session tools"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-[11px] font-medium hidden sm:inline">Tools</span>
            </button>

            {/* Session Tools Dropdown Menu */}
            <AnimatePresence>
              {showToolsMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl border shadow-2xl space-y-1 z-50 text-xs ${
                    isLight
                      ? 'bg-white border-[#E2DFD8] text-[#141413]'
                      : 'bg-[#1E1F20] border-[#37393B] text-[#E3E3E3]'
                  }`}
                >
                  {/* Header info */}
                  <div className="px-3 py-2 border-b border-current/10 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#1A73E8] dark:text-[#8AB4F8]" />
                      <span className="font-semibold">Session Tools</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-70">
                      {session?.fps ? `${session.fps}fps` : '60fps'}
                    </span>
                  </div>

                  {/* AI Page Summary */}
                  <button
                    onClick={() => {
                      setShowToolsMenu(false);
                      if (onTriggerAiSummary) {
                        onTriggerAiSummary();
                      } else if (onOpenTools) {
                        onOpenTools();
                      }
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/10'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#1A73E8] dark:text-[#8AB4F8]" />
                    <div>
                      <div className="font-medium">AI Page Insights</div>
                      <div className="text-[10px] opacity-70">Summarize & extract key facts</div>
                    </div>
                  </button>

                  {/* Full Session Tools Modal */}
                  {onOpenTools && (
                    <button
                      onClick={() => {
                        setShowToolsMenu(false);
                        onOpenTools();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                        isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/10'
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-[#E37400] dark:text-[#FDD663]" />
                      <div>
                        <div className="font-medium">CDP & DOM Inspector</div>
                        <div className="text-[10px] opacity-70">Inspect elements and stream console</div>
                      </div>
                    </button>
                  )}

                  {/* Capture Snapshot */}
                  {onCaptureSnapshot && (
                    <button
                      onClick={() => {
                        setShowToolsMenu(false);
                        onCaptureSnapshot();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                        isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/10'
                      }`}
                    >
                      <Camera className="w-4 h-4 text-[#188038] dark:text-[#81C995]" />
                      <div>
                        <div className="font-medium">Capture DOM Snapshot</div>
                        <div className="text-[10px] opacity-70">Download current rendered viewport</div>
                      </div>
                    </button>
                  )}

                  {/* Copy URL */}
                  <button
                    onClick={() => {
                      handleCopyUrl();
                      setShowToolsMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                      isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/10'
                    }`}
                  >
                    <Copy className="w-4 h-4 opacity-70" />
                    <div>
                      <div className="font-medium">Copy Page URL</div>
                      <div className="text-[10px] opacity-70">{displayHost}</div>
                    </div>
                  </button>

                  {/* Share Session */}
                  {onShare && (
                    <button
                      onClick={() => {
                        setShowToolsMenu(false);
                        onShare();
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-colors ${
                        isLight ? 'hover:bg-[#F3EFE9]' : 'hover:bg-white/10'
                      }`}
                    >
                      <Share2 className="w-4 h-4 opacity-70" />
                      <div>
                        <div className="font-medium">Share Session</div>
                        <div className="text-[10px] opacity-70">Export live sandbox session</div>
                      </div>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BrowserSessionToolbar;

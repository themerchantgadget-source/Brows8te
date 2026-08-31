import React, { useState, useEffect } from 'react';
import { DeviceSettings, ColorPalette, AmbientLightState, Ripple, Brow8teView, BrowserSession, ChatMessage } from '../types';
import { DEVICE_SPECS } from '../constants/presets';
import { Brow8teChat } from './chat/Brow8teChat';
import { Brow8teBrowser } from './browser/Brow8teBrowser';
import { motion, AnimatePresence } from 'motion/react';
import { Wifi, BatteryMedium, MessageSquare, Globe, Sparkles, ChevronRight, Layers } from 'lucide-react';

interface ScreenCanvasProps {
  settings: DeviceSettings;
  palette: ColorPalette;
  lightState: AmbientLightState;
  session: BrowserSession;
  activeView: Brow8teView;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onSwitchView: (view: Brow8teView) => void;
  onNavigate: (url: string, title?: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onOpenTools: () => void;
  onLightMove?: (x: number, y: number) => void;
}

export const ScreenCanvas: React.FC<ScreenCanvasProps> = ({
  settings,
  palette,
  lightState,
  session,
  activeView,
  messages,
  onSendMessage,
  onSwitchView,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onOpenTools,
  onLightMove,
}) => {
  const spec = DEVICE_SPECS[settings.preset];
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      timestamp: Date.now(),
    };

    setRipples((prev) => [...prev.slice(-4), newRipple]);

    if (onLightMove) {
      const pctX = Math.round((x / rect.width) * 100);
      const pctY = Math.round((y / rect.height) * 100);
      onLightMove(pctX, pctY);
    }
  };

  const triggerRippleAt = (e: React.MouseEvent) => {
    const target = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - target.left;
    const y = e.clientY - target.top;
    const newRipple: Ripple = {
      id: Date.now() + Math.random(),
      x,
      y,
      timestamp: Date.now(),
    };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
  };

  // Texture rendering
  const renderTextureOverlay = () => {
    const opacity = settings.textureOpacity;
    if (opacity <= 0 || settings.texture === 'clean') return null;

    if (settings.texture === 'dotmatrix') {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: opacity * 0.35,
            backgroundImage: `radial-gradient(${palette.accentWarmth} 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
            mixBlendMode: 'plus-lighter',
          }}
        />
      );
    }

    if (settings.texture === 'isometric') {
      return (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            opacity: opacity * 0.2,
            backgroundImage: `linear-gradient(to right, ${palette.borderColor} 1px, transparent 1px), linear-gradient(to bottom, ${palette.borderColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      );
    }

    if (settings.texture === 'brushed') {
      return (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-10"
          style={{
            opacity: opacity * 0.25,
            backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)`,
          }}
        />
      );
    }

    if (settings.texture === 'grain' || settings.texture === 'velvet') {
      return (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay z-10"
          style={{ opacity: opacity * (settings.texture === 'grain' ? 0.3 : 0.18) }}
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={settings.texture === 'grain' ? '0.85' : '0.45'}
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.85 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      );
    }

    return null;
  };

  const isLight = settings.themeMode === 'light';
  const isFullScreenOrDesktop = settings.preset === 'fullscreen' || settings.preset === 'desktop';

  return (
    <div
      id="mobile-screen-interior"
      className="relative w-full h-full select-none overflow-hidden transition-colors duration-500 flex flex-col justify-between"
      style={{
        backgroundColor: palette.bgBase,
        color: palette.textPrimary,
      }}
      onPointerDown={handlePointerDown}
    >
      {/* 1. Subtle Ambient Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLight
            ? `radial-gradient(ellipse at 50% 0%, ${palette.bgSurface} 0%, ${palette.bgBase} 85%)`
            : `radial-gradient(ellipse at 50% 0%, ${palette.bgSurface} 0%, ${palette.bgBase} 85%)`,
        }}
      />

      {/* 2. Interactive Spotlight */}
      <motion.div
        className={`absolute pointer-events-none rounded-full blur-3xl ${isLight ? 'mix-blend-multiply' : 'mix-blend-screen'}`}
        animate={{
          left: `${lightState.x}%`,
          top: `${lightState.y}%`,
          opacity: isLight ? lightState.intensity * 0.45 : lightState.intensity * 0.7,
        }}
        transition={{
          left: { type: 'spring', damping: 25, stiffness: 120 },
          top: { type: 'spring', damping: 25, stiffness: 120 },
          opacity: { duration: 0.3 },
        }}
        style={{
          width: `${lightState.radius}px`,
          height: `${lightState.radius}px`,
          transform: 'translate(-50%, -50%)',
          background: isLight
            ? `radial-gradient(circle, ${palette.glowColor} 0%, rgba(196, 138, 79, 0.08) 45%, transparent 75%)`
            : `radial-gradient(circle, ${palette.glowColor} 0%, rgba(212, 163, 115, 0.05) 45%, transparent 75%)`,
        }}
      />

      {/* 3. Texture Overlay */}
      {renderTextureOverlay()}

      {/* 4. Touch Wavelets / Ripples */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-40">
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{ scale: 3, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: 'easeOut' }}
              className="absolute rounded-full border pointer-events-none"
              style={{
                left: r.x,
                top: r.y,
                width: '60px',
                height: '60px',
                transform: 'translate(-50%, -50%)',
                borderColor: palette.accentWarmth,
                boxShadow: `0 0 20px ${palette.glowColor}`,
                background: `radial-gradient(circle, ${palette.glowColor} 0%, transparent 70%)`,
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 5. Safe Area Top: Status Bar & Dynamic Island (Shown on mobile frame presets) */}
      {!isFullScreenOrDesktop && settings.showStatusBar && (
        <div
          id="screen-status-bar"
          className={`relative z-30 flex items-center justify-between px-6 pt-3.5 pb-1 font-mono text-[13px] tracking-tight border-b select-none transition-colors ${
            isLight
              ? 'bg-[#FFFFFF] border-[#E7E6E2]'
              : 'bg-[#1A1A1A] border-[#2D2D2D]/40'
          }`}
          style={{ color: palette.textSecondary }}
        >
          <span className="font-semibold text-xs pl-1" style={{ color: palette.textPrimary }}>
            {currentTime}
          </span>

          {/* Dynamic Island */}
          {settings.showDynamicIsland && spec.notchType === 'island' ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className={`px-3.5 h-6 rounded-full flex items-center justify-between gap-2 border shadow-sm ${
                isLight
                  ? 'bg-[#18181B] border-black/20 text-white'
                  : 'bg-[#141414] border-[#2D2D2D] text-[#D6D1C4]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    session.state === 'live'
                      ? isLight
                        ? 'bg-[#C48A4F] animate-pulse'
                        : 'bg-[#D4A373] animate-pulse'
                      : isLight
                      ? 'bg-[#52525B]'
                      : 'bg-[#584D3D]'
                  }`}
                />
                <span className="text-[10px] tracking-wider uppercase font-sans font-medium text-white">
                  {session.state === 'live' ? 'Brow8te Live' : 'Brow8te'}
                </span>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#27272A]" />
            </motion.div>
          ) : spec.notchType === 'punch' ? (
            <div className={`w-3.5 h-3.5 rounded-full mx-auto border ${
              isLight ? 'bg-black border-black/20' : 'bg-black border-[#2D2D2D]'
            }`} />
          ) : (
            <div className="w-16" />
          )}

          <div className="flex items-center gap-2 pr-1">
            <Wifi className="w-3.5 h-3.5 opacity-80" />
            <span className="text-[10px] font-sans font-medium opacity-80">5G</span>
            <div className="flex items-center">
              <BatteryMedium className={`w-4 h-4 opacity-90 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            </div>
          </div>
        </div>
      )}

      {/* 6. Primary Workspace Layer: Chat ↔ Preview */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col z-20">
        <AnimatePresence mode="wait">
          {activeView === 'chat' ? (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Brow8teChat
                messages={messages}
                palette={palette}
                themeMode={settings.themeMode}
                onSendMessage={onSendMessage}
                onSwitchToPreview={() => onSwitchView('preview')}
                sessionState={session.state}
                activeUrl={session.tabs.find((t) => t.id === session.activeTabId)?.url}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview-view"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full"
            >
              <Brow8teBrowser
                session={session}
                palette={palette}
                themeMode={settings.themeMode}
                onNavigate={onNavigate}
                onGoBack={onGoBack}
                onGoForward={onGoForward}
                onReload={onReload}
                onOpenTools={onOpenTools}
                onTriggerRipple={triggerRippleAt}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. Central Segmented Control: Chat ↔ Preview */}
      <div
        id="brow8te-segmented-control-bar"
        className={`relative z-30 w-full px-4 py-2 border-t flex items-center justify-center transition-colors ${
          isLight
            ? 'bg-[#FFFFFF] border-[#E7E6E2]'
            : 'bg-[#1A1A1A] border-[#2D2D2D]'
        }`}
      >
        <div className={`flex items-center p-1 rounded-2xl border shadow-sm transition-colors ${
          isLight
            ? 'bg-[#F7F7F6] border-[#E7E6E2]'
            : 'bg-[#141414] border-[#2D2D2D]'
        }`}>
          {/* Chat Control Button */}
          <button
            id="segmented-btn-chat"
            onClick={() => onSwitchView('chat')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'chat'
                ? isLight
                  ? 'bg-white text-[#C48A4F] border border-[#C48A4F]/50 shadow-xs font-semibold'
                  : 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-xs'
                : isLight
                ? 'text-[#7A766F] hover:text-[#141413]'
                : 'text-[#8C887E] hover:text-[#E6E1D6]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>

          {/* Preview Control Button */}
          <button
            id="segmented-btn-preview"
            onClick={() => onSwitchView('preview')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeView === 'preview'
                ? isLight
                  ? 'bg-white text-[#C48A4F] border border-[#C48A4F]/50 shadow-xs font-semibold'
                  : 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-xs'
                : isLight
                ? 'text-[#7A766F] hover:text-[#141413]'
                : 'text-[#8C887E] hover:text-[#E6E1D6]'
            } ${session.state === 'none' ? 'opacity-70' : ''}`}
            title={session.state === 'none' ? 'No active browser session yet' : 'Live Browser Viewport'}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Preview</span>
            {session.state === 'live' && (
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ml-0.5 ${
                isLight ? 'bg-[#C48A4F]' : 'bg-[#D4A373]'
              }`} />
            )}
          </button>
        </div>
      </div>

      {/* 8. Safe Area Bottom: Home Indicator (Only for mobile frame presets) */}
      {!isFullScreenOrDesktop && settings.showHomeIndicator && (
        <div className={`relative pt-1 pb-1.5 flex justify-center items-center ${
          isLight ? 'bg-[#FFFFFF]' : 'bg-[#1A1A1A]'
        }`}>
          <div
            className={`w-32 h-1 rounded-full ${isLight ? 'opacity-25 bg-[#141413]' : 'opacity-40'}`}
            style={isLight ? {} : { backgroundColor: palette.textSecondary }}
          />
        </div>
      )}
    </div>
  );
};

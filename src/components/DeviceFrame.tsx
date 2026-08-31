import React, { useRef, useState } from 'react';
import { DeviceSettings, ColorPalette, AmbientLightState, Brow8teView, BrowserSession, ChatMessage } from '../types';
import { DEVICE_SPECS } from '../constants/presets';
import { ScreenCanvas } from './ScreenCanvas';

interface DeviceFrameProps {
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

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
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
  const frameRef = useRef<HTMLDivElement>(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  // Optional 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.tilt3D || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 6;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6;
    setMouseTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const isLight = settings.themeMode === 'light';

  // If fullscreen or desktop mode is active
  if (settings.preset === 'fullscreen' || settings.preset === 'desktop') {
    const isDesktop = settings.preset === 'desktop';
    return (
      <div
        ref={frameRef}
        id="fullscreen-screen-wrapper"
        className="relative w-full h-full flex-1 flex flex-col transition-all duration-300 ease-out"
        style={{
          maxWidth: isDesktop ? '1100px' : '100%',
          maxHeight: isDesktop ? '760px' : 'calc(100vh - 150px)',
          margin: '0 auto',
          transform: settings.tilt3D
            ? `perspective(1200px) rotateX(${mouseTilt.x * 0.4}deg) rotateY(${mouseTilt.y * 0.4}deg)`
            : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Subtle Ambient Glow behind viewport */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-700 -z-10"
          style={{
            background: `radial-gradient(circle at ${lightState.x}% ${lightState.y}%, ${palette.glowColor}, transparent 70%)`,
            opacity: settings.screenGlow ? (isLight ? 0.35 : 0.5) : 0.1,
          }}
        />

        <div
          id="fullscreen-screen-container"
          className={`relative w-full h-full flex-1 rounded-2xl md:rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col ${
            isLight
              ? 'bg-white border-[#E2DFD8] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.04)]'
              : 'bg-[#181818] border-[#2E2E2E] shadow-[0_25px_70px_-20px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(255,255,255,0.04)]'
          }`}
        >
          <ScreenCanvas
            settings={settings}
            palette={palette}
            lightState={lightState}
            session={session}
            activeView={activeView}
            messages={messages}
            onSendMessage={onSendMessage}
            onSwitchView={onSwitchView}
            onNavigate={onNavigate}
            onGoBack={onGoBack}
            onGoForward={onGoForward}
            onReload={onReload}
            onOpenTools={onOpenTools}
            onLightMove={onLightMove}
          />
        </div>
      </div>
    );
  }

  // If frameless mode is active
  if (settings.preset === 'frameless') {
    return (
      <div
        ref={frameRef}
        className="relative mx-auto transition-transform duration-300 ease-out"
        style={{
          width: `${spec.width}px`,
          height: `${spec.height}px`,
          maxHeight: 'calc(100vh - 160px)',
          aspectRatio: spec.aspectRatio,
          transform: settings.tilt3D
            ? `perspective(1000px) rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`
            : 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          id="frameless-screen-container"
          className="relative w-full h-full rounded-[32px] overflow-hidden border shadow-2xl transition-all duration-300"
          style={{
            borderColor: palette.borderColor,
            boxShadow: isLight
              ? `0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 30px ${palette.glowColor}`
              : `0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px ${palette.glowColor}`,
          }}
        >
          <ScreenCanvas
            settings={settings}
            palette={palette}
            lightState={lightState}
            session={session}
            activeView={activeView}
            messages={messages}
            onSendMessage={onSendMessage}
            onSwitchView={onSwitchView}
            onNavigate={onNavigate}
            onGoBack={onGoBack}
            onGoForward={onGoForward}
            onReload={onReload}
            onOpenTools={onOpenTools}
            onLightMove={onLightMove}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={frameRef}
      id="device-chassis-wrapper"
      className="relative mx-auto transition-transform duration-300 ease-out flex items-center justify-center"
      style={{
        width: `${spec.width + spec.bezel * 2}px`,
        height: `${spec.height + spec.bezel * 2}px`,
        maxHeight: 'calc(100vh - 150px)',
        transform: settings.tilt3D
          ? `perspective(1200px) rotateX(${mouseTilt.x}deg) rotateY(${mouseTilt.y}deg)`
          : 'none',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Outer Ambient Glow */}
      <div
        className="absolute -inset-12 rounded-[72px] blur-3xl pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at ${lightState.x}% ${lightState.y}%, ${palette.glowColor}, transparent 65%)`,
          opacity: settings.screenGlow ? (isLight ? 0.45 : 0.6) : 0.15,
        }}
      />

      {/* Hardware Buttons on Chassis */}
      <div
        className={`absolute -left-[3px] top-[115px] w-[3px] h-[28px] rounded-l-sm border-l ${
          isLight ? 'bg-[#D6D5CF] border-black/10' : 'bg-[#2D2D2D] border-white/10'
        }`}
        title="Action Button"
      />
      <div
        className={`absolute -left-[3px] top-[160px] w-[3px] h-[48px] rounded-l-sm border-l ${
          isLight ? 'bg-[#D6D5CF] border-black/10' : 'bg-[#2D2D2D] border-white/10'
        }`}
        title="Volume Up"
      />
      <div
        className={`absolute -left-[3px] top-[220px] w-[3px] h-[48px] rounded-l-sm border-l ${
          isLight ? 'bg-[#D6D5CF] border-black/10' : 'bg-[#2D2D2D] border-white/10'
        }`}
        title="Volume Down"
      />
      <div
        className={`absolute -right-[3px] top-[170px] w-[3px] h-[68px] rounded-r-sm border-r ${
          isLight ? 'bg-[#D6D5CF] border-black/10' : 'bg-[#2D2D2D] border-white/10'
        }`}
        title="Side Button"
      />

      {/* Outer Immersive Frame Chassis */}
      <div
        id="device-chassis"
        className={`relative w-full h-full p-[10px] overflow-hidden transition-all duration-500 flex flex-col rounded-[54px] border ${
          isLight
            ? 'bg-[#EAE8E2] border-[#D4D2CA] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.18),0_0_20px_rgba(196,138,79,0.06)]'
            : 'bg-[#242424] border-[#2D2D2D]/80 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_25px_rgba(212,163,115,0.06)]'
        }`}
      >
        {/* Chamfered Metallic Edge Reflection */}
        <div className={`absolute inset-[1px] rounded-[inherit] pointer-events-none border ${
          isLight ? 'border-white/60 opacity-90' : 'border-white/5 opacity-80'
        }`} />

        {/* Earpiece / Speaker Mesh Top */}
        <div className={`absolute top-[5px] left-1/2 -translate-x-1/2 w-12 h-1 rounded-full border-t z-30 ${
          isLight ? 'bg-[#C8C6BE] border-black/10' : 'bg-[#1A1A1A] border-black/40'
        }`} />

        {/* Screen Bezel & Display Vessel */}
        <div
          id="screen-display-bezel"
          className={`relative w-full h-full overflow-hidden border rounded-[44px] ${
            isLight
              ? 'border-black/20 bg-white'
              : 'border-black/60 bg-[#1A1A1A]'
          }`}
          style={{
            boxShadow: isLight
              ? 'inset 0 0 2px rgba(0, 0, 0, 0.2)'
              : 'inset 0 0 4px rgba(0, 0, 0, 0.9)',
          }}
        >
          <ScreenCanvas
            settings={settings}
            palette={palette}
            lightState={lightState}
            session={session}
            activeView={activeView}
            messages={messages}
            onSendMessage={onSendMessage}
            onSwitchView={onSwitchView}
            onNavigate={onNavigate}
            onGoBack={onGoBack}
            onGoForward={onGoForward}
            onReload={onReload}
            onOpenTools={onOpenTools}
            onLightMove={onLightMove}
          />
        </div>
      </div>
    </div>
  );
};

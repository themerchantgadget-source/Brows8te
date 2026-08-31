import React from 'react';
import { DeviceSettings, ColorPalette, AmbientLightState } from '../types';
import { PALETTES } from '../constants/presets';
import { X, SunMedium, Orbit, Sliders, Sparkles, Smartphone, Eye, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DeviceSettings;
  onUpdateSettings: (updater: Partial<DeviceSettings>) => void;
  lightState: AmbientLightState;
  onUpdateLight: (updater: Partial<AmbientLightState>) => void;
  onReset: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  lightState,
  onUpdateLight,
  onReset,
}) => {
  if (!isOpen) return null;

  const isLight = settings.themeMode === 'light';
  const currentPalette = PALETTES.find((p) => p.id === settings.palette) || PALETTES[0];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      id="inspector-panel-drawer"
      className={`fixed top-6 right-6 bottom-24 w-80 z-50 p-5 rounded-3xl border backdrop-blur-2xl shadow-2xl overflow-y-auto flex flex-col justify-between transition-colors ${
        isLight
          ? 'bg-white/95 border-[#E2DFD8] text-[#141413] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.18)]'
          : 'bg-[#1A1A1A]/95 border-[#2D2D2D] text-[#E6E1D6] shadow-[0_25px_60px_-10px_rgba(0,0,0,0.85)]'
      }`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          <div className="flex items-center gap-2">
            <Sliders className={`w-4 h-4 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            <h3 className={`text-sm font-semibold ${isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'}`}>Lighting & Canvas</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isLight ? 'hover:bg-black/5 text-[#7A766F] hover:text-black' : 'hover:bg-white/10 text-[#8C887E] hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Theme Mode Selector */}
        <div className="space-y-2">
          <label className={`text-xs font-semibold flex items-center justify-between ${isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'}`}>
            <span>Interface Mode</span>
            <span className="text-[10px] font-mono text-[#8C887E]">{isLight ? 'White Theme' : 'Dark Theme'}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ themeMode: 'light', palette: 'pure-white' })}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                isLight
                  ? 'bg-[#F2ECE4] text-[#C48A4F] border-[#C48A4F] font-semibold shadow-xs'
                  : 'bg-white/5 text-[#8C887E] border-white/10 hover:text-white'
              }`}
            >
              <span>☀️ White Mode</span>
            </button>
            <button
              onClick={() => onUpdateSettings({ themeMode: 'dark', palette: 'studio-graphite' })}
              className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                !isLight
                  ? 'bg-[#242424] text-[#D4A373] border-[#D4A373] font-semibold shadow-xs'
                  : 'bg-black/5 text-[#7A766F] border-black/10 hover:text-black'
              }`}
            >
              <span>🌙 Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Ambient Light Position Controls */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium flex items-center gap-1.5 ${isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'}`}>
              <SunMedium className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
              Ambient Spotlight Focus
            </span>
            <button
              onClick={() => onUpdateLight({ isAutoOrbit: !lightState.isAutoOrbit })}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono border transition-colors ${
                lightState.isAutoOrbit
                  ? isLight
                    ? 'bg-[#F5EFE7] text-[#C48A4F] border-[#C48A4F]/50'
                    : 'bg-[#242424] text-[#D4A373] border-[#D4A373]/50'
                  : isLight
                  ? 'bg-black/5 text-[#7A766F] border-black/5 hover:text-black'
                  : 'bg-white/5 text-[#8C887E] border-white/5 hover:text-white'
              }`}
            >
              <Orbit className={`w-3 h-3 ${lightState.isAutoOrbit ? 'animate-spin' : ''}`} />
              <span>{lightState.isAutoOrbit ? 'Auto-Orbit' : 'Manual'}</span>
            </button>
          </div>

          {/* 2D Light Pad Position Controller */}
          <div
            id="light-pad-controller"
            className={`relative w-full h-28 rounded-2xl border overflow-hidden cursor-crosshair ${
              isLight ? 'bg-[#F7F6F3] border-[#E2DFD8]' : 'bg-[#141414] border-[#2D2D2D]'
            }`}
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
              const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
              onUpdateLight({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)), isAutoOrbit: false });
            }}
          >
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(${currentPalette.accentWarmth} 1px, transparent 1px)`,
                backgroundSize: '12px 12px',
              }}
            />
            {/* Center target indicator */}
            <div
              className="absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 border-2 shadow-lg flex items-center justify-center pointer-events-none"
              style={{
                left: `${lightState.x}%`,
                top: `${lightState.y}%`,
                borderColor: currentPalette.accentWarmth,
                backgroundColor: currentPalette.accentWarmth + '44',
                boxShadow: `0 0 15px ${currentPalette.accentWarmth}`,
              }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[#141413]' : 'bg-white'}`} />
            </div>
            <div className={`absolute bottom-2 left-2 text-[9px] font-mono pointer-events-none ${isLight ? 'text-[#8C887E]' : 'text-[#8C887E]'}`}>
              X: {lightState.x}% · Y: {lightState.y}%
            </div>
          </div>
        </div>

        {/* Ambient Light Intensity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Spotlight Intensity</span>
            <span className={`font-mono ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`}>{Math.round(lightState.intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={lightState.intensity}
            onChange={(e) => onUpdateLight({ intensity: parseFloat(e.target.value) })}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
              isLight ? 'bg-[#E5E2DA] accent-[#C48A4F]' : 'bg-[#242424] accent-[#D4A373]'
            }`}
          />
        </div>

        {/* Ambient Light Radius Spread */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Diffusion Radius</span>
            <span className={`font-mono ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`}>{lightState.radius}px</span>
          </div>
          <input
            type="range"
            min="200"
            max="650"
            step="25"
            value={lightState.radius}
            onChange={(e) => onUpdateLight({ radius: parseInt(e.target.value, 10) })}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
              isLight ? 'bg-[#E5E2DA] accent-[#C48A4F]' : 'bg-[#242424] accent-[#D4A373]'
            }`}
          />
        </div>

        {/* Tactile Texture Opacity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className={`flex items-center gap-1 ${isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}`}>
              <Sparkles className={`w-3 h-3 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
              Texture Tactility
            </span>
            <span className={`font-mono ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`}>{Math.round(settings.textureOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={settings.textureOpacity}
            onChange={(e) => onUpdateSettings({ textureOpacity: parseFloat(e.target.value) })}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${
              isLight ? 'bg-[#E5E2DA] accent-[#C48A4F]' : 'bg-[#242424] accent-[#D4A373]'
            }`}
          />
        </div>

        {/* Viewport Chrome Toggles */}
        <div className={`space-y-3 pt-2 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
          <div className={`text-xs font-semibold flex items-center gap-1.5 ${isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'}`}>
            <Smartphone className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            Chassis & Safe Areas
          </div>

          <label className="flex items-center justify-between text-xs cursor-pointer select-none">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Status Bar & Clock</span>
            <input
              type="checkbox"
              checked={settings.showStatusBar}
              onChange={(e) => onUpdateSettings({ showStatusBar: e.target.checked })}
              className={`rounded cursor-pointer ${isLight ? 'accent-[#C48A4F]' : 'accent-[#D4A373]'}`}
            />
          </label>

          <label className="flex items-center justify-between text-xs cursor-pointer select-none">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Dynamic Island / Notch</span>
            <input
              type="checkbox"
              checked={settings.showDynamicIsland}
              onChange={(e) => onUpdateSettings({ showDynamicIsland: e.target.checked })}
              className={`rounded cursor-pointer ${isLight ? 'accent-[#C48A4F]' : 'accent-[#D4A373]'}`}
            />
          </label>

          <label className="flex items-center justify-between text-xs cursor-pointer select-none">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Home Gesture Bar</span>
            <input
              type="checkbox"
              checked={settings.showHomeIndicator}
              onChange={(e) => onUpdateSettings({ showHomeIndicator: e.target.checked })}
              className={`rounded cursor-pointer ${isLight ? 'accent-[#C48A4F]' : 'accent-[#D4A373]'}`}
            />
          </label>

          <label className="flex items-center justify-between text-xs cursor-pointer select-none">
            <span className={isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}>Chassis Ambient Halo</span>
            <input
              type="checkbox"
              checked={settings.screenGlow}
              onChange={(e) => onUpdateSettings({ screenGlow: e.target.checked })}
              className={`rounded cursor-pointer ${isLight ? 'accent-[#C48A4F]' : 'accent-[#D4A373]'}`}
            />
          </label>
        </div>
      </div>

      {/* Footer Reset */}
      <div className={`pt-4 border-t ${isLight ? 'border-black/10' : 'border-white/10'}`}>
        <button
          onClick={onReset}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors border ${
            isLight
              ? 'text-[#7A766F] hover:text-black hover:bg-black/5 border-black/5'
              : 'text-[#8C887E] hover:text-[#E6E1D6] hover:bg-white/5 border-white/5'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Ambient Defaults</span>
        </button>
      </div>
    </motion.div>
  );
};

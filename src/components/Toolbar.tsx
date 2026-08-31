import React from 'react';
import { DeviceSettings, PaletteId, TextureType, GuideType, DevicePreset, ThemeMode } from '../types';
import { PALETTES, TEXTURE_OPTIONS, GUIDE_OPTIONS, DEVICE_SPECS } from '../constants/presets';
import {
  Smartphone,
  Tablet,
  Maximize,
  Sliders,
  Code2,
  Volume2,
  VolumeX,
  Compass,
  Grid,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Layers,
  Check,
} from 'lucide-react';
import { audioEngine, AmbientSoundType } from '../utils/audioEngine';

interface ToolbarProps {
  settings: DeviceSettings;
  onUpdateSettings: (updater: Partial<DeviceSettings>) => void;
  activeSound: AmbientSoundType;
  onSelectSound: (sound: AmbientSoundType) => void;
  onOpenInspector: () => void;
  onOpenCode: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onReset: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onUpdateSettings,
  activeSound,
  onSelectSound,
  onOpenInspector,
  onOpenCode,
  isFullscreen,
  onToggleFullscreen,
  onReset,
}) => {
  const [openDropdown, setOpenDropdown] = React.useState<'palette' | 'texture' | 'guide' | 'device' | 'sound' | null>(null);

  const isLight = settings.themeMode === 'light';
  const activePalette = PALETTES.find((p) => p.id === settings.palette) || PALETTES[0];
  const activeTexture = TEXTURE_OPTIONS.find((t) => t.id === settings.texture) || TEXTURE_OPTIONS[0];
  const activeGuide = GUIDE_OPTIONS.find((g) => g.id === settings.guide) || GUIDE_OPTIONS[0];
  const activeDevice = DEVICE_SPECS[settings.preset];

  const soundOptions: { id: AmbientSoundType; label: string; desc: string }[] = [
    { id: 'none', label: 'Silent Studio', desc: 'No background ambient sound' },
    { id: 'warm-hum', label: '55Hz Warm Hum', desc: 'Analog transformer soothing warmth' },
    { id: 'tape-hiss', label: 'Vintage Tape Hiss', desc: 'Soft organic analog noise floor' },
    { id: 'brown-noise', label: 'Brown Noise', desc: 'Deep soothing atmospheric frequency' },
    { id: 'rain-drift', label: 'Rain on Glass', desc: 'Gentle rhythmic atmospheric rain' },
  ];

  const toggleDropdown = (name: 'palette' | 'texture' | 'guide' | 'device' | 'sound') => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleToggleThemeMode = () => {
    if (isLight) {
      onUpdateSettings({
        themeMode: 'dark',
        palette: 'studio-graphite',
      });
    } else {
      onUpdateSettings({
        themeMode: 'light',
        palette: 'pure-white',
      });
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#ambient-toolbar-root')) {
        setOpenDropdown(null);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div id="ambient-toolbar-root" className="relative z-50">
      {/* Floating Pill Toolbar */}
      <div
        className={`flex items-center gap-1.5 p-2 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 ${
          isLight
            ? 'bg-white/95 border-[#E2DFD8] text-[#141413] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.15),0_0_1px_1px_rgba(0,0,0,0.06)]'
            : 'bg-[#1A1A1A]/95 border-[#2D2D2D] text-[#E6E1D6] shadow-[0_20px_45px_-10px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(255,255,255,0.06)]'
        }`}
      >
        {/* 0. Primary Light / Dark Mode Toggle */}
        <button
          id="toolbar-btn-theme-mode"
          onClick={handleToggleThemeMode}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            isLight
              ? 'bg-[#F2ECE4] text-[#C48A4F] border border-[#C48A4F]/40 hover:bg-[#EAE2D8]'
              : 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 hover:bg-[#2A2A2A]'
          }`}
          title={isLight ? 'Switch to Dark Mode' : 'Switch to White / Light Mode'}
        >
          {isLight ? <Sun className="w-4 h-4 text-[#C48A4F]" /> : <Moon className="w-4 h-4 text-[#D4A373]" />}
          <span className="font-mono text-[11px] uppercase tracking-wide">
            {isLight ? 'White' : 'Dark'}
          </span>
        </button>

        <div className={`w-[1px] h-5 my-auto ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

        {/* 1. Device Viewport Switcher */}
        <div className="relative">
          <button
            id="toolbar-btn-device"
            onClick={() => toggleDropdown('device')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight
                ? 'text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Switch Viewport / Frame"
          >
            {settings.preset === 'fullscreen' ? (
              <Maximize className={`w-4 h-4 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            ) : settings.preset === 'desktop' ? (
              <Layers className={`w-4 h-4 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            ) : settings.preset === 'slate' ? (
              <Tablet className={`w-4 h-4 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            ) : (
              <Smartphone className={`w-4 h-4 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            )}
            <span className="hidden sm:inline">{activeDevice.name}</span>
          </button>

          {openDropdown === 'device' && (
            <div
              className={`absolute bottom-full mb-3 left-0 w-64 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 ${
                isLight
                  ? 'bg-white border-[#E7E6E2] text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
              }`}
            >
              <div className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest ${
                isLight ? 'text-[#8C887E]' : 'text-[#8C887E]'
              }`}>
                Viewport Dimensions
              </div>
              {(Object.keys(DEVICE_SPECS) as DevicePreset[]).map((key) => {
                const spec = DEVICE_SPECS[key];
                const isSelected = settings.preset === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      onUpdateSettings({ preset: key });
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-[#F5EFE7] text-[#141413] font-medium border border-[#C48A4F]/40'
                          : 'bg-[#242424] text-[#E6E1D6] font-medium border border-[#D4A373]/40'
                        : isLight
                        ? 'text-[#6B6862] hover:bg-[#F3EFE9] hover:text-black'
                        : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
                    }`}
                  >
                    <div>
                      <div className="font-sans">{spec.name}</div>
                      <div className={`text-[10px] font-mono ${isLight ? 'text-[#9E9B93]' : 'text-[#584D3D]'}`}>
                        {spec.category} {spec.width > 0 ? `· ${spec.width}×${spec.height}` : '· Full Screen'}
                      </div>
                    </div>
                    {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={`w-[1px] h-5 my-auto ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

        {/* 2. Palette Selector */}
        <div className="relative">
          <button
            id="toolbar-btn-palette"
            onClick={() => toggleDropdown('palette')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight
                ? 'text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Palette & Tone"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border shadow-sm"
              style={{ backgroundColor: activePalette.bgSurface, borderColor: activePalette.accentWarmth }}
            />
            <span className="hidden md:inline">{activePalette.name}</span>
          </button>

          {openDropdown === 'palette' && (
            <div
              className={`absolute bottom-full mb-3 left-0 w-72 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 max-h-80 overflow-y-auto ${
                isLight
                  ? 'bg-white border-[#E7E6E2] text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8C887E]">
                {isLight ? 'Light Mode Palettes' : 'Dark Mode Palettes'}
              </div>
              {PALETTES.map((p) => {
                const isSelected = settings.palette === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      onUpdateSettings({
                        palette: p.id,
                        themeMode: p.mode || (p.id.startsWith('pure-') || p.id.startsWith('warm-ala') || p.id.startsWith('soft-sand') || p.id.startsWith('minimal-sil') ? 'light' : 'dark'),
                      });
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-[#F5EFE7] text-[#141413] font-medium border border-[#C48A4F]/40'
                          : 'bg-[#242424] text-[#E6E1D6] font-medium border border-[#D4A373]/40'
                        : isLight
                        ? 'text-[#6B6862] hover:bg-[#F3EFE9] hover:text-black'
                        : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-lg border shrink-0 flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: p.bgBase, borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)' }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.accentWarmth }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.mode === 'light' && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-mono">
                            Light
                          </span>
                        )}
                      </div>
                      <div className={`text-[10px] truncate ${isLight ? 'text-[#8C887E]' : 'text-[#8C887E]'}`}>{p.subtitle}</div>
                    </div>
                    {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Surface Texture Selector */}
        <div className="relative">
          <button
            id="toolbar-btn-texture"
            onClick={() => toggleDropdown('texture')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight
                ? 'text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Tactile Screen Texture"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8C887E]" />
            <span className="hidden lg:inline">{activeTexture.name}</span>
          </button>

          {openDropdown === 'texture' && (
            <div
              className={`absolute bottom-full mb-3 left-0 w-64 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 ${
                isLight
                  ? 'bg-white border-[#E7E6E2] text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8C887E]">
                Screen Surface Texture
              </div>
              {TEXTURE_OPTIONS.map((tex) => {
                const isSelected = settings.texture === tex.id;
                return (
                  <button
                    key={tex.id}
                    onClick={() => {
                      onUpdateSettings({ texture: tex.id });
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-[#F5EFE7] text-[#141413] font-medium border border-[#C48A4F]/40'
                          : 'bg-[#242424] text-[#E6E1D6] font-medium border border-[#D4A373]/40'
                        : isLight
                        ? 'text-[#6B6862] hover:bg-[#F3EFE9] hover:text-black'
                        : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
                    }`}
                  >
                    <div>
                      <div className="font-sans">{tex.name}</div>
                      <div className="text-[10px] text-[#8C887E]">{tex.description}</div>
                    </div>
                    {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Composition Guides & Wireframes */}
        <div className="relative">
          <button
            id="toolbar-btn-guides"
            onClick={() => toggleDropdown('guide')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              isLight
                ? 'text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Composition Guides & Wireframes"
          >
            <Grid className="w-3.5 h-3.5 text-[#8C887E]" />
            <span className="hidden lg:inline">{activeGuide.name}</span>
          </button>

          {openDropdown === 'guide' && (
            <div
              className={`absolute bottom-full mb-3 left-0 w-64 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 ${
                isLight
                  ? 'bg-white border-[#E7E6E2] text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8C887E]">
                Screen Templates & Guides
              </div>
              {GUIDE_OPTIONS.map((g) => {
                const isSelected = settings.guide === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      onUpdateSettings({ guide: g.id });
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-[#F5EFE7] text-[#141413] font-medium border border-[#C48A4F]/40'
                          : 'bg-[#242424] text-[#E6E1D6] font-medium border border-[#D4A373]/40'
                        : isLight
                        ? 'text-[#6B6862] hover:bg-[#F3EFE9] hover:text-black'
                        : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
                    }`}
                  >
                    <div>
                      <div className="font-sans">{g.name}</div>
                      <div className="text-[10px] text-[#8C887E]">{g.description}</div>
                    </div>
                    {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={`w-[1px] h-5 my-auto ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />

        {/* 5. Ambient Sound Synthesizer */}
        <div className="relative">
          <button
            id="toolbar-btn-sound"
            onClick={() => toggleDropdown('sound')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
              activeSound !== 'none'
                ? isLight
                  ? 'bg-[#F5EFE7] text-[#C48A4F] border border-[#C48A4F]/40 shadow-sm'
                  : 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-sm'
                : isLight
                ? 'text-[#141413] hover:bg-[#F3EFE9]'
                : 'text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Ambient Soundscape"
          >
            {activeSound !== 'none' ? (
              <Volume2 className={`w-3.5 h-3.5 animate-pulse ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#8C887E]" />
            )}
            <span className="hidden xl:inline">{activeSound !== 'none' ? 'Atmosphere On' : 'Ambient Sound'}</span>
          </button>

          {openDropdown === 'sound' && (
            <div
              className={`absolute bottom-full mb-3 right-0 sm:left-0 w-64 p-2 rounded-2xl border shadow-2xl space-y-1 text-xs z-50 ${
                isLight
                  ? 'bg-white border-[#E7E6E2] text-[#141413]'
                  : 'bg-[#1A1A1A] border-[#2D2D2D] text-[#E6E1D6]'
              }`}
            >
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-[#8C887E]">
                Ambient Audio Atmosphere
              </div>
              {soundOptions.map((snd) => {
                const isSelected = activeSound === snd.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => {
                      onSelectSound(snd.id);
                      setOpenDropdown(null);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                      isSelected
                        ? isLight
                          ? 'bg-[#F5EFE7] text-[#141413] font-medium border border-[#C48A4F]/40'
                          : 'bg-[#242424] text-[#E6E1D6] font-medium border border-[#D4A373]/40'
                        : isLight
                        ? 'text-[#6B6862] hover:bg-[#F3EFE9] hover:text-black'
                        : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
                    }`}
                  >
                    <div>
                      <div className="font-sans">{snd.label}</div>
                      <div className="text-[10px] text-[#8C887E]">{snd.desc}</div>
                    </div>
                    {isSelected && <Check className={`w-3.5 h-3.5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. 3D Tilt Toggle */}
        <button
          id="toolbar-btn-tilt"
          onClick={() => onUpdateSettings({ tilt3D: !settings.tilt3D })}
          className={`p-2 rounded-xl text-xs font-medium transition-colors ${
            settings.tilt3D
              ? isLight
                ? 'bg-[#F5EFE7] text-[#C48A4F] border border-[#C48A4F]/40 shadow-sm'
                : 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-sm'
              : isLight
              ? 'text-[#7A766F] hover:bg-[#F3EFE9] hover:text-black'
              : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
          }`}
          title="Toggle 3D Gyro Tilt"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* 7. Inspector / Fine-Tune Tuning Sliders */}
        <button
          id="toolbar-btn-inspector"
          onClick={onOpenInspector}
          className={`p-2 rounded-xl text-xs font-medium transition-colors ${
            isLight
              ? 'text-[#7A766F] hover:bg-[#F3EFE9] hover:text-black'
              : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
          }`}
          title="Open Lighting & Material Inspector"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* 8. Code Snippet Export */}
        <button
          id="toolbar-btn-code"
          onClick={onOpenCode}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors shadow-sm ${
            isLight
              ? 'bg-[#F5EFE7] hover:bg-[#EBE2D8] text-[#C48A4F] border border-[#C48A4F]/30'
              : 'bg-[#242424] hover:bg-[#2D2D2D] text-[#D4A373] border border-[#D4A373]/30'
          }`}
          title="Get Template Code & CSS Tokens"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Code</span>
        </button>

        {/* 9. Fullscreen presentation */}
        <button
          id="toolbar-btn-fullscreen"
          onClick={onToggleFullscreen}
          className={`p-2 rounded-xl text-xs font-medium transition-colors ${
            isLight
              ? 'text-[#7A766F] hover:bg-[#F3EFE9] hover:text-black'
              : 'text-[#8C887E] hover:bg-white/5 hover:text-[#E6E1D6]'
          }`}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

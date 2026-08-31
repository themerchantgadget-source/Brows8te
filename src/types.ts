export type ThemeMode = 'light' | 'dark';

export type DevicePreset = 'fullscreen' | 'desktop' | 'iphone16pro' | 'pixel9' | 'compact' | 'slate' | 'frameless';

export type TextureType = 'velvet' | 'grain' | 'dotmatrix' | 'isometric' | 'brushed' | 'clean';

export type PaletteId =
  | 'pure-white'
  | 'warm-alabaster'
  | 'soft-sand'
  | 'minimal-silver'
  | 'warm-basalt'
  | 'deep-umber'
  | 'smoked-obsidian'
  | 'matte-anthracite'
  | 'raw-graphite'
  | 'bronze-graphite'
  | 'studio-graphite';

export interface ColorPalette {
  id: PaletteId;
  name: string;
  subtitle: string;
  mode: ThemeMode;
  bgBase: string;
  bgSurface: string;
  bgElevated: string;
  borderColor: string;
  glowColor: string;
  accentWarmth: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  tagColor: string;
}

export type GuideType = 'none' | 'immersive-series' | 'minimal-clock' | 'safe-area' | 'grid-8pt' | 'rule-of-thirds' | 'wireframe-clean' | 'wireframe-content';

export interface AmbientLightState {
  x: number; // 0 to 100 percentage
  y: number; // 0 to 100 percentage
  intensity: number; // 0 to 1
  radius: number; // in pixels or percentage
  temperatureK: number; // 1800K to 4000K
  isAutoOrbit: boolean;
}

export interface DeviceSettings {
  preset: DevicePreset;
  palette: PaletteId;
  themeMode: ThemeMode;
  texture: TextureType;
  textureOpacity: number; // 0 to 1
  guide: GuideType;
  showDynamicIsland: boolean;
  showStatusBar: boolean;
  showHomeIndicator: boolean;
  tilt3D: boolean;
  tiltX: number;
  tiltY: number;
  reflectionOpacity: number;
  customNotes: string;
  screenGlow: boolean;
}

export interface Ripple {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

// Brow8te Architecture Types
export type Brow8teView = 'chat' | 'preview';

export type SessionState = 'none' | 'connecting' | 'live' | 'error';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date | number;
  actionType?: 'navigate' | 'search' | 'scroll' | 'click' | 'summarize' | 'info';
  targetUrl?: string;
  pageTitle?: string;
  previewSnapshotTitle?: string;
  isExecuting?: boolean;
}

export interface BrowserTab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  history: string[];
  historyIndex: number;
  isSecure?: boolean;
  isLoading: boolean;
  loadingProgress?: number;
}

export interface BrowserSession {
  state: SessionState;
  activeTabId: string;
  tabs: BrowserTab[];
  zoomLevel?: number;
  vncConnected?: boolean;
  fps?: number;
  latencyMs?: number;
  userAgent?: string;
  cookiesCount?: number;
}

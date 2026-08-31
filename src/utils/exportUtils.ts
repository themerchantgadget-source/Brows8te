import { DeviceSettings, ColorPalette } from '../types';
import { DEVICE_SPECS } from '../constants/presets';

export function generateTailwindSnippet(settings: DeviceSettings, palette: ColorPalette): string {
  const spec = DEVICE_SPECS[settings.preset];
  return `<!-- Warm Ambient Graphite Mobile Template -->
<div class="relative w-full max-w-[${spec.width}px] h-[${spec.height}px] mx-auto rounded-[${spec.radius}px] bg-[${palette.bgBase}] text-[${palette.textPrimary}] shadow-2xl overflow-hidden border border-[${palette.borderColor}]">
  <!-- Dynamic Ambient Glow Layer -->
  <div 
    class="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
    style="background: radial-gradient(circle 380px at 50% 30%, ${palette.glowColor}, transparent 70%);"
  ></div>

  <!-- Status Bar (Safe Area Top) -->
  ${settings.showStatusBar ? `<div class="relative z-20 flex items-center justify-between px-7 pt-4 pb-2 text-xs text-[${palette.textSecondary}] font-medium tracking-wide">
    <span>9:41</span>
    ${settings.showDynamicIsland && spec.notchType === 'island' ? `<div class="w-28 h-7 bg-black rounded-full shadow-inner mx-auto flex items-center justify-center">
      <div class="w-2.5 h-2.5 rounded-full bg-[#1c1b1a] ml-auto mr-2"></div>
    </div>` : ''}
    <div class="flex items-center gap-1.5">
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div class="w-5 h-2.5 border border-current rounded-sm p-0.5"><div class="h-full w-3/4 bg-current rounded-xs"></div></div>
    </div>
  </div>` : ''}

  <!-- Canvas Interior / Viewport Content -->
  <div class="relative z-10 p-6 flex flex-col h-full justify-between">
    <!-- Your mobile UI components go here -->
    <div class="space-y-4 pt-10">
      <div class="h-6 w-32 rounded-lg bg-[${palette.bgElevated}] border border-[${palette.borderColor}]/50"></div>
      <div class="h-28 w-full rounded-2xl bg-[${palette.bgSurface}] border border-[${palette.borderColor}]/60 p-4"></div>
    </div>

    <!-- Home Indicator (Safe Area Bottom) -->
    ${settings.showHomeIndicator ? `<div class="w-32 h-1 bg-[${palette.textTertiary}]/40 rounded-full mx-auto mb-2"></div>` : ''}
  </div>
</div>`;
}

export function generateCssTokens(palette: ColorPalette): string {
  return `:root {
  /* Warm Ambient Graphite Palette: ${palette.name} */
  --graphite-base: ${palette.bgBase};
  --graphite-surface: ${palette.bgSurface};
  --graphite-elevated: ${palette.bgElevated};
  --graphite-border: ${palette.borderColor};
  --graphite-glow: ${palette.glowColor};
  --graphite-accent: ${palette.accentWarmth};
  
  --text-primary: ${palette.textPrimary};
  --text-secondary: ${palette.textSecondary};
  --text-tertiary: ${palette.textTertiary};
  
  --ambient-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 18px 36px -18px rgba(0, 0, 0, 0.6);
}`;
}

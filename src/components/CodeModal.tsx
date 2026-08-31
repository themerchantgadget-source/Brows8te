import React, { useState } from 'react';
import { DeviceSettings, ColorPalette } from '../types';
import { generateTailwindSnippet, generateCssTokens } from '../utils/exportUtils';
import { X, Copy, Check, Code2, Palette } from 'lucide-react';
import { motion } from 'motion/react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DeviceSettings;
  palette: ColorPalette;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  onClose,
  settings,
  palette,
}) => {
  const [tab, setTab] = useState<'tailwind' | 'css'>('tailwind');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const content = tab === 'tailwind' ? generateTailwindSnippet(settings, palette) : generateCssTokens(palette);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="code-export-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border bg-[#1A1A1A] border-[#2D2D2D] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        style={{
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#222222]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#242424] border border-[#D4A373]/30 text-[#D4A373]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E1D6]">Warm Ambient Graphite Code</h3>
              <p className="text-[11px] text-[#8C887E]">Drop-in mobile template snippet & tokens</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C887E] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-[#171717] border-b border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('tailwind')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                tab === 'tailwind'
                  ? 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8C887E] hover:text-white'
              }`}
            >
              HTML / Tailwind Canvas
            </button>
            <button
              onClick={() => setTab('css')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                tab === 'css'
                  ? 'bg-[#242424] text-[#D4A373] border border-[#D4A373]/40 shadow-sm'
                  : 'text-[#8C887E] hover:text-white'
              }`}
            >
              CSS Design Tokens
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#D4A373] text-[#1A1A1A] hover:bg-[#E59A60] transition-colors shadow-sm font-semibold"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Snippet'}</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-[#D6D1C4] bg-[#101010] leading-relaxed flex-1">
          <pre className="whitespace-pre-wrap select-all">
            <code>{content}</code>
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

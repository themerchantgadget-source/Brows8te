import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ThemeMode } from '../../types/aistudio';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  themeMode,
}) => {
  const [copied, setCopied] = useState(false);
  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const maskedKey = 'AIzaSy' + '•'.repeat(24) + 'X8jQ';

  const handleCopy = () => {
    navigator.clipboard.writeText('AIzaSyDk93LkQ09_SampleGeminiApiKey_Live');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="modal-api-keys"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden p-5 space-y-5 transition-all ${
          isDark
            ? 'bg-[#1e1f20] border-[#37393b] text-[#e3e3e3]'
            : 'bg-white border-[#e0e3e7] text-[#1f1f1f]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">API Keys & Cloud Project</h3>
              <p className="text-xs opacity-60">Google AI Studio Free Tier & Quotas</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Key Display */}
        <div className="space-y-2">
          <label className="text-xs font-semibold">Active Gemini API Key</label>
          <div className="flex items-center gap-2">
            <div
              className={`flex-1 p-2.5 rounded-xl border text-xs font-mono flex items-center justify-between ${
                isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'
              }`}
            >
              <span>{maskedKey}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-sans font-medium">
                Active
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl border hover:bg-blue-500/10 hover:border-blue-500 transition-colors"
              title="Copy API Key"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quota & Usage Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" />
              <span>Rate Limits & Quota</span>
            </span>
            <span className="text-[10px] text-blue-500 font-mono">Tier: Free of Charge</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div
              className={`p-3 rounded-xl border text-center ${
                isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'
              }`}
            >
              <div className="text-[10px] opacity-60 uppercase font-mono">RPM (Req/min)</div>
              <div className="text-base font-bold text-blue-500 mt-1">15</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center ${
                isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'
              }`}
            >
              <div className="text-[10px] opacity-60 uppercase font-mono">TPM (Tokens/min)</div>
              <div className="text-base font-bold text-purple-500 mt-1">1,000,000</div>
            </div>

            <div
              className={`p-3 rounded-xl border text-center ${
                isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'
              }`}
            >
              <div className="text-[10px] opacity-60 uppercase font-mono">RPD (Req/day)</div>
              <div className="text-base font-bold text-emerald-500 mt-1">1,500</div>
            </div>
          </div>
        </div>

        {/* Google Cloud Info */}
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-blue-50/50 border-blue-200'
          }`}
        >
          <div>
            <div className="font-semibold">Google Cloud Project</div>
            <div className="text-[11px] opacity-60 font-mono">gen-ai-studio-workspace-prod</div>
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline font-medium text-xs"
          >
            <span>Manage in Console</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

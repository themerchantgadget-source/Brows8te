import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe, Lock, ShieldCheck } from 'lucide-react';
import { ThemeMode } from '../../types/aistudio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptTitle: string;
  themeMode: ThemeMode;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  promptTitle,
  themeMode,
}) => {
  const [access, setAccess] = useState<'public' | 'restricted'>('public');
  const [copied, setCopied] = useState(false);

  const isDark = themeMode === 'dark';
  const shareUrl = `https://aistudio.google.com/prompts/${encodeURIComponent(
    promptTitle.toLowerCase().replace(/\s+/g, '-') || 'prompt'
  )}-${Math.random().toString(36).substring(2, 7)}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="modal-share-prompt"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden p-5 space-y-4 transition-all ${
          isDark
            ? 'bg-[#1e1f20] border-[#37393b] text-[#e3e3e3]'
            : 'bg-white border-[#e0e3e7] text-[#1f1f1f]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Share prompt</h3>
              <p className="text-xs opacity-60">Generate a shareable link for collaborators</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access options */}
        <div className="space-y-2">
          <div
            onClick={() => setAccess('public')}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              access === 'public'
                ? isDark
                  ? 'bg-blue-950/30 border-blue-500'
                  : 'bg-blue-50 border-blue-500'
                : isDark
                ? 'bg-[#131314] border-[#282a2c]'
                : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-500" />
              <div>
                <div className="text-xs font-semibold">Anyone with the link</div>
                <div className="text-[11px] opacity-60">Anyone can view, test, and branch a copy</div>
              </div>
            </div>
            {access === 'public' && <Check className="w-4 h-4 text-blue-500" />}
          </div>

          <div
            onClick={() => setAccess('restricted')}
            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
              access === 'restricted'
                ? isDark
                  ? 'bg-blue-950/30 border-blue-500'
                  : 'bg-blue-50 border-blue-500'
                : isDark
                ? 'bg-[#131314] border-[#282a2c]'
                : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-semibold">Restricted Google Workspace</div>
                <div className="text-[11px] opacity-60">Only members within your cloud organization</div>
              </div>
            </div>
            {access === 'restricted' && <Check className="w-4 h-4 text-blue-500" />}
          </div>
        </div>

        {/* Link Input & Copy */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className={`flex-1 p-2.5 text-xs rounded-xl border font-mono outline-hidden ${
              isDark ? 'bg-[#131314] border-[#37393b] text-neutral-300' : 'bg-[#f8fafd] border-[#c4c7c5] text-neutral-800'
            }`}
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

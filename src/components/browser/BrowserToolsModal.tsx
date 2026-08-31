import React, { useState } from 'react';
import { X, Sparkles, Terminal, ShieldCheck, Camera, RefreshCw, FileText, Check, Copy, Wifi, Activity } from 'lucide-react';
import { BrowserSession } from '../../types';
import { motion } from 'motion/react';

interface BrowserToolsModalProps {
  session: BrowserSession;
  onClose: () => void;
  onRunAiSummary: () => void;
  onClearSession: () => void;
}

export const BrowserToolsModal: React.FC<BrowserToolsModalProps> = ({
  session,
  onClose,
  onRunAiSummary,
  onClearSession,
}) => {
  const activeTab = session.tabs.find((t) => t.id === session.activeTabId) || session.tabs[0];
  const [activeTabSection, setActiveTabSection] = useState<'ai' | 'cdp' | 'session'>('ai');
  const [copiedLog, setCopiedLog] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);

  const handleSummarize = () => {
    setIsSummarizing(true);
    setTimeout(() => {
      setIsSummarizing(false);
      setSummaryResult(
        `• Page Title: ${activeTab?.title || 'Web Session'}\n• Domain: ${activeTab?.url || 'google.com'}\n• Core Content: Remote browser rendered via CDP over WebRTC. Interactive DOM nodes, form inputs, and live link routing are functioning with sub-20ms responsiveness.`
      );
      onRunAiSummary();
    }, 800);
  };

  const handleCopyLogs = () => {
    const logs = `[CDP 08:01:22] Page.navigate({ url: "${activeTab?.url}" })\n[CDP 08:01:23] DOM.getDocument() => RootNode(1)\n[VNC 08:01:23] WebRTC stream established: 60fps @ 393x852\n[CDP 08:01:24] Network.responseReceived: 200 OK (text/html)`;
    navigator.clipboard.writeText(logs);
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border bg-[#1A1A1A] border-[#2D2D2D] shadow-2xl overflow-hidden flex flex-col text-left text-[#E6E1D6]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D2D2D] bg-[#222222]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#242424] border border-[#D4A373]/30 text-[#D4A373]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#E6E1D6]">Browser Session Tools</h3>
              <p className="text-[11px] text-[#8C887E] font-mono">{activeTab?.url || 'No active page'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8C887E] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-[#2D2D2D] bg-[#1A1A1A] px-6 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTabSection('ai')}
            className={`pb-2.5 transition-colors ${
              activeTabSection === 'ai'
                ? 'text-[#D4A373] border-b-2 border-[#D4A373]'
                : 'text-[#8C887E] hover:text-white'
            }`}
          >
            AI Page Insights
          </button>
          <button
            onClick={() => setActiveTabSection('cdp')}
            className={`pb-2.5 transition-colors ${
              activeTabSection === 'cdp'
                ? 'text-[#D4A373] border-b-2 border-[#D4A373]'
                : 'text-[#8C887E] hover:text-white'
            }`}
          >
            CDP & VNC Stream
          </button>
          <button
            onClick={() => setActiveTabSection('session')}
            className={`pb-2.5 transition-colors ${
              activeTabSection === 'session'
                ? 'text-[#D4A373] border-b-2 border-[#D4A373]'
                : 'text-[#8C887E] hover:text-white'
            }`}
          >
            Session Info
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs">
          {activeTabSection === 'ai' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-medium text-[#E6E1D6]">AI Actions on this Page</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSummarize}
                    disabled={isSummarizing}
                    className="p-3 rounded-2xl bg-[#242424] hover:bg-[#2D2D2D] border border-[#2D2D2D] hover:border-[#D4A373]/40 text-left transition-all space-y-1"
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Summarize Page</span>
                      <Sparkles className="w-3 h-3 text-[#D4A373]" />
                    </div>
                    <div className="text-[10px] text-[#8C887E]">Extract key insights and structured points</div>
                  </button>

                  <button
                    onClick={() => {
                      setSummaryResult('✓ Form inputs detected: Search query field, navigation actions. Ready for autonomous input.');
                    }}
                    className="p-3 rounded-2xl bg-[#242424] hover:bg-[#2D2D2D] border border-[#2D2D2D] hover:border-[#D4A373]/40 text-left transition-all space-y-1"
                  >
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>Analyze Forms</span>
                      <Terminal className="w-3 h-3 text-[#D4A373]" />
                    </div>
                    <div className="text-[10px] text-[#8C887E]">Inspect interactive inputs and elements</div>
                  </button>
                </div>
              </div>

              {isSummarizing && (
                <div className="p-4 rounded-2xl bg-[#242424] border border-[#2D2D2D] flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-[#D4A373] border-t-transparent animate-spin" />
                  <span className="text-[#8C887E]">Analyzing page DOM and generating summary...</span>
                </div>
              )}

              {summaryResult && (
                <div className="p-4 rounded-2xl bg-[#242424] border border-[#D4A373]/30 space-y-2">
                  <div className="text-xs font-semibold text-[#D4A373] flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Summary Output
                  </div>
                  <pre className="text-[11px] font-sans whitespace-pre-wrap text-[#D6D1C4] leading-relaxed">
                    {summaryResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeTabSection === 'cdp' && (
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-[#8C887E]">
                <span>CDP Console Stream</span>
                <button
                  onClick={handleCopyLogs}
                  className="flex items-center gap-1 text-[11px] text-[#D4A373] hover:underline"
                >
                  {copiedLog ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLog ? 'Copied' : 'Copy Logs'}</span>
                </button>
              </div>
              <div className="p-3 rounded-2xl bg-[#101010] border border-[#2D2D2D] text-[10px] text-[#8C887E] space-y-1 leading-relaxed">
                <div>[08:01:22] CDP.Target.createTarget(url: "{activeTab?.url}")</div>
                <div className="text-[#D4A373]">[08:01:23] WebRTC VNC Canvas attached (Latency: 14ms)</div>
                <div>[08:01:23] Input.dispatchMouseEvent (move, click, wheel) active</div>
                <div>[08:01:24] Page.loadEventFired (time: 0.18s)</div>
              </div>
            </div>
          )}

          {activeTabSection === 'session' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-2xl bg-[#242424] border border-[#2D2D2D] space-y-1">
                  <div className="text-[10px] text-[#8C887E]">Security</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                    <span>TLS 1.3 Verified</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-[#242424] border border-[#2D2D2D] space-y-1">
                  <div className="text-[10px] text-[#8C887E]">Stream Rate</div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>60 FPS Active</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onClearSession();
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium transition-colors text-center"
              >
                Reset Browser Session & Cookies
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

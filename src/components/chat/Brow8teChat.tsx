import React, { useState, useEffect } from 'react';
import { Mic, Plus, ArrowUp, Sparkles, Globe, Compass, CornerDownLeft, ExternalLink, Play, Search, Terminal } from 'lucide-react';
import { ChatMessage, ColorPalette, SessionState, ThemeMode } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

interface Brow8teChatProps {
  messages: ChatMessage[];
  palette?: ColorPalette;
  themeMode?: ThemeMode;
  onSendMessage: (text: string) => void;
  onSwitchToPreview: () => void;
  sessionState: SessionState;
  activeUrl?: string;
}

const ROTATING_EXAMPLES = [
  'google.com',
  'Open YouTube',
  'https://github.com',
  'Search the web for AI browsers',
  'Open Hacker News',
  'Go to Wikipedia',
];

export const Brow8teChat: React.FC<Brow8teChatProps> = ({
  messages,
  palette,
  themeMode = 'light',
  onSendMessage,
  onSwitchToPreview,
  sessionState,
  activeUrl,
}) => {
  const isLight = themeMode === 'light';
  const [inputText, setInputText] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  // Subtle rotating placeholder every 3.5 seconds when input is empty
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((prev) => (prev + 1) % ROTATING_EXAMPLES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleSuggestionClick = (example: string) => {
    onSendMessage(example);
  };

  const isStateA = messages.length === 0 && sessionState === 'none';

  return (
    <div className={`relative w-full h-full flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none transition-colors duration-300 ${
      isLight ? 'bg-[#FFFFFF] text-[#141413]' : 'bg-[#1A1A1A] text-[#E6E1D6]'
    }`}>
      {/* 1. Main Chat / Home Stage */}
      <div className="flex-1 w-full overflow-y-auto flex flex-col justify-between py-2 space-y-4">
        {/* STATE A: Initial Empty Serene Home */}
        {isStateA ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto space-y-6">
            {/* Primary Center Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className={`w-11 h-11 rounded-2xl border mx-auto flex items-center justify-center shadow-sm ${
                isLight
                  ? 'bg-[#F7F7F6] border-[#E7E6E2]'
                  : 'bg-[#242424] border-[#2D2D2D]'
              }`}>
                <Globe className={`w-5 h-5 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
              </div>

              <div className="space-y-1">
                <h2 className={`text-xl sm:text-2xl font-light tracking-tight leading-snug ${
                  isLight ? 'text-[#141413]' : 'text-[#E6E1D6]'
                }`}>
                  Enter a URL or tell Brow8te what to open
                </h2>
                <p className={`text-xs ${isLight ? 'text-[#7A766F]' : 'text-[#8C887E]'}`}>
                  A browser you can talk to — and take control of.
                </p>
              </div>
            </motion.div>

            {/* Subtle Rotating Suggestion Chips */}
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {ROTATING_EXAMPLES.map((ex, idx) => {
                const isActive = idx === exampleIndex;
                return (
                  <button
                    key={ex}
                    onClick={() => handleSuggestionClick(ex)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono border transition-all duration-300 ${
                      isActive
                        ? isLight
                          ? 'bg-[#FFFFFF] text-[#C48A4F] border-[#C48A4F] shadow-sm scale-105 font-medium'
                          : 'bg-[#242424] text-[#D4A373] border-[#D4A373]/40 shadow-sm scale-105'
                        : isLight
                        ? 'bg-[#F7F7F6] text-[#6B6862] border-[#E7E6E2] hover:text-black hover:border-black/20'
                        : 'bg-[#202020] text-[#8C887E] border-[#2D2D2D] hover:text-[#E6E1D6] hover:border-white/10'
                    }`}
                  >
                    {ex}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* STATE B & C: Conversational Control Plane Stream */
          <div className="space-y-4 max-w-lg mx-auto w-full pt-2">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? isLight
                        ? 'bg-[#C48A4F] text-white font-medium shadow-sm'
                        : 'bg-[#D4A373] text-[#1A1A1A] font-medium shadow-sm'
                      : isLight
                      ? 'bg-[#F7F7F6] text-[#141413] border border-[#E7E6E2] shadow-sm'
                      : 'bg-[#242424] text-[#E6E1D6] border border-[#2D2D2D]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-mono opacity-60">
                      {msg.sender === 'user' ? 'You' : 'Brow8te'}
                    </span>
                  </div>
                  <div>{msg.text}</div>

                  {/* If assistant executed navigation, show quick Preview jump pill */}
                  {msg.sender === 'assistant' && msg.actionType && (
                    <div className={`mt-3 pt-2.5 border-t flex items-center justify-between gap-3 ${
                      isLight ? 'border-black/10' : 'border-white/10'
                    }`}>
                      <div className={`flex items-center gap-1.5 text-[11px] font-mono ${
                        isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                          isLight ? 'bg-[#C48A4F]' : 'bg-[#D4A373]'
                        }`} />
                        <span>{msg.targetUrl ? `Live: ${msg.targetUrl}` : 'Action executed'}</span>
                      </div>
                      <button
                        onClick={onSwitchToPreview}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-colors ${
                          isLight
                            ? 'bg-[#EAE7DF] hover:bg-[#DDD8CD] text-[#141413]'
                            : 'bg-[#2D2D2D] hover:bg-[#383838] text-white'
                        }`}
                      >
                        <span>Open Preview</span>
                        <ExternalLink className={`w-3 h-3 ${isLight ? 'text-[#C48A4F]' : 'text-[#D4A373]'}`} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* If actively executing */}
            {sessionState === 'connecting' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-2 text-xs font-mono pl-2 ${
                  isLight ? 'text-[#6B6862]' : 'text-[#8C887E]'
                }`}
              >
                <div className={`w-2 h-2 rounded-full animate-ping ${
                  isLight ? 'bg-[#C48A4F]' : 'bg-[#D4A373]'
                }`} />
                <span>Connecting browser session...</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 2. Bottom Input Box (Matches Screenshot & Spec) */}
      <div id="chat-input-container" className="w-full max-w-lg mx-auto pt-2 z-20">
        <form
          onSubmit={handleSubmit}
          className={`relative w-full rounded-2xl border shadow-lg p-2 flex items-center gap-2 transition-all ${
            isLight
              ? 'bg-white border-[#E7E6E2] focus-within:border-[#C48A4F] focus-within:ring-1 focus-within:ring-[#C48A4F]/20'
              : 'bg-[#222222] border-[#2D2D2D] focus-within:border-[#D4A373]/60'
          }`}
        >
          {/* Action / Plus Button */}
          <button
            type="button"
            onClick={() => {
              setInputText('Search for ');
            }}
            className={`p-2 rounded-xl transition-colors ${
              isLight
                ? 'text-[#7A766F] hover:text-black hover:bg-[#F3EFE9]'
                : 'text-[#8C887E] hover:text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Add command"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Voice / Mic simulation */}
          <button
            type="button"
            onClick={() => {
              setIsRecording(true);
              setTimeout(() => {
                setIsRecording(false);
                setInputText('Open Google');
              }, 1200);
            }}
            className={`p-2 rounded-xl transition-colors ${
              isRecording
                ? isLight
                  ? 'bg-[#C48A4F] text-white animate-pulse'
                  : 'bg-[#D4A373] text-black animate-pulse'
                : isLight
                ? 'text-[#7A766F] hover:text-black hover:bg-[#F3EFE9]'
                : 'text-[#8C887E] hover:text-[#E6E1D6] hover:bg-white/5'
            }`}
            title="Voice input"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Input field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isStateA
                ? `e.g. ${ROTATING_EXAMPLES[exampleIndex]}`
                : 'Enter a URL or ask Brow8te...'
            }
            className={`flex-1 bg-transparent text-xs sm:text-sm outline-none font-sans ${
              isLight
                ? 'text-[#141413] placeholder-[#A09D95]'
                : 'text-[#E6E1D6] placeholder-[#584D3D]'
            }`}
          />

          {/* Submit Arrow */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2 rounded-xl transition-all ${
              inputText.trim()
                ? isLight
                  ? 'bg-[#C48A4F] text-white hover:bg-[#B3793E] active:scale-95 shadow-sm'
                  : 'bg-[#D4A373] text-[#1A1A1A] hover:bg-[#E59A60] active:scale-95 shadow-sm'
                : isLight
                ? 'text-[#C8C5BD] cursor-not-allowed'
                : 'text-[#4A4740] cursor-not-allowed'
            }`}
            title="Send to Brow8te"
          >
            <ArrowUp className="w-4 h-4 font-bold" />
          </button>
        </form>
      </div>
    </div>
  );
};

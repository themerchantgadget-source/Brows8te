import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  Image as ImageIcon,
  FileText,
  Mic,
  Search,
  Code2,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Brain,
  ChevronDown,
  ChevronUp,
  Terminal,
  Paperclip,
  X,
  StopCircle,
  Clock,
  Zap,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage, Attachment, ThemeMode, StudioParameters } from '../../types/aistudio';

interface ChatPromptViewProps {
  messages: ChatMessage[];
  systemInstruction: string;
  onChangeSystemInstruction: (val: string) => void;
  onSendMessage: (text: string, attachments: Attachment[]) => void;
  onRegenerate: () => void;
  onDeleteMessage: (id: string) => void;
  onClearHistory: () => void;
  isGenerating: boolean;
  onStopGenerating: () => void;
  parameters: StudioParameters;
  onChangeParameters: (params: Partial<StudioParameters>) => void;
  themeMode: ThemeMode;
}

export const ChatPromptView: React.FC<ChatPromptViewProps> = ({
  messages,
  systemInstruction,
  onChangeSystemInstruction,
  onSendMessage,
  onRegenerate,
  onDeleteMessage,
  onClearHistory,
  isGenerating,
  onStopGenerating,
  parameters,
  onChangeParameters,
  themeMode,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSystemExpanded, setIsSystemExpanded] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Handle textarea auto-grow
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!inputText.trim() && attachments.length === 0) || isGenerating) return;
    onSendMessage(inputText, attachments);
    setInputText('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const newAttachment: Attachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          data: result,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('audio/')
            ? 'audio'
            : file.type.startsWith('video/')
            ? 'video'
            : 'file',
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      id="aistudio-chat-prompt-view"
      className="flex-1 flex flex-col h-full min-h-0 relative overflow-hidden"
    >
      {/* Scrollable Conversation Canvas */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl w-full mx-auto">
        {/* System Instructions Accordion */}
        <div
          id="system-instruction-card"
          className={`rounded-2xl border transition-all duration-200 shadow-2xs ${
            isDark
              ? 'bg-[#1e1f20] border-[#282a2c]'
              : 'bg-[#ffffff] border-[#e0e3e7]'
          }`}
        >
          <div
            onClick={() => setIsSystemExpanded(!isSystemExpanded)}
            className={`p-3 sm:px-4 sm:py-2.5 flex items-center justify-between cursor-pointer select-none rounded-2xl ${
              isDark ? 'hover:bg-[#282a2c]/50' : 'hover:bg-[#f8fafd]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="font-semibold text-xs sm:text-sm">System Instructions</span>
              <span className="text-[11px] opacity-60 hidden sm:inline">
                · Guide the model's behavior, tone, and formatting
              </span>
            </div>
            <div className="flex items-center gap-2">
              {systemInstruction && !isSystemExpanded && (
                <span className="text-[11px] font-mono opacity-50 truncate max-w-xs">
                  "{systemInstruction.slice(0, 40)}..."
                </span>
              )}
              {isSystemExpanded ? <ChevronUp className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70" />}
            </div>
          </div>

          {isSystemExpanded && (
            <div className="p-3 sm:p-4 pt-0 border-t border-current/10">
              <textarea
                placeholder="Optional: Enter instructions to guide model behavior, style, and tone (e.g. 'You are a Senior TypeScript Architect. Give concise production code')..."
                value={systemInstruction}
                onChange={(e) => onChangeSystemInstruction(e.target.value)}
                rows={2}
                className={`w-full p-2.5 text-xs sm:text-sm rounded-xl border outline-hidden resize-y min-h-[64px] transition-colors leading-relaxed font-sans ${
                  isDark
                    ? 'bg-[#131314] border-[#37393b] text-white placeholder-[#8e918f] focus:border-[#8ab4f8]'
                    : 'bg-[#f8fafd] border-[#c4c7c5] text-black placeholder-[#8e918f] focus:border-[#1a73e8]'
                }`}
              />
            </div>
          )}
        </div>

        {/* Conversation Message List */}
        {messages.length === 0 ? (
          <div className="py-12 sm:py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1a73e8] to-[#8ab4f8] text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-semibold tracking-tight">
                Start crafting your prompt
              </h2>
              <p className="text-xs sm:text-sm opacity-70 max-w-md mx-auto">
                Type a question, attach documents or images, configure model parameters on the right, and press Run.
              </p>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto pt-2">
              {[
                'Explain quantum superposition simply',
                'Write a Python script to parse CSV files',
                'Analyze stock market trends with Google Search grounding',
                'Draft a system architecture for microservices',
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(suggestion);
                    if (textareaRef.current) textareaRef.current.focus();
                  }}
                  className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                    isDark
                      ? 'bg-[#1e1f20] border-[#282a2c] hover:border-[#8ab4f8] text-[#c4c7c5] hover:text-white'
                      : 'bg-white border-[#e0e3e7] hover:border-[#1a73e8] text-[#444746] hover:text-black'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <ChatMessageTurn
                key={message.id}
                message={message}
                isDark={isDark}
                copiedId={copiedId}
                onCopy={(text) => handleCopyText(text, message.id)}
                onDelete={() => onDeleteMessage(message.id)}
                onRegenerate={onRegenerate}
              />
            ))}
          </div>
        )}

        {/* Live Streaming / Generation Indicator */}
        {isGenerating && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 animate-pulse ${
              isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-semibold flex items-center gap-2">
                <span>Gemini is generating response...</span>
                <span className="text-[10px] font-mono opacity-60">
                  {parameters.enableSearch ? 'Grounding with Google Search' : 'Thinking & compiling'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Sticky Input Control Plane */}
      <div
        id="aistudio-bottom-input-bar"
        className={`p-3 sm:p-4 border-t select-none transition-colors ${
          isDark
            ? 'bg-[#131314] border-[#282a2c]'
            : 'bg-[#ffffff] border-[#e0e3e7]'
        }`}
      >
        <div className="max-w-5xl mx-auto space-y-2">
          {/* Active Attachments Preview Chips */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-medium ${
                    isDark ? 'bg-[#1e1f20] border-[#37393b] text-white' : 'bg-[#f0f4f9] border-[#c4c7c5] text-black'
                  }`}
                >
                  {att.type === 'image' ? (
                    <img src={att.data} alt={att.name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-500" />
                  )}
                  <span className="truncate max-w-[150px]">{att.name}</span>
                  <button
                    onClick={() => handleRemoveAttachment(att.id)}
                    className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Box Card */}
          <div
            className={`rounded-2xl border p-2 shadow-sm transition-all ${
              isDark
                ? 'bg-[#1e1f20] border-[#37393b] focus-within:border-[#8ab4f8]'
                : 'bg-white border-[#c4c7c5] focus-within:border-[#1a73e8]'
            }`}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type something, or press Ctrl+Enter to run..."
              className={`w-full px-3 py-1.5 text-xs sm:text-sm bg-transparent outline-hidden resize-none max-h-56 leading-relaxed font-sans ${
                isDark ? 'text-white placeholder-[#8e918f]' : 'text-black placeholder-[#8e918f]'
              }`}
            />

            {/* Input Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-current/10 px-2">
              {/* Left Controls: Add Media, Tools Quick Toggles */}
              <div className="flex items-center gap-1 sm:gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    isDark
                      ? 'bg-[#131314] border-[#282a2c] hover:bg-[#282a2c] text-[#c4c7c5]'
                      : 'bg-[#f8fafd] border-[#e0e3e7] hover:bg-[#e8f0fe] text-[#444746]'
                  }`}
                  title="Upload images, documents, or audio"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                  <span className="hidden sm:inline">Add file</span>
                </button>

                {/* Quick Google Search Toggle */}
                <button
                  type="button"
                  onClick={() => onChangeParameters({ enableSearch: !parameters.enableSearch })}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    parameters.enableSearch
                      ? isDark
                        ? 'bg-blue-950/40 border-blue-500 text-blue-400 font-semibold'
                        : 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                      : isDark
                      ? 'bg-[#131314] border-[#282a2c] hover:bg-[#282a2c] text-[#8e918f]'
                      : 'bg-[#f8fafd] border-[#e0e3e7] hover:bg-[#e8f0fe] text-[#5e5e5e]'
                  }`}
                  title="Toggle Google Search Grounding"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Grounding</span>
                </button>

                {/* Quick Code Execution Toggle */}
                <button
                  type="button"
                  onClick={() => onChangeParameters({ enableCodeExecution: !parameters.enableCodeExecution })}
                  className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    parameters.enableCodeExecution
                      ? isDark
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 font-semibold'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-700 font-semibold'
                      : isDark
                      ? 'bg-[#131314] border-[#282a2c] hover:bg-[#282a2c] text-[#8e918f]'
                      : 'bg-[#f8fafd] border-[#e0e3e7] hover:bg-[#e8f0fe] text-[#5e5e5e]'
                  }`}
                  title="Toggle Python Code Execution Sandbox"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Python Sandbox</span>
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className={`p-1.5 rounded-lg border text-xs transition-colors ${
                      isDark
                        ? 'bg-[#131314] border-[#282a2c] hover:bg-red-950/30 text-[#8e918f] hover:text-red-400'
                        : 'bg-[#f8fafd] border-[#e0e3e7] hover:bg-red-50 text-[#5e5e5e] hover:text-red-600'
                    }`}
                    title="Clear conversation turns"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right Controls: Shortcut Hint & Run / Stop Button */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono opacity-50 hidden lg:inline">
                  Ctrl + ↵ to run
                </span>

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={onStopGenerating}
                    className="px-4 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="btn-run-prompt-submit"
                    onClick={handleSend}
                    disabled={!inputText.trim() && attachments.length === 0}
                    className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:pointer-events-none text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChatMessageTurnProps {
  message: ChatMessage;
  isDark: boolean;
  copiedId: string | null;
  onCopy: (text: string) => void;
  onDelete: () => void;
  onRegenerate: () => void;
}

const ChatMessageTurn: React.FC<ChatMessageTurnProps> = ({
  message,
  isDark,
  copiedId,
  onCopy,
  onDelete,
  onRegenerate,
}) => {
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const isUser = message.role === 'user';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
        isUser
          ? isDark
            ? 'bg-[#18191a] border-[#2c2d2e]'
            : 'bg-[#f8fafd] border-[#e0e3e7]'
          : isDark
          ? 'bg-[#1e1f20] border-[#282a2c] shadow-2xs'
          : 'bg-[#ffffff] border-[#e0e3e7] shadow-2xs'
      }`}
    >
      {/* Header with Role and Metrics */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-current/10">
        <div className="flex items-center gap-2">
          {isUser ? (
            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 font-semibold text-xs flex items-center justify-center">
              U
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#1a73e8] via-[#8ab4f8] to-[#d96570] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          )}
          <span className="font-semibold text-xs sm:text-sm">{isUser ? 'User' : 'Model'}</span>
          {!isUser && message.tokenCount && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono opacity-60">
              <span>·</span>
              <span>{message.tokenCount} tokens</span>
              {message.elapsedMs && <span>· {message.elapsedMs}ms</span>}
            </div>
          )}
        </div>

        {/* Message Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onCopy(message.text)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
            }`}
            title="Copy content"
          >
            {copiedId === message.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {!isUser && (
            <button
              onClick={onRegenerate}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
              }`}
              title="Regenerate model response"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onDelete}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-red-950/30 hover:text-red-400 text-[#8e918f]' : 'hover:bg-red-50 hover:text-red-600 text-[#8e918f]'
            }`}
            title="Delete turn"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* User Multimodal Attachments */}
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {message.attachments.map((att) => (
            <div
              key={att.id}
              className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-xs ${
                isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
              }`}
            >
              {att.type === 'image' ? (
                <img src={att.data} alt={att.name} className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <FileText className="w-5 h-5 text-blue-500 ml-1" />
              )}
              <div>
                <div className="font-semibold text-xs truncate max-w-[180px]">{att.name}</div>
                <div className="text-[10px] opacity-60 font-mono">{(att.size / 1024).toFixed(1)} KB</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Model Reasoning / Thinking Process Accordion */}
      {!isUser && message.thinking && (
        <div
          className={`mb-4 rounded-xl border p-2.5 transition-colors ${
            isDark ? 'bg-[#131314] border-purple-900/40 text-purple-200' : 'bg-purple-50/70 border-purple-200 text-purple-900'
          }`}
        >
          <div
            onClick={() => setIsThinkingOpen(!isThinkingOpen)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Brain className="w-3.5 h-3.5 text-purple-400" />
              <span>Thinking Process</span>
              <span className="text-[10px] font-mono opacity-70">
                ({message.thinking.split('\n').length} reasoning steps)
              </span>
            </div>
            {isThinkingOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>

          {isThinkingOpen && (
            <div className="pt-2 text-xs font-mono whitespace-pre-wrap leading-relaxed opacity-90 border-t border-purple-500/20 mt-2">
              {message.thinking}
            </div>
          )}
        </div>
      )}

      {/* Python Code Execution Output Sandbox Box */}
      {!isUser && message.codeExecution && (
        <div
          className={`mb-4 rounded-xl border overflow-hidden ${
            isDark ? 'bg-[#131314] border-emerald-900/50' : 'bg-emerald-50/50 border-emerald-300'
          }`}
        >
          <div className="px-3 py-1.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>Python Code Sandbox Execution</span>
            </div>
            <span className="text-[10px] font-mono opacity-70">Executed</span>
          </div>
          <div className="p-3 text-xs font-mono space-y-2">
            <div className="text-neutral-400">{message.codeExecution.code}</div>
            <div className="p-2 rounded bg-black text-emerald-400 text-[11px] whitespace-pre-wrap">
              {message.codeExecution.output}
            </div>
          </div>
        </div>
      )}

      {/* Main Message Text (Markdown Rendered) */}
      <div className="text-xs sm:text-sm leading-relaxed prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeString = String(children).replace(/\n$/, '');
              const isInline = !match && !String(children).includes('\n');

              if (isInline) {
                return (
                  <code
                    className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono text-[11px] text-blue-500"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="relative my-3 rounded-xl overflow-hidden border border-[#37393b]">
                  <div className="px-3 py-1.5 bg-[#282a2c] flex items-center justify-between text-[11px] font-mono text-neutral-300">
                    <span>{match ? match[1] : 'code'}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(codeString)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-[#131314] overflow-x-auto text-xs font-mono text-neutral-200 leading-relaxed">
                    <code>{codeString}</code>
                  </pre>
                </div>
              );
            },
          }}
        >
          {message.text}
        </ReactMarkdown>
      </div>

      {/* Google Search Grounding Sources */}
      {!isUser && message.groundingSources && message.groundingSources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-current/10 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-500">
            <Search className="w-3.5 h-3.5" />
            <span>Search Grounding Citations</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {message.groundingSources.map((source, idx) => (
              <a
                key={idx}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-xl border text-xs flex items-start gap-2 transition-all ${
                  isDark
                    ? 'bg-[#131314] border-[#282a2c] hover:border-blue-500/50'
                    : 'bg-white border-[#e0e3e7] hover:border-blue-500/50'
                }`}
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-xs truncate">{source.title}</div>
                  <div className="text-[10px] opacity-60 truncate font-mono">{source.url}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

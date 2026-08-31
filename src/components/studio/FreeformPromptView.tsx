import React, { useState, useRef } from 'react';
import {
  Layers,
  Sparkles,
  Play,
  Plus,
  Image as ImageIcon,
  FileText,
  Copy,
  Check,
  RotateCcw,
  StopCircle,
  Brain,
  Upload,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ThemeMode, StudioParameters } from '../../types/aistudio';

interface FreeformPromptViewProps {
  systemInstruction: string;
  onChangeSystemInstruction: (val: string) => void;
  parameters: StudioParameters;
  themeMode: ThemeMode;
}

export const FreeformPromptView: React.FC<FreeformPromptViewProps> = ({
  systemInstruction,
  onChangeSystemInstruction,
  parameters,
  themeMode,
}) => {
  const [content, setContent] = useState(
    '### Analyze the following system architecture and propose 3 critical improvements:\n\n1. API Gateway with Rate Limiting\n2. Postgres Cloud SQL Primary-Replica cluster\n3. Redis Cache layer for session state and hot product queries\n4. Worker pool for asynchronous PDF export generation\n\nWhat are potential single points of failure?'
  );
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = themeMode === 'dark';

  const handleRun = async () => {
    if (!content.trim() || isRunning) return;
    setIsRunning(true);
    setOutput('');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          systemInstruction,
          model: parameters.model,
          temperature: parameters.temperature,
          topP: parameters.topP,
          topK: parameters.topK,
          maxOutputTokens: parameters.maxOutputTokens,
          enableSearch: parameters.enableSearch,
          enableCodeExecution: parameters.enableCodeExecution,
          mode: 'freeform',
        }),
      });
      const data = await res.json();
      setOutput(data.text || 'No response received.');
    } catch (err: any) {
      setOutput(`Error generating output: ${err?.message || 'Server error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleInsertMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setContent((prev) => `${prev}\n\n![${file.name}](${dataUrl})\n`);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4 sm:p-6 max-w-5xl w-full mx-auto space-y-4">
      {/* Top Controls Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-semibold">Freeform Scratchpad</h2>
            <p className="text-[11px] opacity-60">Interleave text, multimodal media, and test inputs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleInsertMedia}
            className="hidden"
            accept="image/*,audio/*,application/pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-[#1e1f20] border-[#282a2c] hover:bg-[#282a2c]' : 'bg-white border-[#e0e3e7] hover:bg-[#f0f4f9]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Insert media</span>
          </button>

          {isRunning ? (
            <button
              onClick={() => setIsRunning(false)}
              className="px-4 py-1.5 rounded-xl bg-red-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Run (Ctrl+Enter)</span>
            </button>
          )}
        </div>
      </div>

      {/* System Instructions Input */}
      <div
        className={`p-3 rounded-2xl border ${
          isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
        }`}
      >
        <div className="flex items-center gap-2 pb-2 text-xs font-semibold text-purple-400">
          <Brain className="w-3.5 h-3.5" />
          <span>System Instructions</span>
        </div>
        <textarea
          value={systemInstruction}
          onChange={(e) => onChangeSystemInstruction(e.target.value)}
          placeholder="System instructions to guide response formatting and tone..."
          rows={2}
          className={`w-full p-2 text-xs rounded-xl border outline-hidden resize-y ${
            isDark ? 'bg-[#131314] border-[#37393b] text-white' : 'bg-[#f8fafd] border-[#c4c7c5] text-black'
          }`}
        />
      </div>

      {/* Main Freeform Text Area & Live Output Split */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {/* Left: Input Document Editor */}
        <div
          className={`flex flex-col rounded-2xl border p-3 ${
            isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-current/10 text-xs font-semibold">
            <span>Prompt Content & Media</span>
            <span className="text-[10px] font-mono opacity-50">{content.length} chars</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                handleRun();
              }
            }}
            placeholder="Enter prompt text, paste markdown, or insert multimodal media..."
            className="flex-1 w-full p-2 text-xs sm:text-sm bg-transparent outline-hidden resize-none leading-relaxed font-mono mt-2"
          />
        </div>

        {/* Right: Model Output Preview Canvas */}
        <div
          className={`flex flex-col rounded-2xl border p-3 overflow-hidden ${
            isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-current/10 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Model Output</span>
            </div>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] hover:text-blue-500"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 text-xs sm:text-sm leading-relaxed prose dark:prose-invert max-w-none">
            {isRunning ? (
              <div className="flex items-center gap-2 text-blue-500 animate-pulse pt-4">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Generating response...</span>
              </div>
            ) : output ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
            ) : (
              <div className="text-center py-12 opacity-40 text-xs font-mono">
                Click "Run" to test model generation on this scratchpad.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

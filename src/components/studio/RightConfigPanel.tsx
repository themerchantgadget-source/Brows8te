import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Search,
  Code2,
  FileCode,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Info,
  X,
  Plus,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { StudioParameters, ThemeMode, SafetyThreshold } from '../../types/aistudio';
import { GEMINI_MODELS } from '../../constants/models';

interface RightConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
  parameters: StudioParameters;
  onChangeParameters: (params: Partial<StudioParameters>) => void;
  themeMode: ThemeMode;
}

export const RightConfigPanel: React.FC<RightConfigPanelProps> = ({
  isOpen,
  onClose,
  parameters,
  onChangeParameters,
  themeMode,
}) => {
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [stopSeqInput, setStopSeqInput] = useState('');

  const isDark = themeMode === 'dark';
  const activeModel = GEMINI_MODELS.find((m) => m.id === parameters.model) || GEMINI_MODELS[0];

  if (!isOpen) return null;

  const handleAddStopSequence = () => {
    if (!stopSeqInput.trim()) return;
    if (!parameters.stopSequences.includes(stopSeqInput.trim())) {
      onChangeParameters({
        stopSequences: [...parameters.stopSequences, stopSeqInput.trim()],
      });
    }
    setStopSeqInput('');
  };

  const handleRemoveStopSequence = (seq: string) => {
    onChangeParameters({
      stopSequences: parameters.stopSequences.filter((s) => s !== seq),
    });
  };

  return (
    <aside
      id="aistudio-right-config-panel"
      className={`fixed lg:static inset-y-0 right-0 z-30 w-80 h-[calc(100vh-3.5rem)] border-l flex flex-col justify-between select-none overflow-y-auto transition-all duration-200 ${
        isDark
          ? 'bg-[#1e1f20] border-[#282a2c] text-[#e3e3e3]'
          : 'bg-[#f8fafd] border-[#e0e3e7] text-[#1f1f1f]'
      }`}
    >
      <div className="p-4 space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-current/10">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Sliders className="w-4 h-4 text-blue-500" />
            <span>Model Parameters</span>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Model Card */}
        <div
          className={`p-3 rounded-xl border space-y-2 ${
            isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>{activeModel.name}</span>
            </div>
            {activeModel.badge && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-mono font-medium">
                {activeModel.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] opacity-70 leading-relaxed">{activeModel.description}</p>
          <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#8e918f]">
            <span>Context: {(activeModel.contextWindow / 1000).toLocaleString()}k tokens</span>
            <span>Max Out: {activeModel.maxOutputTokens}</span>
          </div>
        </div>

        {/* Temperature Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-medium flex items-center gap-1">
              <span>Temperature</span>
              <span className="text-[10px] opacity-60" title="Higher values make output more random, lower values more deterministic.">
                <HelpCircle className="w-3 h-3 inline" />
              </span>
            </label>
            <span className="font-mono text-blue-500 font-semibold">{parameters.temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="2"
            step="0.05"
            value={parameters.temperature}
            onChange={(e) => onChangeParameters({ temperature: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] opacity-50 font-mono">
            <span>Precise (0.0)</span>
            <span>Creative (2.0)</span>
          </div>
        </div>

        {/* Top P Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-medium flex items-center gap-1">
              <span>Top P (Nucleus Sampling)</span>
            </label>
            <span className="font-mono text-blue-500 font-semibold">{parameters.topP.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={parameters.topP}
            onChange={(e) => onChangeParameters({ topP: parseFloat(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Top K Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-medium">Top K</label>
            <span className="font-mono text-blue-500 font-semibold">{parameters.topK}</span>
          </div>
          <input
            type="range"
            min="1"
            max="40"
            step="1"
            value={parameters.topK}
            onChange={(e) => onChangeParameters({ topK: parseInt(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Output Token Limit */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-medium">Output Token Limit</label>
            <span className="font-mono text-blue-500 font-semibold">{parameters.maxOutputTokens}</span>
          </div>
          <input
            type="range"
            min="64"
            max={activeModel.maxOutputTokens}
            step="64"
            value={parameters.maxOutputTokens}
            onChange={(e) => onChangeParameters({ maxOutputTokens: parseInt(e.target.value) })}
            className="w-full accent-blue-500 h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg cursor-pointer"
          />
        </div>

        {/* Thinking Budget Level (for reasoning models) */}
        {activeModel.supportsThinking && (
          <div className="space-y-2 pt-2 border-t border-current/10">
            <div className="flex items-center justify-between">
              <label className="font-medium flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Thinking Budget</span>
              </label>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">
                {parameters.thinkingLevel || 'AUTO'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['LOW', 'HIGH', 'MINIMAL'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => onChangeParameters({ thinkingLevel: lvl })}
                  className={`py-1 rounded-lg border text-[11px] font-medium transition-all ${
                    parameters.thinkingLevel === lvl
                      ? isDark
                        ? 'bg-purple-950/50 border-purple-500 text-purple-300'
                        : 'bg-purple-50 border-purple-500 text-purple-700'
                      : isDark
                      ? 'bg-[#131314] border-[#282a2c] hover:bg-[#282a2c]'
                      : 'bg-white border-[#e0e3e7] hover:bg-[#f0f4f9]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Advanced Tools Section */}
        <div className="space-y-3 pt-2 border-t border-current/10">
          <div className="flex items-center justify-between font-semibold">
            <span>Tools & Grounding</span>
          </div>

          {/* Google Search Grounding Toggle */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              parameters.enableSearch
                ? isDark
                  ? 'bg-blue-950/20 border-blue-500/40'
                  : 'bg-blue-50 border-blue-300'
                : isDark
                ? 'bg-[#131314] border-[#282a2c]'
                : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-500/10 text-blue-500">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">Google Search</div>
                <div className="text-[10px] opacity-60">Ground model with real-time web results</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={parameters.enableSearch}
              onChange={(e) => onChangeParameters({ enableSearch: e.target.checked })}
              className="w-4 h-4 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Code Execution Toggle */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              parameters.enableCodeExecution
                ? isDark
                  ? 'bg-emerald-950/20 border-emerald-500/40'
                  : 'bg-emerald-50 border-emerald-300'
                : isDark
                ? 'bg-[#131314] border-[#282a2c]'
                : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">Code Execution</div>
                <div className="text-[10px] opacity-60">Run Python code in isolated sandbox</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={parameters.enableCodeExecution}
              onChange={(e) => onChangeParameters({ enableCodeExecution: e.target.checked })}
              className="w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Structured Outputs (JSON Schema) */}
          <div
            className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
              parameters.enableStructuredOutput
                ? isDark
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-amber-50 border-amber-300'
                : isDark
                ? 'bg-[#131314] border-[#282a2c]'
                : 'bg-white border-[#e0e3e7]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-500">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-xs">Structured JSON Output</div>
                <div className="text-[10px] opacity-60">Enforce schema-compliant responses</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={parameters.enableStructuredOutput}
              onChange={(e) => onChangeParameters({ enableStructuredOutput: e.target.checked })}
              className="w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Stop Sequences */}
        <div className="space-y-2 pt-2 border-t border-current/10">
          <label className="font-medium">Stop Sequences</label>
          <div className="flex gap-1.5">
            <input
              type="text"
              placeholder="e.g. STOP or END"
              value={stopSeqInput}
              onChange={(e) => setStopSeqInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddStopSequence();
              }}
              className={`flex-1 px-2.5 py-1 text-xs rounded-lg border outline-hidden ${
                isDark
                  ? 'bg-[#131314] border-[#282a2c] text-white focus:border-[#8ab4f8]'
                  : 'bg-white border-[#e0e3e7] text-black focus:border-[#1a73e8]'
              }`}
            />
            <button
              onClick={handleAddStopSequence}
              className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                isDark ? 'bg-[#282a2c] border-[#37393b] hover:bg-[#37393b]' : 'bg-[#f0f4f9] border-[#c4c7c5]'
              }`}
            >
              Add
            </button>
          </div>

          {parameters.stopSequences.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {parameters.stopSequences.map((seq) => (
                <span
                  key={seq}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 font-mono text-[11px]"
                >
                  <span>{seq}</span>
                  <button onClick={() => handleRemoveStopSequence(seq)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Safety Settings Accordion */}
        <div className="space-y-2 pt-2 border-t border-current/10">
          <button
            onClick={() => setIsSafetyOpen(!isSafetyOpen)}
            className="w-full flex items-center justify-between font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
              <span>Safety Settings</span>
            </div>
            {isSafetyOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {isSafetyOpen && (
            <div className="space-y-3 pt-2 text-[11px]">
              {(['harassment', 'hateSpeech', 'sexuallyExplicit', 'dangerousContent'] as const).map((cat) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between font-medium capitalize">
                    <span>{cat.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-mono text-orange-400">{parameters.safetySettings[cat]}</span>
                  </div>
                  <select
                    value={parameters.safetySettings[cat]}
                    onChange={(e) =>
                      onChangeParameters({
                        safetySettings: {
                          ...parameters.safetySettings,
                          [cat]: e.target.value as SafetyThreshold,
                        },
                      })
                    }
                    className={`w-full p-1.5 rounded-lg border text-xs outline-hidden ${
                      isDark
                        ? 'bg-[#131314] border-[#282a2c] text-white'
                        : 'bg-white border-[#e0e3e7] text-black'
                    }`}
                  >
                    <option value="BLOCK_NONE">Block None</option>
                    <option value="BLOCK_FEW">Block Few</option>
                    <option value="BLOCK_SOME">Block Some (Default)</option>
                    <option value="BLOCK_MOST">Block Most</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

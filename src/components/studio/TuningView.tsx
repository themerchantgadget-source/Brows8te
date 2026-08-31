import React, { useState } from 'react';
import {
  Zap,
  Sparkles,
  Upload,
  FileCheck,
  Play,
  CheckCircle2,
  Sliders,
  TrendingDown,
  Layers,
  Database,
} from 'lucide-react';
import { ThemeMode } from '../../types/aistudio';

interface TuningViewProps {
  themeMode: ThemeMode;
}

export const TuningView: React.FC<TuningViewProps> = ({ themeMode }) => {
  const [modelName, setModelName] = useState('My Custom Customer Support Model');
  const [baseModel, setBaseModel] = useState('gemini-3.7-flash');
  const [epochs, setEpochs] = useState(4);
  const [learningRate, setLearningRate] = useState(1.0);
  const [batchSize, setBatchSize] = useState(16);
  const [isTraining, setIsTraining] = useState(false);
  const [trainProgress, setTrainProgress] = useState(0);
  const [isTrained, setIsTrained] = useState(false);

  const isDark = themeMode === 'dark';

  const handleStartTuning = () => {
    setIsTraining(true);
    setTrainProgress(0);
    setIsTrained(false);

    const interval = setInterval(() => {
      setTrainProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          setIsTrained(true);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-semibold">Gemini Model Tuning Studio</h2>
          <p className="text-xs opacity-60">
            Create custom adapter weights for specialized domain tasks and style transfer
          </p>
        </div>
      </div>

      {/* Configuration Card */}
      <div
        className={`p-5 rounded-2xl border space-y-5 ${
          isDark ? 'bg-[#1e1f20] border-[#282a2c]' : 'bg-white border-[#e0e3e7]'
        }`}
      >
        {/* Tuned Model Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Tuned Model Display Name</label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className={`w-full p-2.5 text-xs rounded-xl border outline-hidden ${
              isDark ? 'bg-[#131314] border-[#37393b] text-white' : 'bg-[#f8fafd] border-[#c4c7c5] text-black'
            }`}
          />
        </div>

        {/* Base Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Base Foundation Model</label>
          <select
            value={baseModel}
            onChange={(e) => setBaseModel(e.target.value)}
            className={`w-full p-2.5 text-xs rounded-xl border outline-hidden ${
              isDark ? 'bg-[#131314] border-[#37393b] text-white' : 'bg-[#f8fafd] border-[#c4c7c5] text-black'
            }`}
          >
            <option value="gemini-3.7-flash">Gemini 3.7 Flash (Fast, multimodal, high efficiency)</option>
            <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Deep reasoning, complex STEM)</option>
          </select>
        </div>

        {/* Dataset Upload Sandbox */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold">Training Dataset (JSONL / CSV / Google Cloud Storage)</label>
          <div
            className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center space-y-2 cursor-pointer ${
              isDark ? 'border-[#37393b] bg-[#131314]/50' : 'border-[#c4c7c5] bg-[#f8fafd]'
            }`}
          >
            <Database className="w-8 h-8 text-blue-500" />
            <div className="text-xs font-medium">
              Drag & drop training files or <span className="text-blue-500 underline">browse</span>
            </div>
            <div className="text-[11px] opacity-60">
              Format: {`{"messages": [{"role": "user", "parts": [...]}, {"role": "model", "parts": [...]}]}`}
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              sample_customer_support_dataset.jsonl (1,420 rows validated)
            </span>
          </div>
        </div>

        {/* Hyperparameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold">Epochs ({epochs})</label>
            <input
              type="range"
              min="1"
              max="10"
              value={epochs}
              onChange={(e) => setEpochs(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Batch Size ({batchSize})</label>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold">Learning Rate Multiplier ({learningRate}x)</label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={learningRate}
              onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Training Progress Bar */}
        {isTraining && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span>Training in progress... (Epoch 3/4)</span>
              <span>{trainProgress}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${trainProgress}%` }}
              />
            </div>
          </div>
        )}

        {isTrained && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Model tuning complete! Your endpoint `tunedModels/{modelName.toLowerCase().replace(/\s+/g, '-')}` is ready in AI Studio.
            </span>
          </div>
        )}

        {/* Start Button */}
        <div className="flex justify-end pt-3">
          <button
            onClick={handleStartTuning}
            disabled={isTraining}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-all"
          >
            <Play className="w-4 h-4" />
            <span>{isTraining ? 'Tuning Model...' : 'Start Tuning Job'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

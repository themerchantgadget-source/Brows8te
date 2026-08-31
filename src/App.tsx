import React, { useState, useEffect } from 'react';
import { TopNavBar } from './components/studio/TopNavBar';
import { LeftSidebar } from './components/studio/LeftSidebar';
import { RightConfigPanel } from './components/studio/RightConfigPanel';
import { ChatPromptView } from './components/studio/ChatPromptView';
import { FreeformPromptView } from './components/studio/FreeformPromptView';
import { StructuredPromptView } from './components/studio/StructuredPromptView';
import { TuningView } from './components/studio/TuningView';
import { GetCodeModal } from './components/studio/GetCodeModal';
import { ShareModal } from './components/studio/ShareModal';
import { ApiKeyModal } from './components/studio/ApiKeyModal';

import {
  StudioMode,
  ThemeMode,
  ChatMessage,
  Attachment,
  StudioParameters,
  PromptItem,
} from './types/aistudio';
import { INITIAL_PROMPTS } from './constants/defaultPrompts';
import { GEMINI_MODELS } from './constants/models';

export function App() {
  // Theme state: default to 'light' (white mode)
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  // Active prompt workspace state
  const [prompts, setPrompts] = useState<PromptItem[]>(INITIAL_PROMPTS);
  const [activePromptId, setActivePromptId] = useState<string>(INITIAL_PROMPTS[0].id);
  const [promptTitle, setPromptTitle] = useState<string>(INITIAL_PROMPTS[0].title);
  const [mode, setMode] = useState<StudioMode>('chat');
  const [systemInstruction, setSystemInstruction] = useState<string>(
    INITIAL_PROMPTS[0].systemInstruction || ''
  );

  // Chat conversation turns
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'user',
      text: 'Hello Gemini! What are your key capabilities and how can you help me build full-stack applications?',
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    {
      id: 'msg-2',
      role: 'model',
      text: `Hello! I am **Gemini 3.7 Flash**, Google's multimodal frontier model.

### Key Capabilities:
- 🧠 **Dynamic Thinking & Reasoning**: Deep mathematical logic, architectural code generation, and step-by-step problem breakdown.
- ⚡ **Lightning Fast Multimodal Understanding**: Native processing across text, high-resolution images, video, audio, and documents.
- 🔍 **Real-Time Google Search Grounding**: Live, citation-backed web queries with verifiable source attribution.
- 🐍 **Sandboxed Code Execution**: Instant Python execution and algorithmic verification.
- 📚 **1M+ Token Context Window**: Process entire code repositories, hours of video, or comprehensive technical documentation in a single prompt.

How can we accelerate your development today? Feel free to ask technical questions, upload design mockups, or write Python scripts!`,
      timestamp: Date.now() - 1000 * 60 * 4,
      tokenCount: 168,
      elapsedMs: 340,
      thinking: 'Analyzed user query asking for Gemini capabilities.\nStructured reply highlighting multimodal processing, search grounding, Python sandbox, and context window length.\nFormatted with Markdown lists for clarity.',
    },
  ]);

  // Model parameters state
  const [parameters, setParameters] = useState<StudioParameters>({
    model: 'gemini-3.7-flash',
    temperature: 1.0,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    thinkingLevel: 'HIGH',
    enableSearch: false,
    enableCodeExecution: false,
    enableStructuredOutput: false,
    stopSequences: [],
    safetySettings: {
      harassment: 'BLOCK_SOME',
      hateSpeech: 'BLOCK_SOME',
      sexuallyExplicit: 'BLOCK_SOME',
      dangerousContent: 'BLOCK_SOME',
    },
  });

  // UI layout toggles
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Modals state
  const [isGetCodeOpen, setIsGetCodeOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Apply dark mode class to root document
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Calculate approximate total token count in current prompt session
  const totalTokensCount =
    systemInstruction.length / 4 +
    messages.reduce((acc, m) => acc + m.text.length / 4, 0);

  // Handle switching prompt items from left sidebar
  const handleSelectPrompt = (prompt: PromptItem) => {
    setActivePromptId(prompt.id);
    setPromptTitle(prompt.title);
    setMode(prompt.mode);
    setSystemInstruction(prompt.systemInstruction || '');
    if (prompt.model) {
      setParameters((prev) => ({ ...prev, model: prompt.model }));
    }
  };

  // Create brand new prompt
  const handleCreateNewPrompt = (newMode: StudioMode) => {
    const newId = `prompt-${Date.now()}`;
    const newTitle = `Untitled ${
      newMode === 'chat' ? 'Chat' : newMode === 'freeform' ? 'Freeform' : 'Structured'
    } prompt`;

    const newPromptItem: PromptItem = {
      id: newId,
      title: newTitle,
      mode: newMode,
      model: parameters.model,
      updatedAt: Date.now(),
      systemInstruction: '',
      isPinned: false,
      messagesCount: 0,
    };

    setPrompts([newPromptItem, ...prompts]);
    setActivePromptId(newId);
    setPromptTitle(newTitle);
    setMode(newMode);
    setSystemInstruction('');
    setMessages([]);
  };

  // Duplicate prompt
  const handleDuplicatePrompt = (prompt: PromptItem) => {
    const newId = `prompt-${Date.now()}`;
    const duplicated: PromptItem = {
      ...prompt,
      id: newId,
      title: `${prompt.title} (Copy)`,
      updatedAt: Date.now(),
      isPinned: false,
    };
    setPrompts([duplicated, ...prompts]);
    setActivePromptId(newId);
    setPromptTitle(duplicated.title);
  };

  // Delete prompt
  const handleDeletePrompt = (id: string) => {
    const remaining = prompts.filter((p) => p.id !== id);
    setPrompts(remaining);
    if (activePromptId === id && remaining.length > 0) {
      handleSelectPrompt(remaining[0]);
    }
  };

  // Toggle pin
  const handleTogglePinPrompt = (id: string) => {
    setPrompts(
      prompts.map((p) => (p.id === id ? { ...p, isPinned: !p.isPinned } : p))
    );
  };

  // Send message in Chat Mode (Calls backend Express API with Gemini SDK)
  const handleSendMessage = async (text: string, attachments: Attachment[]) => {
    if ((!text.trim() && attachments.length === 0) || isGenerating) return;

    const userMessageId = `msg-user-${Date.now()}`;
    const newUserMessage: ChatMessage = {
      id: userMessageId,
      role: 'user',
      text: text.trim(),
      attachments,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    const startTime = Date.now();

    try {
      // Build conversation history payload for backend
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: historyPayload,
          systemInstruction,
          model: parameters.model,
          temperature: parameters.temperature,
          topP: parameters.topP,
          topK: parameters.topK,
          maxOutputTokens: parameters.maxOutputTokens,
          enableSearch: parameters.enableSearch,
          enableCodeExecution: parameters.enableCodeExecution,
          mode: 'chat',
        }),
        signal: controller.signal,
      });

      const data = await res.json();
      const elapsedMs = Date.now() - startTime;

      const modelMessageId = `msg-model-${Date.now()}`;
      const newModelMessage: ChatMessage = {
        id: modelMessageId,
        role: 'model',
        text: data.text || 'No response text received from model.',
        timestamp: Date.now(),
        tokenCount: Math.round((data.text?.length || 20) / 4),
        elapsedMs,
        thinking: data.thinking,
        groundingSources: data.groundingSources,
        codeExecution: data.codeExecution,
      };

      setMessages((prev) => [...prev, newModelMessage]);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const errorMessageId = `msg-err-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: errorMessageId,
            role: 'model',
            text: `⚠️ **Error generating content**: ${
              err?.message || 'Failed to communicate with Gemini API'
            }`,
            timestamp: Date.now(),
          },
        ]);
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleStopGenerating = () => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleRegenerate = () => {
    if (messages.length === 0 || isGenerating) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;
    const targetIndex = messages.length - 1 - lastUserIndex;
    const userMessage = messages[targetIndex];
    // Trim history up to the user message
    const trimmed = messages.slice(0, targetIndex);
    setMessages(trimmed);
    handleSendMessage(userMessage.text, userMessage.attachments || []);
  };

  const handleDeleteMessage = (id: string) => {
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div
      id="aistudio-root-container"
      className={`w-full h-screen flex flex-col font-sans select-none overflow-hidden transition-colors duration-200 ${
        themeMode === 'dark'
          ? 'bg-[#131314] text-[#e3e3e3]'
          : 'bg-[#ffffff] text-[#1f1f1f]'
      }`}
    >
      {/* Top Application Bar */}
      <TopNavBar
        mode={mode}
        onSelectMode={setMode}
        promptTitle={promptTitle}
        onChangePromptTitle={setPromptTitle}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isConfigOpen={isConfigOpen}
        onToggleConfig={() => setIsConfigOpen(!isConfigOpen)}
        parameters={parameters}
        onChangeParameters={(params) => setParameters((prev) => ({ ...prev, ...params }))}
        onOpenGetCode={() => setIsGetCodeOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onRunPrompt={() => {}}
        onClearPrompt={handleClearHistory}
        isGenerating={isGenerating}
        totalTokensCount={Math.round(totalTokensCount)}
      />

      {/* Main Studio Split Layout */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {/* Left Library Sidebar */}
        <LeftSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          prompts={prompts}
          activePromptId={activePromptId}
          onSelectPrompt={handleSelectPrompt}
          onCreateNewPrompt={handleCreateNewPrompt}
          onDeletePrompt={handleDeletePrompt}
          onTogglePinPrompt={handleTogglePinPrompt}
          onDuplicatePrompt={handleDuplicatePrompt}
          onOpenApiKey={() => setIsApiKeyOpen(true)}
          themeMode={themeMode}
        />

        {/* Center Prompt Canvas */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {mode === 'chat' && (
            <ChatPromptView
              messages={messages}
              systemInstruction={systemInstruction}
              onChangeSystemInstruction={setSystemInstruction}
              onSendMessage={handleSendMessage}
              onRegenerate={handleRegenerate}
              onDeleteMessage={handleDeleteMessage}
              onClearHistory={handleClearHistory}
              isGenerating={isGenerating}
              onStopGenerating={handleStopGenerating}
              parameters={parameters}
              onChangeParameters={(params) =>
                setParameters((prev) => ({ ...prev, ...params }))
              }
              themeMode={themeMode}
            />
          )}

          {mode === 'freeform' && (
            <FreeformPromptView
              systemInstruction={systemInstruction}
              onChangeSystemInstruction={setSystemInstruction}
              parameters={parameters}
              themeMode={themeMode}
            />
          )}

          {mode === 'structured' && (
            <StructuredPromptView
              systemInstruction={systemInstruction}
              onChangeSystemInstruction={setSystemInstruction}
              parameters={parameters}
              themeMode={themeMode}
            />
          )}

          {mode === 'tuning' && <TuningView themeMode={themeMode} />}
        </main>

        {/* Right Model Parameters Panel */}
        <RightConfigPanel
          isOpen={isConfigOpen}
          onClose={() => setIsConfigOpen(false)}
          parameters={parameters}
          onChangeParameters={(params) =>
            setParameters((prev) => ({ ...prev, ...params }))
          }
          themeMode={themeMode}
        />
      </div>

      {/* Interactive Modals */}
      <GetCodeModal
        isOpen={isGetCodeOpen}
        onClose={() => setIsGetCodeOpen(false)}
        mode={mode}
        systemInstruction={systemInstruction}
        messages={messages}
        parameters={parameters}
        themeMode={themeMode}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        promptTitle={promptTitle}
        themeMode={themeMode}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        themeMode={themeMode}
      />
    </div>
  );
}

export default App;

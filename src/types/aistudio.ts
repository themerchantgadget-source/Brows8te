export type StudioMode = 'chat' | 'freeform' | 'structured' | 'tuning';

export type ThemeMode = 'dark' | 'light';

export interface ModelSpec {
  id: string;
  name: string;
  category: string;
  description: string;
  contextWindow: number; // e.g. 1048576 or 2097152
  maxOutputTokens: number;
  supportsThinking?: boolean;
  supportsSearch?: boolean;
  supportsCodeExecution?: boolean;
  supportsVision?: boolean;
  supportsAudio?: boolean;
  badge?: string;
  recommended?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  data: string; // base64 or preview url
  type: 'image' | 'audio' | 'video' | 'file';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: number;
  attachments?: Attachment[];
  thinking?: string | null;
  thinkingTimeMs?: number;
  tokenCount?: number;
  elapsedMs?: number;
  groundingSources?: Array<{ title: string; url: string; snippet?: string }>;
  codeExecution?: {
    code: string;
    output: string;
  } | null;
  error?: string;
  isStreaming?: boolean;
}

export interface StructuredRow {
  id: string;
  inputs: Record<string, string>;
  output: string;
  testStatus?: 'idle' | 'running' | 'success' | 'error';
  testedOutput?: string;
}

export interface StructuredColumn {
  id: string;
  name: string;
  type: 'input' | 'output';
}

export interface PromptItem {
  id: string;
  title: string;
  mode: StudioMode;
  model: string;
  updatedAt: number;
  systemInstruction?: string;
  isPinned?: boolean;
  messagesCount?: number;
  description?: string;
}

export type SafetyThreshold = 'BLOCK_NONE' | 'BLOCK_FEW' | 'BLOCK_SOME' | 'BLOCK_MOST';

export interface SafetySettings {
  harassment: SafetyThreshold;
  hateSpeech: SafetyThreshold;
  sexuallyExplicit: SafetyThreshold;
  dangerousContent: SafetyThreshold;
}

export interface StudioParameters {
  model: string;
  temperature: number;
  topP: number;
  topK: number;
  maxOutputTokens: number;
  thinkingLevel?: 'LOW' | 'HIGH' | 'MINIMAL';
  enableSearch: boolean;
  enableCodeExecution: boolean;
  enableStructuredOutput: boolean;
  jsonSchemaText?: string;
  stopSequences: string[];
  safetySettings: SafetySettings;
}

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Code2,
  FileCode,
  Terminal,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import {
  ChatMessage,
  StudioParameters,
  ThemeMode,
  StudioMode,
} from '../../types/aistudio';

interface GetCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: StudioMode;
  systemInstruction: string;
  messages: ChatMessage[];
  parameters: StudioParameters;
  themeMode: ThemeMode;
}

type CodeTab = 'python' | 'javascript' | 'curl' | 'swift' | 'kotlin';

export const GetCodeModal: React.FC<GetCodeModalProps> = ({
  isOpen,
  onClose,
  mode,
  systemInstruction,
  messages,
  parameters,
  themeMode,
}) => {
  const [activeTab, setActiveTab] = useState<CodeTab>('python');
  const [copied, setCopied] = useState(false);

  const isDark = themeMode === 'dark';

  if (!isOpen) return null;

  const promptText =
    messages.length > 0
      ? messages[messages.length - 1]?.text || 'Hello Gemini'
      : 'Hello Gemini';

  const generateCode = (): { code: string; installGuide: string } => {
    switch (activeTab) {
      case 'python':
        return {
          installGuide: 'pip install google-genai',
          code: `from google import genai
from google.genai import types

# Initialize client with GEMINI_API_KEY environment variable
client = genai.Client()

${
  parameters.enableSearch || parameters.enableCodeExecution
    ? `tools = [
${parameters.enableSearch ? '    types.Tool(google_search=types.GoogleSearch()),\n' : ''}${
        parameters.enableCodeExecution ? '    types.Tool(code_execution=types.CodeExecution()),\n' : ''
      }]`
    : ''
}
config = types.GenerateContentConfig(
    temperature=${parameters.temperature},
    top_p=${parameters.topP},
    top_k=${parameters.topK},
    max_output_tokens=${parameters.maxOutputTokens},
${systemInstruction ? `    system_instruction="${systemInstruction.replace(/"/g, '\\"')}",\n` : ''}${
            parameters.enableSearch || parameters.enableCodeExecution ? '    tools=tools,\n' : ''
          })

response = client.models.generate_content(
    model="${parameters.model}",
    contents="${promptText.replace(/"/g, '\\"')}",
    config=config,
)

print(response.text)
`,
        };

      case 'javascript':
        return {
          installGuide: 'npm install @google/genai',
          code: `import { GoogleGenAI } from "@google/genai";

// Initialize client (reads process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function main() {
  const response = await ai.models.generateContent({
    model: "${parameters.model}",
    contents: "${promptText.replace(/"/g, '\\"')}",
    config: {
      temperature: ${parameters.temperature},
      topP: ${parameters.topP},
      topK: ${parameters.topK},
      maxOutputTokens: ${parameters.maxOutputTokens},
${systemInstruction ? `      systemInstruction: "${systemInstruction.replace(/"/g, '\\"')}",\n` : ''}${
            parameters.enableSearch || parameters.enableCodeExecution
              ? `      tools: [
${parameters.enableSearch ? '        { googleSearch: {} },\n' : ''}${
                  parameters.enableCodeExecution ? '        { codeExecution: {} },\n' : ''
                }      ],\n`
              : ''
          }    },
  });

  console.log(response.text);
}

main().catch(console.error);
`,
        };

      case 'curl':
        return {
          installGuide: 'cURL is pre-installed on Linux and macOS',
          code: `curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/${parameters.model}:generateContent?key=$GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [{
      "parts": [{ "text": "${promptText.replace(/"/g, '\\"')}" }]
    }],
    "generationConfig": {
      "temperature": ${parameters.temperature},
      "topP": ${parameters.topP},
      "topK": ${parameters.topK},
      "maxOutputTokens": ${parameters.maxOutputTokens}
    }${
      systemInstruction
        ? `,\n    "systemInstruction": { "parts": [{ "text": "${systemInstruction.replace(/"/g, '\\"')}" }] }`
        : ''
    }
  }'
`,
        };

      case 'swift':
        return {
          installGuide: 'Add package via Swift Package Manager: google-genai-sdk-swift',
          code: `import GoogleGenAI

let ai = GoogleGenAI(apiKey: ProcessInfo.processInfo.environment["GEMINI_API_KEY"] ?? "")

Task {
    do {
        let response = try await ai.models.generateContent(
            model: "${parameters.model}",
            prompt: "${promptText.replace(/"/g, '\\"')}"
        )
        if let text = response.text {
            print(text)
        }
    } catch {
        print("Error: \\(error)")
    }
}
`,
        };

      case 'kotlin':
        return {
          installGuide: 'implementation("com.google.genai:google-genai:0.1.0")',
          code: `import com.google.genai.Client

suspend fun main() {
    val client = Client()
    
    val response = client.models.generateContent(
        model = "${parameters.model}",
        contents = "${promptText.replace(/"/g, '\\"')}"
    )
    
    println(response.text)
}
`,
        };
    }
  };

  const { code, installGuide } = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="modal-get-code"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all ${
          isDark
            ? 'bg-[#1e1f20] border-[#37393b] text-[#e3e3e3]'
            : 'bg-white border-[#e0e3e7] text-[#1f1f1f]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-current/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Get code snippet</h3>
              <p className="text-xs opacity-60">
                Production-ready SDK integration for {parameters.model}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-[#282a2c] text-[#c4c7c5]' : 'hover:bg-[#f0f4f9] text-[#444746]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className={`px-4 pt-3 flex items-center gap-1 border-b ${isDark ? 'border-[#282a2c]' : 'border-[#e0e3e7]'}`}>
          {(
            [
              { id: 'python', label: 'Python (google-genai)' },
              { id: 'javascript', label: 'Node / TypeScript' },
              { id: 'curl', label: 'cURL (REST)' },
              { id: 'swift', label: 'Swift' },
              { id: 'kotlin', label: 'Kotlin (Android)' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Package Installation Command Bar */}
        <div className={`px-4 py-2 text-xs font-mono flex items-center justify-between border-b ${
          isDark ? 'bg-[#131314] border-[#282a2c]' : 'bg-[#f8fafd] border-[#e0e3e7]'
        }`}>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-blue-500" />
            <span className="opacity-70">{installGuide}</span>
          </div>
          <a
            href="https://ai.google.dev/gemini-api/docs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline text-[11px]"
          >
            <BookOpen className="w-3 h-3" />
            <span>Docs</span>
          </a>
        </div>

        {/* Code Snippet Box */}
        <div className="p-4 flex-1 overflow-y-auto min-h-0 bg-[#131314]">
          <pre className="p-4 rounded-xl bg-[#0e0f10] border border-[#282a2c] text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDark ? 'border-[#282a2c]' : 'border-[#e0e3e7]'
        }`}>
          <div className="text-[11px] opacity-60">
            Set <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">GEMINI_API_KEY</code> environment variable in your runtime.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium ${
                isDark ? 'border-[#37393b] hover:bg-[#282a2c]' : 'border-[#c4c7c5] hover:bg-[#f0f4f9]'
              }`}
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

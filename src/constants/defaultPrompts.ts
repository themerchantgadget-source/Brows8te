import { PromptItem, StructuredColumn, StructuredRow } from '../types/aistudio';

export const INITIAL_PROMPTS: PromptItem[] = [
  {
    id: 'prompt-1',
    title: 'Chat with Gemini 3.7 Flash',
    mode: 'chat',
    model: 'gemini-3.7-flash',
    updatedAt: Date.now() - 1000 * 60 * 12,
    systemInstruction: 'You are a helpful, expert AI programming assistant and technical advisor. Provide clear explanations, clean code examples, and structured responses.',
    isPinned: true,
    messagesCount: 4,
    description: 'Interactive general chat with reasoning and code capabilities',
  },
  {
    id: 'prompt-2',
    title: 'TypeScript & Python Refactoring Assistant',
    mode: 'chat',
    model: 'gemini-3.1-pro-preview',
    updatedAt: Date.now() - 1000 * 60 * 180,
    systemInstruction: 'Analyze code for performance bottlenecks, typing strictness, security vulnerabilities, and adherence to clean architecture principles.',
    isPinned: true,
    messagesCount: 2,
    description: 'Deep architectural code review and optimization',
  },
  {
    id: 'prompt-3',
    title: 'Customer Feedback Sentiment & Intent Classifier',
    mode: 'structured',
    model: 'gemini-3.7-flash',
    updatedAt: Date.now() - 1000 * 60 * 600,
    systemInstruction: 'Extract customer sentiment (Positive, Neutral, Negative), primary topic, and urgency score (1-5).',
    isPinned: false,
    messagesCount: 0,
    description: 'Few-shot structured JSON classification dataset',
  },
  {
    id: 'prompt-4',
    title: 'Multimodal Image & Document Extraction',
    mode: 'freeform',
    model: 'gemini-3.7-flash',
    updatedAt: Date.now() - 1000 * 60 * 1440,
    systemInstruction: 'Extract tabular data, key-value pairs, and textual content from invoices and documents into clean Markdown tables.',
    isPinned: false,
    messagesCount: 0,
    description: 'Freeform multimodal document parser',
  },
  {
    id: 'prompt-5',
    title: 'Search Grounded Market Analyst',
    mode: 'chat',
    model: 'gemini-3.7-flash',
    updatedAt: Date.now() - 1000 * 60 * 2880,
    systemInstruction: 'Provide factual, citation-backed market analysis utilizing real-time Google Search grounding.',
    isPinned: false,
    messagesCount: 1,
    description: 'Live web-grounded research assistant',
  },
];

export const INITIAL_STRUCTURED_COLUMNS: StructuredColumn[] = [
  { id: 'col-1', name: 'Customer Review', type: 'input' },
  { id: 'col-2', name: 'Product Category', type: 'input' },
  { id: 'col-3', name: 'Sentiment & Action JSON', type: 'output' },
];

export const INITIAL_STRUCTURED_ROWS: StructuredRow[] = [
  {
    id: 'row-1',
    inputs: {
      'col-1': 'The battery life on this laptop is incredible! Lasts 18 hours easily.',
      'col-2': 'Hardware / Laptops',
    },
    output: '{"sentiment": "Positive", "urgency": 1, "action": "Highlight in marketing testimonials"}',
  },
  {
    id: 'row-2',
    inputs: {
      'col-1': 'App crashes every time I try to upload a PDF file over 5MB. Need fix ASAP!',
      'col-2': 'Mobile App',
    },
    output: '{"sentiment": "Negative", "urgency": 5, "action": "File urgent bug ticket with mobile team"}',
  },
  {
    id: 'row-3',
    inputs: {
      'col-1': 'Package arrived on time, box was slightly scuffed but product works fine.',
      'col-2': 'Logistics & Shipping',
    },
    output: '{"sentiment": "Neutral", "urgency": 2, "action": "Log carrier quality feedback"}',
  },
];

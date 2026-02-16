
export type Language = 'en' | 'hi' | 'hinglish';
export type AIModel = 'gemini-3-flash-preview' | 'gemini-3-pro-preview';

export interface Lesson {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  content: Record<Language, string>; // Markdown or plain text content
  codeSnippet?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isCodeContext?: boolean; // To mark if this message is just code attachment
}

export type Tab = 'learn' | 'editor' | 'tutor';

export interface AnalysisResult {
  message: string;        // The explanation/report
  fixedCode: string | null; // The corrected Smali code (if any)
}

export interface Template {
  label: string;
  code: string;
}

export interface Translation {
  learn: string;
  editor: string;
  tutor: string;
  curriculum: string;
  masterSmali: string;
  openEditor: string;
  reset: string;
  analyze: string;
  analysisTitle: string;
  dismiss: string;
  askPlaceholder: string;
  settings: string;
  selectLanguage: string;
  attachCode: string;
  codeAttached: string;
  applyFix: string;     
  fixApplied: string;   
  noIssues: string;
  // New features
  templates: string;
  convertJava: string;
  convertTitle: string;
  convertPlaceholder: string;
  converting: string;
  insert: string;
  searchLessons: string;
  close: string;
  // Model Settings
  selectModel: string;
  modelFlash: string;
  modelPro: string;
}

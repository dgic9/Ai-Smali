
import React, { useState, useEffect, useRef } from 'react';
import { TopBar } from './components/TopBar';
import { BottomNav } from './components/BottomNav';
import { MaterialIcon } from './components/MaterialIcon';
import { MessageBubble } from './components/MessageBubble';
import { Tab, ChatMessage, Language, AnalysisResult, AIModel } from './types';
import { LESSONS, DEFAULT_EDITOR_CODE, TRANSLATIONS, CODE_TEMPLATES, MODELS } from './constants';
import { analyzeSmali, sendMessageToTutor, resetChat, convertJavaToSmali, setApiKey, getApiKey } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('learn');
  const [editorCode, setEditorCode] = useState(DEFAULT_EDITOR_CODE);
  
  // Update state type to hold the full AnalysisResult object
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [aiModel, setAiModel] = useState<AIModel>('gemini-3-flash-preview');
  const [showSettings, setShowSettings] = useState(false);
  const [fixApplied, setFixApplied] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  // New Features State
  const [showTemplates, setShowTemplates] = useState(false);
  const [showConverter, setShowConverter] = useState(false);
  const [converterInput, setConverterInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [lessonSearch, setLessonSearch] = useState('');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [attachCodeToChat, setAttachCodeToChat] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Editor Refs for sync scrolling
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  // Initialize Chat greeting when language changes
  useEffect(() => {
    resetChat();
    // Load existing API key for display
    setApiKeyInput(getApiKey());

    const greeting = language === 'hi' ? 'नमस्ते! मैं आपका Smali गुरु हूँ। पूछिए क्या पूछना है।' :
                     language === 'hinglish' ? 'Hello! Main hoon aapka Smali Tutor. Android reverse engineering ke baare mein kuch bhi puccho.' :
                     'Hello! I am your Smali Tutor. Ask me anything about Android reverse engineering.';
    
    setChatHistory([{ 
      id: 'init', 
      role: 'model', 
      text: greeting, 
      timestamp: Date.now() 
    }]);
  }, [language]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  // Handlers
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setFixApplied(false);
    const result = await analyzeSmali(editorCode, language, aiModel);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleApplyFix = () => {
    if (analysisResult?.fixedCode) {
        setEditorCode(analysisResult.fixedCode);
        setFixApplied(true);
        // Hide success message after 3 seconds
        setTimeout(() => setFixApplied(false), 3000);
    }
  };

  const handleConvert = async () => {
      if (!converterInput.trim()) return;
      setIsConverting(true);
      const smali = await convertJavaToSmali(converterInput, aiModel);
      setEditorCode(prev => prev + '\n\n' + smali);
      setIsConverting(false);
      setShowConverter(false);
      setConverterInput('');
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatting) return;
    
    const currentCode = attachCodeToChat ? editorCode : undefined;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: Date.now()
    };
    
    // Add visual indicator if code was attached
    if (attachCodeToChat) {
        setChatHistory(prev => [...prev, userMsg, {
            id: `code-${Date.now()}`,
            role: 'user',
            text: `📄 ${t.codeAttached}`,
            timestamp: Date.now(),
            isCodeContext: true
        }]);
    } else {
        setChatHistory(prev => [...prev, userMsg]);
    }

    setChatInput('');
    setIsChatting(true);
    setAttachCodeToChat(false); // Reset attachment toggle

    const responseText = await sendMessageToTutor(userMsg.text, language, aiModel, currentCode);
    
    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };
    
    setChatHistory(prev => [...prev, botMsg]);
    setIsChatting(false);
  };

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
    // Don't close settings immediately so they can change model too
  };
  
  const toggleModel = (model: AIModel) => {
      setAiModel(model);
  };
  
  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setApiKeyInput(val);
      setApiKey(val);
  };

  const handleEditorScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Helper to render simple Markdown in the Analysis Card (Simplified logic compared to MessageBubble)
  const renderAnalysisText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
        if (line.startsWith('### ')) {
            return <h4 key={idx} className="text-[#d3e3fd] font-bold mt-2 mb-1">{line.replace('### ', '')}</h4>;
        }
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
            // Bold handling inside list item
            const content = line.replace(/^[*-]\s/, '');
            const parts = content.split(/\*\*(.*?)\*\*/g);
            return (
                <div key={idx} className="flex gap-2 ml-1 mb-1 text-sm text-[#c4c7c5]">
                    <span className="text-[#a8c7fa]">•</span>
                    <p>
                        {parts.map((part, pIdx) => 
                            pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#e2e2e6]">{part}</strong> : part
                        )}
                    </p>
                </div>
            );
        }
        // Bold handling in normal text
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
            <p key={idx} className="mb-1 text-sm text-[#c4c7c5]">
                {parts.map((part, pIdx) => 
                     pIdx % 2 === 1 ? <strong key={pIdx} className="text-[#e2e2e6]">{part}</strong> : part
                )}
            </p>
        );
    });
  };

  // UI Components
  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1e1f20] rounded-[28px] w-full max-w-sm p-6 shadow-2xl border border-[#444746]/30">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#e2e2e6]">{t.settings}</h2>
          <button onClick={() => setShowSettings(false)} className="text-[#c4c7c5] hover:bg-[#c4c7c5]/10 p-2 rounded-full">
            <MaterialIcon name="close" />
          </button>
        </div>
        
        {/* Language Section */}
        <h3 className="text-sm font-medium text-[#c4c7c5] mb-2">{t.selectLanguage}</h3>
        <div className="space-y-2 mb-6">
          {[
            { id: 'en', label: 'English' },
            { id: 'hi', label: 'हिन्दी (Hindi)' },
            { id: 'hinglish', label: 'Hinglish' }
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleLanguage(opt.id as Language)}
              className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                language === opt.id 
                ? 'bg-[#004a77] text-[#d3e3fd]' 
                : 'hover:bg-[#444746]/30 text-[#e2e2e6]'
              }`}
            >
              <span>{opt.label}</span>
              {language === opt.id && <MaterialIcon name="check" />}
            </button>
          ))}
        </div>

        {/* AI Model Section */}
        <h3 className="text-sm font-medium text-[#c4c7c5] mb-2">{t.selectModel}</h3>
        <div className="space-y-2 mb-6">
            {MODELS.map((model) => (
                 <button
                 key={model.id}
                 onClick={() => toggleModel(model.id)}
                 className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-colors ${
                   aiModel === model.id 
                   ? 'bg-[#004a77] text-[#d3e3fd]' 
                   : 'hover:bg-[#444746]/30 text-[#e2e2e6]'
                 }`}
               >
                 <span>{t[model.labelKey]}</span>
                 {aiModel === model.id && <MaterialIcon name="check" />}
               </button>
            ))}
        </div>

        {/* API Key Section */}
        <h3 className="text-sm font-medium text-[#c4c7c5] mb-2">{t.apiKeyLabel}</h3>
        <input 
            type="text" 
            value={apiKeyInput}
            onChange={handleApiKeyChange}
            placeholder={t.apiKeyPlaceholder}
            className="w-full bg-[#1a1c1e] text-[#e2e2e6] px-4 py-3 rounded-xl border border-[#444746]/30 focus:outline-none focus:border-[#a8c7fa] placeholder-[#8e918f]"
        />
        <p className="text-[10px] text-[#c4c7c5] mt-1.5 ml-1">{t.apiKeyHelp}</p>

      </div>
    </div>
  );

  const ConverterModal = () => (
      <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1f20] rounded-[28px] w-full max-w-lg p-6 shadow-2xl border border-[#444746]/30 flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#e2e2e6]">{t.convertTitle}</h2>
                  <button onClick={() => setShowConverter(false)} className="text-[#c4c7c5] hover:bg-[#c4c7c5]/10 p-2 rounded-full">
                      <MaterialIcon name="close" />
                  </button>
              </div>
              <textarea 
                 value={converterInput}
                 onChange={(e) => setConverterInput(e.target.value)}
                 className="flex-1 bg-[#1a1c1e] text-[#e2e2e6] font-mono text-sm p-4 rounded-xl resize-none focus:outline-none border border-[#444746]/30 focus:border-[#a8c7fa] mb-4 min-h-[200px]"
                 placeholder={t.convertPlaceholder}
              />
              <div className="flex justify-end gap-3">
                  <button onClick={() => setShowConverter(false)} className="px-4 py-2 text-[#c4c7c5] hover:text-white">{t.close}</button>
                  <button 
                     onClick={handleConvert} 
                     disabled={isConverting || !converterInput.trim()}
                     className="px-6 py-2 bg-[#d3e3fd] text-[#00325b] rounded-full font-medium flex items-center gap-2 hover:bg-white disabled:opacity-50"
                  >
                      {isConverting && <span className="w-4 h-4 border-2 border-[#00325b] border-t-transparent rounded-full animate-spin"></span>}
                      {isConverting ? t.converting : t.convertJava}
                  </button>
              </div>
          </div>
      </div>
  )

  const renderLearn = () => {
    const filteredLessons = LESSONS.filter(l => 
        l.title[language].toLowerCase().includes(lessonSearch.toLowerCase()) ||
        l.description[language].toLowerCase().includes(lessonSearch.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-4 pb-4">
        <div className="mb-6">
            <h2 className="text-3xl font-bold text-[#d3e3fd] mb-2">{t.curriculum}</h2>
            <p className="text-[#c4c7c5] mb-4">{t.masterSmali}</p>
            {/* Search Bar */}
            <div className="relative">
                 <MaterialIcon name="search" className="absolute left-3 top-2.5 text-[#c4c7c5]" />
                 <input 
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    placeholder={t.searchLessons}
                    className="w-full bg-[#1e1f20] text-[#e2e2e6] pl-10 pr-4 py-2.5 rounded-xl border border-[#444746]/30 focus:outline-none focus:border-[#a8c7fa] placeholder-[#8e918f]"
                 />
            </div>
        </div>
        <div className="space-y-4">
        {filteredLessons.map((lesson) => (
            <div 
            key={lesson.id} 
            className="bg-[#1e1f20] rounded-[24px] p-6 shadow-md border border-[#444746]/20 transition-all hover:bg-[#252729]"
            >
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-[#e2e2e6]">{lesson.title[language]}</h3>
                <span className={`text-xs px-2 py-1 rounded-md border font-medium ${
                lesson.difficulty === 'Beginner' ? 'border-green-400/30 text-green-300 bg-green-400/5' :
                lesson.difficulty === 'Intermediate' ? 'border-yellow-400/30 text-yellow-300 bg-yellow-400/5' :
                'border-red-400/30 text-red-300 bg-red-400/5'
                }`}>
                {lesson.difficulty}
                </span>
            </div>
            <p className="text-[#c4c7c5] text-sm mb-4 leading-relaxed">{lesson.description[language]}</p>
            <p className="text-[#e2e2e6] text-sm mb-4 border-l-2 border-[#d3e3fd] pl-3 py-1 bg-[#d3e3fd]/5 rounded-r-lg">
                {lesson.content[language]}
            </p>
            <div className="bg-[#111111] p-4 rounded-xl font-mono text-xs text-[#a8c7fa] overflow-x-auto border border-[#444746]/30 shadow-inner">
                <pre>{lesson.codeSnippet}</pre>
            </div>
            <div className="mt-4 flex justify-end">
                <button 
                onClick={() => {
                    if (lesson.codeSnippet) setEditorCode(lesson.codeSnippet);
                    setActiveTab('editor');
                }}
                className="flex items-center gap-2 text-[#a8c7fa] text-sm font-medium hover:bg-[#a8c7fa]/10 px-4 py-2 rounded-full transition-colors"
                >
                <MaterialIcon name="code" className="text-lg" />
                {t.openEditor}
                </button>
            </div>
            </div>
        ))}
        {filteredLessons.length === 0 && (
            <div className="text-center py-10 text-[#c4c7c5]">No lessons found.</div>
        )}
        </div>
        </div>
    );
  };

  const renderEditor = () => {
    // Generate line numbers based on code content
    const lineCount = editorCode.split('\n').length;
    
    return (
      <div className="flex flex-col h-full relative">
        <div className="flex-1 p-4 relative flex flex-col gap-4 overflow-hidden">
          {/* Editor Container */}
          <div className="bg-[#1e1f20] flex-1 rounded-[24px] border border-[#444746]/30 flex flex-col shadow-lg relative overflow-hidden">
            <div className="bg-[#2a2b2d] px-3 py-2 border-b border-[#444746]/30 flex justify-between items-center z-10 shrink-0">
               <div className="flex items-center gap-3">
                   {/* File Name */}
                   <div className="flex items-center gap-2">
                        <MaterialIcon name="description" className="text-[#c4c7c5] text-sm" />
                        <span className="text-xs text-[#c4c7c5] font-mono tracking-wide hidden sm:block">Main.smali</span>
                   </div>
                   
                   {/* Vertical Separator */}
                   <div className="h-4 w-[1px] bg-[#444746]/50"></div>

                   {/* Templates Trigger */}
                   <div className="relative">
                       <button 
                         onClick={() => setShowTemplates(!showTemplates)}
                         className="flex items-center gap-1 text-[#c4c7c5] hover:text-[#d3e3fd] px-2 py-1 rounded-md transition-colors text-xs font-medium uppercase tracking-wider"
                       >
                           <MaterialIcon name="integration_instructions" className="text-base" />
                           <span className="hidden sm:inline">{t.templates}</span>
                       </button>
                       {/* Dropdown */}
                       {showTemplates && (
                           <div className="absolute top-8 left-0 w-48 bg-[#2a2b2d] border border-[#444746]/50 rounded-xl shadow-xl z-50 flex flex-col overflow-hidden animate-fade-in">
                               {CODE_TEMPLATES.map((tpl) => (
                                   <button 
                                     key={tpl.label}
                                     onClick={() => {
                                         setEditorCode(prev => prev + '\n' + tpl.code);
                                         setShowTemplates(false);
                                     }}
                                     className="text-left px-4 py-2.5 text-xs text-[#e2e2e6] hover:bg-[#444746]/30 border-b border-[#444746]/10 last:border-0"
                                   >
                                       {tpl.label}
                                   </button>
                               ))}
                           </div>
                       )}
                   </div>

                   {/* Converter Trigger */}
                   <button 
                         onClick={() => setShowConverter(true)}
                         className="flex items-center gap-1 text-[#c4c7c5] hover:text-[#d3e3fd] px-2 py-1 rounded-md transition-colors text-xs font-medium uppercase tracking-wider"
                       >
                           <MaterialIcon name="transform" className="text-base" />
                           <span className="hidden sm:inline">{t.convertJava}</span>
                   </button>

               </div>
               
               {/* Reset */}
               <button 
                  onClick={() => setEditorCode(DEFAULT_EDITOR_CODE)}
                  className="p-1.5 hover:bg-white/10 rounded-full text-[#c4c7c5] transition-colors" 
                  title={t.reset}>
                 <MaterialIcon name="restart_alt" className="text-lg" />
               </button>
            </div>
            
            <div className="relative flex-1 bg-[#1a1c1e] overflow-hidden flex">
               {/* Line Numbers */}
               <div 
                 ref={lineNumbersRef}
                 className="w-10 bg-[#222426] border-r border-[#444746]/30 flex flex-col items-center pt-4 pb-4 text-[#444746] text-xs font-mono select-none overflow-hidden"
               >
                   {Array.from({ length: Math.max(lineCount, 20) }).map((_, i) => (
                      <div key={i} className="leading-6 h-6">{i + 1}</div>
                   ))}
               </div>
               
               {/* Text Area */}
               <textarea
                  ref={textareaRef}
                  onScroll={handleEditorScroll}
                  value={editorCode}
                  onChange={(e) => setEditorCode(e.target.value)}
                  className="flex-1 bg-transparent text-[#e2e2e6] font-mono text-sm resize-none focus:outline-none leading-6 p-4 whitespace-pre"
                  spellCheck={false}
                  wrap="off"
                />
            </div>
          </div>
  
          {/* Analysis Result Card */}
          {analysisResult && (
            <div className="bg-[#0f2e2e] border border-green-500/30 rounded-[24px] p-0 animate-slide-up shadow-xl mx-1 shrink-0 max-h-[35%] flex flex-col overflow-hidden">
              <div className="bg-[#0b2424] px-5 py-3 border-b border-green-500/20 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2 text-green-300">
                     <MaterialIcon name="check_circle" filled />
                     <h3 className="font-semibold text-lg">{t.analysisTitle}</h3>
                  </div>
                  <button onClick={() => setAnalysisResult(null)} className="text-green-300/50 hover:text-green-300">
                      <MaterialIcon name="close" />
                  </button>
              </div>
              
              <div className="p-5 overflow-y-auto custom-scroll flex-1">
                 {renderAnalysisText(analysisResult.message)}
              </div>
              
              {/* Footer Actions */}
              <div className="p-3 bg-[#0b2424] border-t border-green-500/20 flex gap-3 shrink-0">
                  {analysisResult.fixedCode ? (
                       <button 
                         onClick={handleApplyFix}
                         disabled={fixApplied}
                         className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-full transition-all ${
                             fixApplied 
                             ? 'bg-green-500/20 text-green-300 cursor-default'
                             : 'bg-[#d3e3fd] text-[#00325b] hover:bg-white shadow-lg'
                         }`}
                       >
                         {fixApplied ? (
                            <>
                                <MaterialIcon name="check" className="text-lg" />
                                {t.fixApplied}
                            </>
                         ) : (
                            <>
                                <MaterialIcon name="auto_fix_high" className="text-lg" />
                                {t.applyFix}
                            </>
                         )}
                       </button>
                  ) : (
                      <div className="flex-1 text-center py-2 text-xs text-green-300/70 font-medium">
                          {t.noIssues}
                      </div>
                  )}
              </div>
            </div>
          )}
        </div>
  
        {/* FAB */}
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className={`h-16 w-16 rounded-[20px] shadow-2xl shadow-[#000000]/50 flex items-center justify-center transition-all duration-300 ${
              isAnalyzing ? 'bg-[#444746] cursor-not-allowed' : 'bg-[#d3e3fd] hover:bg-[#c4d7fc] active:scale-95'
            }`}
          >
            {isAnalyzing ? (
               <span className="block w-6 h-6 border-[3px] border-[#00325b] border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <MaterialIcon name="play_arrow" className="text-[#00325b] text-4xl" filled />
            )}
          </button>
        </div>
      </div>
    );
  };

  const renderTutor = () => (
    <div className="flex flex-col h-full bg-[#1a1c1e] relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 no-scrollbar">
        {chatHistory.map((msg) => (
          <MessageBubble 
            key={msg.id}
            role={msg.role}
            text={msg.text}
            isCodeContext={msg.isCodeContext}
          />
        ))}
        {isChatting && (
          <div className="flex justify-start mb-4">
             <div className="bg-[#1e1f20] rounded-2xl p-4 rounded-bl-none border border-[#444746]/30 flex gap-2 items-center">
                <span className="w-1.5 h-1.5 bg-[#d3e3fd] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#d3e3fd] rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-[#d3e3fd] rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </div>

      {/* Input Area (Flex Item, not absolute) */}
      <div className="shrink-0 bg-[#1e1f20]/90 backdrop-blur-md p-3 border-t border-[#444746]/30 z-40 pb-6">
        <div className="max-w-screen-xl mx-auto flex items-end gap-2 bg-[#1a1c1e] rounded-[24px] px-3 py-2 border border-[#444746]/50 focus-within:border-[#a8c7fa] transition-colors">
          <button
            onClick={() => setAttachCodeToChat(!attachCodeToChat)}
            className={`p-2 mb-0.5 rounded-full transition-all ${
                attachCodeToChat ? 'bg-[#004a77] text-[#d3e3fd]' : 'text-[#c4c7c5] hover:bg-[#c4c7c5]/10'
            }`}
            title={t.attachCode}
          >
             <MaterialIcon name="note_add" />
          </button>
          
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                }
            }}
            placeholder={attachCodeToChat ? `${t.askPlaceholder} (with Code)` : t.askPlaceholder}
            className="flex-1 bg-transparent text-[#e2e2e6] placeholder-[#8e918f] focus:outline-none text-sm py-2 max-h-24 resize-none"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isChatting}
            className={`p-2 mb-0.5 rounded-full transition-colors ${
              !chatInput.trim() || isChatting 
              ? 'text-[#444746]' 
              : 'bg-[#d3e3fd] text-[#00325b]'
            }`}
          >
            <MaterialIcon name="arrow_upward" className="font-bold" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-[100dvh] bg-[#1a1c1e] text-[#e2e2e6] flex flex-col font-sans w-full md:max-w-2xl lg:max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Top Bar with Settings Trigger */}
      <div className="h-16 bg-[#1a1c1e] flex items-center justify-between px-4 sticky top-0 z-50 border-b border-[#444746]/30 shadow-sm shrink-0">
        <div className="flex items-center gap-4">
            <MaterialIcon name="terminal" className="text-[#d3e3fd] text-2xl" />
            <h1 className="text-xl font-medium text-[#e2e2e6] tracking-wide">Smali Master</h1>
        </div>
        <div className="flex items-center">
            <button 
                onClick={() => setShowSettings(true)}
                className="text-[#e2e2e6] hover:bg-[#e2e2e6]/10 p-2 rounded-full transition-colors">
            <MaterialIcon name="settings" />
            </button>
        </div>
      </div>
      
      <main className="flex-1 overflow-hidden relative flex flex-col">
        {activeTab === 'learn' && renderLearn()}
        {activeTab === 'editor' && renderEditor()}
        {activeTab === 'tutor' && renderTutor()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {showSettings && <SettingsModal />}
      {showConverter && <ConverterModal />}
    </div>
  );
};

export default App;

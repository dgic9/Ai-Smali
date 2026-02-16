import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

interface MessageBubbleProps {
  text: string;
  role: 'user' | 'model';
  isCodeContext?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ text, role, isCodeContext }) => {
  // Simple Markdown Parser
  const renderContent = (content: string) => {
    // 1. Split by Code Blocks (```lang ... ```)
    // The regex captures (lang) and (code)
    const parts = content.split(/```(\w*)\s*([\s\S]*?)```/g);
    
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 3 === 0) {
        // --- TEXT PART ---
        const textPart = parts[i];
        if (!textPart.trim() && parts.length > 1) continue; 

        // Split text by newlines to handle headers and lists
        const lines = textPart.split('\n');
        
        lines.forEach((line, lineIdx) => {
           if (!line.trim()) return; // Skip empty lines mostly

           let renderedLine: React.ReactNode[] = [];
           // Handle Bold (**text**)
           const boldParts = line.split(/\*\*(.*?)\*\*/g);
           boldParts.forEach((part, bIdx) => {
               if (bIdx % 2 === 1) {
                   renderedLine.push(<strong key={bIdx} className="font-bold text-white">{part}</strong>);
               } else {
                   renderedLine.push(part);
               }
           });

           // Headers
           if (line.startsWith('### ')) {
             elements.push(
                <h3 key={`t-${i}-${lineIdx}`} className="text-base font-bold text-[#a8c7fa] mt-3 mb-1">
                    {renderedLine.slice(0, 1).toString().replace('### ', '')}{renderedLine.slice(1)}
                </h3>
             );
           } 
           // Bullet points
           else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
               elements.push(
                <div key={`t-${i}-${lineIdx}`} className="flex gap-2 ml-1 mb-1">
                    <span className="text-[#a8c7fa]">•</span>
                    <p className="leading-relaxed">{renderedLine.length > 1 || typeof renderedLine[0] !== 'string' ? renderedLine : line.replace(/^[*-]\s/, '')}</p>
                </div>
               )
           }
           // Standard Paragraph
           else {
             elements.push(<p key={`t-${i}-${lineIdx}`} className="mb-1 leading-relaxed">{renderedLine}</p>);
           }
        });

      } else if (i % 3 === 1) {
        // --- CODE BLOCK ---
        const lang = parts[i];
        const code = parts[i+1];
        
        if (code) {
            elements.push(
            <div key={`code-${i}`} className="my-3 rounded-xl overflow-hidden border border-[#444746]/50 bg-[#111111] shadow-md">
                <div className="flex justify-between items-center px-3 py-1.5 bg-[#2a2b2d] border-b border-[#444746]/30">
                <span className="text-[10px] uppercase text-[#c4c7c5] font-mono tracking-wider">{lang || 'CODE'}</span>
                <CopyButton content={code.trim()} />
                </div>
                <pre className="p-3 text-xs font-mono text-[#a8c7fa] overflow-x-auto whitespace-pre-wrap leading-5 custom-scroll">
                {code.trim()}
                </pre>
            </div>
            );
        }
        i++; // Skip code content part as we handled it
      }
    }
    return elements;
  };

  return (
    <div className={`group flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
       {/* Message Container */}
       <div
          className={`max-w-[90%] md:max-w-[85%] rounded-2xl p-4 shadow-sm relative transition-all ${
            role === 'user'
              ? isCodeContext 
                ? 'bg-[#444746]/30 text-[#c4c7c5] text-xs italic border border-[#444746]/50'
                : 'bg-[#004a77] text-[#d3e3fd] rounded-br-sm'
              : 'bg-[#1e1f20] text-[#e2e2e6] rounded-bl-sm border border-[#444746]/30'
          }`}
        >
          {/* Content */}
          <div className="text-sm break-words">
             {renderContent(text)}
          </div>

          {/* Message Copy Button (visible on group hover) */}
          {!isCodeContext && (
             <div className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <CopyButton content={text} iconOnly />
             </div>
          )}
        </div>
    </div>
  );
};

const CopyButton = ({ content, iconOnly = false }: { content: string, iconOnly?: boolean }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (iconOnly) {
         return (
             <button onClick={handleCopy} className="p-1.5 text-[#c4c7c5] hover:text-[#d3e3fd] bg-[#1e1f20] border border-[#444746]/30 rounded-full shadow-lg" title="Copy Message">
                 <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[14px]" />
             </button>
         )
    }

    return (
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[#c4c7c5] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md">
            <MaterialIcon name={copied ? "check" : "content_copy"} className="text-[12px]" />
            <span className="text-[10px] uppercase tracking-wider font-medium">{copied ? "Copied" : "Copy"}</span>
        </button>
    );
}
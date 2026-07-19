import React from 'react';
import { SUGGESTED_PROMPTS } from '../../utils/constants.js';

interface SuggestedPromptsProps {
  onSelect: (promptText: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {SUGGESTED_PROMPTS.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt.text)}
          className="flex items-start text-left p-4 rounded-xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all duration-200 cursor-pointer shadow-sm group active:scale-98"
        >
          <span className="text-2xl mr-3 group-hover:scale-110 transition-transform">{prompt.icon}</span>
          <div>
            <p className="text-xs font-semibold text-primary font-display tracking-wide uppercase mb-1">
              {prompt.label}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              {prompt.text}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};
export default SuggestedPrompts;

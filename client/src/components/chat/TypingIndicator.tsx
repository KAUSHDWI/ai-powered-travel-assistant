import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 p-4 bg-secondary text-secondary-foreground rounded-2xl rounded-tl-sm w-fit border border-border/50 shadow-sm ml-2">
      <div className="flex space-x-1">
        <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-xs text-muted-foreground font-medium pl-1">Maya is typing...</span>
    </div>
  );
};
export default TypingIndicator;

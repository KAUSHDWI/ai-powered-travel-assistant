import React from 'react';
import { FileText } from 'lucide-react';

interface ConversationSummaryProps {
  summary: string;
}

export const ConversationSummary: React.FC<ConversationSummaryProps> = ({ summary }) => {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
        <FileText className="h-3.5 w-3.5" />
        <span>Conversation Summary</span>
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-border rounded-xl">
        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {summary || 'Start chatting with Maya to generate the live trip profile summary.'}
        </p>
      </div>
    </div>
  );
};
export default ConversationSummary;

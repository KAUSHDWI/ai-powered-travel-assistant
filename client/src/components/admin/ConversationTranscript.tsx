import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '../../utils/cn.js';
import { formatDate } from '../../utils/formatters.js';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface ConversationTranscriptProps {
  messages: Message[];
}

export const ConversationTranscript: React.FC<ConversationTranscriptProps> = ({ messages }) => {
  // Helpers to structure dynamic timelines
  const formatMsgTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-border shadow-inner p-4 space-y-4 max-h-[600px] overflow-y-auto">
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-2">
        <MessageSquare className="h-4 w-4" />
        <span>Transcript Timeline ({messages.length} messages)</span>
      </div>

      {messages.length === 0 ? (
        <p className="text-xs text-center text-slate-400 italic p-6">No chat transcript available.</p>
      ) : (
        <div className="space-y-3.5">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={idx}
                className={cn('flex flex-col max-w-[85%] space-y-1', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}
              >
                {/* Bubble content */}
                <div
                  className={cn(
                    'px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed border shadow-sm',
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-sm border-blue-700'
                      : 'bg-card text-slate-800 dark:text-slate-200 rounded-bl-sm border-border'
                  )}
                >
                  {msg.content.split('\n\n').map((para, i) => (
                    <p key={i} className={cn(i > 0 && 'mt-1.5')}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Footer time/avatar info */}
                <div className="flex items-center space-x-1.5 text-[10px] text-muted-foreground px-1">
                  {!isUser && <Sparkles className="h-3 w-3 text-indigo-500" />}
                  <span>{isUser ? 'Customer' : 'Maya'}</span>
                  <span>•</span>
                  <span>{formatMsgTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default ConversationTranscript;

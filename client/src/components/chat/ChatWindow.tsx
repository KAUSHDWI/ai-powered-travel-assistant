import React, { useRef, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import useChat from '../../hooks/useChat.js';
import MessageBubble from './MessageBubble.js';
import TypingIndicator from './TypingIndicator.js';
import ChatInput from './ChatInput.js';
import SuggestedPrompts from './SuggestedPrompts.js';
import { Button } from '../ui/button.js';

export const ChatWindow: React.FC = () => {
  const { state, sendMessage, resetChat } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.loading]);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border shadow-md overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Chat with Maya</h3>
            <p className="text-xs text-muted-foreground">AI Travel Consultant</p>
          </div>
        </div>

        {state.messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="text-xs text-slate-500 hover:text-destructive flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New Trip
          </Button>
        )}
      </div>

      {/* Message history */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/30 dark:bg-slate-950/10">
        {state.messages.length === 0 ? (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-6">
            <div className="space-y-2">
              <div className="text-4xl">✈️</div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-200 font-display">
                Where to Next?
              </h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Chat with Maya to plan your dream vacation. Start by telling her what kind of trip you want or select a suggestion below.
              </p>
            </div>
            <SuggestedPrompts onSelect={handleSend} />
          </div>
        ) : (
          <div className="space-y-4">
            {state.messages.map((msg, idx) => (
              <MessageBubble key={idx} message={msg} />
            ))}
            {state.loading && <TypingIndicator />}
            {state.error && (
              <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                <span>⚠️ {state.error}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetChat}
                  className="bg-white hover:bg-red-100 text-red-700 border-red-200 h-8 hover:text-red-800"
                >
                  Reset
                </Button>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input row */}
      <ChatInput onSend={handleSend} disabled={state.loading} />
    </div>
  );
};
export default ChatWindow;

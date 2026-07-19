import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';
import type { Message } from '../../types/index.js';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  // Helper to format short timestamps
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn('flex w-full mb-4', isUser ? 'justify-end' : 'justify-start')}
    >
      <div className={cn('flex items-end max-w-[85%] sm:max-w-[75%]', isUser && 'flex-row-reverse')}>
        {/* Avatar */}
        <div
          className={cn(
            'flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shadow-sm shrink-0 mb-1',
            isUser
              ? 'bg-blue-600 text-white ml-2'
              : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 mr-2 border border-indigo-200/30'
          )}
        >
          {isUser ? 'ME' : 'MY'}
        </div>

        <div className="flex flex-col">
          {/* Bubble wrapper */}
          <div
            className={cn(
              'px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm border',
              isUser
                ? 'bg-blue-600 text-white rounded-br-sm border-blue-700 shadow-blue-500/5'
                : 'bg-card text-slate-800 dark:text-slate-200 rounded-bl-sm border-border'
            )}
          >
            {/* Split formatting for multiple lines/paragraphs */}
            {message.content.split('\n\n').map((para, i) => (
              <p key={i} className={cn(i > 0 && 'mt-2')}>
                {para}
              </p>
            ))}
          </div>

          {/* Time display */}
          <span
            className={cn(
              'text-[10px] text-muted-foreground mt-1 px-1',
              isUser ? 'text-right' : 'text-left'
            )}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
export default MessageBubble;

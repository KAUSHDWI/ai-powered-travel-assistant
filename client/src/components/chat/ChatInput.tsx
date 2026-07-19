import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Tooltip } from 'lucide-react';
import { Button } from '../ui/button.js';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  const [showVoiceTooltip, setShowVoiceTooltip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleVoiceClick = () => {
    setShowVoiceTooltip(true);
    setTimeout(() => {
      setShowVoiceTooltip(false);
    }, 2500);
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 p-3 bg-card border-t border-border rounded-b-2xl shadow-inner relative"
    >
      <div className="relative flex-1">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={disabled ? 'Maya is typing...' : 'Message Maya... (e.g. I want to plan a family trip)'}
          disabled={disabled}
          className="w-full h-11 px-4 pr-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border focus:border-blue-400 focus:outline-none text-sm transition-all pr-24 disabled:opacity-50"
        />

        {/* Voice Recognition Button Placeholder */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
          <button
            type="button"
            onClick={handleVoiceClick}
            disabled={disabled}
            className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 relative group"
          >
            <Mic className="h-4.5 w-4.5" />

            {/* Voice Tooltip Alert */}
            {showVoiceTooltip && (
              <span className="absolute bottom-12 right-0 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-md whitespace-nowrap z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                🎙️ Voice recognition coming soon!
              </span>
            )}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!message.trim() || disabled}
        size="icon"
        className="h-11 w-11 rounded-xl shrink-0 cursor-pointer shadow-blue-500/20"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
export default ChatInput;

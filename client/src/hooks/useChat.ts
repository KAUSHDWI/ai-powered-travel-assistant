import { useContext } from 'react';
import { ChatContext, type ChatContextProps } from '../context/ChatContext.js';

export function useChat(): ChatContextProps {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
export default useChat;

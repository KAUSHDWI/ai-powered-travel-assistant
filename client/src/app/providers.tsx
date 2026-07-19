import React, { type ReactNode } from 'react';
import { ChatProvider } from '../context/ChatContext.js';
import { AuthProvider } from '../context/AuthContext.js';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <ChatProvider>
        {children}
      </ChatProvider>
    </AuthProvider>
  );
};
export default Providers;

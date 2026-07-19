import React from 'react';
import ChatWindow from '../components/chat/ChatWindow.js';
import LeadPanel from '../components/lead-panel/LeadPanel.js';

export const Home: React.FC = () => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[calc(100vh-10rem)] md:max-h-[calc(100vh-8rem)]">
      {/* Chat Window: 2 cols on desktop, full width on mobile */}
      <div className="md:col-span-2 h-full flex flex-col min-h-[500px]">
        <ChatWindow />
      </div>

      {/* Lead Panel: 1 col on desktop, hidden on mobile (accessible via slide-up drawer) */}
      <div className="hidden md:block h-full overflow-y-auto">
        <LeadPanel />
      </div>
    </div>
  );
};
export default Home;

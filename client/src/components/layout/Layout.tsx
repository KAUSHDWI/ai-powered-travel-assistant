import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import Navbar from './Navbar.js';
import MobileDrawer from './MobileDrawer.js';
import LeadPanel from '../lead-panel/LeadPanel.js';
import { Button } from '../ui/button.js';
import { useLocation } from 'react-router-dom';

export const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  // Only display the floating drawer toggle button on the home chat screen
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        <Outlet />
      </main>

      {/* Floating drawer action button for smaller mobile views (Home page only) */}
      {isHome && (
        <div className="fixed bottom-4 right-4 z-30 md:hidden animate-in fade-in zoom-in duration-200">
          <Button
            onClick={() => setDrawerOpen(true)}
            className="rounded-full shadow-lg shadow-blue-500/25 h-12 w-12 cursor-pointer flex items-center justify-center"
            size="icon"
          >
            <ClipboardList className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile-only Slide Up drawer container (Home page only) */}
      {isHome && (
        <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <LeadPanel />
        </MobileDrawer>
      )}
    </div>
  );
};
export default Layout;

import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import { supabase } from '../../utils/supabase';
import { Menu } from 'lucide-react';
import { FullPageLoader } from '../shared';

const AppLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <FullPageLoader />;

  // Map path to title
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    switch (path) {
      case 'dashboard': return 'Dashboard';
      case 'list': return 'List New Product';
      case 'trending': return 'Trending Research';
      case 'categories': return 'Category Navigator';
      case 'advisor': return 'AI Advisor Chat';
      default: return 'ListiQ';
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block shrink-0">
        <Sidebar user={user} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Bar for Mobile/Context */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-white border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="lg:hidden w-8 h-8 bg-brand rounded-lg flex items-center justify-center font-bold text-lg text-white">L</div>
            <h2 className="text-lg lg:text-xl font-black text-navy tracking-tight">{getPageTitle()}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              API Online
            </div>
            {/* Mobile User Avatar */}
            <div className="lg:hidden w-8 h-8 rounded-full bg-navy-light flex items-center justify-center text-[10px] font-bold text-white border border-slate-700 uppercase">
              {user?.email?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>

        {/* Mobile Navigation */}
        <BottomBar />
      </main>
    </div>
  );
};

export default AppLayout;

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  TrendingUp, 
  Grid3x3, 
  MessageSquare, 
  LogOut,
  Zap
} from 'lucide-react';
import { supabase } from '../../utils/supabase';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: PackagePlus, label: 'List Product', path: '/list' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
  { icon: Grid3x3, label: 'Categories', path: '/categories' },
  { icon: MessageSquare, label: 'AI Advisor', path: '/advisor' },
];

const Sidebar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col h-screen w-[215px] bg-navy text-white border-r border-slate-800">
      {/* Logo */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-black text-2xl shadow-xl shadow-orange-900/40">L</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter">ListiQ</h1>
            <p className="text-[10px] text-slate-500 -mt-1 font-black uppercase tracking-[0.2em]">SellerGuru</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
              ${isActive ? 'bg-brand text-white shadow-xl shadow-orange-900/20' : 'text-slate-400 hover:bg-navy-light hover:text-white'}
            `}
          >
            <item.icon className={`w-5 h-5 ${item.path === '/list' ? 'text-brand-light' : ''}`} />
            <span className="text-sm font-bold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Pro Badge */}
      <div className="px-4 py-6">
         <div className="bg-navy-light p-4 rounded-2xl border border-slate-700/50 space-y-3">
            <p className="text-[10px] font-black text-brand uppercase tracking-widest flex items-center gap-2">
               <Zap className="w-3 h-3" /> Growth Pro
            </p>
            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">10x listing speed enabled on your account.</p>
         </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-t border-slate-800 bg-navy-light/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-navy-light flex items-center justify-center text-sm font-black border border-slate-700 uppercase">
            {getInitials(user?.user_metadata?.full_name || user?.email)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate text-white uppercase tracking-tight">{user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</p>
            <p className="text-[10px] text-slate-500 truncate font-bold">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[10px] font-black text-slate-400 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border-2 border-transparent rounded-xl transition-all uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

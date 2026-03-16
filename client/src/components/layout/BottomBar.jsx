import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackagePlus, 
  TrendingUp, 
  Grid3x3, 
  MessageSquare,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
  { icon: PackagePlus, label: 'List', path: '/list' },
  { icon: TrendingUp, label: 'Trends', path: '/trending' },
  { icon: Grid3x3, label: 'Cats', path: '/categories' },
  { icon: MessageSquare, label: 'Advisor', path: '/advisor' },
];

const BottomBar = () => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around px-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center gap-1 w-full h-full transition-all
            ${isActive ? 'text-brand' : 'text-gray-400'}
          `}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
          {/* Active Dot */}
          <NavLink 
            to={item.path} 
            className={({ isActive }) => `w-1 h-1 rounded-full ${isActive ? 'bg-brand' : 'bg-transparent'}`} 
          />
        </NavLink>
      ))}
    </div>
  );
};

export default BottomBar;

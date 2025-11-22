
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, MessageSquare, User, LogOut, Hash, PlusCircle } from 'lucide-react';
import { logout, getCurrentUser } from '../services/authService';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();
  const user = getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Hash, label: 'Explore', path: '/explore' },
    { icon: Film, label: 'Clips', path: '/reels' }, 
    { icon: MessageSquare, label: 'Chats', path: '/messages' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
  ];

  return (
    <aside className={`${className} flex flex-col py-8 px-6 bg-white border-r border-gray-200`}>
      <div className="mb-12 px-2 flex items-center space-x-2">
        <div className="w-8 h-8 bg-tixo-accent rounded-lg"></div>
        <h1 className="text-3xl font-display font-black tracking-tighter text-gray-900">
          Tixo.
        </h1>
      </div>

      <nav className="flex-1 space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gray-100 text-tixo-accent'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            <span className={`text-base font-medium tracking-wide ${isActive(item.path) ? 'text-gray-900' : ''}`}>{item.label}</span>
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center space-x-4 px-4 py-3 text-gray-500 hover:text-red-500 transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span className="text-base">Sign Out</span>
      </button>
    </aside>
  );
};


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Film, MessageSquare, User, PlusCircle } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

interface MobileNavProps {
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({ className }) => {
  const location = useLocation();
  const user = getCurrentUser();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Feed', path: '/' },
    { icon: Film, label: 'Clips', path: '/reels' },
    { icon: PlusCircle, label: 'Create', path: '/create' },
    { icon: MessageSquare, label: 'Chats', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?.username}` },
  ];

  return (
    <nav className={`${className} flex justify-around items-center py-4 pb-6 bg-white border-t border-gray-200 shadow-lg`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            isActive(item.path) ? 'text-tixo-accent' : 'text-gray-400'
          }`}
        >
          <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
        </Link>
      ))}
    </nav>
  );
};

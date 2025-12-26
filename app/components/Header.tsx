'use client';

import React from 'react';
import { LayoutGrid, MessageSquare, User, ArrowLeftRight } from 'lucide-react';

interface HeaderProps {
  currentView: 'library' | 'trade' | 'chat' | 'profile';
  onViewChange: (view: 'library' | 'trade' | 'chat' | 'profile') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'library', label: 'THƯ VIỆN', icon: LayoutGrid },
    { id: 'trade', label: 'GIAO DỊCH', icon: ArrowLeftRight },
    { id: 'chat', label: 'TRÒ CHUYỆN', icon: MessageSquare },
    { id: 'profile', label: 'CÁ NHÂN', icon: User },
  ] as const;

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-teal-600 border-b border-teal-500 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16">
          <nav className="flex items-center gap-4 h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`
                  relative flex items-center gap-2 px-4 h-full transition-all duration-200 group
                  text-[11px] font-bold tracking-[0.12em]
                  ${currentView === item.id 
                    ? 'text-white' 
                    : 'text-teal-100 hover:text-white hover:bg-white/5'}
                `}
              >
                <item.icon 
                  className={`w-4 h-4 transition-transform duration-200 ${currentView === item.id ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} 
                />
                
                <span>{item.label}</span>

                {currentView === item.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-sm shadow-[0_-2px_6px_rgba(255,255,255,0.3)]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutGrid, MessageSquare, User, ArrowLeftRight } from 'lucide-react';

interface BottomNavProps {
  currentView: 'library' | 'trade' | 'chat' | 'profile';
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView }) => {
  const tabs = [
    { id: 'library', icon: LayoutGrid, href: '/' },
    { id: 'trade', icon: ArrowLeftRight, href: '/trade' },
    { id: 'chat', icon: MessageSquare, href: '/chat' },
    { id: 'profile', icon: User, href: '/profile' },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-teal-600 md:hidden">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <Link 
            key={tab.id}
            href={tab.href}
            className={`
                relative flex flex-col items-center justify-center w-full h-full transition-all duration-300
                ${currentView === tab.id ? 'text-white' : 'text-teal-200 hover:text-white'}
            `}
          >
            {currentView === tab.id && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-b-full"></div>
            )}
            
            <div className={`
                p-2 transition-all duration-200
                ${currentView === tab.id ? 'scale-110' : ''}
            `}>
              <tab.icon className={`w-6 h-6 ${currentView === tab.id ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;

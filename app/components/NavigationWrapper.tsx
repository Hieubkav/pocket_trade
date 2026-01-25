'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import Header from './Header';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isDetailPage = pathname.startsWith('/card/') || pathname.startsWith('/chat/') && pathname !== '/chat' || pathname.startsWith('/bai-viet/') && pathname !== '/bai-viet';
  
  const getCurrentView = (): 'library' | 'trade' | 'chat' | 'profile' | 'posts' => {
    if (pathname === '/' || pathname.startsWith('/trade')) return 'trade';
    if (pathname === '/library') return 'library';
    if (pathname.startsWith('/bai-viet')) return 'posts';
    if (pathname.startsWith('/chat')) return 'chat';
    if (pathname === '/profile') return 'profile';
    return 'trade';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white">
      {!isDetailPage && <Header currentView={getCurrentView()} />}
      {children}
      <BottomNav currentView={getCurrentView()} />
    </div>
  );
}

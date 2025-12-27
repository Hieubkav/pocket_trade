'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';
import Header from './Header';

export default function NavigationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const isDetailPage = pathname.startsWith('/card/') || pathname.startsWith('/chat/') && pathname !== '/chat';
  
  const getCurrentView = (): 'library' | 'trade' | 'chat' | 'profile' => {
    if (pathname === '/trade') return 'trade';
    if (pathname.startsWith('/chat')) return 'chat';
    if (pathname === '/profile') return 'profile';
    return 'library';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-600 selection:text-white">
      {!isDetailPage && <Header currentView={getCurrentView()} />}
      {children}
      <BottomNav currentView={getCurrentView()} />
    </div>
  );
}

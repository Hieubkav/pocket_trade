'use client';

import { useRouter, useParams } from 'next/navigation';
import ChatDetail from '../../components/ChatDetail';

const chatData: Record<string, { id: string; name: string; avatar: string; message?: string; time?: string }> = {
  'user-1': { id: 'user-1', name: 'EnRico', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EnRico' },
  'user-2': { id: 'user-2', name: 'akram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akram' },
  'user-3': { id: 'user-3', name: 'Dudu', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dudu' },
  'user-4': { id: 'user-4', name: 'ばっさー', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jp' },
  'system-1': { id: 'system-1', name: 'PokeHub News', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PN&backgroundColor=ff4f4f' },
};

export default function ChatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;
  
  const chat = chatData[chatId] || { id: chatId, name: 'Unknown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=unknown' };
  
  return (
    <ChatDetail 
      chat={chat}
      onBack={() => router.back()}
    />
  );
}

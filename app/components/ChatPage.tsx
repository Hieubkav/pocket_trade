'use client';

import React from 'react';
import { ShieldCheck, BadgeCheck, ArrowDownToLine, ArrowUpFromLine, Check, Search } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  message?: string;
  time?: string;
  unreadCount?: number;
  isVerified?: boolean;
  type?: string;
  statusTag?: string;
  statusType?: string;
  showCheck?: boolean;
  tradePreview?: {
    receive: string;
    send: string;
  };
}

interface ChatPageProps {
  onChatClick?: (chat: Chat) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onChatClick }) => {
  const chats: Chat[] = [
    {
      id: 'user-2',
      name: 'akram',
      message: 'add me send trade',
      time: '12 mins ago',
      unreadCount: 2,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akram',
      tradePreview: {
        receive: 'Wugtrio ex',
        send: 'Solgaleo ex'
      }
    },
    {
      id: 'user-3',
      name: 'Dudu',
      message: 'hi, I just sent you the friend request',
      time: '14 mins ago',
      unreadCount: 3,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dudu',
      statusTag: 'They Cancelled',
      statusType: 'muted'
    },
    {
      id: 'system-1',
      name: 'PokeHub News',
      message: 'B1a Event Preview',
      time: 'Dec 19 4:28 PM',
      unreadCount: 57,
      avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PN&backgroundColor=ff4f4f',
      isVerified: true,
      type: 'news'
    },
    {
      id: 'user-1',
      name: 'EnRico',
      message: '???',
      time: '12 mins ago',
      unreadCount: 6,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=EnRico',
      statusTag: 'You confirmed',
      statusType: 'success'
    },
    {
      id: 'user-4',
      name: 'ばっさー',
      message: 'Trade Accepted',
      time: '1 hours ago',
      unreadCount: 0,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jp',
      statusTag: 'Trade Accepted',
      statusType: 'success',
      showCheck: true
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="sticky top-0 z-50 bg-white px-4 py-5 flex items-center justify-center border-b border-slate-50">
        <h1 className="text-lg font-black text-slate-800 tracking-tight">Trò chuyện</h1>
      </div>

      <div className="px-4 py-3 bg-slate-50/50">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tin nhắn..." 
            className="w-full bg-white border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-100 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="divide-y divide-slate-50">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            onClick={() => onChatClick?.(chat)}
            className="px-4 py-4 flex items-start gap-3 hover:bg-slate-50/50 transition-colors cursor-pointer group"
          >
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50 shadow-sm">
                <img src={chat.avatar} alt={chat.name} className="w-full h-full object-cover" />
              </div>
              {chat.type === 'security' && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-500 fill-teal-50" />
                </div>
              )}
            </div>

            <div className="flex-grow min-w-0 pt-0.5">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 min-w-0">
                  <h3 className="text-[14px] font-black text-slate-800 truncate tracking-tight">{chat.name}</h3>
                  {chat.isVerified && <BadgeCheck className="w-4 h-4 text-teal-500 fill-teal-50 flex-shrink-0" />}
                </div>
                {chat.time && <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{chat.time}</span>}
              </div>

              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-medium text-slate-400 truncate leading-tight">
                  {chat.type === 'news' && <span className="mr-1">👀</span>}
                  {chat.message}
                </p>
                {chat.unreadCount && chat.unreadCount > 0 && (
                  <div className="min-w-[18px] h-[18px] flex items-center justify-center bg-pink-500 text-white text-[9px] font-black rounded-full px-1 shadow-[0_2px_8px_rgba(236,72,153,0.3)]">
                    {chat.unreadCount}
                  </div>
                )}
              </div>

              {chat.statusTag && (
                <div className="mt-2 inline-flex">
                  <div className={`
                    px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5 border
                    ${chat.statusType === 'success' ? 'bg-green-50 border-green-100 text-green-600' : ''}
                    ${chat.statusType === 'muted' ? 'bg-slate-100 border-slate-200 text-slate-500' : ''}
                  `}>
                    {chat.showCheck && <Check className="w-3 h-3 stroke-[3px]" />}
                    {chat.statusTag}
                  </div>
                </div>
              )}

              {chat.tradePreview && (
                <div className="mt-3 flex gap-2">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{chat.tradePreview.receive}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                    <ArrowUpFromLine className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{chat.tradePreview.send}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatPage;

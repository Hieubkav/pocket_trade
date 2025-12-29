'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, User, Clock, ArrowRightLeft } from 'lucide-react';

type TabType = 'my-offers' | 'public-offers' | 'offers-to-me' | 'history';

const mockTrades = [
  {
    id: 1,
    traderName: 'akram',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=akram',
    getting: { name: 'Sword & Shield—Fusion Strike', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 3 },
    endsIn: '1h 18m',
  },
  {
    id: 2,
    traderName: 'ばっさー',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jp',
    getting: { name: 'Sword & Shield—Fusion Strike', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 3 },
    endsIn: '1h 19m',
  },
  {
    id: 3,
    traderName: '阿逗',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=china',
    getting: { name: "Champion's Path", count: 3 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 2 },
    endsIn: '1h 20m',
  },
  {
    id: 4,
    traderName: 'TraderPro',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pro',
    getting: { name: "Champion's Path", count: 3 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 2 },
    endsIn: '1h 20m',
  },
  {
    id: 5,
    traderName: 'CardMaster',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=master',
    getting: { name: 'Sword & Shield', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 1 },
    endsIn: '1h 21m',
  },
  {
    id: 6,
    traderName: 'PKMCollector',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=collector',
    getting: { name: 'Sword & Shield', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 1 },
    endsIn: '1h 21m',
  },
  {
    id: 7,
    traderName: 'ShinyHunter',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shiny',
    getting: { name: 'Shining Fates', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 1 },
    endsIn: '1h 21m',
  },
  {
    id: 8,
    traderName: 'ExTrader',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ex',
    getting: { name: 'Shining Fates', count: 1 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 1 },
    endsIn: '1h 21m',
  },
  {
    id: 9,
    traderName: 'BattleKing',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=battle',
    getting: { name: 'Sword & Shield—Battle Styles', count: 5 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 4 },
    endsIn: '1h 22m',
  },
  {
    id: 10,
    traderName: 'RareCards',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rare',
    getting: { name: 'Sword & Shield—Battle Styles', count: 5 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 4 },
    endsIn: '1h 22m',
  },
  {
    id: 11,
    traderName: 'FrostBite',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frost',
    getting: { name: 'Sword & Shield—Chilling Reign', count: 2 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 3 },
    endsIn: '1h 22m',
  },
  {
    id: 12,
    traderName: 'IceQueen',
    traderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ice',
    getting: { name: 'Sword & Shield—Chilling Reign', count: 2 },
    giving: { name: 'Sun & Moon—Crimson Invasion', count: 3 },
    endsIn: '1h 23m',
  },
];

const tabs = [
  { id: 'my-offers' as TabType, label: 'Của tôi' },
  { id: 'public-offers' as TabType, label: 'Công khai' },
  { id: 'offers-to-me' as TabType, label: 'Đề nghị' },
  { id: 'history' as TabType, label: 'Lịch sử' },
];

const ExchangePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('public-offers');
  
  const settings = useQuery(api.settings.get);
  const maxPostsPerDay = settings?.limitTradePostPerTrader ?? 5;
  const todayPostsCount = 2;
  const remainingPosts = maxPostsPerDay - todayPostsCount;

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-lg font-black text-slate-900">Giao dịch</h1>
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-2.5 py-1">
          <User className="w-4 h-4 text-teal-600" />
          <span className="text-slate-900 font-bold text-sm">{remainingPosts}/{maxPostsPerDay}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-2">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-teal-600'
                  : 'text-slate-400'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Trade List - Mobile Optimized */}
      <div className="px-3 py-3 space-y-2">
        {mockTrades.map((trade) => (
          <div
            key={trade.id}
            onClick={() => router.push(`/trade/${trade.id}`)}
            className="bg-white rounded-xl p-3 active:bg-slate-50 transition-colors cursor-pointer border border-slate-100"
          >
            {/* Header: Avatar + Name + Time */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={trade.traderAvatar}
                  alt={trade.traderName}
                  className="w-8 h-8 rounded-full border border-slate-200"
                />
                <span className="text-sm font-bold text-slate-900">{trade.traderName}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{trade.endsIn}</span>
              </div>
            </div>

            {/* Trade Info */}
            <div className="flex items-center gap-2">
              {/* Getting */}
              <div className="flex-1 bg-teal-50 rounded-lg px-2.5 py-2">
                <div className="text-[10px] text-teal-600 font-bold mb-0.5">NHẬN</div>
                <div className="text-xs text-slate-800 font-medium leading-tight">
                  {trade.getting.name}
                  {trade.getting.count > 1 && (
                    <span className="text-teal-600 ml-1">+{trade.getting.count - 1}</span>
                  )}
                </div>
              </div>

              {/* Arrow */}
              <ArrowRightLeft className="w-4 h-4 text-slate-300 flex-shrink-0" />

              {/* Giving */}
              <div className="flex-1 bg-slate-100 rounded-lg px-2.5 py-2">
                <div className="text-[10px] text-slate-500 font-bold mb-0.5">ĐƯA</div>
                <div className="text-xs text-slate-800 font-medium leading-tight">
                  {trade.giving.name}
                  {trade.giving.count > 1 && (
                    <span className="text-slate-500 ml-1">+{trade.giving.count - 1}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="px-4 text-xs text-slate-400 font-medium">
        Tổng: {mockTrades.length} bài đăng
      </div>

      {/* FAB */}
      <button
        onClick={() => router.push('/trade/new')}
        className="fixed bottom-24 right-4 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-600/30 active:scale-90 transition-transform z-50"
      >
        <Plus className="w-5 h-5 text-white stroke-[2.5px]" />
      </button>
    </div>
  );
};

export default ExchangePage;

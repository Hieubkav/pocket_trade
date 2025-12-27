'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, User, CreditCard } from 'lucide-react';

const tradePost = {
  id: '1',
  traderName: 'Nguyễn Văn A',
  traderEmail: 'nguyenvana@gmail.com',
  status: 'active',
  expiresAt: '2024-12-30 14:00',
  isHidden: false,
  createdAt: '2024-12-28 10:00',
  haveCards: [
    { id: '1', name: 'Pikachu', rarity: '◆◆', type: 'Lightning' },
    { id: '2', name: 'Charizard ex', rarity: '★★★', type: 'Fire' },
    { id: '3', name: 'Mewtwo', rarity: '◆◆◆◆', type: 'Psychic' },
  ],
  wantCards: [
    { id: '4', name: 'Blastoise', rarity: '◆◆◆', type: 'Water' },
    { id: '5', name: 'Venusaur', rarity: '◆◆◆', type: 'Grass' },
  ],
  requests: [
    { id: '1', requesterName: 'Trần Thị B', status: 'pending', message: 'Tôi có Blastoise, muốn đổi Pikachu', createdAt: '2024-12-28 11:00' },
    { id: '2', requesterName: 'Lê Văn C', status: 'declined', message: 'Đổi Mewtwo được không?', createdAt: '2024-12-28 12:30' },
  ],
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  matched: { label: 'Đã match', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  expired: { label: 'Hết hạn', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const requestStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ duyệt', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  accepted: { label: 'Đã chấp nhận', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  declined: { label: 'Từ chối', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function TradePostDetailPage() {
  const status = statusConfig[tradePost.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trade-posts"
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Chi tiết Trade Post</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">#{tradePost.id}</p>
        </div>
        <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-green-500" />
              Thẻ có (Have) - {tradePost.haveCards.length}
            </h2>
            <div className="space-y-3">
              {tradePost.haveCards.map((card) => (
                <div key={card.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="h-10 w-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                    IMG
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{card.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.type}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.rarity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-500" />
              Thẻ muốn (Want) - {tradePost.wantCards.length}
            </h2>
            <div className="space-y-3">
              {tradePost.wantCards.map((card) => (
                <div key={card.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="h-10 w-8 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-400">
                    IMG
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{card.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{card.type}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{card.rarity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Trade Requests ({tradePost.requests.length})
            </h2>
            <div className="space-y-3">
              {tradePost.requests.map((req) => {
                const reqStatus = requestStatusConfig[req.status];
                return (
                  <div key={req.id} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-slate-900 dark:text-white">{req.requesterName}</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${reqStatus.color}`}>
                        {reqStatus.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{req.message}</p>
                    <p className="text-xs text-slate-400">{req.createdAt}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <User size={20} />
              Thông tin Trader
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tên</p>
                <p className="font-medium text-slate-900 dark:text-white">{tradePost.traderName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="font-medium text-slate-900 dark:text-white">{tradePost.traderEmail}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Thông tin Post</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tạo lúc</p>
                <p className="font-medium text-slate-900 dark:text-white">{tradePost.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Hết hạn</p>
                <p className="font-medium text-slate-900 dark:text-white">{tradePost.expiresAt}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Ẩn</p>
                <p className="font-medium text-slate-900 dark:text-white">{tradePost.isHidden ? 'Có' : 'Không'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const traders = [
  { id: '1', name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', avatarUrl: null, legitPoint: 150, friendCode: '1234-5678-9012', tradesCount: 45 },
  { id: '2', name: 'Trần Thị B', email: 'tranthib@gmail.com', avatarUrl: null, legitPoint: 520, friendCode: '2345-6789-0123', tradesCount: 128 },
  { id: '3', name: 'Lê Văn C', email: 'levanc@gmail.com', avatarUrl: null, legitPoint: 80, friendCode: '3456-7890-1234', tradesCount: 67 },
  { id: '4', name: 'Phạm Thị D', email: 'phamthid@gmail.com', avatarUrl: null, legitPoint: 1200, friendCode: '4567-8901-2345', tradesCount: 256 },
  { id: '5', name: 'Hoàng Văn E', email: 'hoangvane@gmail.com', avatarUrl: null, legitPoint: 350, friendCode: '5678-9012-3456', tradesCount: 89 },
];

const getRank = (legitPoint: number) => {
  if (legitPoint > 1000) return { name: 'Kim Cương', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' };
  if (legitPoint > 500) return { name: 'Vàng', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
  if (legitPoint > 200) return { name: 'Bạc', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' };
  if (legitPoint >= 100) return { name: 'Đồng', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  return { name: 'Sắt', color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400' };
};

export default function TradersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Traders</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý người dùng trade</p>
        </div>
        <Link
          href="/admin/traders/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Thêm Trader</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm trader..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
            />
          </div>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả Rank</option>
            <option value="diamond">Kim Cương</option>
            <option value="gold">Vàng</option>
            <option value="silver">Bạc</option>
            <option value="bronze">Đồng</option>
            <option value="iron">Sắt</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trader</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Friend Code</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Legit Point</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rank</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trades</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {traders.map((trader) => {
                const rank = getRank(trader.legitPoint);
                return (
                  <tr key={trader.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {trader.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{trader.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{trader.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {trader.friendCode}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-medium">{trader.legitPoint}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${rank.color}`}>
                        {rank.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{trader.tradesCount}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link 
                          href={`/admin/traders/${trader.id}/edit`}
                          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Hiển thị 1-5 của 5 traders</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50" disabled>
              Trước
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50" disabled>
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

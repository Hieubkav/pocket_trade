'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2, Ban, CheckCircle, Info } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const getRank = (legitPoint: number) => {
  if (legitPoint > 1000) return { name: 'Kim Cương', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' };
  if (legitPoint > 500) return { name: 'Vàng', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
  if (legitPoint > 200) return { name: 'Bạc', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' };
  if (legitPoint >= 100) return { name: 'Đồng', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' };
  return { name: 'Sắt', color: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400' };
};

export default function TradersPage() {
  const traders = useQuery(api.traders.list);
  const updateStatus = useMutation(api.traders.updateStatus);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const handleToggleBan = async (id: Id<"traders">, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
    await updateStatus({ id, status: newStatus });
  };

  const filteredTraders = traders?.filter(trader => {
    if (!statusFilter) return true;
    const traderStatus = trader.status || 'active';
    return traderStatus === statusFilter;
  });

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

      <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
        <Info size={16} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-blue-700 dark:text-blue-300">
          <span className="font-medium">Quy tắc xếp hạng:</span>{' '}
          <span className="text-stone-600 dark:text-stone-400">Sắt (&lt;100)</span> → 
          <span className="text-orange-600 dark:text-orange-400"> Đồng (100-200)</span> → 
          <span className="text-slate-500 dark:text-slate-400"> Bạc (201-500)</span> → 
          <span className="text-yellow-600 dark:text-yellow-400"> Vàng (501-1000)</span> → 
          <span className="text-cyan-600 dark:text-cyan-400"> Kim Cương (&gt;1000)</span>
        </div>
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
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="banned">Đã cấm</option>
          </select>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {!filteredTraders ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Đang tải...</td>
                </tr>
              ) : filteredTraders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Không có trader nào</td>
                </tr>
              ) : filteredTraders.map((trader) => {
                const rank = getRank(trader.legitPoint);
                const isBanned = trader.status === 'banned';
                return (
                  <tr key={trader._id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isBanned ? 'opacity-60' : ''}`}>
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
                        {trader.friendCode || '-'}
                      </code>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-medium">{trader.legitPoint}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${rank.color}`}>
                        {rank.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        isBanned 
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {isBanned ? 'Đã cấm' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleToggleBan(trader._id, trader.status)}
                          className={`p-2 rounded-lg transition-colors ${
                            isBanned 
                              ? 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20' 
                              : 'text-orange-500 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                          }`}
                          title={isBanned ? 'Bỏ cấm' : 'Cấm trader'}
                        >
                          {isBanned ? <CheckCircle size={16} /> : <Ban size={16} />}
                        </button>
                        <Link 
                          href={`/admin/traders/${trader._id}/edit`}
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
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filteredTraders ? `Hiển thị ${filteredTraders.length} traders` : 'Đang tải...'}
          </p>
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

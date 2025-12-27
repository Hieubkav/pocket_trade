'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function PacksPage() {
  const packs = useQuery(api.packs.list);
  const removePack = useMutation(api.packs.remove);

  const handleDelete = async (id: Id<"packs">) => {
    if (confirm('Bạn có chắc muốn xóa pack này?')) {
      await removePack({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Packs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các gói thẻ</p>
        </div>
        <Link
          href="/admin/packs/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Thêm Pack</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm pack..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
            />
          </div>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả Set</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pack</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Set</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Số thẻ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {!packs ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Đang tải...</td>
                </tr>
              ) : packs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">Chưa có pack nào</td>
                </tr>
              ) : packs.map((pack) => (
                <tr key={pack._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {pack.imageUrl ? (
                        <img src={pack.imageUrl} alt={pack.name} className="h-12 w-9 rounded object-cover" />
                      ) : (
                        <div className="h-12 w-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                          IMG
                        </div>
                      )}
                      <p className="font-medium text-slate-900 dark:text-white">{pack.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{pack.setName}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{pack.cardCount}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/packs/${pack._id}/edit`}
                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(pack._id)}
                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {packs ? `Hiển thị ${packs.length} packs` : 'Đang tải...'}
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

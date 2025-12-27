'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export default function SetsPage() {
  const sets = useQuery(api.sets.list);
  const removeSet = useMutation(api.sets.remove);

  const handleDelete = async (id: Id<"sets">) => {
    if (confirm('Bạn có chắc muốn xóa set này?')) {
      await removeSet({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sets</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý bộ sưu tập thẻ</p>
        </div>
        <Link
          href="/admin/sets/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Thêm Set</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm set..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
            />
          </div>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả Series</option>
            <option value="A">A Series</option>
            <option value="B">B Series</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Set</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Mã</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Series</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Packs</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thẻ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {!sets ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Đang tải...</td>
                </tr>
              ) : sets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">Chưa có set nào</td>
                </tr>
              ) : sets.map((set) => (
                <tr key={set._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {set.imageUrl ? (
                        <img src={set.imageUrl} alt={set.name} className="h-10 w-10 rounded object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                          IMG
                        </div>
                      )}
                      <p className="font-medium text-slate-900 dark:text-white">{set.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {set.setCode}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{set.seriesName}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{set.packCount}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{set.cardCount}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/sets/${set._id}/edit`}
                        className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(set._id)}
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
            {sets ? `Hiển thị ${sets.length} sets` : 'Đang tải...'}
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

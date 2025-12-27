'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Eye, Trash2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Đang hoạt động', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  matched: { label: 'Đã match', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  expired: { label: 'Hết hạn', color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function TradePostsPage() {
  const tradePosts = useQuery(api.tradePosts.list);
  const removePost = useMutation(api.tradePosts.remove);

  const handleDelete = async (id: Id<"tradePosts">) => {
    if (confirm('Bạn có chắc muốn xóa bài đăng này?')) {
      await removePost({ id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trade Posts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý các bài đăng trade</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo trader..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
            />
          </div>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="matched">Đã match</option>
            <option value="expired">Hết hạn</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trader</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hết hạn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Have / Want</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Requests</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ẩn</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {!tradePosts ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Đang tải...</td>
                </tr>
              ) : tradePosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">Chưa có bài đăng nào</td>
                </tr>
              ) : tradePosts.map((post) => {
                const status = statusConfig[post.status] || statusConfig.active;
                return (
                  <tr key={post._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{post.traderName}</p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{formatDate(post.expiresAt)}</td>
                    <td className="px-4 py-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        <span className="text-green-600 dark:text-green-400">{post.haveCards}</span>
                        {' / '}
                        <span className="text-blue-600 dark:text-blue-400">{post.wantCards}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{post.requestsCount}</td>
                    <td className="px-4 py-4">
                      {post.isHidden ? (
                        <span className="text-amber-600 dark:text-amber-400">Ẩn</span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link 
                          href={`/admin/trade-posts/${post._id}`}
                          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
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
            {tradePosts ? `Hiển thị ${tradePosts.length} bài đăng` : 'Đang tải...'}
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

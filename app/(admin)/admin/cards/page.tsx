'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';

const cards = [
  { id: '1', name: 'Pikachu', rarity: '◆◆', supertype: 'pokemon', subtype: 'Basic', type: 'Lightning', packId: 'pack1', cardNumber: '001/100', imageUrl: '/images/pikachu.png' },
  { id: '2', name: 'Charizard ex', rarity: '★★★', supertype: 'pokemon', subtype: 'ex', type: 'Fire', packId: 'pack1', cardNumber: '006/100', imageUrl: '/images/charizard.png' },
  { id: '3', name: 'Mewtwo', rarity: '◆◆◆◆', supertype: 'pokemon', subtype: 'Basic', type: 'Psychic', packId: 'pack2', cardNumber: '150/150', imageUrl: '/images/mewtwo.png' },
  { id: '4', name: 'Professor Oak', rarity: '◆', supertype: 'trainer', subtype: 'Supporter', type: 'Colorless', packId: 'pack1', cardNumber: '080/100', imageUrl: '/images/oak.png' },
  { id: '5', name: 'Blastoise', rarity: '◆◆◆', supertype: 'pokemon', subtype: 'Stage 2', type: 'Water', packId: 'pack1', cardNumber: '009/100', imageUrl: '/images/blastoise.png' },
];

const rarityColors: Record<string, string> = {
  '◆': 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  '◆◆': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  '◆◆◆': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  '◆◆◆◆': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  '★': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  '★★': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  '★★★': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function CardsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Thẻ Bài</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý thẻ Pokemon TCG Pocket</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors font-medium"
        >
          <Plus size={20} />
          <span>Thêm thẻ</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm thẻ..."
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:text-slate-200"
            />
          </div>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả loại</option>
            <option value="pokemon">Pokemon</option>
            <option value="trainer">Trainer</option>
          </select>
          <select className="h-10 px-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm outline-none focus:border-indigo-500 dark:text-slate-200">
            <option value="">Tất cả type</option>
            <option value="Fire">Fire</option>
            <option value="Water">Water</option>
            <option value="Lightning">Lightning</option>
            <option value="Psychic">Psychic</option>
            <option value="Grass">Grass</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thẻ</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Độ hiếm</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Số thẻ</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-9 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                        IMG
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{card.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{card.subtype}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${rarityColors[card.rarity] || 'bg-slate-100 text-slate-700'}`}>
                      {card.rarity}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400 capitalize">{card.supertype}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{card.type}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{card.cardNumber}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link 
                        href={`/admin/cards/${card.id}/edit`}
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
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">Hiển thị 1-5 của 5 thẻ</p>
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

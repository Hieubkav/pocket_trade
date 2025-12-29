'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Plus, Clock, ArrowRightLeft, Loader2, Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTraderAuth } from '../contexts/TraderAuthContext';

type TabType = 'public-offers' | 'my-offers' | 'history';

const tabs = [
  { id: 'public-offers' as TabType, label: 'Công khai' },
  { id: 'my-offers' as TabType, label: 'Của tôi' },
  { id: 'history' as TabType, label: 'Lịch sử' },
];

const ITEMS_PER_PAGE = 24;

// Countdown Timer Component
const CountdownTimer: React.FC<{ expiresAt: number; onExpired?: () => void }> = ({ expiresAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = Date.now();
      const diff = expiresAt - now;
      
      if (diff <= 0) {
        setTimeLeft('Hết hạn');
        onExpired?.();
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  return <span>{timeLeft}</span>;
};

const ExchangePage: React.FC = () => {
  const router = useRouter();
  const { trader } = useTraderAuth();
  const [activeTab, setActiveTab] = useState<TabType>('public-offers');
  
  // Filter & Sort states
  const [showFilters, setShowFilters] = useState(false);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState('');
  const [selectedSet, setSelectedSet] = useState('');
  const [sortBy, setSortBy] = useState('EXPIRES');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [expiredIds, setExpiredIds] = useState<Set<string>>(new Set());

  // Reset page when filters change
  const handleFilterChange = () => setCurrentPage(1);

  // Build query args based on active tab
  const getQueryArgs = () => {
    const base = {
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      sortBy,
      sortDir,
      onlineOnly: onlineOnly || undefined,
      rarity: selectedRarity || undefined,
      setName: selectedSet || undefined,
    };

    if (activeTab === 'public-offers') {
      return { ...base, status: 'active' };
    }
    if (activeTab === 'my-offers' && trader) {
      return { ...base, status: 'active', traderId: trader._id };
    }
    if (activeTab === 'history' && trader) {
      return { ...base, status: 'matched', traderId: trader._id };
    }
    return null;
  };

  const queryArgs = getQueryArgs();
  const tradePostsResult = useQuery(
    api.tradePosts.listPaginated,
    queryArgs || 'skip'
  );

  const settings = useQuery(api.settings.get);
  const todayPostsCount = useQuery(
    api.tradePosts.countTodayPosts,
    trader ? { traderId: trader._id } : 'skip'
  );

  const maxPostsPerDay = settings?.limitTradePostPerTrader ?? 5;
  const remainingPosts = maxPostsPerDay - (todayPostsCount ?? 0);

  const rawPosts = tradePostsResult?.items ?? [];
  // Filter out expired posts on client-side for realtime update
  const posts = activeTab !== 'history' 
    ? rawPosts.filter(p => p.expiresAt > Date.now() && !expiredIds.has(p._id))
    : rawPosts;
  const totalPages = tradePostsResult?.totalPages ?? 1;
  const total = tradePostsResult?.total ?? 0;
  const rarities = tradePostsResult?.rarities ?? [];
  const sets = tradePostsResult?.sets ?? [];

  const activeFiltersCount = [onlineOnly, selectedRarity, selectedSet].filter(Boolean).length;

  // Handle when a post expires
  const handlePostExpired = (postId: string) => {
    setExpiredIds(prev => new Set([...prev, postId]));
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-black text-slate-900">Giao dịch</h1>
        {trader && (
          <div className="flex items-center gap-1.5 bg-slate-100 rounded-full px-2.5 py-1">
            <span className={`text-sm font-bold ${remainingPosts > 0 ? 'text-teal-600' : 'text-red-500'}`}>
              {remainingPosts}/{maxPostsPerDay}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-2">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={`flex-1 py-3 text-xs font-bold transition-all relative ${
                activeTab === tab.id ? 'text-teal-600' : 'text-slate-400'
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

      {/* Filters - Only show for public-offers */}
      {activeTab === 'public-offers' && (
        <div className="bg-white border-b border-slate-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Lọc
              {activeFiltersCount > 0 && (
                <span className="bg-white text-teal-600 text-[10px] font-bold px-1.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="flex items-center gap-1 ml-auto">
              <select
                value={`${sortBy}-${sortDir}`}
                onChange={(e) => {
                  const [by, dir] = e.target.value.split('-');
                  setSortBy(by);
                  setSortDir(dir as 'ASC' | 'DESC');
                  handleFilterChange();
                }}
                className="text-xs bg-slate-100 border-0 rounded-lg py-1.5 pl-2 pr-6 focus:ring-2 focus:ring-teal-500"
              >
                <option value="EXPIRES-ASC">Sắp hết hạn</option>
                <option value="EXPIRES-DESC">Còn nhiều thời gian</option>
              </select>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-2 space-y-2">
              {/* Online Only */}
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => { setOnlineOnly(e.target.checked); handleFilterChange(); }}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-700">Chỉ trader đang online</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* Rarity Filter */}
                <div className="relative">
                  <select
                    value={selectedRarity}
                    onChange={(e) => { setSelectedRarity(e.target.value); handleFilterChange(); }}
                    className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Tất cả độ hiếm</option>
                    {rarities.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Set Filter */}
                <div className="relative">
                  <select
                    value={selectedSet}
                    onChange={(e) => { setSelectedSet(e.target.value); handleFilterChange(); }}
                    className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Tất cả Set</option>
                    {sets.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trade List */}
      <div className="px-3 py-3 space-y-2">
        {tradePostsResult === undefined ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">
              {activeTab === 'history'
                ? 'Chưa có giao dịch nào hoàn thành'
                : 'Chưa có bài đăng nào'}
            </p>
            {activeTab === 'my-offers' && trader && (
              <button
                onClick={() => router.push('/trade/new')}
                className="mt-3 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-lg"
              >
                Tạo bài đăng
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              onClick={() => router.push(`/trade/${post._id}`)}
              className="bg-white rounded-xl p-3 active:bg-slate-50 transition-colors cursor-pointer border border-slate-100"
            >
              {/* Header: Avatar + Name + Time */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Avatar with online badge */}
                  <div className="relative">
                    {post.traderAvatar ? (
                      <img
                        src={post.traderAvatar}
                        alt={post.traderName}
                        className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                        {post.traderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Online/Offline badge */}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      post.traderIsOnline ? 'bg-green-500' : 'bg-slate-300'
                    }`} />
                  </div>
                  <span className="text-sm font-bold text-slate-900">{post.traderName}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">
                    {activeTab === 'history' ? (
                      'Đã hoàn thành'
                    ) : (
                      <CountdownTimer 
                        expiresAt={post.expiresAt} 
                        onExpired={() => handlePostExpired(post._id)}
                      />
                    )}
                  </span>
                </div>
              </div>

              {/* Cards Preview */}
              <div className="flex items-center gap-2">
                {/* Have Cards */}
                <div className="flex-1">
                  <div className="text-[10px] text-teal-600 font-bold mb-1">CÓ ({post.haveCardsCount})</div>
                  <div className="flex gap-1">
                    {post.haveCards.slice(0, 4).map((card) => (
                      <img
                        key={card._id}
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-10 h-14 object-cover rounded border border-teal-200"
                      />
                    ))}
                    {post.haveCardsCount > 4 && (
                      <div className="w-10 h-14 rounded border border-teal-200 bg-teal-50 flex items-center justify-center text-xs font-bold text-teal-600">
                        +{post.haveCardsCount - 4}
                      </div>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRightLeft className="w-4 h-4 text-slate-300 flex-shrink-0" />

                {/* Want Cards */}
                <div className="flex-1">
                  <div className="text-[10px] text-blue-600 font-bold mb-1">CẦN ({post.wantCardsCount})</div>
                  <div className="flex gap-1">
                    {post.wantCards.slice(0, 4).map((card) => (
                      <img
                        key={card._id}
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-10 h-14 object-cover rounded border border-blue-200"
                      />
                    ))}
                    {post.wantCardsCount > 4 && (
                      <div className="w-10 h-14 rounded border border-blue-200 bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600">
                        +{post.wantCardsCount - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats & Pagination */}
      {posts.length > 0 && (
        <div className="px-4 space-y-3">
          <p className="text-xs text-slate-400 font-medium">
            Tổng: {total} bài đăng
          </p>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                  <span key={`dots-${idx}`} className="px-2 text-slate-400 text-sm">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`min-w-[32px] h-8 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-teal-500 text-white'
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* FAB */}
      {trader && (
        <button
          onClick={() => router.push('/trade/new')}
          className="fixed bottom-24 right-4 w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-600/30 active:scale-90 transition-transform z-50 md:bottom-8"
        >
          <Plus className="w-5 h-5 text-white stroke-[2.5px]" />
        </button>
      )}
    </div>
  );
};

export default ExchangePage;

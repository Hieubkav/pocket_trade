'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Search, ArrowLeftRight, Loader2, Filter, ChevronDown, Check } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useTraderAuth } from '../contexts/TraderAuthContext';
import { Id } from '../../convex/_generated/dataModel';

interface CreateTradePageProps {
  onBack: () => void;
  onSuccess?: () => void;
}

type CardData = {
  _id: Id<"cards">;
  name: string;
  imageUrl: string;
  type: string;
  subtype: string;
  setName: string;
  packName: string;
  rarityName: string;
};

const ITEMS_PER_PAGE = 24;

const CreateTradePage: React.FC<CreateTradePageProps> = ({ onBack, onSuccess }) => {
  const { trader } = useTraderAuth();
  const [haveCards, setHaveCards] = useState<CardData[]>([]);
  const [wantCards, setWantCards] = useState<CardData[]>([]);
  const [selectingFor, setSelectingFor] = useState<'have' | 'want' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedSet, setSelectedSet] = useState('All');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [sortBy, setSortBy] = useState('ID');
  const [sortDir, setSortDir] = useState<'ASC' | 'DESC'>('ASC');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSet, selectedRarity, sortBy, sortDir]);

  // Query cards
  const cardsResult = useQuery(
    api.cards.listPaginated,
    selectingFor ? {
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      search: debouncedSearch || undefined,
      collection: selectedSet !== 'All' ? selectedSet : undefined,
      rarity: selectedRarity !== 'All' ? selectedRarity : undefined,
      sortBy,
      sortDir,
    } : 'skip'
  );

  const settings = useQuery(api.settings.get);
  const createTradePost = useMutation(api.tradePosts.create);

  const maxCardsPerPost = settings?.limitCardPerPost ?? 10;
  const collections = cardsResult?.collections ?? [];
  const rarities = cardsResult?.rarities ?? [];
  const totalPages = cardsResult?.totalPages ?? 1;
  const total = cardsResult?.total ?? 0;
  const cards = (cardsResult?.items ?? []) as CardData[];

  const currentCards = selectingFor === 'have' ? haveCards : wantCards;
  const setCurrentCards = selectingFor === 'have' ? setHaveCards : setWantCards;

  const handleSelectCard = (card: CardData) => {
    if (currentCards.length >= maxCardsPerPost) return;
    if (!currentCards.find(c => c._id === card._id)) {
      setCurrentCards([...currentCards, card]);
    }
  };

  const handleRemoveCard = (cardId: Id<"cards">) => {
    setCurrentCards(currentCards.filter(c => c._id !== cardId));
  };

  const handleSubmit = async () => {
    if (!trader || haveCards.length === 0 || wantCards.length === 0) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await createTradePost({
        traderId: trader._id,
        haveCardIds: haveCards.map(c => c._id),
        wantCardIds: wantCards.map(c => c._id),
      });
      onSuccess?.();
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = haveCards.length > 0 && wantCards.length > 0 && !isSubmitting;

  const closeModal = () => {
    setSelectingFor(null);
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedSet('All');
    setSelectedRarity('All');
    setSortBy('ID');
    setSortDir('ASC');
    setCurrentPage(1);
    setShowFilters(false);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible + 2) {
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

  const activeFiltersCount = [
    selectedSet !== 'All',
    selectedRarity !== 'All',
    sortBy !== 'ID' || sortDir !== 'ASC'
  ].filter(Boolean).length;

  return (
    <>
      {/* Card Selector Modal */}
      {selectingFor && (
        <div className="fixed inset-0 z-[100]">
          <div 
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={closeModal}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[90vh] flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b shrink-0">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  {selectingFor === 'have' ? 'Chọn thẻ bạn CÓ' : 'Chọn thẻ bạn CẦN'}
                </h2>
                <p className="text-xs text-slate-400">{currentCards.length}/{maxCardsPerPost} thẻ</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="px-3 py-2 border-b space-y-2 shrink-0">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm thẻ..."
                    className="w-full bg-slate-100 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    showFilters || activeFiltersCount > 0
                      ? 'bg-teal-500 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {activeFiltersCount > 0 && (
                    <span className="bg-white text-teal-600 text-xs font-bold px-1.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-2 gap-2">
                  {/* Set Filter */}
                  <div className="relative">
                    <select
                      value={selectedSet}
                      onChange={(e) => setSelectedSet(e.target.value)}
                      className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="All">Tất cả Set</option>
                      {collections.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Rarity Filter */}
                  <div className="relative">
                    <select
                      value={selectedRarity}
                      onChange={(e) => setSelectedRarity(e.target.value)}
                      className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="All">Tất cả độ hiếm</option>
                      {rarities.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Sort */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="ID">Theo số thẻ</option>
                      <option value="NAME">Theo tên</option>
                      <option value="RARITY">Theo độ hiếm</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Sort Direction */}
                  <div className="relative">
                    <select
                      value={sortDir}
                      onChange={(e) => setSortDir(e.target.value as 'ASC' | 'DESC')}
                      className="w-full appearance-none bg-slate-100 rounded-lg py-2 pl-3 pr-8 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="ASC">Tăng dần</option>
                      <option value="DESC">Giảm dần</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Results count */}
              {cardsResult && (
                <p className="text-xs text-slate-400">
                  {total > 0 ? `${total} kết quả` : 'Không có kết quả'}
                </p>
              )}
            </div>

            {/* Selected Cards Preview */}
            {currentCards.length > 0 && (
              <div className="px-3 py-2 border-b bg-teal-50 shrink-0">
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {currentCards.map(card => (
                    <div key={card._id} className="relative shrink-0 w-12">
                      <img 
                        src={card.imageUrl} 
                        alt={card.name}
                        className="w-full aspect-[3/4] object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveCard(card._id)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cards Grid */}
            <div className="flex-1 overflow-auto p-3">
              {cardsResult === undefined ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                </div>
              ) : cards.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-sm">
                  Không tìm thấy thẻ
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {cards.map((card) => {
                      const isSelected = currentCards.some(c => c._id === card._id);
                      
                      return (
                        <button
                          key={card._id}
                          onClick={() => isSelected ? handleRemoveCard(card._id) : handleSelectCard(card)}
                          className={`relative rounded-xl overflow-hidden transition-all active:scale-95 ${
                            isSelected ? 'ring-2 ring-teal-500' : ''
                          }`}
                        >
                          <img 
                            src={card.imageUrl} 
                            alt={card.name} 
                            className="w-full aspect-[3/4] object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-teal-500/30 flex items-center justify-center">
                              <div className="bg-teal-500 rounded-full p-1">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1 mt-4">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                          <span key={`dots-${idx}`} className="px-2 text-slate-400">...</span>
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
                </>
              )}
            </div>

            {/* Done Button */}
            <div className="p-3 border-t shrink-0">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-teal-500 text-white rounded-xl text-sm font-bold"
              >
                Xong ({currentCards.length} thẻ)
              </button>
            </div>
          </div>
        </div>
      )}
    
      {/* Main Page */}
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white border-b sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-sm font-bold text-slate-800">Tạo giao dịch</h1>
          <div className="w-7" />
        </div>

        <div className="flex-1 p-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Have Cards */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase">Thẻ bạn có</h2>
              <span className="text-xs text-slate-400">{haveCards.length}/{maxCardsPerPost}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {haveCards.map((card) => (
                <div key={card._id} className="relative w-16">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => setHaveCards(haveCards.filter(c => c._id !== card._id))}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {haveCards.length < maxCardsPerPost && (
                <button 
                  onClick={() => setSelectingFor('have')}
                  className="w-16 aspect-[3/4] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-300" />
                </button>
              )}
            </div>
          </div>

          {/* Exchange icon */}
          <div className="flex justify-center">
            <div className="bg-teal-500 rounded-full p-2.5 shadow-lg">
              <ArrowLeftRight className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Want Cards */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase">Thẻ bạn cần</h2>
              <span className="text-xs text-slate-400">{wantCards.length}/{maxCardsPerPost}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {wantCards.map((card) => (
                <div key={card._id} className="relative w-16">
                  <img 
                    src={card.imageUrl} 
                    alt={card.name} 
                    className="w-full aspect-[3/4] object-cover rounded-lg"
                  />
                  <button 
                    onClick={() => setWantCards(wantCards.filter(c => c._id !== card._id))}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {wantCards.length < maxCardsPerPost && (
                <button 
                  onClick={() => setSelectingFor('want')}
                  className="w-16 aspect-[3/4] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:border-teal-500 hover:bg-teal-50 transition-colors"
                >
                  <Plus className="w-5 h-5 text-slate-300" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-slate-50 to-transparent pt-6">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              canSubmit 
                ? 'bg-teal-500 text-white shadow-lg active:scale-[0.98]' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              'Đăng giao dịch'
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default CreateTradePage;

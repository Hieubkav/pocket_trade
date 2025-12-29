'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { SortOption, SortDirection, FilterState, PokemonCard, PokemonType } from '../../types';
import CardItem from '../../components/CardItem';
import SearchAndFilters from '../../components/SearchAndFilters';

const PAGE_SIZE = 12;

export default function LibraryPage() {
  const router = useRouter();
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [allCards, setAllCards] = useState<PokemonCard[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreFnRef = useRef<() => void>(() => {});
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('ID');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    collection: 'All',
    type: 'All'
  });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query with server-side filtering
  const cardsData = useQuery(api.cards.listPaginated, { 
    limit: PAGE_SIZE, 
    cursor,
    search: debouncedSearch || undefined,
    category: filters.category,
    collection: filters.collection,
    cardType: filters.type,
    sortBy: sortOption,
    sortDir: sortDirection,
  });

  // Reset cards when filters/search/sort change
  useEffect(() => {
    setCursor(undefined);
    setAllCards([]);
  }, [debouncedSearch, filters, sortOption, sortDirection]);

  // Append new cards when data arrives
  useEffect(() => {
    if (cardsData?.items) {
      const newCards: PokemonCard[] = cardsData.items.map(card => ({
        id: card._id,
        name: card.name,
        hp: 0,
        type: card.type as PokemonType,
        rarity: parseInt(card.rarityName?.replace(/[^\d]/g, '') || '1') || 1,
        rarityName: card.rarityName,
        rarityImageUrl: card.rarityImageUrl,
        imageUrl: card.imageUrl,
        subName: card.supertype === 'pokemon' ? card.subtype : '',
        collection: card.setName || card.packName,
        category: card.supertype === 'pokemon' ? 'Pokemon' : 'Trainer',
        cardNumber: card.cardNumber,
        setCode: card.setCode,
      }));
      
      if (cursor === undefined) {
        setAllCards(newCards);
      } else {
        setAllCards(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const uniqueNew = newCards.filter(c => !existingIds.has(c.id));
          return [...prev, ...uniqueNew];
        });
      }
      setIsLoadingMore(false);
    }
  }, [cardsData, cursor]);

  const handleSortChange = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortOption(option);
      setSortDirection('ASC');
    }
  };

  const loadMore = useCallback(() => {
    if (cardsData?.hasMore && cardsData?.nextCursor && !isLoadingMore) {
      setIsLoadingMore(true);
      setCursor(cardsData.nextCursor);
    }
  }, [cardsData, isLoadingMore]);

  // Keep ref updated with latest loadMore
  useEffect(() => {
    loadMoreFnRef.current = loadMore;
  }, [loadMore]);

  // Create observer once
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreFnRef.current();
        }
      },
      { threshold: 0.1 }
    );
    return () => observerRef.current?.disconnect();
  }, []);

  // Callback ref - observe element when it renders
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (node && observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current.observe(node);
    }
  }, []);

  if (cardsData === undefined && allCards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <SearchAndFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOption={sortOption}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        filters={filters}
        setFilters={setFilters}
        resultCount={cardsData?.total ?? 0}
        collections={cardsData?.collections ?? []}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        <main className="mt-8">
          {allCards.length > 0 ? (
            <>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
                {allCards.map((card) => (
                  <CardItem 
                    key={card.id} 
                    card={card} 
                    onClick={() => router.push(`/card/${card.id}`)}
                  />
                ))}
              </div>
              
              {/* Load more trigger */}
              <div ref={sentinelRef} className="py-8 flex justify-center">
                {isLoadingMore && (
                  <div className="animate-spin w-6 h-6 border-3 border-teal-600 border-t-transparent rounded-full" />
                )}
                {cardsData?.hasMore && !isLoadingMore && (
                  <div className="h-1" /> 
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 border border-slate-200 shadow-sm">
                  <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-widest">Không tìm thấy kết quả</h2>
              <p className="text-sm font-medium">Thử điều chỉnh từ khóa hoặc bộ lọc của bạn.</p>
              <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ category: 'All', collection: 'All', type: 'All' });
                  }}
                  className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all uppercase tracking-tighter"
              >
                  Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

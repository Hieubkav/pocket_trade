'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { POKEMON_CARDS } from '../data';
import { SortOption, SortDirection, FilterState } from '../types';
import CardItem from '../components/CardItem';
import SearchAndFilters from '../components/SearchAndFilters';

export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('ID');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    collection: 'All',
    type: 'All'
  });

  const collections = useMemo(() => {
    const set = new Set(POKEMON_CARDS.map(c => c.collection));
    return Array.from(set).sort();
  }, []);

  const filteredAndSortedCards = useMemo(() => {
    let result = POKEMON_CARDS.filter(card => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.category === 'All' || card.category === filters.category;
      const matchesCollection = filters.collection === 'All' || card.collection === filters.collection;
      const matchesType = filters.type === 'All' || card.type === filters.type;

      return matchesSearch && matchesCategory && matchesCollection && matchesType;
    });

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'NAME': 
          comparison = a.name.localeCompare(b.name);
          break;
        case 'TYPE': 
          comparison = a.type.localeCompare(b.type);
          break;
        case 'ID': 
          comparison = parseInt(a.id) - parseInt(b.id);
          break;
        default: 
          comparison = 0;
      }
      return sortDirection === 'ASC' ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, sortOption, sortDirection, filters]);

  const handleSortChange = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortOption(option);
      setSortDirection('ASC');
    }
  };

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
        resultCount={filteredAndSortedCards.length}
        collections={collections}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
        <main className="mt-8">
          {filteredAndSortedCards.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6 md:gap-8 lg:gap-10">
              {filteredAndSortedCards.map((card) => (
                <CardItem 
                  key={card.id} 
                  card={card} 
                  onClick={() => router.push(`/card/${card.id}`)}
                />
              ))}
            </div>
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

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Info, Search, ListFilter, RotateCcw, ChevronRight, Check } from 'lucide-react';
import { PokemonCard } from '../types';

interface CardDetailProps {
  card: PokemonCard;
  collections?: string[];
  onBack: () => void;
}

const CardDetail: React.FC<CardDetailProps> = ({ card, collections = [], onBack }) => {
  const [activeTab, setActiveTab] = useState<'offering' | 'seeking'>('offering');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string>('Tat ca');
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <div className="bg-[#1e293b] text-white px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <button onClick={onBack} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-bold tracking-tight">Bài đăng giao dịch</h1>
        <div className="w-6" />
      </div>

      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex gap-4">
          <div className="relative w-24 h-32 flex-shrink-0 shadow-lg rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={card.imageUrl} 
              alt={card.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-grow flex flex-col justify-between">
            <div className="flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">{card.name} {card.subName}</h2>
                  <Info className="w-4 h-4 text-slate-400 stroke-[2.5px]" />
                </div>
              </div>
              <div className="flex gap-1 mt-1">
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-[8px] text-white">★</div>
                <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center text-[8px] text-white">★</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4">
              <div className="bg-orange-100 border border-orange-200 text-orange-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                {card.collection}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow bg-white rounded-t-[2.5rem] shadow-2xl mt-2 flex flex-col">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('offering')}
            className={`flex-1 py-6 text-sm font-black transition-all relative uppercase tracking-tighter ${activeTab === 'offering' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Người đang tìm
            {activeTab === 'offering' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-500 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('seeking')}
            className={`flex-1 py-6 text-sm font-black transition-all relative uppercase tracking-tighter ${activeTab === 'seeking' ? 'text-slate-900' : 'text-slate-400'}`}
          >
            Người đang có
            {activeTab === 'seeking' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-teal-500 rounded-t-full"></div>}
          </button>
        </div>

        <div className="p-4 flex gap-2 relative">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Tìm thẻ tôi có thể trao đổi..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-xs font-medium placeholder:text-slate-300 focus:outline-none"
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 border px-4 h-full rounded-xl font-bold text-xs uppercase tracking-tighter transition-all ${isFilterOpen ? 'bg-teal-50 border-teal-500 text-teal-600' : 'border-slate-100 text-slate-500 bg-white'}`}
            >
              <ListFilter className="w-4 h-4" />
              {selectedSet === 'Tat ca' ? 'Bo loc' : selectedSet}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] py-2 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chon Pack / Set</span>
                </div>
                <button 
                  onClick={() => { setSelectedSet('Tat ca'); setIsFilterOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedSet === 'Tat ca' ? 'text-teal-600 bg-teal-50/50' : 'text-slate-700'}`}
                >
                  TAT CA PACKS
                  {selectedSet === 'Tat ca' && <Check className="w-3.5 h-3.5" />}
                </button>
                {collections.map(coll => (
                  <button 
                    key={coll}
                    onClick={() => { setSelectedSet(coll); setIsFilterOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold flex items-center justify-between hover:bg-slate-50 transition-colors ${selectedSet === coll ? 'text-teal-600 bg-teal-50/50' : 'text-slate-700'}`}
                  >
                    {coll.toUpperCase()}
                    {selectedSet === coll && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="px-6 text-[11px] text-slate-500 text-center font-medium leading-relaxed italic">
          {activeTab === 'offering' 
            ? `Những người chơi này đang cần lá ${card.name}, dưới đây là các thẻ họ sẵn sàng đổi cho bạn:`
            : `Những người chơi này đang sở hữu lá ${card.name}, dưới đây là các thẻ họ muốn nhận lại:`
          }
        </p>

        <div className="mt-6 space-y-4 px-4 pb-12">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-0.5 overflow-hidden border border-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover bg-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-800">lheb HFD</span>
                    <div className="flex items-center gap-0.5 bg-slate-200/50 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-600">
                      <RotateCcw className="w-2.5 h-2.5" />
                      8
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">1 giờ trước</span>
                </div>
              </div>
              <button className="bg-teal-500 text-white px-6 py-2.5 rounded-full text-xs font-black shadow-[0_4px_12px_rgba(20,184,166,0.3)] transition-transform active:scale-95 uppercase tracking-wider">
                Giao dịch
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-teal-500 uppercase tracking-tight">
                  {activeTab === 'offering' ? 'Thẻ họ có' : 'Thẻ họ cần'}
                </h3>
                <button className="text-[10px] text-slate-400 font-bold flex items-center">
                  Xem tất cả <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-16">
                   <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-slate-100">
                     <img src="https://assets.tcgdex.net/en/tcgp/A1/036/high.webp" alt="Charizard" className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-[7px] text-white font-black px-1 py-0.5 text-center truncate">Charizard ex</div>
                   </div>
                   <div className="bg-purple-100 border border-purple-200 text-purple-700 text-[6px] font-black p-0.5 rounded text-center leading-[1.1] uppercase">
                     GENETIC<br/>APEX
                   </div>
                </div>
                
                <div className="flex flex-col gap-1 w-16">
                   <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-slate-100">
                     <img src="https://assets.tcgdex.net/en/tcgp/A1/056/high.webp" alt="Blastoise" className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-[7px] text-white font-black px-1 py-0.5 text-center truncate">Blastoise ex</div>
                   </div>
                   <div className="bg-blue-100 border border-blue-200 text-blue-700 text-[6px] font-black p-0.5 rounded text-center leading-[1.1] uppercase">
                     GENETIC<br/>APEX
                   </div>
                </div>
              </div>

              <p className="pt-2 text-[10px] text-slate-400 font-medium italic">
                {activeTab === 'offering' 
                  ? `Người này sẵn sàng đổi lấy ${card.name} của bạn.`
                  : `Họ đang sở hữu lá ${card.name} và muốn trao đổi.`
                }
              </p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 p-0.5 overflow-hidden border border-slate-100">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Master" alt="avatar" className="w-full h-full object-cover bg-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-black text-slate-800">MasterTCG_VN</span>
                    <div className="flex items-center gap-0.5 bg-slate-200/50 px-1.5 py-0.5 rounded text-[9px] font-black text-slate-600">
                      <RotateCcw className="w-2.5 h-2.5" />
                      15
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">3 giờ trước</span>
                </div>
              </div>
              <button className="bg-teal-500 text-white px-6 py-2.5 rounded-full text-xs font-black shadow-[0_4px_12px_rgba(20,184,166,0.3)] transition-transform active:scale-95 uppercase tracking-wider">
                Giao dịch
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-teal-500 uppercase tracking-tight">
                  {activeTab === 'offering' ? 'Thẻ họ có' : 'Thẻ họ cần'}
                </h3>
                <button className="text-[10px] text-slate-400 font-bold flex items-center">
                  Xem tất cả <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-16">
                   <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-slate-100">
                     <img src="https://assets.tcgdex.net/en/tcgp/A1/129/high.webp" alt="Mewtwo" className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-[7px] text-white font-black px-1 py-0.5 text-center truncate">Mewtwo ex</div>
                   </div>
                   <div className="bg-orange-100 border border-orange-200 text-orange-700 text-[6px] font-black p-0.5 rounded text-center leading-[1.1] uppercase">
                     GENETIC<br/>APEX
                   </div>
                </div>
                
                <div className="flex flex-col gap-1 w-16">
                   <div className="relative aspect-[3/4] rounded-lg overflow-hidden shadow-sm border border-slate-100">
                     <img src="https://assets.tcgdex.net/en/tcgp/A1/123/high.webp" alt="Gengar" className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 text-[7px] text-white font-black px-1 py-0.5 text-center truncate">Gengar ex</div>
                   </div>
                   <div className="bg-pink-100 border border-pink-200 text-pink-700 text-[6px] font-black p-0.5 rounded text-center leading-[1.1] uppercase">
                     GENETIC<br/>APEX
                   </div>
                </div>
              </div>

              <p className="pt-2 text-[10px] text-slate-400 font-medium italic">
                {activeTab === 'offering' 
                  ? `Người này sẵn sàng đổi lấy ${card.name} của bạn.`
                  : `Họ đang sở hữu lá ${card.name} và muốn trao đổi.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;

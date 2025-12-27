'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Plus, X, Search, Check, RefreshCcw } from 'lucide-react';
import { POKEMON_CARDS } from '../data';
import { PokemonCard } from '../types';

interface CreateTradePageProps {
  onBack: () => void;
  onSubmit?: (data: { offering: PokemonCard; seeking: PokemonCard; language: string }) => void;
}

type Step = 'offering' | 'seeking' | 'confirm';



const CreateTradePage: React.FC<CreateTradePageProps> = ({ onBack, onSubmit }) => {
  const [step, setStep] = useState<Step>('offering');
  const [offeringCard, setOfferingCard] = useState<PokemonCard | null>(null);
  const [seekingCard, setSeekingCard] = useState<PokemonCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectingCard, setIsSelectingCard] = useState<'offering' | 'seeking' | null>(null);

  const filteredCards = useMemo(() => {
    if (!searchTerm) return POKEMON_CARDS;
    return POKEMON_CARDS.filter(card => 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.collection.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSelectCard = (card: PokemonCard) => {
    if (isSelectingCard === 'offering') {
      setOfferingCard(card);
      setIsSelectingCard(null);
      setSearchTerm('');
      if (!seekingCard) setStep('seeking');
    } else if (isSelectingCard === 'seeking') {
      setSeekingCard(card);
      setIsSelectingCard(null);
      setSearchTerm('');
      setStep('confirm');
    }
  };

  const handleSubmit = () => {
    if (offeringCard && seekingCard && onSubmit) {
      onSubmit({ offering: offeringCard, seeking: seekingCard, language: 'ANY' });
    }
    onBack();
  };

  const canSubmit = offeringCard && seekingCard;

  if (isSelectingCard) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 flex items-center gap-3">
          <button onClick={() => { setIsSelectingCard(null); setSearchTerm(''); }} className="p-1">
            <ChevronLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">
            {isSelectingCard === 'offering' ? 'Chọn thẻ bạn có' : 'Chọn thẻ bạn cần'}
          </h1>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm thẻ..."
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium placeholder:text-slate-300 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="flex-1 px-4 pb-24">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleSelectCard(card)}
                className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 active:scale-95 transition-transform"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2">
                  <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                </div>
                <p className="text-[10px] font-black text-slate-800 truncate">{card.name} {card.subName}</p>
                <p className="text-[8px] font-bold text-slate-400 truncate uppercase">{card.collection}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 py-4 flex items-center justify-between">
        <button onClick={onBack} className="p-1">
          <ChevronLeft className="w-6 h-6 text-slate-800" />
        </button>
        <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Tạo bài đăng</h1>
        <div className="w-6" />
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center gap-2 px-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'offering' ? 'bg-teal-500 text-white' : offeringCard ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {offeringCard ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <div className={`flex-1 h-1 rounded ${offeringCard ? 'bg-teal-500' : 'bg-slate-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'seeking' ? 'bg-teal-500 text-white' : seekingCard ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
            {seekingCard ? <Check className="w-4 h-4" /> : '2'}
          </div>
          <div className={`flex-1 h-1 rounded ${seekingCard ? 'bg-teal-500' : 'bg-slate-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 'confirm' ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
            3
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Thẻ bạn có (Offering)</h2>
          
          {offeringCard ? (
            <div className="flex items-center gap-4">
              <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img src={offeringCard.imageUrl} alt={offeringCard.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setOfferingCard(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800">{offeringCard.name} {offeringCard.subName}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">{offeringCard.collection}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsSelectingCard('offering')}
              className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-teal-500 hover:bg-teal-50/30 transition-all"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-400">Chọn thẻ bạn muốn đổi</span>
            </button>
          )}
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-full p-3 shadow-md border border-slate-100">
            <RefreshCcw className="w-5 h-5 text-teal-500" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4">Thẻ bạn cần (Seeking)</h2>
          
          {seekingCard ? (
            <div className="flex items-center gap-4">
              <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-slate-200">
                <img src={seekingCard.imageUrl} alt={seekingCard.name} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSeekingCard(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800">{seekingCard.name} {seekingCard.subName}</p>
                <p className="text-xs font-bold text-slate-400 uppercase">{seekingCard.collection}</p>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsSelectingCard('seeking')}
              className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-teal-500 hover:bg-teal-50/30 transition-all"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-400">Chọn thẻ bạn muốn nhận</span>
            </button>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent pt-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl text-sm font-black uppercase tracking-tight transition-all ${
            canSubmit 
              ? 'bg-teal-500 text-white shadow-[0_4px_16px_rgba(20,184,166,0.4)] active:scale-[0.98]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          Đăng bài giao dịch
        </button>
      </div>
    </div>
  );
};

export default CreateTradePage;

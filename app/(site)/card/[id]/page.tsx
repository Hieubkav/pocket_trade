'use client';

import { useRouter, useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import CardDetail from '../../../components/CardDetail';
import { PokemonCard, PokemonType } from '../../../types';

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  
  const cardsData = useQuery(api.cards.list);
  
  if (cardsData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const cardData = cardsData.find(c => c._id === cardId);
  
  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Khong tim thay the</h1>
          <button 
            onClick={() => router.back()}
            className="text-teal-600 font-medium hover:underline"
          >
            Quay lai
          </button>
        </div>
      </div>
    );
  }

  const card: PokemonCard = {
    id: cardData._id,
    name: cardData.name,
    hp: 0,
    type: cardData.type as PokemonType,
    rarity: parseInt(cardData.rarityName?.replace(/[^\d]/g, '') || '1') || 1,
    imageUrl: cardData.imageUrl,
    subName: cardData.subtype,
    collection: cardData.setName || cardData.packName,
    category: cardData.supertype === 'pokemon' ? 'Pokemon' : 'Trainer',
    cardNumber: cardData.cardNumber,
  };

  const collections = Array.from(new Set(cardsData.map(c => c.setName || c.packName).filter(Boolean)));
  
  return (
    <CardDetail 
      card={card}
      collections={collections}
      onBack={() => router.back()}
    />
  );
}

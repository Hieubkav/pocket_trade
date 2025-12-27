'use client';

import { useRouter, useParams } from 'next/navigation';
import CardDetail from '../../components/CardDetail';
import { POKEMON_CARDS } from '../../data';

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params.id as string;
  
  const card = POKEMON_CARDS.find(c => c.id === cardId);
  
  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Card not found</h1>
          <button 
            onClick={() => router.back()}
            className="text-teal-600 font-medium hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <CardDetail 
      card={card}
      onBack={() => router.back()}
    />
  );
}

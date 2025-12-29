'use client';

import React, { useState } from 'react';
import { PokemonCard } from '../types';

interface CardItemProps {
  card: PokemonCard;
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cardRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;
    const centerX = cardRect.width / 2;
    const centerY = cardRect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col gap-1.5 md:gap-3 group" onClick={onClick}>
      <div 
        className="relative aspect-[3/4] cursor-pointer perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        <div className="w-full h-full rounded-lg md:rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white flex items-center justify-center relative group-hover:shadow-xl group-hover:border-teal-200 transition-all duration-300">
            <img 
                src={card.imageUrl} 
                alt={card.name} 
                className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${card.id}/300/400`;
                }}
            />
            {card.cardNumber && (
              <div className="absolute bottom-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-bold text-white tracking-tighter">
                {card.cardNumber}
              </div>
            )}
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-[15px] tracking-tight text-slate-900 uppercase group-hover:text-teal-600 transition-colors leading-tight truncate">
            {card.name} <span className="ml-0.5">{card.subName}</span>
          </h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0.5 md:gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${i < card.rarity ? 'bg-slate-600' : 'bg-slate-200'}`}
              />
            ))}
          </div>
          <span className="text-[7px] md:text-[9px] text-slate-400 truncate max-w-[70px] md:max-w-[110px] font-bold uppercase tracking-tighter">
            {card.collection}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardItem;

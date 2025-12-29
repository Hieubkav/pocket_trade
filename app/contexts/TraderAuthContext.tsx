'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Id } from '../../convex/_generated/dataModel';

interface Trader {
  _id: Id<"traders">;
  name: string;
  email: string;
  avatarUrl?: string;
  legitPoint: number;
  friendCode?: string;
  status?: string;
}

interface TraderAuthContextType {
  trader: Trader | null;
  setTrader: (trader: Trader | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const TraderAuthContext = createContext<TraderAuthContextType | undefined>(undefined);

export function TraderAuthProvider({ children }: { children: ReactNode }) {
  const [trader, setTraderState] = useState<Trader | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('trader');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        Promise.resolve().then(() => setTraderState(parsed));
      } catch {
        localStorage.removeItem('trader');
      }
    }
    Promise.resolve().then(() => setIsLoading(false));
  }, []);

  const setTrader = (newTrader: Trader | null) => {
    setTraderState(newTrader);
    if (newTrader) {
      localStorage.setItem('trader', JSON.stringify(newTrader));
    } else {
      localStorage.removeItem('trader');
    }
  };

  const logout = () => {
    setTrader(null);
  };

  return (
    <TraderAuthContext.Provider value={{ trader, setTrader, logout, isLoading }}>
      {children}
    </TraderAuthContext.Provider>
  );
}

export function useTraderAuth() {
  const context = useContext(TraderAuthContext);
  if (!context) {
    throw new Error('useTraderAuth must be used within TraderAuthProvider');
  }
  return context;
}

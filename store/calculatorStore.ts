import { create } from 'zustand';
import { Stock } from '@/lib/api';

interface CalculatorState {
  selectedStock: Stock | null;
  targetDate: Date | null;
  investmentAmount: number; // in KRW
  
  // Results
  pastPrice: number | null;
  currentPrice: number | null;
  isCalculating: boolean;
  
  actions: {
    setStock: (stock: Stock | null) => void;
    setDate: (date: Date | null) => void;
    setAmount: (amount: number) => void;
    setPrices: (past: number, current: number) => void;
    setCalculating: (loading: boolean) => void;
    reset: () => void;
  }
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  selectedStock: null,
  targetDate: null,
  investmentAmount: 1000000, // Default 1 million KRW
  pastPrice: null,
  currentPrice: null,
  isCalculating: false,

  actions: {
    setStock: (stock) => set({ selectedStock: stock, pastPrice: null, currentPrice: null }),
    setDate: (date) => set({ targetDate: date, pastPrice: null, currentPrice: null }),
    setAmount: (amount) => set({ investmentAmount: amount }),
    setPrices: (past, current) => set({ pastPrice: past, currentPrice: current }),
    setCalculating: (loading) => set({ isCalculating: loading }),
    reset: () => set({ 
        selectedStock: null, 
        targetDate: null, 
        investmentAmount: 1000000, 
        pastPrice: null, 
        currentPrice: null 
    }),
  },
}));

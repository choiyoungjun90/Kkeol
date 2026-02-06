'use client';

import React, { useEffect } from 'react';
import StockSearch from './StockSearch';
import ResultCard from './ResultCard';
import { useCalculatorStore } from '@/store/calculatorStore';
import { getStockPricesAction } from '@/app/actions/stock';
import { toast } from 'sonner';

export default function Calculator() {
  const { 
    selectedStock, 
    targetDate, 
    investmentAmount, 
    actions 
  } = useCalculatorStore();

  const handleCalculate = async () => {
    if (!selectedStock || !targetDate) return;

    actions.setCalculating(true);
    
    try {
        const dateStr = targetDate.toISOString().split('T')[0];
        // Server Action call
        const { current, past } = await getStockPricesAction(selectedStock.code, dateStr);
        
        actions.setPrices(past, current);
    } catch (error) {
        console.error(error);
        // Basic error handling
        alert('가격 정보를 가져오는데 실패했습니다. (장 쉬는 날이거나 데이터 부족)');
    } finally {
        actions.setCalculating(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-4 space-y-6">
      
      <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <StockSearch />

        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                언제 살껄/팔껄?
            </label>
            <input 
                type="date" 
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => actions.setDate(new Date(e.target.value))}
            />
        </div>

        <div className="space-y-1">
             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                얼마나?
            </label>
            <div className="relative">
                <input 
                    type="number" 
                    className="w-full p-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1,000,000"
                    defaultValue={investmentAmount}
                    onChange={(e) => actions.setAmount(Number(e.target.value))}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    원
                </span>
            </div>
        </div>

        <button 
            onClick={handleCalculate}
            disabled={!selectedStock || !targetDate}
            className={`w-full py-4 text-lg font-bold rounded-2xl transition-all transform active:scale-95
                ${(!selectedStock || !targetDate) 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700'
                }`}
        >
            계산기 돌리기 🎲
        </button>
      </div>

      <ResultCard />

    </div>
  );
}

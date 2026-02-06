'use client';

import React from 'react';
import { useCalculatorStore } from '@/store/calculatorStore';
import { formatKRW, formatProfit } from '@/lib/utils';
import { Share2 } from 'lucide-react';

export default function ResultCard() {
  const { selectedStock, investmentAmount, pastPrice, currentPrice } = useCalculatorStore();

  if (!selectedStock || !pastPrice || !currentPrice) return null;

  const shares = investmentAmount / pastPrice;
  const currentValue = shares * currentPrice;
  const profit = currentValue - investmentAmount;
  const profitRate = ((currentValue - investmentAmount) / investmentAmount) * 100;
  const isPositive = profit >= 0;

  // Comparison logic (Mock)
  const chickenCount = Math.floor(Math.abs(profit) / 25000); // Assume chicken is 25k KRW
  const model3Count = (Math.abs(profit) / 52000000).toFixed(1); // Assume Model 3 is 52m KRW

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`relative overflow-hidden rounded-3xl p-6 shadow-2xl ${isPositive ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} text-white`}>
        
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        
        <div className="relative z-10 text-center space-y-4">
            <div>
                <p className="text-white/80 text-sm font-medium mb-1">현재 내 자산이 될 뻔한 금액</p>
                <h2 className="text-4xl font-black tracking-tighter">
                    {formatKRW(currentValue)}
                </h2>
            </div>

            <div className="flex justify-center items-center gap-2 text-lg font-bold bg-white/20 rounded-full py-1 px-4 mx-auto w-fit backdrop-blur-sm">
                <span>{isPositive ? '🔥' : '💧'}</span>
                <span>{formatProfit(profit)}</span>
                <span>({profitRate.toFixed(2)}%)</span>
            </div>

            <div className="pt-4 border-t border-white/20">
                <p className="text-sm text-white/90 mb-2">
                    {isPositive ? '이 돈이면...' : '이 돈을 잃지 않았다면...'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3">
                        <span className="text-2xl">🍗</span>
                        <div>
                            <p className="text-xs text-white/70">황금올리브</p>
                            <p className="font-bold">{chickenCount} 마리</p>
                        </div>
                    </div>
                    {parseFloat(model3Count) > 0.1 && (
                        <div className="bg-white/10 p-3 rounded-xl flex items-center gap-3">
                            <span className="text-2xl">🚗</span>
                            <div>
                                <p className="text-xs text-white/70">테슬라 Model 3</p>
                                <p className="font-bold">{model3Count} 대</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <button className="w-full mt-4 py-3 bg-white text-gray-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors">
                <Share2 size={18} />
                <span>고통 공유하기</span>
            </button>
        </div>
      </div>
    </div>
  );
}

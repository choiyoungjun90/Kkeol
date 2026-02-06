'use client';

import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import StockSearch from './StockSearch';
import { useCalculatorStore } from '@/store/calculatorStore';
import { getStockPricesAction } from '@/app/actions/stock';
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/store/theme';

interface TrackedStock {
  code: string;
  name: string;
  addedPrice: number;
  currentPrice: number;
  addedAt: string;
}

export default function HumanIndicator() {
  const [trackedStocks, setTrackedStocks] = useState<TrackedStock[]>([]);
  const { selectedStock, actions } = useCalculatorStore();
  const { mode } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const isPain = mode === "pain";

  useEffect(() => {
    const saved = localStorage.getItem('human_indicator_stocks');
    if (saved) {
      setTrackedStocks(JSON.parse(saved));
    }
  }, []);

  const handleAddStock = async () => {
    if (!selectedStock) {
      toast.error('종목을 선택해주세요.');
      return;
    }

    if (trackedStocks.find(s => s.code === selectedStock.code)) {
      toast.error('이미 등록된 종목입니다.');
      return;
    }

    setLoading(true);
    try {
      const price = await getStockPricesAction(selectedStock.code, new Date().toISOString().split('T')[0]);
      
      const newStock: TrackedStock = {
        code: selectedStock.code,
        name: selectedStock.name,
        addedPrice: price.current,
        currentPrice: price.current,
        addedAt: new Date().toISOString(),
      };

      const updated = [newStock, ...trackedStocks];
      setTrackedStocks(updated);
      localStorage.setItem('human_indicator_stocks', JSON.stringify(updated));
      actions.setStock(null);
      toast.success(`${selectedStock.name} 등록 완료! 이제 당신이 사면 떨어지는지 지켜보겠습니다.`);
    } catch (error) {
      toast.error('가격을 가져오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const removeStock = (code: string) => {
    const updated = trackedStocks.filter(s => s.code !== code);
    setTrackedStocks(updated);
    localStorage.setItem('human_indicator_stocks', JSON.stringify(updated));
  };

  const calculateScore = () => {
    if (trackedStocks.length === 0) return 0;
    const totalChange = trackedStocks.reduce((acc, stock) => {
      return acc + ((stock.currentPrice - stock.addedPrice) / stock.addedPrice) * 100;
    }, 0);
    return (totalChange / trackedStocks.length).toFixed(1);
  };

  const avgChange = Number(calculateScore());
  const indicatorTitle = avgChange < 0 ? '고점 판독기' : '무릎 판독기';

  return (
    <div className={cn(
      "rounded-3xl p-6 shadow-sm border space-y-6 transition-colors duration-300",
      isPain ? "bg-pain-card border-pain-border" : "bg-base-card border-base-border"
    )}>
      <div className="flex justify-between items-start">
        <div className="space-y-1 text-left">
          <h3 className={cn(
            "text-lg font-bold flex items-center gap-2 transition-colors duration-300",
            isPain ? "text-pain-text" : "text-base-text"
          )}>
            인간지표 테스트 🤖
          </h3>
          <p className={cn(
            "text-xs font-medium transition-colors duration-300",
            isPain ? "text-pain-subtext" : "text-base-subtext"
          )}>
            내가 찜하면 떨어질까? 실시간 흑우력 측정
          </p>
        </div>
        <div className={cn(
            "px-3 py-1.5 rounded-2xl text-xs font-black transition-colors duration-300",
            avgChange < 0 
              ? (isPain ? "bg-painAccent-red/20 text-painAccent-red" : "bg-red-50 text-state-danger") 
              : (isPain ? "bg-painAccent-blue/20 text-painAccent-blue" : "bg-blue-50 text-primary")
        )}>
            {indicatorTitle}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 items-end">
            <div className="flex-1">
                <StockSearch />
            </div>
            <button 
                onClick={handleAddStock}
                disabled={loading || !selectedStock}
                className={cn(
                  "h-[52px] px-4 rounded-xl font-bold flex items-center justify-center disabled:opacity-50 transition-all active:scale-95",
                  isPain ? "bg-painAccent-blue text-white" : "bg-primary text-white"
                )}
            >
                {loading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Plus size={24} />}
            </button>
        </div>

        <div className="space-y-3">
          {trackedStocks.length === 0 ? (
            <div className={cn(
              "py-10 text-center border-2 border-dashed rounded-2xl text-sm transition-colors duration-300",
              isPain ? "border-pain-border text-pain-subtext" : "border-base-border text-base-subtext"
            )}>
                관심 종목을 추가하고<br />당신의 인간지표 등급을 확인하세요.
            </div>
          ) : (
            trackedStocks.map((stock) => {
              const change = ((stock.currentPrice - stock.addedPrice) / stock.addedPrice) * 100;
              const isDown = change < 0;

              return (
                <div key={stock.code} className={cn(
                  "p-4 rounded-2xl flex justify-between items-center group transition-colors duration-300",
                  isPain ? "bg-gray-800/50" : "bg-gray-50"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300",
                        isDown 
                          ? (isPain ? "bg-painAccent-red/20 text-painAccent-red" : "bg-red-100 text-state-danger") 
                          : (isPain ? "bg-painAccent-blue/20 text-painAccent-blue" : "bg-blue-100 text-primary")
                    )}>
                        {isDown ? <TrendingDown size={20} /> : <TrendingUp size={20} />}
                    </div>
                    <div className="text-left">
                        <p className={cn(
                          "font-bold text-sm transition-colors duration-300",
                          isPain ? "text-pain-text" : "text-base-text"
                        )}>{stock.name}</p>
                        <p className={cn(
                          "text-[10px] transition-colors duration-300",
                          isPain ? "text-pain-subtext" : "text-base-subtext"
                        )}>등록일: {new Date(stock.addedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className={cn(
                          "font-black text-sm transition-colors duration-300",
                          isDown ? "text-state-danger" : "text-primary"
                        )}>
                            {isDown ? '' : '+'}{change.toFixed(2)}%
                        </p>
                        <p className={cn(
                          "text-[10px] transition-colors duration-300",
                          isPain ? "text-pain-subtext" : "text-base-subtext"
                        )}>{stock.currentPrice.toLocaleString()}원</p>
                    </div>
                    <button 
                        onClick={() => removeStock(stock.code)}
                        className="p-2 text-gray-400 hover:text-state-danger transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {trackedStocks.length > 0 && (
          <div className={cn(
            "p-4 rounded-2xl text-center transition-colors duration-300",
            isPain ? "bg-gray-800" : "bg-base-bg"
          )}>
              <p className={cn(
                "text-xs mb-1 transition-colors duration-300",
                isPain ? "text-pain-subtext" : "text-base-subtext"
              )}>나의 평균 인간지표 점수</p>
              <p className={cn(
                "text-2xl font-black transition-colors duration-300",
                avgChange < 0 ? "text-state-danger" : "text-primary"
              )}>
                  {avgChange.toFixed(1)}%
              </p>
              <p className={cn(
                "text-[10px] mt-2 font-medium transition-colors duration-300",
                isPain ? "text-painAccent-gray" : "text-gray-500"
              )}>
                  {avgChange < 0 
                    ? "축하합니다! 당신이 찜하면 가격이 떨어집니다. 진정한 인간지표시군요." 
                    : "아직 부족합니다. 당신이 찜해도 가격이 오르는 실수를 범하고 계시네요."}
              </p>
          </div>
      )}
    </div>
  );
}

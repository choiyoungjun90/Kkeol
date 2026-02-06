"use client";

import React, { useState } from "react";
import { useCalculatorStore } from "@/store/calculatorStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/theme";
import { formatKRW, formatProfit, cn } from "@/lib/utils";
import { Share2, Award } from "lucide-react";
import BlackCowCertificate from "@/components/BlackCowCertificate";

export default function ResultCard() {
  const { selectedStock, investmentAmount, pastPrice, currentPrice } =
    useCalculatorStore();
  const { user } = useAuthStore();
  const { mode } = useThemeStore();
  const [showCertificate, setShowCertificate] = useState(false);

  const isPain = mode === "pain";

  if (!selectedStock || !pastPrice || !currentPrice) return null;

  const shares = investmentAmount / pastPrice;
  const currentValue = shares * currentPrice;
  const profit = currentValue - investmentAmount;
  const profitRate =
    ((currentValue - investmentAmount) / investmentAmount) * 100;
  const isPositive = profit >= 0;

  const chickenCount = Math.floor(Math.abs(profit) / 25000);
  const model3Count = (Math.abs(profit) / 52000000).toFixed(1);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl p-6 shadow-2xl text-white",
          isPositive
            ? "bg-linear-to-br from-red-500 to-red-600"
            : "bg-linear-to-br from-blue-500 to-blue-600",
        )}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>

        <div className="relative z-10 text-center space-y-4">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">
              현재 내 자산이 될 뻔한 금액
            </p>
            <h2 className="text-4xl font-black tracking-tighter">
              {formatKRW(currentValue)}
            </h2>
          </div>

          <div className="flex justify-center items-center gap-2 text-lg font-bold bg-white/20 rounded-full py-1 px-4 mx-auto w-fit backdrop-blur-sm">
            <span>{isPositive ? "🔥" : "💧"}</span>
            <span>{formatProfit(profit)}</span>
            <span>({profitRate.toFixed(2)}%)</span>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-sm text-white/90 mb-2">
              {isPositive ? "이 돈이면..." : "이 돈을 잃지 않았다면..."}
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

          <div className="flex gap-2">
            {!isPositive && (
              <button
                onClick={() => setShowCertificate(true)}
                className="flex-1 mt-4 py-3 bg-painAccent-yellow text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors shadow-lg"
              >
                <Award size={18} />
                <span>인증서 발급</span>
              </button>
            )}
            <button
              className={cn(
                "flex-1 mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors",
                isPain
                  ? "bg-pain-card text-pain-text hover:bg-gray-800"
                  : "bg-white text-base-text hover:bg-gray-100",
              )}
            >
              <Share2 size={18} />
              <span>공유하기</span>
            </button>
          </div>
        </div>
      </div>

      {showCertificate && (
        <BlackCowCertificate
          userName={user?.user_metadata?.nickname || "익명 흑우"}
          stockName={selectedStock.name}
          lossAmount={profit}
          lossRate={profitRate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}

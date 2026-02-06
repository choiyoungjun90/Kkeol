'use client';

import React, { useRef } from 'react';
import { Download, Share2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatKRW } from '@/lib/utils';
import { useThemeStore } from '@/store/theme';

interface BlackCowCertificateProps {
  userName: string;
  stockName: string;
  lossAmount: number;
  lossRate: number;
  onClose: () => void;
}

export default function BlackCowCertificate({
  userName,
  stockName,
  lossAmount,
  lossRate,
  onClose,
}: BlackCowCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { mode } = useThemeStore();
  const isPain = mode === "pain";

  // Grade based on loss rate or amount
  const getGrade = () => {
    if (lossRate < -50) return '1++ 등급 (명예 흑우)';
    if (lossRate < -30) return '1+ 등급 (우수 흑우)';
    return '1 등급 (성실 흑우)';
  };

  const grade = getGrade();
  const date = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={cn(
        "relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transition-colors duration-300",
        isPain ? "bg-pain-card text-pain-text" : "bg-white text-base-text"
      )}>
        <button 
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-colors z-10",
            isPain ? "bg-gray-800 text-pain-subtext hover:text-pain-text" : "bg-gray-100 text-gray-500 hover:text-gray-900"
          )}
        >
          <X size={20} />
        </button>

        <div className={cn(
          "p-8 space-y-6 text-center border-8 border-double m-2 rounded-[2rem] transition-colors duration-300",
          isPain ? "border-painAccent-yellow/30" : "border-yellow-600/30"
        )}>
          <div className="space-y-1">
             <div className="flex justify-center mb-2">
                <div className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center border-4 shadow-lg transition-colors duration-300",
                  isPain ? "bg-painAccent-yellow border-yellow-900/50" : "bg-yellow-500 border-yellow-200"
                )}>
                    <span className="text-2xl font-bold text-white">흑우</span>
                </div>
             </div>
            <h2 className="text-2xl font-black tracking-tight">
              흑우 등급 인증서
            </h2>
            <p className={cn(
              "text-[10px] font-bold tracking-widest uppercase",
              isPain ? "text-painAccent-yellow" : "text-yellow-600"
            )}>
              Official Black Cow Certificate
            </p>
          </div>

          <div className="py-4 space-y-4">
            <div className="space-y-1">
                <p className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isPain ? "text-pain-subtext" : "text-gray-400"
                )}>성명</p>
                <p className="text-lg font-bold">{userName}</p>
            </div>

            <div className="space-y-1">
                <p className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  isPain ? "text-pain-subtext" : "text-gray-400"
                )}>인증 등급</p>
                <p className={cn(
                  "text-xl font-black",
                  isPain ? "text-painAccent-red" : "text-state-danger"
                )}>{grade}</p>
            </div>

            <div className={cn(
              "pt-4 border-t transition-colors duration-300",
              isPain ? "border-pain-border" : "border-gray-100"
            )}>
                <p className={cn(
                  "text-sm leading-relaxed px-4 transition-colors duration-300",
                  isPain ? "text-pain-subtext" : "text-gray-600"
                )}>
                    위 사람은 <span className={cn("font-bold", isPain ? "text-pain-text" : "text-gray-900")}>{stockName}</span> 종목에서 
                    <br />
                    <span className={cn("font-bold", isPain ? "text-painAccent-red" : "text-state-danger")}>{formatKRW(Math.abs(lossAmount))}</span>의 손실
                    ({lossRate.toFixed(2)}%)을 기록하며, 
                    타의 추종을 불허하는 고점 매수 및 저점 매도의 기염을 토했으므로 본 인증서를 수여합니다.
                </p>
            </div>
          </div>

          <div className="pt-4 space-y-1">
            <p className={cn(
              "text-xs transition-colors duration-300",
              isPain ? "text-painAccent-gray" : "text-gray-400"
            )}>{date}</p>
            <p className="text-sm font-bold">살껄팔껄 위원회 위원장 껄무새</p>
          </div>

          <div className="flex gap-2 pt-2">
            <button className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors",
              isPain ? "bg-white text-pain-bg" : "bg-gray-900 text-white"
            )}>
                <Download size={16} />
                이미지 저장
            </button>
            <button className={cn(
              "p-3 rounded-xl transition-colors",
              isPain ? "bg-gray-800 text-painAccent-blue" : "bg-primary-soft text-primary"
            )}>
                <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

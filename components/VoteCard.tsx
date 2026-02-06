'use client';

import React, { useTransition } from 'react';
import { formatKRW } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { castVoteAction } from '@/app/actions/community';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VoteCard({ item }: { item: any }) {
  const [isPending, startTransition] = useTransition();
  const total = item.buyCount + item.sellCount;
  const buyPercent = total > 0 ? Math.round((item.buyCount / total) * 100) : 50;
  const sellPercent = 100 - buyPercent;

  const handleVote = (type: 'BUY' | 'SELL') => {
    startTransition(async () => {
      try {
        await castVoteAction(item.id, type);
        toast.success(type === 'BUY' ? '살껄! 에 투표했습니다.' : '팔껄! 에 투표했습니다.');
      } catch (error) {
        toast.error('투표 참여에 실패했습니다.');
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            {item.stock_name}
            <span className="text-xs font-normal text-gray-400">{item.stock_code}</span>
          </h3>
          <p className="text-xs text-gray-400 font-medium mt-0.5">
            지금 유저들의 선택은?
          </p>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
            🔥 {total}명 참여중
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
        "{item.description}"
      </p>

      <div className="space-y-2">
        <div className="flex h-12 rounded-xl overflow-hidden font-bold text-white text-sm relative">
            <button 
                onClick={() => handleVote('BUY')}
                disabled={isPending}
                className={cn(
                    "bg-red-500 flex items-center pl-4 transition-all duration-500 hover:brightness-110 disabled:opacity-80",
                    item.userVote === 'BUY' && "ring-2 ring-inset ring-white/50"
                )}
                style={{ width: `${buyPercent}%` }}
            >
                살껄 {buyPercent}%
            </button>
            <button 
                onClick={() => handleVote('SELL')}
                disabled={isPending}
                className={cn(
                    "bg-blue-500 flex items-center justify-end pr-4 transition-all duration-500 hover:brightness-110 disabled:opacity-80",
                    item.userVote === 'SELL' && "ring-2 ring-inset ring-white/50"
                )}
                style={{ width: `${sellPercent}%` }}
            >
                {sellPercent}% 팔껄
            </button>
            
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs px-1.5 py-0.5 rounded-full font-black border-2 border-white dark:border-gray-800 z-10 pointer-events-none">
                VS
            </div>
        </div>
        
        <div className="flex justify-between text-[10px] text-gray-400 font-medium px-1">
            <span>{item.buyCount}명</span>
            <span>{item.sellCount}명</span>
        </div>
      </div>
    </div>
  );
}
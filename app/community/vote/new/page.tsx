'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDebateAction } from '@/app/actions/community';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';
import StockSearch from '@/components/StockSearch';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useAuthStore } from '@/store/authStore';

export default function NewVotePage() {
  const router = useRouter();
  const { selectedStock } = useCalculatorStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStock) {
        toast.error('종목을 선택해주세요.');
        return;
    }
    if (!description) {
      toast.error('주제를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDebateAction({
        stock_code: selectedStock.code,
        stock_name: selectedStock.name,
        description,
      });
      toast.success('새로운 투표가 생성되었습니다.');
      router.push('/community');
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || '투표 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-black min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">투표 만들기</h1>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="text-blue-600 font-bold disabled:opacity-50"
        >
          {isSubmitting ? '생성중...' : '완료'}
        </button>
      </header>

      <div className="p-4 space-y-6">
        <div className="space-y-4 bg-gray-50 dark:bg-gray-900 p-6 rounded-3xl">
            <StockSearch />
            
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">토론 주제</label>
                <textarea 
                    placeholder="예: 지금 풀매수 타이밍인가요?, 떡락각 보이나요?"
                    className="w-full h-32 p-4 rounded-2xl bg-white dark:bg-black border-none outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                💡 **팁**: 명확한 주제일수록 유저들이 더 많이 참여합니다. 선택한 종목에 대한 유저들의 실시간 민심을 확인해보세요!
            </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPostAction } from '@/app/actions/community';
import { ChevronLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import StockSearch from '@/components/StockSearch';
import { useCalculatorStore } from '@/store/calculatorStore';
import { useAuthStore } from '@/store/authStore';

export default function WritePage() {
  const router = useRouter();
  const { selectedStock } = useCalculatorStore();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        toast.error('로그인 중입니다. 잠시만 기다려주세요.');
        return;
    }
    if (!title || !content) {
      toast.error('제목과 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createPostAction({
        title,
        content,
        stock_code: selectedStock?.code,
      });
      toast.success('게시글이 작성되었습니다.');
      router.push('/community');
      router.refresh();
    } catch (error: any) {
      console.error('Write Error:', error);
      toast.error(error.message || '게시글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthLoading) {
      return (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-black">
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
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">글 쓰기</h1>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="text-blue-600 font-bold disabled:opacity-50"
        >
          {isSubmitting ? '작성중...' : '완료'}
        </button>
      </header>

      <div className="flex-1 overflow-y-auto">
        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          <div className="pb-2 border-b border-gray-50 dark:border-gray-900">
              <StockSearch />
          </div>

          <input 
            type="text"
            placeholder="제목을 입력하세요"
            className="w-full text-xl font-bold bg-transparent outline-none border-none placeholder:text-gray-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea 
            placeholder="어떤 후회를 하고 계신가요? (자유롭게 작성해주세요)"
            className="w-full min-h-[300px] bg-transparent outline-none border-none resize-none placeholder:text-gray-300 text-base"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

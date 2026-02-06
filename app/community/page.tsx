import React from 'react';
import VoteCard from '@/components/VoteCard';
import CommunityList from '@/components/CommunityList';
import { PenSquare, PlusCircle } from 'lucide-react';
import { getPostsAction, getDebatesAction } from '@/app/actions/community';
import Link from 'next/link';

export default async function CommunityPage() {
  const [posts, debates] = await Promise.all([
    getPostsAction(),
    getDebatesAction()
  ]);

  return (
    <div className="bg-gray-50 dark:bg-black min-h-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md px-4 h-14 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-xl font-bold">커뮤니티</h1>
        <Link 
            href="/community/write"
            className="p-2 -mr-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
            <PenSquare size={22} />
        </Link>
      </header>

      <div className="p-4 space-y-6">
        
        {/* Active Votes Section */}
        <section className="space-y-3">
            <div className="flex justify-between items-end px-1">
                <h2 className="text-sm font-bold text-gray-500">🔥 지금 가장 뜨거운 논쟁</h2>
                <Link href="/community/vote/new" className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">
                    <PlusCircle size={12} />
                    투표 만들기
                </Link>
            </div>
            <div className="space-y-4">
                {debates.length > 0 ? (
                    debates.map(debate => (
                        <VoteCard key={debate.id} item={debate} />
                    ))
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center text-sm text-gray-400 border border-dashed border-gray-200">
                        진행중인 투표가 없습니다.
                    </div>
                )}
            </div>
        </section>

        {/* Posts Feed Section */}
        <section className="space-y-2 pt-2">
            <div className="flex justify-between items-end px-1 pb-2">
                 <h2 className="text-sm font-bold text-gray-500">💬 실시간 껄무새들</h2>
                 <div className="text-xs text-gray-400 font-medium space-x-2">
                     <span className="text-gray-900 dark:text-white font-bold cursor-pointer">최신순</span>
                     <span className="cursor-pointer hover:text-gray-600">인기순</span>
                 </div>
            </div>
            
            <CommunityList initialPosts={posts} />
        </section>

      </div>
    </div>
  );
}

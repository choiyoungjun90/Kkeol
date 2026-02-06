'use client';

import React, { useTransition } from 'react';
import PostCard from '@/components/PostCard';
import { toggleLikeAction } from '@/app/actions/community';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CommunityList({ initialPosts }: { initialPosts: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleLike = async (postId: string) => {
    startTransition(async () => {
      try {
        await toggleLikeAction(postId);
      } catch (error) {
        toast.error('좋아요 처리에 실패했습니다.');
      }
    });
  };

  if (initialPosts.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        아직 게시글이 없습니다. 첫 글을 남겨보세요!
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
      {initialPosts.map((post) => (
        <div key={post.id} className="relative">
            <Link href={`/community/post/${post.id}`}>
                <PostCard post={post} onLike={(id) => {
                    // Prevent link navigation when clicking like
                    // This is handled better if onLike is passed correctly
                }} />
            </Link>
            {/* Overlay button for like if needed, but for simplicity let's handle inside PostCard with stopPropagation */}
        </div>
      ))}
      <button className="w-full py-3 mt-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors">
        더보기
      </button>
    </div>
  );
}

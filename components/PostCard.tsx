'use client';

import React from 'react';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function PostCard({ post, onLike }: { post: any, onLike?: (id: string) => void }) {
  const author = post.profiles?.nickname || '익명';
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko });
  
  return (
    <div className="py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors px-4 -mx-4">
      <div className="flex justify-between items-start mb-1.5">
        <div className="flex items-center gap-2">
          {post.is_holy && (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-purple-100 text-purple-600">
                성지예약
            </span>
          )}
          <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{author}</span>
          <span className="text-[10px] text-gray-400">{timeAgo}</span>
        </div>
        {post.stock_code && (
             <span className="text-[10px] text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                #{post.stock_code}
            </span>
        )}
      </div>

      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{post.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-3">
        {post.content}
      </p>

      <div className="flex items-center gap-4 text-gray-400">
        <button 
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLike?.(post.id);
            }}
            className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors"
        >
            <ThumbsUp size={14} className={cn(post.user_has_liked && "fill-red-500 text-red-500")} />
            <span>{post.like_count || 0}</span>
        </button>
        <button className="flex items-center gap-1 text-xs hover:text-blue-500 transition-colors">
            <MessageSquare size={14} />
            <span>{post.comment_count || 0}</span>
        </button>
      </div>
    </div>
  );
}
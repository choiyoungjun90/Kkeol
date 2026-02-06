'use client';

import React, { useState } from 'react';
import { createCommentAction } from '@/app/actions/community';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

export default function CommentList({ postId, initialComments }: { postId: string, initialComments: any[] }) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await createCommentAction(postId, content);
      setContent('');
      toast.success('댓글이 작성되었습니다.');
    } catch (error) {
      toast.error('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {initialComments.map((comment) => (
          <div key={comment.id} className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-gray-900 dark:text-gray-200">
                {comment.profiles?.nickname || '익명'}
              </span>
              <span className="text-gray-400">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ko })}
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* Floating Input or Bottom Input */}
      <form 
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-black border-t border-gray-100 dark:border-gray-800 p-3 flex gap-2 z-50 mb-16"
      >
        <input 
          type="text"
          placeholder="댓글을 입력하세요"
          className="flex-1 bg-gray-100 dark:bg-gray-900 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button 
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="p-2 text-blue-600 disabled:opacity-30"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

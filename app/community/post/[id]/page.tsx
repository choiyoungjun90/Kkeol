import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ChevronLeft, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import CommentList from '@/components/CommentList';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (nickname, avatar_url),
      votes (vote_type, user_id)
    `)
    .eq('id', id)
    .single();

  if (error || !post) {
    notFound();
  }

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (nickname, avatar_url)
    `)
    .eq('post_id', id)
    .order('created_at', { ascending: true });

  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ko });

  return (
    <div className="bg-white dark:bg-black min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md h-14 flex items-center px-4 border-b border-gray-100 dark:border-gray-800">
        <Link href="/community" className="p-2 -ml-2">
          <ChevronLeft size={24} />
        </Link>
        <span className="ml-2 font-bold truncate">게시글</span>
      </header>

      <main className="flex-1 pb-20">
        <article className="p-4 space-y-4">
          <div className="flex justify-between items-center text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-gray-200">
                {post.profiles?.nickname || '익명'}
              </span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
            {post.stock_code && (
              <span className="text-blue-500 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">
                #{post.stock_code}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="text-gray-800 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
            {post.content}
          </div>

          <div className="pt-6 flex items-center gap-6 border-t border-gray-50 dark:border-gray-900">
            <div className="flex items-center gap-1.5 text-gray-500">
              <ThumbsUp size={18} />
              <span className="text-sm font-medium">{post.like_count || 0}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-500">
              <MessageSquare size={18} />
              <span className="text-sm font-medium">{comments?.length || 0}</span>
            </div>
            <button className="flex items-center gap-1.5 text-gray-500 ml-auto">
              <Share2 size={18} />
            </button>
          </div>
        </article>

        <div className="h-2 bg-gray-50 dark:bg-gray-900" />

        <section className="p-4">
          <h3 className="text-sm font-bold text-gray-500 mb-4">댓글 {comments?.length || 0}</h3>
          <CommentList postId={id} initialComments={comments || []} />
        </section>
      </main>
    </div>
  );
}

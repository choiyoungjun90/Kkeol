"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function getAuthUser() {
  const supabase = await createClient();
  let { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) {
      console.error("Anonymous Sign-in Error:", anonError);
      if (anonError.message.includes("disabled")) {
        throw new Error("익명 로그인이 비활성화되어 있습니다. Supabase 대시보드에서 Anonymous Providers를 활성화해주세요.");
      }
      throw new Error("인증에 실패했습니다. 다시 시도해주세요.");
    }
    user = anonData.user;
  }

  if (!user) throw new Error("인증에 실패했습니다.");

  // Safety net: Ensure profile exists (in case trigger failed)
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.from("profiles").insert([
      {
        id: user.id,
        nickname: `익명_${user.id.substring(0, 5)}`,
        is_anonymous: true,
      },
    ]);
  }

  return { supabase, user };
}

export async function createPostAction(formData: {
  title: string;
  content: string;
  stock_code?: string;
}) {
  const { supabase, user } = await getAuthUser();

  const { data, error: insertError } = await supabase
    .from("posts")
    .insert([
      {
        user_id: user.id,
        title: formData.title,
        content: formData.content,
        stock_code: formData.stock_code,
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error("Supabase Insert Error:", insertError);
    throw new Error(`게시글 저장 실패: ${insertError.message}`);
  }

  revalidatePath("/community");
  return data;
}

export async function createDebateAction(formData: {
  stock_code: string;
  stock_name: string;
  description: string;
}) {
  const { supabase, user } = await getAuthUser();

  const { data, error } = await supabase
    .from("debates")
    .insert([
      {
        user_id: user.id,
        stock_code: formData.stock_code,
        stock_name: formData.stock_name,
        description: formData.description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Create Debate Error:", error);
    throw new Error(`투표 생성 실패: ${error.message}`);
  }

  revalidatePath("/community");
  return data;
}

export async function getDebatesAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("debates")
    .select(
      `
      *,
      debate_votes (user_id, vote_type)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Get Debates Error:", error);
    return [];
  }

  return (data || []).map((debate) => {
    const votes = debate.debate_votes || [];
    const buyCount = votes.filter((v: any) => v.vote_type === "BUY").length;
    const sellCount = votes.filter((v: any) => v.vote_type === "SELL").length;
    const userVote =
      votes.find((v: any) => v.user_id === user?.id)?.vote_type || null;

    const { debate_votes, ...debateData } = debate;

    return {
      ...debateData,
      buyCount,
      sellCount,
      userVote,
    };
  });
}

export async function castVoteAction(
  debateId: string,
  voteType: "BUY" | "SELL",
) {
  const { supabase, user } = await getAuthUser();

  const { error } = await supabase
    .from("debate_votes")
    .upsert([{ debate_id: debateId, user_id: user.id, vote_type: voteType }], {
      onConflict: "user_id, debate_id",
    });

  if (error) {
    console.error("Cast Vote Error:", error);
    throw new Error(`투표 참여 실패: ${error.message}`);
  }

  revalidatePath("/community");
}

export async function getPostsAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles:user_id (nickname, avatar_url),
      votes (vote_type, user_id),
      comments (id)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Get Posts Error:", error);
    return [];
  }

  // Map data to include counts and user-specific states
  return (data || []).map((post) => {
    const { votes, comments, ...postData } = post;
    return {
      ...postData,
      comment_count: comments?.length || 0,
      user_has_liked: !!votes?.some(
        (v: any) => v.user_id === user?.id && v.vote_type === "LIKE",
      ),
    };
  });
}

export async function toggleLikeAction(postId: string) {
  const { supabase, user } = await getAuthUser();

  // Check if already liked
  const { data: existingVote } = await supabase
    .from("votes")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("vote_type", "LIKE")
    .single();

  if (existingVote) {
    // Unlike
    await supabase.from("votes").delete().eq("id", existingVote.id);
  } else {
    // Like
    await supabase
      .from("votes")
      .insert([{ post_id: postId, user_id: user.id, vote_type: "LIKE" }]);
  }

  revalidatePath("/community");
}

export async function createCommentAction(
  postId: string,
  content: string,
  parentId?: string,
) {
  const { supabase, user } = await getAuthUser();

  const { data, error } = await supabase.from("comments").insert([
    {
      post_id: postId,
      user_id: user.id,
      content,
      parent_id: parentId || null,
    },
  ]);

  if (error) throw error;

  revalidatePath(`/community/post/${postId}`);
  revalidatePath("/community");
}

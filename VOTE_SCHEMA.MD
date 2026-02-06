-- ==========================================
-- 1. Debates (투표 주제) 테이블
-- ==========================================
CREATE TABLE public.debates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stock_code TEXT NOT NULL,
  stock_name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. Debate Votes (개별 투표) 테이블
-- ==========================================
CREATE TABLE public.debate_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('BUY', 'SELL')), -- 살껄(BUY), 팔껄(SELL)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, debate_id) -- 한 유저가 한 투표에 중복 참여 불가
);

-- ==========================================
-- 3. RLS 정책 설정
-- ==========================================
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_votes ENABLE ROW LEVEL SECURITY;

-- [Debates]
CREATE POLICY "Public debates are viewable by everyone" ON public.debates FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create debates" ON public.debates FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- [Debate Votes]
CREATE POLICY "Public debate votes are viewable by everyone" ON public.debate_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can cast votes" ON public.debate_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can change their own votes" ON public.debate_votes FOR UPDATE USING (auth.uid() = user_id);

-- ==========================================
-- 4. Triggers (실시간 집계를 위한 뷰 혹은 함수)
-- ==========================================
-- 성능을 위해 투표 수 합산은 클라이언트에서 처리하거나 별도 통계 테이블을 둘 수 있지만, 
-- MVP에서는 실시간 쿼리로 충분합니다.

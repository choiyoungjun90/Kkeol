📝 IMPLEMENTATION_STRATEGY.md1. 🔑 인증 전략: Lazy Registration (그림자 계정)사용자가 사이트에 접속하거나 첫 상호작용(좋아요, 투표)을 할 때 자동으로 익명 계정을 생성합니다. 유저는 로그인했다는 사실조차 모르지만, 시스템 내부적으로는 고유한 User ID를 갖게 됩니다. 추후 소셜 로그인 연동 시 데이터가 자연스럽게 이관됩니다.🔄 Flow진입 (Entry): 유저 접속 시 클라이언트에서 supabase.auth.signInAnonymously() 실행 (혹은 첫 액션 시 실행).활동 (Activity): 글쓰기, 좋아요, 투표 등 모든 활동은 부여된 Anonymous User ID로 DB에 기록됨.전환 (Conversion): 유저가 "내 글 관리", "프로필 설정" 접근 시 또는 "계정 보호하기" 클릭 시 구글/카카오 등 OAuth 팝업 유도.병합 (Link): OAuth 로그인 성공 시, 기존 Anonymous User ID에 해당 소셜 계정 정보를 Link(연결) 하여 기존 활동 내역 유지.2. 🗄️ Database Schema Structure모든 유저는 auth.users 테이블에 존재하며(익명/실명 공통), 비즈니스 로직은 별도의 테이블로 분리합니다.profiles: 유저 닉네임, 익명 여부, 아바타 등 관리.posts: 게시글 데이터 (주식 종목 코드 포함 가능).comments: 게시글에 달린 댓글.votes: 좋아요 및 살껄/팔껄 투표 데이터 (중복 방지 핵심).request_logs: 도배 방지를 위한 IP 기반 요청 로그.3. 🛡️ 보안 및 필터링 전략A. 도배 방지 (Rate Limiting)별도의 Redis 없이 MVP 단계에서는 DB(request_logs)를 활용하여 비정상적인 트래픽을 제어합니다.방식: 글/댓글 작성 요청 시 request_logs 테이블에서 해당 IP의 최근 요청 기록을 조회.정책: 짧은 시간 내 과도한 요청 발생 시 Server Action 단에서 차단 (구체적인 제한 수치는 운영 상황에 맞춰 조정).구현 위치: Server Action 진입점 (createPost, createComment).B. 금칙어 필터 (Profanity Filter)라이브러리: badwords-ko 또는 커스텀 Regex 활용.구현 위치: Server Action (DB 저장 직전 수행).동작 방식:옵션: 저장을 거부하거나, 욕설 부분을 마스킹(\*\*\*) 처리하여 저장 (유저 반발 감소를 위해 마스킹 추천).4. ⚡ 아키텍처 및 캐싱 전략 (Next.js 14)A. Server Actions (Data Mutation)클라이언트에서 API를 직접 호출하지 않고, Server Action을 통해 안전하게 DB에 접근합니다.createPostAction(formData)Auth Check: 익명 세션 유효성 확인.Rate Limit Check: IP 조회 및 도배 여부 확인.Filter Content: 금칙어 필터링 및 마스킹.DB Insert: 데이터 저장.Revalidate: revalidatePath('/community') 호출로 캐시 갱신.convertUserAction(provider)OAuth Provider로 리다이렉트 및 계정 링크 처리.B. Caching Strategy (Data Fetching)데이터 종류Fetching 방식캐싱 전략 (Next.js)설명게시글 목록Server ComponentrevalidatePath (On Demand)글 작성/수정 시에만 캐시 무효화. 평소엔 정적(Static)에 가까운 속도로 제공.주식 시세Server Componentrevalidate: 60 (Time-based)1분마다 갱신. 실시간성은 클라이언트 폴링으로 보완.투표/좋아요 수Server Componentno-store (Dynamic)숫자는 유저 상호작용에 따라 즉시 변하므로 실시간 Fetching.유저 프로필Server Componentno-store개인화 데이터는 캐싱하지 않음.C. Client Store (Zustand)서버 컴포넌트(RSC)가 데이터를 주도하므로 클라이언트 전역 상태는 최소화합니다.useUserStore: 현재 접속자의 isAnonymous, nickname, userId 관리 (UI 분기용).useToastStore: 알림 메시지 처리.D. Optimistic UI (useOptimistic)"좋아요"나 "투표" 클릭 시 서버 응답을 기다리지 않고 UI 숫자를 즉시 변경하여 체감 속도 0.1초를 구현합니다.5. 📜 Supabase SQL Script (Schema + RLS + Triggers)아래 스크립트를 Supabase SQL Editor에서 실행하여 백엔드를 구축합니다.SQL-- ==========================================
-- 1. Tables Setup
-- ==========================================

-- 1. 유저 프로필 테이블 (auth.users와 1:1 매핑)
CREATE TABLE public.profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
nickname TEXT,
avatar_url TEXT,
is_anonymous BOOLEAN DEFAULT TRUE,
role TEXT DEFAULT 'user', -- 'user', 'admin'
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 게시글 테이블
CREATE TABLE public.posts (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
stock_code TEXT, -- 종목 코드 (예: 005930.KS)
title TEXT NOT NULL,
content TEXT NOT NULL,
view_count INT DEFAULT 0,
like_count INT DEFAULT 0,
ip_address INET, -- 관리자 추적 및 차단용
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 댓글 테이블
CREATE TABLE public.comments (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
content TEXT NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 투표/좋아요 테이블 (중복 방지 핵심)
CREATE TABLE public.votes (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
vote_type TEXT CHECK (vote_type IN ('LIKE', 'BUY', 'SELL')), -- 좋아요, 살껄, 팔껄
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE(user_id, post_id) -- 한 유저가 한 글에 중복 투표 불가
);

-- 5. 도배 방지용 로그 (Redis 대용)
CREATE TABLE public.request_logs (
id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
ip_address INET NOT NULL,
action_type TEXT NOT NULL, -- 'WRITE_POST', 'WRITE_COMMENT'
created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. 🛡️ Row Level Security (RLS) 정책 설정
-- ==========================================

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- [Profiles]
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- [Posts]
CREATE POLICY "Public posts are viewable by everyone"
ON public.posts FOR SELECT USING (true);

-- 로그인한 유저(익명 포함)만 글 작성 가능
CREATE POLICY "Authenticated users can insert posts"
ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 내 글만 수정/삭제 가능
CREATE POLICY "Users can update own posts"
ON public.posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- [Comments]
CREATE POLICY "Public comments are viewable by everyone"
ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert comments"
ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own comments"
ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- [Votes]
CREATE POLICY "Public votes are viewable by everyone"
ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert votes"
ON public.votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own votes"
ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- ⚡ 자동화 Triggers (수정됨)
-- ==========================================

-- 1. 회원가입(익명 포함) 시 profiles 테이블에 자동 행 생성
-- (수정사항: 함수명 및 문자열의 \* 제거 -> _ 변경)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO public.profiles (id, nickname, is_anonymous)
VALUES (
new.id,
'익명_' || SUBSTRING(new.id::text, 1, 5), -- 닉네임 예: 익명\_a1b2c
TRUE
);
RETURN new;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 연결
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. 좋아요(Vote) 추가 시 posts 테이블의 like_count 자동 증가
CREATE OR REPLACE FUNCTION public.handle_vote_added()
RETURNS TRIGGER AS
$$

BEGIN
IF NEW.vote_type = 'LIKE' THEN
UPDATE public.posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 연결
DROP TRIGGER IF EXISTS on_vote_added ON public.votes;
CREATE TRIGGER on_vote_added
  AFTER INSERT ON public.votes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_vote_added();


-- 3. 좋아요(Vote) 취소 시 posts 테이블의 like_count 자동 감소
CREATE OR REPLACE FUNCTION public.handle_vote_removed()
RETURNS TRIGGER AS
$$

BEGIN
IF OLD.vote_type = 'LIKE' THEN
UPDATE public.posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
END IF;
RETURN OLD;
END;

$$
LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거 연결
DROP TRIGGER IF EXISTS on_vote_removed ON public.votes;
CREATE TRIGGER on_vote_removed
  AFTER DELETE ON public.votes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_vote_removed();
$$

---

추후 추가된 vote
// ...existing code...

---

## 🔧 Supabase 설정 (필수 조치)

### 1. 익명 로그인(Anonymous Auth) 활성화

익명 로그인이 비활성화되어 있으면 `AuthApiError: Anonymous sign-ins are disabled` 오류가 발생합니다.

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. **Authentication** > **Providers** 이동
3. **Anonymous** 섹션 클릭
4. **Allow anonymous sign-ins** 스위치를 **ON**으로 변경 후 저장

### 2. 신규 테이블 및 권한 설정 SQL

SQL Editor에서 아래 명령어를 실행하여 투표 기능을 위한 테이블과 RLS(보안 정책)를 설정합니다.

```sql
-- 1. debates 테이블 생성 (투표 주제)
CREATE TABLE IF NOT EXISTS public.debates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    stock_code TEXT NOT NULL,
    stock_name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. debate_votes 테이블 생성 (실제 투표 기록)
CREATE TABLE IF NOT EXISTS public.debate_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    debate_id UUID REFERENCES public.debates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vote_type TEXT CHECK (vote_type IN ('BUY', 'SELL')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, debate_id) -- 중복 투표 방지
);

-- 3. RLS 정책 설정
ALTER TABLE public.debates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debate_votes ENABLE ROW LEVEL SECURITY;

-- 조회 정책: 누구나 가능
CREATE POLICY "Anyone can view debates" ON public.debates FOR SELECT USING (true);
CREATE POLICY "Anyone can view debate votes" ON public.debate_votes FOR SELECT USING (true);

-- 작성 정책: 인증된 유저(익명 포함)만 가능
CREATE POLICY "Auth users can create debates" ON public.debates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth users can vote" ON public.debate_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own vote" ON public.debate_votes FOR UPDATE USING (auth.uid() = user_id);
```

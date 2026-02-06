export interface VoteItem {
  id: string;
  stockName: string;
  stockCode: string;
  price: number;
  changeRate: number;
  buyCount: number;
  sellCount: number;
  description: string;
}

export interface PostItem {
  id: string;
  author: string;
  badge?: string; // e.g., '성지', '흑우'
  content: string;
  timeAgo: string;
  stockTag?: string;
  likes: number;
  comments: number;
}

export const MOCK_VOTES: VoteItem[] = [
  {
    id: '1',
    stockName: '삼성전자',
    stockCode: '005930',
    price: 58900,
    changeRate: -1.2,
    buyCount: 1542,
    sellCount: 890,
    description: '5만전자 깨졌는데 지금 줍나요?',
  },
  {
    id: '2',
    stockName: 'Tesla',
    stockCode: 'TSLA',
    price: 345000,
    changeRate: 5.4,
    buyCount: 3200,
    sellCount: 120,
    description: '천슬라 간다 vs 고점이다',
  },
];

export const MOCK_POSTS: PostItem[] = [
  {
    id: '1',
    author: '한강뷰가자',
    badge: '성지예약',
    content: '솔직히 지금 엔비디아 안 사는 사람들은 나중에 땅을 치고 후회한다. 내가 분명히 말했다. 2026년에는 300불 넘음.',
    timeAgo: '10분 전',
    stockTag: 'NVDA',
    likes: 124,
    comments: 45,
  },
  {
    id: '2',
    author: '파란나라',
    badge: '흑우',
    content: '아니 삼성전자 9만에 물린 사람 나밖에 없음? 구조대 언제 오냐고...',
    timeAgo: '1시간 전',
    stockTag: '005930',
    likes: 890,
    comments: 203,
  },
  {
    id: '3',
    author: '도지아빠',
    content: '비트코인 1억 갈 때 안 샀던 내 손가락을 자르고 싶다 진짜.',
    timeAgo: '3시간 전',
    stockTag: 'BTC',
    likes: 56,
    comments: 12,
  },
];

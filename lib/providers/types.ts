// lib/providers/types.ts

export interface StockInfo {
  code: string; // Symbol (e.g., AAPL, 005930.KS)
  name: string;
  market: string;
  currency: string;
}

export interface StockPrice {
  date: string; // YYYY-MM-DD
  price: number;
  currency: string;
}

export interface IStockProvider {
  search(query: string): Promise<StockInfo[]>;
  getCurrentPrice(symbol: string): Promise<number>;
  getHistoryPrice(symbol: string, date: string): Promise<number>;
}

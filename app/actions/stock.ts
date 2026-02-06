'use server';

import { YahooFinanceProvider } from '@/lib/providers/yahoo';
import { StockInfo } from '@/lib/providers/types';

// Singleton instance
const provider = new YahooFinanceProvider();

export async function searchStocksAction(query: string): Promise<StockInfo[]> {
  if (!query) return [];
  return await provider.search(query);
}

export async function getCurrentPriceAction(symbol: string): Promise<number> {
    return await provider.getCurrentPrice(symbol);
}

export async function getStockPricesAction(symbol: string, date: string): Promise<{ current: number; past: number }> {
  try {
    const [current, past] = await Promise.all([
      provider.getCurrentPrice(symbol),
      provider.getHistoryPrice(symbol, date),
    ]);
    return { current, past };
  } catch (error) {
    console.error(error);
    throw new Error('가격 정보를 가져오는데 실패했습니다.');
  }
}

import { searchStocksAction, getCurrentPriceAction, getStockPricesAction } from '@/app/actions/stock';

export interface Stock {
  code: string;
  name: string;
  market: string;
}

export async function searchStocks(query: string): Promise<Stock[]> {
  return await searchStocksAction(query);
}

export async function getStockPrice(code: string, date: string): Promise<number> {
    const res = await getStockPricesAction(code, date);
    return res.past;
}

export async function getCurrentStockPrice(code: string): Promise<number> {
    return await getCurrentPriceAction(code);
}

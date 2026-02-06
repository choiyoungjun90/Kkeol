import { IStockProvider, StockInfo } from "./types";
import KOREAN_STOCKS from "@/data/stocks.json";
// @ts-ignore
import { josa } from "es-hangul";

// Import the class properly
const YahooFinance = require("yahoo-finance2").default;

// Instantiate it
const yahooFinance = new YahooFinance();

export class YahooFinanceProvider implements IStockProvider {
  async search(query: string): Promise<StockInfo[]> {
    try {
      // 1. Local Search (Korean Stocks)
      // Check if query has Korean characters or matches known English names in our list
      const normalizedQuery = query.toLowerCase().replace(/\s+/g, "");

      const localResults = KOREAN_STOCKS.filter((stock: any) => {
        const stockName = stock.n.toLowerCase().replace(/\s+/g, "");
        const stockCode = stock.c.toLowerCase();
        return (
          stockName.includes(normalizedQuery) ||
          stockCode.includes(normalizedQuery)
        );
      }).map((stock: any) => ({
        code: stock.c,
        name: stock.n,
        market: stock.c.endsWith(".KS") ? "KOSPI" : "KOSDAQ",
        currency: "KRW",
      }));

      // If we found a good number of matches locally, return them.
      // Or we can combine them with Yahoo results.
      // For now, if we have local results, prefer them for Korean context.
      if (localResults.length > 0) {
        return localResults;
      }

      // 2. Fallback to Yahoo Finance Search (Global)
      // Only search Yahoo if no local match or if query seems like a ticker/English
      const trimmedQuery = query.trim();
      if (!trimmedQuery) return localResults;

      const result: any = await yahooFinance.search(trimmedQuery);

      if (!result.quotes) return [];

      return result.quotes
        .filter(
          (quote: any) => quote.isYahooFinance && quote.quoteType === "EQUITY",
        )
        .map((quote: any) => ({
          code: quote.symbol,
          name: quote.shortname || quote.longname || quote.symbol,
          market: quote.exchange,
          currency: "KRW",
        }))
        .slice(0, 10);
    } catch (error) {
      console.error("Yahoo Search Error:", error);
      return [];
    }
  }

  async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const result: any = await yahooFinance.quote(symbol);
      return result.regularMarketPrice || result.previousClose || 0;
    } catch (error) {
      console.error(`Yahoo Current Price Error (${symbol}):`, error);
      throw new Error("Failed to fetch current price");
    }
  }

  async getHistoryPrice(symbol: string, date: string): Promise<number> {
    try {
      // Yahoo Finance requires a range. We'll set the range to [date, date + 2 days] to ensure we catch the close.
      // We need to handle weekends/holidays, so asking for a small window is safer.
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(startDate.getDate() + 3); // Window of 3 days

      const result: any[] = await yahooFinance.historical(symbol, {
        period1: startDate.toISOString().split("T")[0],
        period2: endDate.toISOString().split("T")[0],
        interval: "1d",
      });

      if (!result || result.length === 0) {
        // If no data (e.g., weekend), try to find the closest previous data?
        // For now, let's throw or return 0. Ideally, we should look back a few days if empty.
        throw new Error("Market closed on this date");
      }

      // Return the close price of the first available entry in the range
      return result[0].close;
    } catch (error) {
      console.error(`Yahoo History Price Error (${symbol} on ${date}):`, error);
      throw error;
    }
  }
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKRW(amount: number): string {
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
}

export function formatProfit(amount: number): string {
    const sign = amount > 0 ? '+' : '';
    return `${sign}${new Intl.NumberFormat('ko-KR').format(amount)}원`;
}

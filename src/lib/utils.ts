import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function computeWPM(totalChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds === 0) return 0;
  const minutes = elapsedSeconds / 60;
  return Math.round(totalChars / 5 / minutes);
}

export function computeAccuracy(quote: string, userInput: string): number {
  if (quote.length === 0) return 0;
  const correctChars = userInput
    .split("")
    .filter((char, i) => char === quote[i]).length;
  return Math.round((correctChars / quote.length) * 100);
}

export function getRandomQuote(quotes: string[]): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

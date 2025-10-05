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
  // Get 5-10 random sentences for a longer test
  const numSentences = Math.floor(Math.random() * 6) + 5; // 5 to 10
  const selectedQuotes: string[] = [];
  const usedIndices = new Set<number>();

  while (selectedQuotes.length < numSentences && selectedQuotes.length < quotes.length) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      selectedQuotes.push(quotes[randomIndex]);
    }
  }

  return selectedQuotes.join(' ');
}

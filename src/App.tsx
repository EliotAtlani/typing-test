import { useEffect, useState, useRef } from "react";

import QuoteDisplay from "@/components/QuoteDisplay";
import Stats from "@/components/Stats";
import sampleQuotes from "@/components/sampleQuotes";
import { computeWPM, getRandomQuote } from "@/lib/utils";
import Settings from "./components/Settings";
import { Button } from "./components/ui/button";

const DEFAULT_DURATION = 30;

function App() {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState(duration);

  const [quote, setQuote] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isTestActive, setIsTestActive] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);

  const [allTypedText, setAllTypedText] = useState("");

  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);

  const [mode, setMode] = useState<"normal" | "strict">("normal");
  const [isError, setIsError] = useState(false);

  // NEW: counters for accuracy
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // On mount, pick a random quote and reset everything
  useEffect(() => {
    setQuote(getRandomQuote(sampleQuotes));
    setUserInput("");
    setAllTypedText("");

    setFinalWpm(0);
    setFinalAccuracy(0);

    setTimeLeft(duration);
    setIsTestActive(false);
    setIsTestComplete(false);
    setIsError(false);

    setTotalTyped(0);
    setCorrectTyped(0);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Timer logic
  useEffect(() => {
    if (isTestActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTestActive) {
      // Time's up → compute final stats
      const finalTyped = allTypedText + userInput;

      const elapsed = duration;
      const wpm = computeWPM(finalTyped.length, elapsed);

      // Compute accuracy from our counters
      const accuracy =
        totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 0;

      setFinalWpm(wpm);
      setFinalAccuracy(accuracy);

      setIsTestActive(false);
      setIsTestComplete(true);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTestActive, timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // what the user just tried to type
    const prev = userInput; // what’s currently in state

    if (!isTestActive && !isTestComplete) {
      setIsTestActive(true);
    }
    if (isTestComplete) return;

    if (mode === "strict") {
      // 1) If user backspaces, allow it to correct errors
      if (raw.length < prev.length) {
        setUserInput(raw);
        setIsError(false);
        return;
      }

      // 2) Only allow one new character at a time in strict mode
      if (raw.length === prev.length + 1) {
        const newChar = raw.charAt(raw.length - 1);
        const expected = quote.charAt(prev.length);

        // Count this keystroke
        setTotalTyped((t) => t + 1);

        // If it matches, advance and clear error
        if (newChar === expected) {
          setCorrectTyped((c) => c + 1);
          setIsError(false);

          const updated = raw;
          setUserInput(updated);

          // If quote is complete, move on
          if (updated.length >= quote.length || updated === quote) {
            setAllTypedText((p) => p + updated);
            const next = getRandomQuote(sampleQuotes);
            setQuote(next);
            setUserInput("");
          }
        } else {
          // Wrong keystroke: mark error but do not advance userInput
          setIsError(true);
        }
      }

      // If user tries to paste or add more than one char at once, ignore it
      return;
    }

    // ─── Normal mode ───
    // If they added exactly one character:
    if (raw.length === prev.length + 1) {
      const newChar = raw.charAt(raw.length - 1);
      const expected = quote.charAt(prev.length);

      setTotalTyped((t) => t + 1);
      if (newChar === expected) {
        setCorrectTyped((c) => c + 1);
      }
    }

    setUserInput(raw);
    setIsError(false);

    // If quote is complete, move on
    if (raw.length >= quote.length || raw === quote) {
      setAllTypedText((p) => p + raw);
      const nextQuote = getRandomQuote(sampleQuotes);
      setQuote(nextQuote);
      setUserInput("");
    }
  };

  const handleRestart = () => {
    setQuote(getRandomQuote(sampleQuotes));
    setUserInput("");
    setAllTypedText("");

    setFinalWpm(0);
    setFinalAccuracy(0);

    setTimeLeft(duration);
    setIsTestActive(false);
    setIsTestComplete(false);
    setIsError(false);

    setTotalTyped(0);
    setCorrectTyped(0);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleDurationChange = (newValue: string) => {
    const secs = Number(newValue);
    if (isNaN(secs)) return;
    setDuration(secs);
    if (!isTestActive) {
      setTimeLeft(secs);
    }
  };

  const stopTest = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsTestActive(false);
    setUserInput("");
    setAllTypedText("");
    setQuote(getRandomQuote(sampleQuotes));
    setIsError(false);

    setTotalTyped(0);
    setCorrectTyped(0);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4/5 text-center space-y-6">
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2">
          <Settings
            duration={duration}
            handleDurationChange={handleDurationChange}
            mode={mode}
            setMode={setMode}
            isTestActive={isTestActive}
          />
        </div>

        {(isTestActive || isTestComplete) && (
          <div className="text-2xl font-bold text-gray-700">
            {isTestComplete ? "Time’s Up!" : `${timeLeft}s`}
          </div>
        )}

        <QuoteDisplay
          quote={quote}
          userInput={userInput}
          showCursor={isTestActive && !isTestComplete}
          isError={isError}
        />

        <input
          ref={inputRef}
          className="opacity-0 w-0 h-0 absolute -z-10"
          onChange={handleChange}
          value={userInput}
          autoFocus
          disabled={isTestComplete}
          onBlur={() => {
            if (!isTestComplete) {
              inputRef.current?.focus();
            }
          }}
        />

        {isTestComplete ? (
          <Stats
            wpm={finalWpm}
            accuracy={finalAccuracy}
            onRestart={handleRestart}
          />
        ) : (
          <div
            className="text-gray-500 cursor-pointer"
            onClick={() => inputRef.current?.focus()}
          >
            {!isTestActive
              ? `Start typing to begin the ${duration}-second test!`
              : "Keep typing..."}
          </div>
        )}

        {isTestActive && <Button onClick={stopTest}>Stop</Button>}
      </div>
    </div>
  );
}

export default App;

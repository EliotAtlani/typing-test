import React from "react";

interface Props {
  quote: string;
  userInput: string;
  showCursor: boolean;
  isError: boolean; // new prop
}

const QuoteDisplay = ({ quote, userInput, showCursor, isError }: Props) => {
  const chars = quote.split("");

  return (
    <div className="text-xl font-mono leading-relaxed break-words">
      {chars.map((char, i) => {
        let colorClass = "";

        // 1) already‐typed characters (always compare userInput[i])
        if (i < userInput.length) {
          colorClass =
            char === userInput[i] ? "text-purple-700" : "text-red-600";
        }

        // 2) if there’s an active error *exactly* at index = userInput.length,
        //    then force that character to be red
        if (isError && i === userInput.length) {
          colorClass = "text-red-600";
        }

        // 3) decide if this index should show the blinking cursor
        const isCursorHere =
          showCursor &&
          ((i === userInput.length && !isError) ||
            (i === userInput.length && isError));

        const base = `relative ${colorClass}`;
        const cursorPseudo = isCursorHere
          ? " after:content-[''] after:absolute after:left-0 after:top-0 after:h-full after:w-px after:bg-gray-700 after:animate-pulse"
          : "";

        return (
          <span key={i} className={base + cursorPseudo}>
            {char}
          </span>
        );
      })}

      {/* if they finished exactly at the end, show a cursor at a blank spot */}
      {showCursor && !isError && userInput.length >= quote.length && (
        <span className="relative after:content-['\u00A0'] after:absolute after:left-0 after:top-0 after:h-full after:w-px after:bg-gray-700 after:animate-pulse">
          {"\u00A0"}
        </span>
      )}
    </div>
  );
};

export default QuoteDisplay;

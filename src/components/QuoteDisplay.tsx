import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useEffect } from "react";

interface Props {
  quote: string;
  userInput: string;
  showCursor: boolean;
  isError: boolean;
}

const QuoteDisplay = ({ quote, userInput, showCursor, isError }: Props) => {
  const chars = quote.split("");
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Use motion values for smooth animation
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  // Apply spring physics to the motion values
  const springX = useSpring(cursorX, { stiffness: 500, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 30 });
  const springScrollY = useSpring(scrollY, { stiffness: 400, damping: 35 });

  // Calculate cursor position and scroll offset
  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const charSpans = textRef.current.querySelectorAll('[data-char-index]');
    const targetIndex = userInput.length;

    if (targetIndex === 0) {
      // Position at start
      cursorX.set(0);
      cursorY.set(0);
      scrollY.set(0);
    } else if (charSpans[targetIndex - 1]) {
      // Position after the last typed character
      const prevChar = charSpans[targetIndex - 1] as HTMLElement;
      const rect = prevChar.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      // Calculate line height
      const lineHeight = 48; // 2xl text with loose leading
      const visibleLines = 3;
      const maxVisibleHeight = lineHeight * visibleLines;

      // Get relative position to text container (accounting for scroll)
      const currentScrollY = scrollY.get();
      const relativeY = rect.top - containerRect.top - currentScrollY;

      // Calculate scroll offset to keep cursor in view
      let newScrollY = currentScrollY;
      if (relativeY > maxVisibleHeight - lineHeight) {
        // Need to scroll up (negative Y) to keep cursor visible
        newScrollY = currentScrollY - (relativeY - (maxVisibleHeight - lineHeight));
      }

      scrollY.set(newScrollY);

      cursorX.set(rect.right - containerRect.left);
      cursorY.set(rect.top - containerRect.top - newScrollY);
    }
  }, [userInput.length]);

  return (
    <div
      ref={containerRef}
      className="text-2xl font-mono leading-loose relative max-w-4xl mx-auto px-4 overflow-hidden"
      style={{ height: '144px' }}
    >
      <motion.div
        ref={textRef}
        style={{ y: springScrollY }}
        className="relative"
        css={{ wordBreak: 'normal', overflowWrap: 'break-word' }}
      >
        {chars.map((char, i) => {
          let colorClass = "text-gray-400";
          let isJustTyped = false;

          // already-typed characters
          if (i < userInput.length) {
            colorClass =
              char === userInput[i] ? "text-purple-700" : "text-red-600";
            if (i === userInput.length - 1) {
              isJustTyped = true;
            }
          }

          // active error
          if (isError && i === userInput.length) {
            colorClass = "text-red-600";
          }

          return (
            <motion.span
              key={i}
              data-char-index={i}
              className={`${colorClass}`}
              initial={false}
              animate={{
                scale: isJustTyped ? [1.15, 1] : 1,
              }}
              transition={{
                scale: {
                  duration: 0.2,
                  ease: "easeOut",
                },
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </motion.div>

      {/* Smooth animated cursor */}
      {showCursor && (
        <motion.span
          className="absolute h-[1.3em] w-0.5 bg-gray-700 rounded-full"
          style={{
            left: springX,
            top: springY,
          }}
          initial={false}
          animate={{
            opacity: [1, 0.4, 1],
          }}
          transition={{
            opacity: {
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      )}
    </div>
  );
};

export default QuoteDisplay;

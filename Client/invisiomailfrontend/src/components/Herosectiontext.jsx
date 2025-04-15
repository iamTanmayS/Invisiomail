// src/components/RotatingText.jsx
"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// Utility function for class names (if not using a library like clsx)
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 25, stiffness: 300 },
    initial = { y: "100%", opacity: 0, scale: 0.8, rotateX: -90 }, // Added scale/rotate
    animate = { y: 0, opacity: 1, scale: 1, rotateX: 0 }, // Added scale/rotate
    exit = { y: "-120%", opacity: 0, scale: 0.8, rotateX: 90 }, // Added scale/rotate
    animatePresenceMode = "wait",
    animatePresenceInitial = false,
    rotationInterval = 2500, // Slightly increased interval
    staggerDuration = 0.03, // Slightly increased stagger
    staggerFrom = "first",
    loop = true,
    auto = true,
    splitBy = "characters",
    onNext,
    mainClassName, // Class for the main rotating text container
    splitLevelClassName, // Class for each word/line container
    elementLevelClassName, // Class for each character/word/line element
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Function to split text into characters, handling graphemes correctly
  const splitIntoCharacters = (text) => {
    if (typeof Intl !== "undefined" && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
      return Array.from(segmenter.segment(text), (segment) => segment.segment);
    }
    // Fallback for environments without Intl.Segmenter
    return Array.from(text);
  };

  // Memoize the elements to be rendered based on the current text and splitBy prop
  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];
    if (!currentText) return []; // Handle case where texts array might be empty temporarily

    // Split by Characters (Default)
    if (splitBy === "characters") {
      const words = currentText.split(/(\s+)/); // Split by spaces, keep spaces
      return words
        .filter(part => part.length > 0) // Remove empty strings
        .map((part) => ({
          characters: part.trim().length > 0 ? splitIntoCharacters(part) : [part], // Split word or keep space
          isSpace: /^\s+$/.test(part), // Check if it's just whitespace
        }));
    }
    // Split by Words
    if (splitBy === "words") {
      return currentText.split(/(\s+)/).filter(part => part.length > 0).map((part) => ({
        characters: [part],
        isSpace: /^\s+$/.test(part),
      }));
    }
    // Split by Lines
    if (splitBy === "lines") {
      return currentText.split("\n").map((line, i, arr) => ({
        characters: [line],
        isSpace: false, // No space needed between lines here
        needsLineBreak: i !== arr.length - 1, // Add line break visually if needed
      }));
    }
    // Split by Custom Separator
    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      isSpace: false, // Assume no space needed unless handled by wrapper
      needsSeparator: i !== arr.length - 1, // Indicate if separator was present
    }));

  }, [texts, currentTextIndex, splitBy]);


  // Calculate stagger delay based on index and direction
  const getStaggerDelay = useCallback(
    (elementIndex, totalElements) => {
      const total = totalElements;
      if (staggerFrom === "first") return elementIndex * staggerDuration;
      if (staggerFrom === "last") return (total - 1 - elementIndex) * staggerDuration;
      if (staggerFrom === "center") {
        const center = Math.floor(total / 2);
        return Math.abs(center - elementIndex) * staggerDuration;
      }
      if (staggerFrom === "random") {
        // Note: This generates a new random order *per render*, might not be desired.
        // For consistent random, generate sequence once and store in state/memo.
         const randomIndex = Math.floor(Math.random() * total);
         return Math.abs(randomIndex - elementIndex) * staggerDuration;
      }
       // Allow numerical index for stagger start
      if (typeof staggerFrom === 'number') {
        return Math.abs(staggerFrom - elementIndex) * staggerDuration;
      }
      return 0; // Default to no stagger if invalid
    },
    [staggerFrom, staggerDuration]
  );

  // Handle index change and notify parent if callback provided
  const handleIndexChange = useCallback(
    (newIndex) => {
      setCurrentTextIndex(newIndex);
      if (onNext) onNext(newIndex);
    },
    [onNext]
  );

  // Go to the next text item
  const next = useCallback(() => {
    const nextIndex =
      currentTextIndex === texts.length - 1
        ? loop
          ? 0
          : currentTextIndex
        : currentTextIndex + 1;
    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  // Go to the previous text item
  const previous = useCallback(() => {
    const prevIndex =
      currentTextIndex === 0
        ? loop
          ? texts.length - 1
          : currentTextIndex
        : currentTextIndex - 1;
    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  // Jump to a specific text item index
  const jumpTo = useCallback(
    (index) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  // Reset to the first text item
  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  // Expose control methods via ref
  useImperativeHandle(
    ref,
    () => ({
      next,
      previous,
      jumpTo,
      reset,
    }),
    [next, previous, jumpTo, reset]
  );

  // Set up automatic rotation interval if 'auto' is true
  useEffect(() => {
    if (!auto || texts.length <= 1) return; // Don't run interval if not auto or only one text
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval, auto, texts.length]); // Added texts.length dependency

  // --- Rendering Logic ---
  let characterCounter = 0; // Counter for stagger calculation across all elements

  return (
    // Main component span - apply layout transitions if needed
    <motion.span
      className={cn("relative inline-block align-bottom", mainClassName)} // Use align-bottom for better baseline alignment
      {...rest}
      layout // Animate layout changes (e.g., width changes)
      transition={transition}
    >
      {/* Screen reader only text - crucial for accessibility */}
      <span className="sr-only">{texts[currentTextIndex]}</span>

      {/* AnimatePresence handles enter/exit animations */}
      <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
        <motion.span // Changed from div to span for inline flow, apply layout here too
          key={currentTextIndex} // Key change triggers animation
          className={cn(
            "inline-flex flex-wrap", // Use flex-wrap for character/word splitting
            splitBy === "lines" ? "flex-col w-full" : "" // Special case for lines
          )}
          layout // Animate layout changes within the current text block
          aria-hidden="true" // Hide from screen readers (sr-only covers it)
        >
          {elements.map((elementObj, elementIndex) => {
            const currentCharacterBaseIndex = characterCounter;
            // Increment counter for next element's base index BEFORE mapping characters
             characterCounter += elementObj.characters.length;

            // Render word/line container (splitLevel)
             return (
               <span
                 key={elementIndex}
                 className={cn(
                   "inline-flex", // Keep elements together
                   splitLevelClassName,
                   { 'whitespace-pre': elementObj.isSpace } // Preserve whitespace if it's a space element
                 )}
               >
                 {elementObj.characters.map((char, charIndex) => (
                   // Render individual character/word/line element (elementLevel)
                   <motion.span
                     key={charIndex}
                     initial={initial}
                     animate={animate}
                     exit={exit}
                     transition={{
                       ...transition,
                       delay: getStaggerDelay(
                         currentCharacterBaseIndex + charIndex, // Calculate index relative to start of text
                         characterCounter // Pass total characters count up to this point
                       ),
                     }}
                     className={cn(
                       "inline-block", // Ensure it's treated as a block for transforms
                       elementLevelClassName
                     )}
                   >
                     {char}
                   </motion.span>
                 ))}
                 {/* Add line break if needed for splitBy="lines" */}
                 {elementObj.needsLineBreak && <br />}
               </span>
             );
          })}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText;
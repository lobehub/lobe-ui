'use client';

import { motion } from 'framer-motion';
import { createElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useStyles } from './style';
import type { TypewriterEffectProps } from './type';

const TypewriterEffect = memo<TypewriterEffectProps>(
  ({
    sentences,
    as: Component = 'div',
    typingSpeed = 100,
    initialDelay = 0,
    pauseDuration = 2000,
    deletingSpeed = 50,
    deletePauseDuration = 0,
    loop = true,
    className = '',
    color,
    showCursor = true,
    hideCursorWhileTyping = false,
    cursorCharacter,
    cursorClassName = '',
    cursorColor,
    cursorBlinkDuration = 0.8,
    cursorFade = true,
    cursorStyle = 'pipe',
    textColors = [],
    variableSpeed,
    onSentenceComplete,
    startOnVisible = false,
    reverseMode = false,
    ...props
  }: TypewriterEffectProps) => {
    const { styles, cx } = useStyles();
    const [displayedText, setDisplayedText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(!startOnVisible);
    const [isDeletePausing, setIsDeletePausing] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    const textArray = useMemo(
      () => (Array.isArray(sentences) ? sentences : [sentences]),
      [sentences],
    );

    const getRandomSpeed = useCallback(() => {
      if (!variableSpeed) return typingSpeed;
      const { min, max } = variableSpeed;
      return Math.random() * (max - min) + min;
    }, [variableSpeed, typingSpeed]);

    const getCurrentTextColor = () => {
      if (textColors.length > 0) {
        return textColors[currentTextIndex % textColors.length];
      }
      return color;
    };

    const getCurrentCursorColor = () => {
      return cursorColor || color;
    };

    useEffect(() => {
      if (!startOnVisible || !containerRef.current) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            }
          });
        },
        { threshold: 0.1 },
      );

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }, [startOnVisible]);

    useEffect(() => {
      if (!isVisible) return;

      let timeout: ReturnType<typeof setTimeout>;

      const currentText = textArray[currentTextIndex];
      const processedText = reverseMode ? currentText.split('').reverse().join('') : currentText;

      // Handle delete pause state
      if (isDeletePausing) {
        timeout = setTimeout(() => {
          setIsDeletePausing(false);
        }, deletePauseDuration);
        return () => clearTimeout(timeout);
      }

      const executeTypingAnimation = () => {
        if (isDeleting) {
          if (displayedText === '') {
            setIsDeleting(false);
            if (currentTextIndex === textArray.length - 1 && !loop) {
              return;
            }
            if (onSentenceComplete) {
              onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
            }
            setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
            setCurrentCharIndex(0);

            if (deletePauseDuration > 0) {
              setIsDeletePausing(true);
              return;
            }
          } else {
            timeout = setTimeout(() => {
              setDisplayedText((prev) => prev.slice(0, -1));
            }, deletingSpeed);
          }
        } else {
          if (currentCharIndex < processedText.length) {
            timeout = setTimeout(
              () => {
                setDisplayedText((prev) => prev + processedText[currentCharIndex]);
                setCurrentCharIndex((prev) => prev + 1);
              },
              variableSpeed ? getRandomSpeed() : typingSpeed,
            );
          } else if (textArray.length >= 1) {
            if (!loop && currentTextIndex === textArray.length - 1) return;

            timeout = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }
      };

      if (currentCharIndex === 0 && !isDeleting && displayedText === '') {
        timeout = setTimeout(executeTypingAnimation, initialDelay);
      } else {
        executeTypingAnimation();
      }

      return () => clearTimeout(timeout);
    }, [
      currentCharIndex,
      displayedText,
      isDeleting,
      isDeletePausing,
      typingSpeed,
      deletingSpeed,
      deletePauseDuration,
      pauseDuration,
      textArray,
      currentTextIndex,
      loop,
      initialDelay,
      isVisible,
      reverseMode,
      variableSpeed,
      onSentenceComplete,
      getRandomSpeed,
    ]);

    const getCursorStyle = () => {
      if (cursorCharacter) return styles.cursorCustom;

      switch (cursorStyle) {
        case 'block': {
          return styles.cursorBlock;
        }
        case 'dot': {
          return styles.cursorDot;
        }
        case 'underscore': {
          return styles.cursorUnderscore;
        }
        case 'pipe': {
          return styles.cursor;
        }
      }
    };

    const isTyping = currentCharIndex < textArray[currentTextIndex].length && !isDeleting;
    const isAfterTyping = currentCharIndex === textArray[currentTextIndex].length && !isDeleting;

    const shouldHideCursor = (() => {
      if (hideCursorWhileTyping === true) return true; // 完全隐藏
      if (hideCursorWhileTyping === 'typing') return isTyping || isDeleting; // 打字和删除时隐藏
      if (hideCursorWhileTyping === 'afterTyping') return isAfterTyping; // 打字完成后隐藏
      return false;
    })();

    const textColor = getCurrentTextColor();
    const finalCursorColor = getCurrentCursorColor();

    // Split displayed text into characters for animation
    const characters = displayedText.split('');

    return createElement(
      Component,
      {
        className: cx(styles.container, className),
        ref: containerRef,
        ...props,
      },
      <>
        <span className={styles.text} style={textColor ? { color: textColor } : undefined}>
          {characters.map((char, index) => (
            <motion.span
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              key={`${currentTextIndex}-${index}`}
              style={{ display: 'inline-block' }}
              transition={{
                duration: typingSpeed / 500,
                ease: 'easeInOut',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </span>
        {showCursor &&
          (cursorFade ? (
            <motion.span
              animate={{ opacity: shouldHideCursor ? 0 : 1 }}
              className={cx(getCursorStyle(), cursorClassName)}
              initial={{ opacity: 0 }}
              style={finalCursorColor ? { backgroundColor: finalCursorColor } : undefined}
              transition={{
                duration: shouldHideCursor ? 0.2 : cursorBlinkDuration,
                ease: 'easeInOut',
                repeat: shouldHideCursor ? 0 : Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
              }}
            >
              {cursorCharacter}
            </motion.span>
          ) : (
            <span
              className={cx(getCursorStyle(), cursorClassName)}
              style={{
                backgroundColor: finalCursorColor,
                opacity: shouldHideCursor ? 0 : 1,
              }}
            >
              {cursorCharacter}
            </span>
          ))}
      </>,
    );
  },
);

TypewriterEffect.displayName = 'TypewriterEffect';

export default TypewriterEffect;

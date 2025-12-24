'use client';

import { createElement, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMotionComponent } from '@/MotionProvider';

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
    segmentMode = 'grapheme',
    ...props
  }: TypewriterEffectProps) => {
    const Motion = useMotionComponent();
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

    // Helper function to split text based on segment mode
    const splitText = useCallback(
      (text: string): string[] => {
        // Use Intl.Segmenter if available
        if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
          const segmenter = new Intl.Segmenter(undefined, { granularity: segmentMode });
          return Array.from(segmenter.segment(text), (segment) => segment.segment);
        }

        // Fallback when Intl.Segmenter is not available
        if (segmentMode === 'word') {
          // Simple word splitting fallback
          return text.split(/(\s+)/).filter(Boolean);
        }

        // Grapheme fallback
        return Array.from(text);
      },
      [segmentMode],
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
      // Split text based on segment mode
      const textSegments = splitText(currentText);
      const processedText = reverseMode ? textSegments.reverse().join('') : currentText;

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
              setDisplayedText((prev) => {
                const segments = splitText(prev);
                return segments.slice(0, -1).join('');
              });
            }, deletingSpeed);
          }
        } else {
          const processedSegments = splitText(processedText);
          if (currentCharIndex < processedSegments.length) {
            timeout = setTimeout(
              () => {
                setDisplayedText((prev) => prev + processedSegments[currentCharIndex]);
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
      splitText,
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

    const currentTextLength = splitText(textArray[currentTextIndex]).length;
    const isTyping = currentCharIndex < currentTextLength && !isDeleting;
    const isAfterTyping = currentCharIndex === currentTextLength && !isDeleting;

    const shouldHideCursor = (() => {
      if (hideCursorWhileTyping === true) return true; // 完全隐藏
      if (hideCursorWhileTyping === 'typing') return isTyping || isDeleting; // 打字和删除时隐藏
      if (hideCursorWhileTyping === 'afterTyping') return isAfterTyping; // 打字完成后隐藏
      return false;
    })();

    const textColor = getCurrentTextColor();
    const finalCursorColor = getCurrentCursorColor();

    // Split displayed text for animation
    const characters = splitText(displayedText);

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
            <Motion.span
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
            </Motion.span>
          ))}
        </span>
        {showCursor &&
          (cursorFade ? (
            <Motion.span
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
            </Motion.span>
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

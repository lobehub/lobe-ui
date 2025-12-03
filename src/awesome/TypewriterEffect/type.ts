import type { ElementType, ReactNode } from 'react';

export type CursorStyle = 'pipe' | 'underscore' | 'dot' | 'block';

export interface TypewriterEffectProps {
  /**
   * Custom element type for the container
   * @default 'div'
   */
  as?: ElementType;
  /**
   * Additional class name for the container
   */
  className?: string;
  /**
   * Text color
   */
  color?: string;
  /**
   * Cursor blink duration in seconds
   * @default 0.8
   */
  cursorBlinkDuration?: number;
  /**
   * Custom cursor character or ReactNode
   * @default undefined (uses cursorStyle)
   */
  cursorCharacter?: string | ReactNode;
  /**
   * Additional class name for the cursor
   */
  cursorClassName?: string;
  /**
   * Cursor color (defaults to color if not provided)
   */
  cursorColor?: string;
  /**
   * Cursor fade animation
   * @default true
   */
  cursorFade?: boolean;
  /**
   * Style of the cursor (ignored if cursorCharacter is provided)
   * @default 'pipe'
   */
  cursorStyle?: CursorStyle;
  /**
   * Pause duration after deleting complete before next sentence (milliseconds)
   * @default 0
   */
  deletePauseDuration?: number;
  /**
   * Speed of deleting characters (milliseconds per character)
   * @default 50
   */
  deletingSpeed?: number;
  /**
   * Hide cursor behavior
   * - false: always show cursor
   * - 'typing': hide cursor while typing
   * - 'afterTyping': hide cursor after typing complete (during pause)
   * - true: completely hide cursor
   * @default false
   */
  hideCursorWhileTyping?: boolean | 'typing' | 'afterTyping';
  /**
   * Initial delay before starting animation (milliseconds)
   * @default 0
   */
  initialDelay?: number;
  /**
   * Whether to loop through sentences
   * @default true
   */
  loop?: boolean;
  /**
   * Callback when a sentence is completed
   */
  onSentenceComplete?: (sentence: string, index: number) => void;
  /**
   * Pause duration after typing complete before deleting (milliseconds)
   * @default 2000
   */
  pauseDuration?: number;
  /**
   * Reverse mode: type from end to start
   * @default false
   */
  reverseMode?: boolean;
  /**
   * Array of sentences to display
   */
  sentences: string[];
  /**
   * Whether to show cursor
   * @default true
   */
  showCursor?: boolean;
  /**
   * Start animation when element becomes visible
   * @default false
   */
  startOnVisible?: boolean;
  /**
   * Colors for each sentence (cycles through array)
   */
  textColors?: string[];
  /**
   * Speed of typing characters (milliseconds per character)
   * @default 100
   */
  typingSpeed?: number;
  /**
   * Variable typing speed range
   */
  variableSpeed?: { max: number; min: number };
}

---
nav: Awesome
group: General
title: TypewriterEffect
description: A powerful typewriter effect component that creates realistic typing animations with automatic typing and deleting, cycling through multiple sentences with extensive customization options.
apiHeader:
  pkg: '@lobehub/ui/awesome'
  docUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/TypewriterEffect/index.md'
  sourceUrl: 'https://github.com/lobehub/lobe-ui/tree/master/src/awesome/TypewriterEffect/TypewriterEffect.tsx'
---

## Default

Interactive playground with all configuration options.

<code src="./demos/index.tsx" nopadding></code>

## Cursor Styles

<code src="./demos/cursorStyles.tsx"></code>

## Cursor Behavior

<code src="./demos/cursorBehavior.tsx"></code>

## Colors

<code src="./demos/colors.tsx"></code>

## Speed Control

<code src="./demos/customSpeed.tsx"></code>

## Initial Delay

<code src="./demos/initialDelay.tsx"></code>

## Advanced Features

<code src="./demos/advanced.tsx"></code>

## Variable Speed

<code src="./demos/variableSpeed.tsx"></code>

## Callback

<code src="./demos/callback.tsx"></code>

## APIs

| Property              | Description                                              | Type                                         | Default  |
| --------------------- | -------------------------------------------------------- | -------------------------------------------- | -------- |
| sentences             | Array of sentences to display and cycle through          | `string[]`                                   | -        |
| typingSpeed           | Typing speed (milliseconds per character)                | `number`                                     | `100`    |
| deletingSpeed         | Deleting speed (milliseconds per character)              | `number`                                     | `50`     |
| deletePauseDuration   | Pause after deleting before next sentence (milliseconds) | `number`                                     | `0`      |
| pauseDuration         | Pause duration after typing complete (milliseconds)      | `number`                                     | `2000`   |
| initialDelay          | Initial delay before starting animation (milliseconds)   | `number`                                     | `0`      |
| loop                  | Whether to loop through sentences                        | `boolean`                                    | `true`   |
| color                 | Text color                                               | `string`                                     | -        |
| showCursor            | Whether to show cursor                                   | `boolean`                                    | `true`   |
| cursorStyle           | Built-in cursor style                                    | `'pipe' \| 'block' \| 'underscore' \| 'dot'` | `'pipe'` |
| cursorCharacter       | Custom cursor character or ReactNode                     | `string \| ReactNode`                        | -        |
| cursorColor           | Cursor color (defaults to color if not provided)         | `string`                                     | -        |
| cursorBlinkDuration   | Cursor blink animation duration in seconds               | `number`                                     | `0.8`    |
| cursorFade            | Enable cursor fade animation                             | `boolean`                                    | `true`   |
| cursorClassName       | Additional class name for the cursor                     | `string`                                     | -        |
| hideCursorWhileTyping | Hide cursor behavior                                     | `false \| 'typing' \| 'afterTyping' \| true` | `false`  |
| textColors            | Colors for each sentence (cycles through array)          | `string[]`                                   | `[]`     |
| variableSpeed         | Variable typing speed range for natural effect           | `{ min: number; max: number }`               | -        |
| reverseMode           | Type text from end to start                              | `boolean`                                    | `false`  |
| startOnVisible        | Start animation when element becomes visible             | `boolean`                                    | `false`  |
| onSentenceComplete    | Callback fired when a sentence completes                 | `(sentence: string, index: number) => void`  | -        |
| as                    | Custom HTML element type for the container               | `ElementType`                                | `'div'`  |
| className             | Additional class name for the container                  | `string`                                     | -        |

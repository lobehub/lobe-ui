import { Button, Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useEffect, useState } from 'react';

import { Flexbox } from '@/Flex';

import { markdownElements } from './custom/plugins/MarkdownElements';
import { removeLineBreaksInAntArtifact } from './custom/plugins/utils';

const fullContent = `# Complete Markdown Integration Example

This demonstrates a comprehensive real-world example of how different markdown features work together in a cohesive document.

## AI Assistant Capabilities

Hello! I'm an AI assistant powered by advanced language models. I can help you with various tasks:

1. **Question Answering** - Provide detailed responses to complex queries
2. **Information Research** - Gather and synthesize information from multiple sources
3. **Code Development** - Write, review, and debug code in multiple languages
4. **Concept Explanation** - Break down complex topics into understandable parts

## React Component Implementation

Here's a complete React component that demonstrates markdown integration:

\`\`\`tsx
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

import { PreviewGroup } from '@/Image';
import { useMarkdown } from '@/hooks/useMarkdown';

import { SyntaxMarkdownProps } from '../type';
\`\`\`

## Mathematical Formula Support

Advanced mathematical expressions are fully supported through LaTeX integration:

### Fourier Transform
The Fourier transform converts signals between time and frequency domains:

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} d\\xi
$$

### Complex Analysis
For complex functions, we can express relationships like:

$$
\\frac{d}{dz}f(z) = \\lim_{h \\to 0} \\frac{f(z+h) - f(z)}{h}
$$

## Data Flow Visualization

\`\`\`mermaid
graph TD
  A[User Input] --> B[Markdown Parser]
  B --> C[Plugin Processing]
  C --> D[Component Rendering]
  D --> E[Final Output]

  B --> F[LaTeX Processing]
  F --> D

  B --> G[Mermaid Processing]
  G --> D

  B --> H[Code Highlighting]
  H --> D
\`\`\`

## Feature Integration Summary

| Feature | Status | Implementation |
|---------|--------|----------------|
| Headers | ✅ | Native markdown |
| Text Formatting | ✅ | Bold, italic, strikethrough |
| Code Blocks | ✅ | Syntax highlighting + annotations |
| Math Formulas | ✅ | LaTeX via KaTeX |
| Diagrams | ✅ | Mermaid integration |
| Tables | ✅ | GitHub-flavored markdown |
| Task Lists | ✅ | Interactive checkboxes |
| Footnotes | ✅ | Reference system |

Thank you for exploring these markdown capabilities!
`;

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

export default () => {
  const store = useCreateStore();
  const { children, streamingSpeed, ...rest } = useControls(
    {
      children: {
        rows: true,
        value: fullContent,
      },
      fullFeaturedCodeBlock: {
        value: true,
      },
      streamingSpeed: {
        max: 100,
        min: 5,
        step: 5,
        value: 25,
      },
    },
    { store },
  );

  // State to store the currently displayed content
  const [streamedContent, setStreamedContent] = useState(children);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Restart streaming
  const restartStreaming = () => {
    setStreamedContent('');
    setIsStreaming(true);
    setIsPaused(false);
  };

  // Toggle pause state
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Simulate streaming effect
  useEffect(() => {
    if (!isStreaming || isPaused) return;

    let currentPosition = 0;
    if (streamedContent.length > 0) {
      currentPosition = streamedContent.length;
    }

    const intervalId = setInterval(() => {
      if (currentPosition < children.length) {
        // Stream character by character
        const nextChunkSize = Math.min(3, children.length - currentPosition);
        const nextContent = children.slice(0, Math.max(0, currentPosition + nextChunkSize));
        setStreamedContent(nextContent);
        currentPosition += nextChunkSize;
      } else {
        clearInterval(intervalId);
        setIsStreaming(false);
      }
    }, streamingSpeed);

    return () => clearInterval(intervalId);
  }, [children, streamingSpeed, isStreaming, isPaused, streamedContent.length]);

  return (
    <StoryBook levaStore={store}>
      <Flexbox
        gap={16}
        height={'100%'}
        style={{
          overflow: 'auto',
        }}
        width={'100%'}
      >
        <Flexbox direction="horizontal" gap={8}>
          <Button
            block
            loading={!isPaused && isStreaming}
            onClick={restartStreaming}
            type={'primary'}
          >
            Restart Streaming
          </Button>
          <Button
            block
            disabled={!isStreaming}
            onClick={togglePause}
            type={isPaused ? 'default' : 'primary'}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        </Flexbox>
        <Markdown
          animated={isStreaming}
          components={components}
          fullFeaturedCodeBlock={rest.fullFeaturedCodeBlock}
          rehypePlugins={rehypePlugins}
          variant="chat"
        >
          {removeLineBreaksInAntArtifact(streamedContent)}
        </Markdown>
      </Flexbox>
    </StoryBook>
  );
};

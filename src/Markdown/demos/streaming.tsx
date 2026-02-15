import { Button, Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useCallback, useEffect, useRef, useState } from 'react';

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

## Long Paragraph Example

This is the first paragraph demonstrating the text-box-trim and text-edge properties. In modern web design, typography plays a crucial role in creating readable and visually appealing content. When browsers support the text-box-trim property, we can achieve more precise control over vertical spacing, eliminating unnecessary whitespace that can affect the overall layout.

This is the second paragraph showing how margin-inline-start and margin-inline-end create horizontal spacing for paragraphs. By setting appropriate inline margins, we can create visual separation between paragraphs while maintaining a clean, structured appearance. This approach is particularly effective for long-form content like articles, documentation, and blog posts.

This is the third paragraph illustrating the line-height property set to 2. A generous line height significantly improves readability by providing more breathing room between lines of text. This spacing reduces visual fatigue and makes it easier for readers to follow along, especially when reading extended passages of text.

This is the fourth paragraph explaining the text-box-trim: trim-both property. When supported by the browser, this CSS feature automatically trims the leading and trailing whitespace of text boxes, allowing for more precise control over paragraph spacing. Combined with text-edge: cap alphabetic, we can achieve professional typographic alignment.

This is the fifth paragraph discussing practical applications of these typography techniques. These styling approaches are particularly well-suited for displaying long articles, blog content, technical documentation, and any scenario where excellent readability is essential. Proper spacing and line height can transform dense text into an enjoyable reading experience.

This is the sixth paragraph covering the separation of concerns in typography. Paragraph spacing is controlled through margin-block-start and margin-block-end, while horizontal spacing uses margin-inline-start and margin-inline-end. This separation provides flexibility in controlling layout effects independently, allowing designers to fine-tune the visual presentation.

This is the seventh paragraph exploring modern CSS capabilities. New CSS features like text-box-trim and text-edge give us unprecedented control over text rendering. These properties enable more precise typographic control, helping us achieve professional-grade layouts that were previously difficult to implement with traditional CSS approaches.

This is the eighth paragraph demonstrating the visual effect of multiple paragraphs. Each paragraph benefits from appropriate horizontal margins and a line-height of 2, creating a comfortable reading rhythm. This design approach proves highly effective in long-form reading scenarios, where user comfort and comprehension are paramount.

This is the ninth paragraph emphasizing the importance of typography in user experience. Text formatting is not merely a technical concern but a fundamental component of user experience design. Well-crafted typography helps users understand content more easily, reduces reading burden, and enhances overall usability. This is why attention to these details matters.

This is the tenth and final paragraph concluding our exploration of paragraph styling. Through thoughtful spacing and line-height settings, we can create text layouts that are both aesthetically pleasing and highly functional. This design approach deserves consideration and application in real-world projects where readability and user experience are priorities.

Thank you for exploring these markdown capabilities!

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

`;

const MOCK_API_BASE = 'https://aistream-speed-mocker.vercel.app/v1';
const API_MODELS = {
  'deepseek-r1-1.5B-400tps': 'deepseek-r1 1.5B (400 tps)',
  'qwen-2.5-1.5B-200tps': 'qwen-2.5 1.5B (200 tps)',
  'qwen-qwq-32B-120tps': 'qwen-qwq 32B (120 tps)',
  'llama-3-8b-80tps': 'llama-3 8b (80 tps)',
  'gpt-4o-40tps': 'gpt-4o (40 tps)',
  'deepseek-v3-10tps': 'deepseek-v3 (10 tps)',
};

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

export default () => {
  const store = useCreateStore();
  const { children, streamingSpeed, randomStreaming, useAPI, apiModel, ...rest } = useControls(
    {
      apiModel: {
        options: API_MODELS,
        value: 'gpt-4o-40tps',
      },
      children: {
        rows: true,
        value: fullContent,
      },
      fullFeaturedCodeBlock: {
        value: true,
      },
      randomStreaming: {
        value: false,
      },
      streamingSpeed: {
        max: 100,
        min: 5,
        step: 5,
        value: 25,
      },
      useAPI: {
        value: false,
      },
    },
    { store },
  );

  const safeChildren = typeof children === 'string' ? children : '';

  const [streamedContent, setStreamedContent] = useState(safeChildren);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const startAPIStreaming = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStreamedContent('');
    setIsStreaming(true);

    try {
      const response = await fetch(`${MOCK_API_BASE}/chat/completions`, {
        body: JSON.stringify({
          messages: [{ content: safeChildren || 'hello', role: 'user' }],
          model: apiModel,
          stream: true,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        signal: controller.signal,
      });

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ') || trimmed === 'data: [DONE]') continue;
          try {
            const data = JSON.parse(trimmed.slice(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              accumulated += content;
              setStreamedContent(accumulated);
            }
          } catch {
            // skip malformed chunks
          }
        }
      }
    } catch (error: any) {
      if (error?.name !== 'AbortError') console.error('Streaming error:', error);
    } finally {
      setIsStreaming(false);
    }
  }, [apiModel, safeChildren]);

  const restartStreaming = () => {
    if (useAPI) {
      startAPIStreaming();
      return;
    }
    abortRef.current?.abort();
    setStreamedContent('');
    setIsStreaming(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Local simulation streaming
  useEffect(() => {
    if (useAPI || !isStreaming || isPaused) return;

    let currentPosition = streamedContent.length;
    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (currentPosition >= safeChildren.length) {
        setIsStreaming(false);
        return;
      }

      const chunkSize = randomStreaming
        ? Math.min(Math.floor(Math.random() * 8) + 1, safeChildren.length - currentPosition)
        : Math.min(3, safeChildren.length - currentPosition);

      currentPosition += chunkSize;
      setStreamedContent(safeChildren.slice(0, currentPosition));

      const delay = randomStreaming
        ? Math.floor(Math.random() * streamingSpeed * 2) + 5
        : streamingSpeed;

      const newChunk = safeChildren.slice(currentPosition - chunkSize, currentPosition);
      console.log('delay', delay, newChunk);

      timerId = setTimeout(tick, delay);
    };

    timerId = setTimeout(
      tick,
      randomStreaming ? Math.floor(Math.random() * streamingSpeed) + 5 : streamingSpeed,
    );

    return () => clearTimeout(timerId);
  }, [
    safeChildren,
    streamingSpeed,
    randomStreaming,
    useAPI,
    isStreaming,
    isPaused,
    streamedContent.length,
  ]);

  return (
    <StoryBook levaStore={store}>
      <Flexbox
        gap={16}
        height={'100%'}
        width={'100%'}
        style={{
          overflow: 'auto',
        }}
      >
        <Flexbox direction="horizontal" gap={8}>
          <Button
            block
            loading={!isPaused && isStreaming}
            type={'primary'}
            onClick={restartStreaming}
          >
            {useAPI ? 'Start API Streaming' : 'Restart Streaming'}
          </Button>
          <Button
            block
            disabled={!isStreaming || useAPI}
            type={isPaused ? 'default' : 'primary'}
            onClick={togglePause}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          {useAPI && isStreaming && (
            <Button
              block
              danger
              onClick={() => {
                abortRef.current?.abort();
                setIsStreaming(false);
              }}
            >
              Stop
            </Button>
          )}
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

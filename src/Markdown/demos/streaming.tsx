import { Button, Markdown } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useEffect, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import { markdownElements } from '@/Markdown/demos/customPlugins/MarkdownElements';
import { removeLineBreaksInAntArtifact } from '@/Markdown/demos/customPlugins/utils';

import { fullContent } from './data';

const rehypePlugins = markdownElements.map((element) => element.rehypePlugin);
const components = Object.fromEntries(
  markdownElements.map((element) => [element.tag, element.Component]),
);

export default () => {
  const store = useCreateStore();
  const { children, streamingSpeed, animated, ...rest } = useControls(
    {
      animated: {
        value: true,
      },
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
  const [streamedContent, setStreamedContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
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
          <Button block loading={isStreaming} onClick={restartStreaming} type={'primary'}>
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
          animated={animated}
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

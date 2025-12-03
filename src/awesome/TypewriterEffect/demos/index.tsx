import { TypewriterEffect } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const { sentence1, sentence2, sentence3, ...config } = useControls(
    {
      color: '',
      cursorBlinkDuration: {
        max: 2,
        min: 0.1,
        step: 0.1,
        value: 0.8,
      },
      cursorCharacter: '',
      cursorColor: '',
      cursorFade: true,
      cursorStyle: {
        options: ['pipe', 'block', 'underscore', 'dot'],
        value: 'pipe',
      },
      deletePauseDuration: {
        max: 3000,
        min: 0,
        step: 100,
        value: 0,
      },
      deletingSpeed: {
        max: 200,
        min: 10,
        step: 10,
        value: 50,
      },
      hideCursorWhileTyping: {
        options: [false, 'typing', 'afterTyping', true],
        value: false,
      },
      initialDelay: {
        max: 3000,
        min: 0,
        step: 100,
        value: 0,
      },
      loop: true,
      pauseDuration: {
        max: 5000,
        min: 500,
        step: 100,
        value: 2000,
      },
      reverseMode: false,
      segmentMode: {
        options: ['grapheme', 'word'],
        value: 'grapheme',
      },
      sentence1: 'Build awesome apps with LobeHub.',
      sentence2: 'Create beautiful UI components.',
      sentence3: 'Enhance your user experience.',
      showCursor: true,
      typingSpeed: {
        max: 300,
        min: 20,
        step: 10,
        value: 100,
      },
    },
    { store },
  );

  const sentences = [sentence1, sentence2, sentence3].filter(Boolean);

  return (
    <StoryBook levaStore={store}>
      <div style={{ fontSize: 24, minHeight: 80 }}>
        <TypewriterEffect sentences={sentences} {...(config as any)} />
      </div>
    </StoryBook>
  );
};

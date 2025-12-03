import { TypewriterEffect } from '@lobehub/ui/awesome';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const {
    sentence1,
    sentence2,
    sentence3,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    color,
    showCursor,
    cursorStyle,
    cursorCharacter,
    cursorColor,
    cursorBlinkDuration,
    hideCursorWhileTyping,
    reverseMode,
  } = useControls(
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
      cursorStyle: {
        options: ['pipe', 'block', 'underscore', 'dot'],
        value: 'pipe',
      },
      deletingSpeed: {
        max: 200,
        min: 10,
        step: 10,
        value: 50,
      },
      hideCursorWhileTyping: false,
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
        <TypewriterEffect
          color={color || undefined}
          cursorBlinkDuration={cursorBlinkDuration}
          cursorCharacter={cursorCharacter || undefined}
          cursorColor={cursorColor || undefined}
          cursorStyle={cursorStyle as any}
          deletingSpeed={deletingSpeed}
          hideCursorWhileTyping={hideCursorWhileTyping}
          initialDelay={initialDelay}
          loop={loop}
          pauseDuration={pauseDuration}
          reverseMode={reverseMode}
          sentences={sentences}
          showCursor={showCursor}
          typingSpeed={typingSpeed}
        />
      </div>
    </StoryBook>
  );
};

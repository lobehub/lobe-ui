import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect
        sentences={[
          '👋 Hello World!',
          '🎉 Emoji support 🚀',
          '👨‍👩‍👧‍👦 Family emoji works!',
          '👍🏻 Skin tone emoji 🙌🏽',
          '🏳️‍🌈 Flag sequences 🏴‍☠️',
          '😀😃😄😁 Multiple emojis!',
        ]}
      />
    </Flexbox>
  );
};

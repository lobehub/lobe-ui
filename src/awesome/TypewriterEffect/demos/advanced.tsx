import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect cursorCharacter="▋" sentences={['Custom cursor character']} />
      <TypewriterEffect hideCursorWhileTyping sentences={['Hide cursor while typing']} />
      <TypewriterEffect
        sentences={['Blue text', 'Green text', 'Red text']}
        textColors={['#1677ff', '#52c41a', '#ff4d4f']}
      />
      <TypewriterEffect loop={false} sentences={['First', 'Last (stops here)']} />
    </Flexbox>
  );
};

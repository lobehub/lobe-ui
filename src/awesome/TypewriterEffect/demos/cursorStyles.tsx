import { TypewriterEffect } from '@lobehub/ui/awesome';
import { LoadingDots } from '@lobehub/ui/chat';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const sentences = ['Different cursor styles'];

  return (
    <Flexbox gap={16}>
      <TypewriterEffect cursorCharacter={<LoadingDots variant="pulse" />} sentences={sentences} />
      <TypewriterEffect cursorStyle="pipe" sentences={sentences} />
      <TypewriterEffect cursorStyle="block" sentences={sentences} />
      <TypewriterEffect cursorStyle="underscore" sentences={sentences} />
      <TypewriterEffect cursorStyle="dot" sentences={sentences} />
    </Flexbox>
  );
};

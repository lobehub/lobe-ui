import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect sentences={['No delay - starts immediately']} />
      <TypewriterEffect initialDelay={1000} sentences={['1 second initial delay']} />
      <TypewriterEffect initialDelay={2000} sentences={['2 seconds initial delay']} />
    </Flexbox>
  );
};

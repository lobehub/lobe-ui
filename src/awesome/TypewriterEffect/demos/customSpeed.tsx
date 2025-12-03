import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect
        deletingSpeed={30}
        pauseDuration={1000}
        sentences={['Fast typing speed']}
        typingSpeed={50}
      />
      <TypewriterEffect sentences={['Normal typing speed']} />
      <TypewriterEffect
        deletingSpeed={100}
        pauseDuration={3000}
        sentences={['Slow typing speed']}
        typingSpeed={200}
      />
    </Flexbox>
  );
};

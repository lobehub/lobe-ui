import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect sentences={['Constant speed typing']} typingSpeed={80} />
      <TypewriterEffect
        sentences={['Variable speed typing']}
        variableSpeed={{ max: 150, min: 30 }}
      />
    </Flexbox>
  );
};

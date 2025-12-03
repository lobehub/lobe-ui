import { TypewriterEffect } from '@lobehub/ui/awesome';
import { Flexbox } from 'react-layout-kit';

export default () => {
  return (
    <Flexbox gap={16}>
      <TypewriterEffect color="#1677ff" sentences={['Blue text with blue cursor']} />
      <TypewriterEffect color="#52c41a" sentences={['Green text with green cursor']} />
      <TypewriterEffect
        color="#ff4d4f"
        cursorColor="#1677ff"
        sentences={['Red text with blue cursor']}
      />
      <TypewriterEffect
        color="#722ed1"
        cursorColor="#52c41a"
        sentences={['Purple text with green cursor']}
      />
    </Flexbox>
  );
};

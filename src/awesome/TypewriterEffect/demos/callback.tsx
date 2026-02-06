import { TypewriterEffect } from '@lobehub/ui/awesome';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [count, setCount] = useState(0);

  return (
    <Flexbox gap={16}>
      <TypewriterEffect
        pauseDuration={1500}
        sentences={['First sentence', 'Second sentence', 'Third sentence']}
        onSentenceComplete={() => setCount((c) => c + 1)}
      />
      <div style={{ color: '#888', fontSize: 14 }}>Completed: {count} times</div>
    </Flexbox>
  );
};

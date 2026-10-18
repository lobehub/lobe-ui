import { Button, Flexbox, Markdown, Text } from '@lobehub/ui';
import { useCallback, useEffect, useRef, useState } from 'react';

const content = `Here is how the agent handles a request:

\`\`\`mermaid
flowchart TD
  A[User message] --> B{Has tool call?}
  B -->|Yes| C[Run tool]
  C --> D[(Vector DB)]
  D --> E[Compose answer]
  B -->|No| E
  subgraph Agent
    C
    D
  end
\`\`\`

And the request timeline:

\`\`\`mermaid
sequenceDiagram
  participant U as User
  participant A as Agent
  participant L as LLM
  U->>A: Ask
  A->>L: Prompt
  L-->>A: Stream tokens
  loop each chunk
    A-->>U: Render
  end
  Note right of L: streaming
\`\`\`
`;

const CHUNK = 3;
const INTERVAL = 40;

export default () => {
  const [length, setLength] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const streaming = length < content.length;

  const start = useCallback(() => {
    clearInterval(timerRef.current);
    setLength(0);
    timerRef.current = setInterval(() => {
      setLength((previous) => {
        const next = Math.min(previous + CHUNK, content.length);
        if (next === content.length) clearInterval(timerRef.current);
        return next;
      });
    }, INTERVAL);
  }, []);

  useEffect(() => {
    start();
    return () => clearInterval(timerRef.current);
  }, [start]);

  return (
    <Flexbox gap={16} style={{ width: '100%' }}>
      <Flexbox horizontal align={'center'} gap={12}>
        <Button type={'primary'} onClick={start}>
          Restart streaming
        </Button>
        <Text type={'secondary'}>
          {streaming ? `Streaming ${length} / ${content.length}` : 'Done'}
        </Text>
      </Flexbox>
      <Markdown animated={streaming}>{content.slice(0, length)}</Markdown>
    </Flexbox>
  );
};

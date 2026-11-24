import { AnimatedNumber, Button, Flexbox, Text } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [tokens, setTokens] = useState(12_480);

  return (
    <Flexbox gap={16} padding={24}>
      <Flexbox horizontal align="baseline" gap={8}>
        <Text fontSize={28} style={{ fontVariantNumeric: 'tabular-nums' }} weight="bold">
          <AnimatedNumber value={tokens} />
        </Text>
        <Text type="secondary">tokens</Text>
      </Flexbox>
      <Text type="secondary">
        <AnimatedNumber
          duration={800}
          formatter={(value) => `$${(value / 1_000_000).toFixed(4)}`}
          value={tokens * 3}
        />
      </Text>
      <Flexbox horizontal gap={8}>
        <Button size="small" onClick={() => setTokens((value) => value + 1536)}>
          Add 1,536
        </Button>
        <Button size="small" onClick={() => setTokens(0)}>
          Reset
        </Button>
      </Flexbox>
    </Flexbox>
  );
};

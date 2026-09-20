import { Flexbox } from '@lobehub/ui';
import { Accordion, type AccordionProps, Button } from '@lobehub/ui/base-ui';
import { useState } from 'react';

const items: AccordionProps['items'] = [
  {
    children: (
      <Flexbox gap={4} style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.75 }}>
        <div>Intelligence 100 · Agentic 99 · Writing 78</div>
        <div>Design 75 · Speed 53 · Price 31</div>
      </Flexbox>
    ),
    key: 'rating',
    title: 'Benchmarks',
  },
  {
    children: '1M tokens',
    key: 'context',
    title: 'Context length',
  },
  {
    children: (
      <Flexbox gap={4} style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.75 }}>
        <div>Vision</div>
        <div>Tool calling</div>
        <div>Reasoning</div>
      </Flexbox>
    ),
    key: 'abilities',
    title: 'Abilities',
  },
  {
    children: 'Collapsed on purpose — click to compare the expand motion.',
    key: 'pricing',
    title: 'Pricing',
  },
];

export default () => {
  const [mountKey, setMountKey] = useState(0);

  return (
    <Flexbox gap={12} padding={16} style={{ maxWidth: 480 }}>
      <Flexbox horizontal align="center" gap={8}>
        <Button size="small" onClick={() => setMountKey((key) => key + 1)}>
          Remount
        </Button>
        <span style={{ fontSize: 12, opacity: 0.55 }}>
          Default-open sections should appear instantly. A collapsed item still animates on click.
        </span>
      </Flexbox>
      <Accordion
        defaultValue={['rating', 'context', 'abilities']}
        gap={8}
        indicatorPlacement="inline"
        items={items}
        key={mountKey}
      />
    </Flexbox>
  );
};

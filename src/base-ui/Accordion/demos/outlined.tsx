import { Flexbox } from '@lobehub/ui';
import { Accordion, type AccordionProps } from '@lobehub/ui/base-ui';

const items: AccordionProps['items'] = [
  {
    children:
      'LobeHub is an open-source AIGC application framework with a modern component library and toolchain.',
    key: 'what',
    title: 'What is LobeHub?',
  },
  {
    children: 'All major model providers are supported out of the box.',
    key: 'models',
    title: 'Which models are supported?',
  },
  {
    children: 'Deploy with Docker or Vercel in one click.',
    key: 'selfhost',
    title: 'How do I self-host?',
  },
];

export default () => {
  return (
    <Flexbox gap={24} padding={16} style={{ maxWidth: 480 }}>
      <Accordion defaultValue={['what']} items={items} multiple={false} variant="outlined" />
      <Accordion
        defaultValue={['what']}
        indicatorPlacement="end"
        items={items}
        variant="outlined"
      />
    </Flexbox>
  );
};

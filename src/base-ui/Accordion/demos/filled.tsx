import { Flexbox } from '@lobehub/ui';
import { Accordion, type AccordionProps } from '@lobehub/ui/base-ui';

const items: AccordionProps['items'] = [
  {
    children: 'The panel stays outside the filled header surface.',
    key: 'active',
    title: 'Active tasks',
  },
  {
    children: 'Each header keeps the compact list-group treatment.',
    key: 'completed',
    title: 'Completed tasks',
  },
];

export default () => (
  <Flexbox padding={16} style={{ maxWidth: 480 }}>
    <Accordion defaultValue={['active']} gap={8} items={items} variant="filled" />
  </Flexbox>
);

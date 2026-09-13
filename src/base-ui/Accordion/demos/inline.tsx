import { Accordion, type AccordionProps } from '@lobehub/ui/base-ui';

const items: AccordionProps['items'] = [
  { children: 'Design review · Roadmap sync · Retro', key: 'today', title: 'Today' },
  { children: 'Perf audit · Release notes', key: 'yesterday', title: 'Yesterday' },
  { children: 'Onboarding revamp', key: 'week', title: 'This week' },
];

export default () => (
  <Accordion
    defaultValue={['today', 'yesterday']}
    gap={4}
    indicatorPlacement="inline"
    items={items}
  />
);

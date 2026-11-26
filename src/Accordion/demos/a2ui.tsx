import { Accordion, type AccordionItemType } from '@lobehub/ui';

// Sample data from the A2UI playground Accordion (CopilotKit a2ui-playground, MIT).
const items: AccordionItemType[] = [
  {
    children:
      'A declarative protocol for agents to describe UI as JSON that a client renders with its own components.',
    key: 'what',
    title: 'What is A2UI?',
  },
  {
    children:
      'Fixed: the tree is pre-authored and the agent streams data. Dynamic: a sub-agent composes the tree per request.',
    key: 'schema',
    title: 'Fixed vs dynamic schema',
  },
  {
    children: 'Yes. Components paint as they arrive over AG-UI.',
    key: 'stream',
    title: 'Does it stream?',
  },
];

export default () => (
  <Accordion defaultValue={['what']} items={items} multiple={false} variant="a2ui" />
);

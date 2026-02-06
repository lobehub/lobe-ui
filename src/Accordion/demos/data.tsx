import { Accordion, AccordionItem, ActionIcon } from '@lobehub/ui';
import { MoreHorizontal, Settings } from 'lucide-react';

import { Flexbox } from '@/Flex';

export default () => {
  return (
    <Accordion defaultExpandedKeys={['1']} style={{ width: '100%' }}>
      <AccordionItem
        itemKey="1"
        title="Accordion Panel 1"
        action={
          <ActionIcon
            icon={MoreHorizontal}
            size="small"
            onClick={() => console.log('action clicked')}
          />
        }
      >
        <Flexbox padding={16}>
          <div>This is the content of panel 1.</div>
          <div>You can put any React component here.</div>
        </Flexbox>
      </AccordionItem>
      <AccordionItem
        action={<ActionIcon icon={Settings} size="small" />}
        itemKey="2"
        title="Accordion Panel 2"
      >
        <Flexbox padding={16}>
          <div>This is the content of panel 2.</div>
          <div>You can put any React component here.</div>
        </Flexbox>
      </AccordionItem>
    </Accordion>
  );
};

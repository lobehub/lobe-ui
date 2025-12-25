import { AccordionItem } from '@lobehub/ui';
import { useState } from 'react';

import { Flexbox } from '@/Flex';

export default () => {
  const [controlledExpanded, setControlledExpanded] = useState(false);

  return (
    <Flexbox gap={16} style={{ width: '100%' }}>
      <div>
        <h3>Uncontrolled (defaultExpand)</h3>
        <AccordionItem
          defaultExpand={true}
          itemKey="uncontrolled"
          title="Uncontrolled Accordion Item"
        >
          <Flexbox padding={16}>
            <div>This is an uncontrolled accordion item.</div>
            <div>It uses defaultExpand prop to set initial state.</div>
          </Flexbox>
        </AccordionItem>
      </div>

      <div>
        <h3>Controlled (expand + onExpandChange)</h3>
        <AccordionItem
          expand={controlledExpanded}
          itemKey="controlled"
          onExpandChange={setControlledExpanded}
          title="Controlled Accordion Item"
        >
          <Flexbox padding={16}>
            <div>This is a controlled accordion item.</div>
            <div>Current state: {controlledExpanded ? 'Expanded' : 'Collapsed'}</div>
            <button onClick={() => setControlledExpanded(!controlledExpanded)} type="button">
              Toggle from outside
            </button>
          </Flexbox>
        </AccordionItem>
      </div>

      <div>
        <h3>Standalone Item (no Accordion wrapper)</h3>
        <AccordionItem defaultExpand={false} itemKey="standalone" title="Standalone Accordion Item">
          <Flexbox padding={16}>
            <div>This accordion item works independently.</div>
            <div>It doesn&apos;t need to be wrapped in an Accordion component.</div>
          </Flexbox>
        </AccordionItem>
      </div>

      <div>
        <h3>allowExpand={false} (controlled only, no click)</h3>
        <AccordionItem
          allowExpand={false}
          expand={controlledExpanded}
          itemKey="no-expand"
          onExpandChange={setControlledExpanded}
          title="Controlled Only Item (allowExpand=false)"
        >
          <Flexbox padding={16}>
            <div>This item has allowExpand set to false.</div>
            <div>The indicator arrow is hidden and cannot be clicked.</div>
            <div>Current state: {controlledExpanded ? 'Expanded' : 'Collapsed'}</div>
            <div>You can only control it via the expand prop.</div>
            <button onClick={() => setControlledExpanded(!controlledExpanded)} type="button">
              Toggle via external control
            </button>
          </Flexbox>
        </AccordionItem>
      </div>
    </Flexbox>
  );
};

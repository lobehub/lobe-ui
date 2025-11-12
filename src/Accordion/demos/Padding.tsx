import { Accordion, AccordionItem } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();

  const { variant, gap, indicatorPlacement } = useControls(
    {
      gap: {
        label: 'Gap',
        max: 32,
        min: 0,
        step: 4,
        value: 8,
      },
      indicatorPlacement: {
        label: 'Indicator Placement',
        options: ['start', 'end'],
        value: 'start',
      },
      variant: {
        label: 'Variant',
        options: ['filled', 'outlined', 'borderless'],
        value: 'filled',
      },
    },
    { store },
  );

  return (
    <StoryBook levaStore={store}>
      <Accordion
        defaultExpandedKeys={['1']}
        gap={gap}
        indicatorPlacement={indicatorPlacement as any}
        style={{ width: '100%' }}
        variant={variant as any}
      >
        <AccordionItem itemKey="1" title="Accordion Panel 1">
          <div>
            <p>This is the content of panel 1.</p>
            <p>You can put any React component here.</p>
          </div>
        </AccordionItem>
        <AccordionItem itemKey="2" title="Accordion Panel 2">
          <div>
            <p>This is the content of panel 2.</p>
            <p>Simple accordion panel.</p>
          </div>
        </AccordionItem>
        <AccordionItem itemKey="3" title="Accordion Panel 3">
          <div>
            <p>This is the content of panel 3.</p>
          </div>
        </AccordionItem>
      </Accordion>
    </StoryBook>
  );
};

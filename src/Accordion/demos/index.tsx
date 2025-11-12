import { Accordion, AccordionItem, type AccordionProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { Flexbox } from 'react-layout-kit';

export default () => {
  const store = useCreateStore();

  const control = useControls(
    {
      accordion: {
        label: 'Accordion Mode',
        value: false,
      },
      disableAnimation: {
        label: 'Disable Animation',
        value: false,
      },
      gap: {
        label: 'Gap',
        max: 32,
        min: 0,
        step: 4,
        value: 8,
      },
      hideIndicator: {
        label: 'Hide Indicator',
        value: false,
      },
      indicatorPlacement: {
        label: 'Indicator Placement',
        options: ['start', 'end'],
        value: 'start',
      },
      keepContentMounted: {
        label: 'Keep Content Mounted',
        value: false,
      },
      showDivider: {
        label: 'Show Divider',
        value: false,
      },
      variant: {
        label: 'Variant',
        options: ['filled', 'outlined', 'borderless'],
        value: 'borderless',
      },
    },
    { store },
  ) as Partial<AccordionProps>;

  return (
    <StoryBook levaStore={store}>
      <Accordion defaultExpandedKeys={['1']} style={{ width: '100%' }} {...control}>
        <AccordionItem itemKey="1" title="Accordion Panel 1">
          <Flexbox padding={16}>
            <div>This is the content of panel 1.</div>
            <div>You can put any React component here.</div>
          </Flexbox>
        </AccordionItem>
        <AccordionItem itemKey="2" title="Accordion Panel 2">
          <Flexbox padding={16}>
            <div>This is the content of panel 2.</div>
            <div>You can put any React component here.</div>
          </Flexbox>
        </AccordionItem>
        <AccordionItem itemKey="3" title="Accordion Panel 3">
          <Flexbox padding={16}>
            <div>This is the content of panel 3.</div>
            <div>You can put any React component here.</div>
          </Flexbox>
        </AccordionItem>
        <AccordionItem disabled itemKey="4" title="Disabled Panel">
          <Flexbox padding={16}>
            <div>This is the content of panel 4.</div>
            <div>You can put any React component here.</div>
          </Flexbox>
        </AccordionItem>
      </Accordion>
    </StoryBook>
  );
};

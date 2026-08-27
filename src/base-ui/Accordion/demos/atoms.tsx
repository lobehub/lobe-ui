import { Flexbox } from '@lobehub/ui';
import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from '@lobehub/ui/base-ui';

export default () => {
  return (
    <Flexbox padding={16} style={{ maxWidth: 480 }}>
      <AccordionRoot multiple defaultValue={['a']}>
        <AccordionItem value="a">
          <AccordionHeader>
            <AccordionTrigger>Composed with atoms</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            Build custom layouts with AccordionRoot / Item / Header / Trigger / Panel while keeping
            keyboard navigation, aria wiring and the height animation.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionHeader>
            <AccordionTrigger hideIndicator>No indicator on this one</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel hideIndicator>
            Per-atom overrides win over the root-level config.
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>
    </Flexbox>
  );
};

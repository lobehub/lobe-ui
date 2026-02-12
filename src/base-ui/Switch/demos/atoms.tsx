import { Flexbox } from '@lobehub/ui';
import { SwitchIcon, SwitchRoot, SwitchThumb } from '@lobehub/ui/base-ui';
import { CheckIcon, XIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={8}>
        <span>Basic:</span>
        <SwitchRoot defaultChecked>
          <SwitchThumb />
        </SwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Small:</span>
        <SwitchRoot defaultChecked size="small">
          <SwitchThumb size="small" />
        </SwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>With Icons:</span>
        <SwitchRoot defaultChecked>
          <SwitchIcon position="left" size="default">
            <CheckIcon size={12} />
          </SwitchIcon>
          <SwitchIcon position="right" size="default">
            <XIcon size={12} />
          </SwitchIcon>
          <SwitchThumb />
        </SwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Custom Thumb:</span>
        <SwitchRoot defaultChecked>
          <SwitchThumb
            pressedAnimation={{ scale: 1.1, width: 24 }}
            transition={{ damping: 20, stiffness: 400, type: 'spring' }}
          />
        </SwitchRoot>
      </Flexbox>
    </Flexbox>
  );
};

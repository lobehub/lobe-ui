import { Flexbox, LobeSwitchIcon, LobeSwitchRoot, LobeSwitchThumb } from '@lobehub/ui';
import { CheckIcon, XIcon } from 'lucide-react';

export default () => {
  return (
    <Flexbox gap={16}>
      <Flexbox horizontal align="center" gap={8}>
        <span>Basic:</span>
        <LobeSwitchRoot defaultChecked>
          <LobeSwitchThumb />
        </LobeSwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Small:</span>
        <LobeSwitchRoot defaultChecked size="small">
          <LobeSwitchThumb size="small" />
        </LobeSwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>With Icons:</span>
        <LobeSwitchRoot defaultChecked>
          <LobeSwitchIcon position="left" size="default">
            <CheckIcon size={12} />
          </LobeSwitchIcon>
          <LobeSwitchIcon position="right" size="default">
            <XIcon size={12} />
          </LobeSwitchIcon>
          <LobeSwitchThumb />
        </LobeSwitchRoot>
      </Flexbox>
      <Flexbox horizontal align="center" gap={8}>
        <span>Custom Thumb:</span>
        <LobeSwitchRoot defaultChecked>
          <LobeSwitchThumb
            pressedAnimation={{ scale: 1.1, width: 24 }}
            transition={{ damping: 20, stiffness: 400, type: 'spring' }}
          />
        </LobeSwitchRoot>
      </Flexbox>
    </Flexbox>
  );
};

import { PanelLeft, Pin, PinOff } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import { type DivProps } from '@/types';

import { useStyles } from './style';

export interface DraggablePanelHeaderProps extends Omit<DivProps, 'children'> {
  pin?: boolean;
  position?: 'left' | 'right';
  setExpand?: (expand: boolean) => void;
  setPin?: (pin: boolean) => void;
  title?: string;
}

const DraggablePanelHeader = memo<DraggablePanelHeaderProps>((props) => {
  const { pin, setPin, className, setExpand, title, position = 'left', ...rest } = props;
  const { cx, styles } = useStyles();

  const [isPinned, setIsPinned] = useControlledState(false, {
    onChange: setPin,
    value: pin,
  });

  const panelIcon = (
    <ActionIcon
      icon={PanelLeft}
      onClick={() => setExpand?.(false)}
      size={{ blockSize: 24, fontSize: 14 }}
    />
  );
  const pinIcon = (
    <ActionIcon
      active={pin}
      icon={pin ? Pin : PinOff}
      onClick={() => setIsPinned(!isPinned)}
      size={{ blockSize: 24, fontSize: 14 }}
    />
  );
  return (
    <Flexbox
      align={'center'}
      className={cx(styles.header, className)}
      flex={'none'}
      gap={8}
      horizontal
      justify={'space-between'}
      {...rest}
    >
      {position === 'left' ? panelIcon : pinIcon}
      {title}
      {position === 'left' ? pinIcon : panelIcon}
    </Flexbox>
  );
});

export default DraggablePanelHeader;

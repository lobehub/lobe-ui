import { ActionIcon } from '@lobehub/ui';
import { PanelLeft, Pin, PinOff } from 'lucide-react';
import { memo } from 'react';

import { type DivProps } from '@/types';

import { useStyles } from './style';

export interface DraggablePanelHeaderProps extends DivProps {
  pin: boolean;
  position?: 'left' | 'right';
  setExpand: (expand: boolean) => void;
  setPin: (pin: boolean) => void;
  title: string;
}

const DraggablePanelHeader = memo<DraggablePanelHeaderProps>(
  ({ pin, setPin, className, setExpand, title, position = 'left', ...rest }) => {
    const { cx, styles } = useStyles();
    const panelIcon = (
      <ActionIcon
        icon={PanelLeft}
        onClick={() => setExpand(false)}
        size={{ blockSize: 24, fontSize: 14 }}
      />
    );
    const pinIcon = (
      <ActionIcon
        active={pin}
        icon={pin ? Pin : PinOff}
        onClick={() => setPin(!pin)}
        size={{ blockSize: 24, fontSize: 14 }}
      />
    );
    return (
      <div className={cx(styles.header, className)} {...rest}>
        {position === 'left' ? panelIcon : pinIcon}
        {title}
        {position === 'left' ? pinIcon : panelIcon}
      </div>
    );
  },
);

export default DraggablePanelHeader;

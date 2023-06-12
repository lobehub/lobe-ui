import { ActionIcon, ActionIconProps, Spotlight } from '@lobehub/ui';
import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ActionIconGroupProps extends DivProps {
  direction?: 'row' | 'column';
  items: ActionIconProps[];
  /**
   * @description The position of the tooltip relative to the target
   * @enum ["top","left","right","bottom","topLeft","topRight","bottomLeft","bottomRight","leftTop","leftBottom","rightTop","rightBottom"]
   */
  placement?: ActionIconProps['placement'];
  /**
   * @description Whether add spotlight background
   * @default true
   */
  spotlight?: boolean;
  /**
   * @description The type of the group
   * @default 'block'
   */
  type?: 'ghost' | 'block' | 'pure';
}

const ActionIconGroup = memo<ActionIconGroupProps>(
  ({ type = 'block', items, placement, spotlight = true, direction = 'row', ...props }) => {
    const { styles } = useStyles({ direction, type });

    return (
      <div className={styles.container} {...props}>
        {spotlight && <Spotlight />}
        {items.map((item, index) => (
          <ActionIcon
            key={index}
            placement={placement || (direction === 'column' ? 'right' : 'top')}
            size="small"
            {...item}
          />
        ))}
      </div>
    );
  },
);

export default ActionIconGroup;

import { ActionIcon, ActionIconProps, Spotlight } from '@lobehub/ui';
import { Dropdown, type MenuProps } from 'antd';
import { MoreHorizontal } from 'lucide-react';
import { memo } from 'react';

import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ActionIconGroupProps extends DivProps {
  direction?: 'row' | 'column';
  dropdownMenu?: MenuProps['items'];
  items?: ActionIconProps[];
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
  ({
    type = 'block',
    items = [],
    placement,
    spotlight = true,
    direction = 'row',
    dropdownMenu = [],
    ...props
  }) => {
    const { styles } = useStyles({ direction, type });

    const tooltipsPlacement = placement || (direction === 'column' ? 'right' : 'top');

    return (
      <div className={styles.container} {...props}>
        {spotlight && <Spotlight />}
        {items.map((item, index) => (
          <ActionIcon key={index} placement={tooltipsPlacement} size="small" {...item} />
        ))}
        {dropdownMenu && (
          <Dropdown menu={{ items: dropdownMenu }} trigger={['click']}>
            <ActionIcon
              icon={MoreHorizontal}
              key="more"
              placement={tooltipsPlacement}
              size="small"
            />
          </Dropdown>
        )}
      </div>
    );
  },
);

export default ActionIconGroup;

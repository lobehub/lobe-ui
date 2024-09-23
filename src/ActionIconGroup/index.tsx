'use client';

import { Dropdown } from 'antd';
import { type LucideIcon, MoreHorizontal } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon, { type ActionIconProps } from '@/ActionIcon';
import Icon, { IconSizeType } from '@/Icon';
import { DivProps } from '@/types';

import { useStyles } from './style';

export interface ActionIconGroupItems {
  disable?: boolean;
  icon: LucideIcon;
  key: string;
  label: string;
}

export interface ActionEvent {
  item: ActionIconGroupItems;
  key: string;
  keyPath: string[];
}

export interface ActionIconGroupProps extends DivProps {
  /**
   * @description The direction of the icons
   * @default "row"
   */
  direction?: 'row' | 'column';
  /**
   * @description The menu items for the dropdown
   */
  dropdownMenu?: (ActionIconGroupItems | { type: 'divider' })[];
  /**
   * @description The items to be rendered
   * @default []
   */
  items?: ActionIconGroupItems[];
  onActionClick?: (action: ActionEvent) => void;
  /**
   * @description The position of the tooltip relative to the target
   * @enum ["top","left","right","bottom","topLeft","topRight","bottomLeft","bottomRight","leftTop","leftBottom","rightTop","rightBottom"]
   */
  placement?: ActionIconProps['placement'];
  /**
   * @description The size of the group
   * @default "small"
   */
  size?: IconSizeType;
  /**
   * @description Whether to add a spotlight background
   * @default true
   */
  spotlight?: boolean;
  /**
   * @description The type of the group
   * @default "block"
   */
  type?: 'ghost' | 'block' | 'pure';
}

const ActionIconGroup = memo<ActionIconGroupProps>(
  ({
    type = 'block',
    items = [],
    placement,
    direction = 'row',
    dropdownMenu = [],
    onActionClick,
    size = 'small',
    ...rest
  }) => {
    const { styles } = useStyles({ type });

    const tooltipsPlacement = placement || (direction === 'column' ? 'right' : 'top');

    return (
      <Flexbox className={styles.container} horizontal={direction === 'row'} {...rest}>
        {items?.length > 0 &&
          items.map((item) => (
            <ActionIcon
              disable={item.disable}
              icon={item.icon}
              key={item.key}
              onClick={
                onActionClick
                  ? () => onActionClick?.({ item, key: item.key, keyPath: [item.key] })
                  : undefined
              }
              placement={tooltipsPlacement}
              size={size}
              title={item.label}
            />
          ))}
        {dropdownMenu?.length > 0 && (
          <Dropdown
            menu={{
              items: dropdownMenu.map((item: any) => {
                if (item.type) return item;
                return {
                  ...item,
                  disabled: item.disable,
                  icon: <Icon icon={item.icon} size={size} />,
                  onClick: onActionClick
                    ? (info: ActionEvent) =>
                        onActionClick({
                          item,
                          key: info.key,
                          keyPath: info.keyPath,
                        })
                    : undefined,
                };
              }),
            }}
            trigger={['click']}
          >
            <ActionIcon
              icon={MoreHorizontal}
              key="more"
              placement={tooltipsPlacement}
              size={size}
            />
          </Dropdown>
        )}
      </Flexbox>
    );
  },
);

export default ActionIconGroup;

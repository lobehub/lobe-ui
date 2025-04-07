import type { ItemType as AntdItemType } from 'antd/es/menu/interface';

import Icon, { type IconProps } from '@/Icon';

import type { ItemType } from './type';

export const mapItems = (item: ItemType, iconProps?: Omit<IconProps, 'icon'>): AntdItemType => {
  switch (item?.type) {
    case 'divider': {
      return item;
    }
    case 'group': {
      const { children, ...rest } = item;
      return {
        children: children ? children?.map((i) => mapItems(i, iconProps)) : undefined,
        ...rest,
      };
    }
    default: {
      const { children, icon, ...rest } = item as any;
      return {
        children: children ? children?.map((i: any) => mapItems(i, iconProps)) : undefined,
        icon: <Icon icon={icon} size={'small'} {...iconProps} />,
        ...rest,
      };
    }
  }
};

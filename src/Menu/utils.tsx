import type { ItemType as AntdItemType } from 'antd/es/menu/interface';
import { isValidElement } from 'react';

import Icon from '@/Icon';

import type { ItemType } from './type';

export const mapItems = (item: ItemType): AntdItemType => {
  switch (item?.type) {
    case 'divider': {
      return item;
    }
    case 'group': {
      const { children, ...rest } = item;
      return {
        children: children ? children?.map((i) => mapItems(i)) : undefined,
        ...rest,
      };
    }
    default: {
      const { children, icon, ...rest } = item as any;
      return {
        children: children ? children?.map((i: any) => mapItems(i)) : undefined,
        icon: isValidElement(icon) ? icon : <Icon icon={icon} size={'small'} />,
        ...rest,
      };
    }
  }
};

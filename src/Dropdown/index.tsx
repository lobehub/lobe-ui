'use client';

import { Dropdown as AntdDropdown, type DropdownProps as AntdDropdownProps } from 'antd';
import { memo, useMemo } from 'react';

import type { IconProps } from '@/Icon';
import { type MenuProps, mapItems } from '@/Menu';

export interface DropdownProps extends Omit<AntdDropdownProps, 'menu'> {
  iconProps?: Omit<IconProps, 'icon'>;
  menu: MenuProps;
}

const Dropdown = memo<DropdownProps>(({ children, menu, iconProps, ...rest }) => {
  const { items, ...menuProps } = menu;

  const antdItems = useMemo(
    () => items.map((item) => mapItems(item, iconProps)),
    [items, iconProps],
  );

  return (
    <AntdDropdown
      menu={{
        ...menuProps,
        items: antdItems,
      }}
      {...rest}
    >
      {children}
    </AntdDropdown>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;

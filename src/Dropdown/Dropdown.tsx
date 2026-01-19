'use client';

import { Dropdown as AntdDropdown } from 'antd';
import { memo, useMemo } from 'react';

import { IconProvider } from '@/Icon';
import { mapItems } from '@/Menu';

import type { DropdownProps } from './type';

/**
 * @deprecated
 * Use `DropdownMenu` or `ContextMenu` instead
 * @see https://ui.lobehub.com/components/context-menu
 * @see https://ui.lobehub.com/components/dropdown-menu
 */
const Dropdown = memo<DropdownProps>(({ children, iconProps, menu, ...rest }) => {
  const { items, ...menuProps } = menu;

  const antdItems = useMemo(() => items.map((item) => mapItems(item)), [items]);

  return (
    <IconProvider
      config={{
        size: 'small',
        ...iconProps,
      }}
    >
      <AntdDropdown
        menu={{
          ...menuProps,
          items: antdItems,
        }}
        {...rest}
      >
        {children}
      </AntdDropdown>
    </IconProvider>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;

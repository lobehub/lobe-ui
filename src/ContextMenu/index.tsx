'use client';

import { Dropdown, type DropdownProps } from 'antd';
import { memo } from 'react';

export type ContextMenuProps = DropdownProps;

const ContextMenu = memo<ContextMenuProps>((props) => (
  <Dropdown trigger={['contextMenu']} {...props} />
));

export default ContextMenu;

import { Block, ContextMenuTrigger, type GenericItemType, Text } from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { useMemo } from 'react';

const styles = createStaticStyles(({ css, cssVar }) => ({
  trigger: css`
    cursor: context-menu;

    border: 1px dashed ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgElevated};
    box-shadow: 0 0 0 1px ${cssVar.colorBorderSecondary} inset;

    transition: all 150ms ${cssVar.motionEaseOut};

    &[data-popup-open],
    &[data-state='open'],
    &[aria-expanded='true'] {
      background: ${cssVar.colorFillTertiary};
    }
  `,
}));

export default () => {
  const items = useMemo<GenericItemType[]>(
    () => [
      { key: 'open', label: 'Open' },
      {
        children: [],
        key: 'emptySubmenu',
        label: 'Empty Submenu',
      },
      {
        children: [
          { key: 'item1', label: 'Item 1' },
          { key: 'item2', label: 'Item 2' },
        ],
        key: 'normalSubmenu',
        label: 'Normal Submenu',
      },
      { type: 'divider' },
      { danger: true, key: 'delete', label: 'Delete' },
    ],
    [],
  );

  return (
    <ContextMenuTrigger className={styles.trigger} items={items}>
      <Block direction="vertical" gap={8} padding={16}>
        <Text strong as={'p'}>
          Right click to see empty submenu
        </Text>
        <Text as={'p'} type="secondary">
          The &quot;Empty Submenu&quot; shows an (empty) placeholder.
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};

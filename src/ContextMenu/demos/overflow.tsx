import {
  Block,
  ContextMenuHost,
  type ContextMenuItem,
  ContextMenuTrigger,
  type MenuInfo,
  Text,
} from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { useMemo, useState } from 'react';

const MENU_ITEM_COUNT = 24;

const styles = createStaticStyles(({ css, cssVar }) => ({
  trigger: css`
    cursor: context-menu;

    min-width: 280px;
    min-height: 160px;
    border: 1px dashed ${cssVar.colorBorderSecondary};
    border-radius: 12px;

    background: ${cssVar.colorBgElevated};

    &[data-popup-open],
    &[data-state='open'],
    &[aria-expanded='true'] {
      background: ${cssVar.colorFillTertiary};
    }
  `,
}));

export default () => {
  const [selectedItem, setSelectedItem] = useState('none');
  const items = useMemo<ContextMenuItem[]>(
    () =>
      Array.from({ length: MENU_ITEM_COUNT }, (_, index) => {
        const itemNumber = index + 1;

        return {
          key: `item-${itemNumber}`,
          label: `Menu item ${String(itemNumber).padStart(2, '0')}`,
          onClick: ({ key }: MenuInfo) => setSelectedItem(String(key)),
        };
      }),
    [],
  );

  return (
    <>
      <ContextMenuTrigger className={styles.trigger} items={items}>
        <Block align="center" direction="vertical" gap={8} justify="center" padding={16}>
          <Text strong as={'p'}>
            Right click this panel
          </Text>
          <Text as={'p'} type="secondary">
            The 24-item menu remains within the viewport and scrolls internally.
          </Text>
          <Text as={'p'} type="secondary">
            Selected item: {selectedItem}
          </Text>
        </Block>
      </ContextMenuTrigger>
      <ContextMenuHost />
    </>
  );
};

import {
  Block,
  ContextMenuHost,
  ContextMenuTrigger,
  type GenericItemType,
  Text,
  showContextMenu,
} from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import type { MouseEvent } from 'react';
import { useCallback, useMemo } from 'react';

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
      { key: 'duplicate', label: 'Duplicate' },
      { type: 'divider' },
      { danger: true, key: 'delete', label: 'Delete' },
    ],
    [],
  );

  const handleContextMenu = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      showContextMenu(items);
    },
    [items],
  );

  return (
    <>
      <ContextMenuTrigger className={styles.trigger} onContextMenu={handleContextMenu}>
        <Block direction="vertical" gap={8} padding={16}>
          <Text as={'p'} strong>
            Right click this panel
          </Text>
          <Text as={'p'} type="secondary">
            Trigger background is controlled by menu state.
          </Text>
        </Block>
      </ContextMenuTrigger>
      <ContextMenuHost />
    </>
  );
};

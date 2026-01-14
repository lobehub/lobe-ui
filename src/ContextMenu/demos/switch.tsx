import {
  Block,
  type ContextMenuItem,
  ContextMenuTrigger,
  Text,
  updateContextMenuItems,
} from '@lobehub/ui';
import { createStaticStyles } from 'antd-style';
import { useCallback, useMemo, useState } from 'react';

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
  const [state, setState] = useState({ autoSave: true, notifications: false });

  const buildItems = useCallback(
    (next: typeof state): ContextMenuItem[] => [
      {
        checked: next.autoSave,
        closeOnClick: false,
        key: 'autoSave',
        label: 'Auto Save',
        onCheckedChange: (checked: boolean) =>
          setState((prev) => {
            const nextState = { ...prev, autoSave: checked };
            updateContextMenuItems(buildItems(nextState));
            return nextState;
          }),
        type: 'switch',
      },
      {
        checked: next.notifications,
        closeOnClick: false,
        key: 'notifications',
        label: 'Email Notifications',
        onCheckedChange: (checked: boolean) =>
          setState((prev) => {
            const nextState = { ...prev, notifications: checked };
            updateContextMenuItems(buildItems(nextState));
            return nextState;
          }),
        type: 'switch',
      },
      { type: 'divider' },
      { key: 'settings', label: 'Settings...' },
    ],
    [],
  );

  const items = useMemo<ContextMenuItem[]>(() => buildItems(state), [buildItems, state]);

  return (
    <ContextMenuTrigger className={styles.trigger} items={items}>
      <Block direction="vertical" gap={8} padding={16}>
        <Text as={'p'} strong>
          Right click this panel
        </Text>
        <Text as={'p'} type="secondary">
          Switch: autoSave={String(state.autoSave)}, notifications={String(state.notifications)}
        </Text>
      </Block>
    </ContextMenuTrigger>
  );
};

'use client';

import * as stylex from '@stylexjs/stylex';
import { Menu, X } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Drawer } from '@/Drawer';
import burgerMessages from '@/i18n/resources/en/burger';
import { useTranslation } from '@/i18n/useTranslation';
import { type ListItem } from '@/List';
import { ListImpl as List } from '@/List/List';
import type { ListRowXstyle } from '@/List/ListRow';

import { styles } from './style';
import type { BurgerProps } from './type';

const withoutIcons = (items: ListItem[]): ListItem[] =>
  items.flatMap((item) => (item.type === 'divider' ? [] : [{ ...item, icon: undefined }]));

const bodyStyle = { paddingBlock: 8, paddingInline: 12 };

const rowXstyle: ListRowXstyle = (item, active) => {
  const current = active && (!item.href || !!item.disabled);
  return [styles.row, current && styles.rowCurrent];
};

const largeRowXstyle: ListRowXstyle = (item, active) => {
  const current = active && (!item.href || !!item.disabled);
  return [styles.largeRow, current && styles.largeRowCurrent];
};

const Burger = memo<BurgerProps>(
  ({
    activeKey,
    className,
    footer,
    fullscreen = false,
    headerHeight = 64,
    items,
    onOpenChange,
    onSelect,
    opened,
    size,
    style,
    variant,
  }) => {
    const { t } = useTranslation(burgerMessages);
    const close = () => onOpenChange(false);

    const toggle = (
      <ActionIcon
        aria-expanded={opened}
        aria-label={opened ? t('burger.close') : t('burger.open')}
        className={className}
        icon={opened ? X : Menu}
        size={size}
        style={style}
        variant={variant}
        onClick={() => onOpenChange(!opened)}
      />
    );

    return (
      <>
        {toggle}
        <Drawer
          noHeader
          height={fullscreen ? '100dvh' : `calc(100dvh - ${headerHeight}px)`}
          open={opened}
          placement="top"
          styles={
            fullscreen
              ? { bodyContent: bodyStyle }
              : { bodyContent: bodyStyle, popup: { insetBlockStart: headerHeight } }
          }
          onClose={close}
        >
          {fullscreen && (
            <div {...stylex.props(styles.fullHeader)} style={{ height: headerHeight }}>
              <ActionIcon aria-label={t('burger.close')} icon={X} size={size} onClick={close} />
            </div>
          )}
          <List
            selectable
            activeKey={activeKey ?? null}
            itemXstyle={fullscreen ? largeRowXstyle : rowXstyle}
            items={fullscreen ? withoutIcons(items) : items}
            onClick={({ key }) => {
              onSelect?.(key);
              close();
            }}
          />
          {fullscreen && footer && <div {...stylex.props(styles.footer)}>{footer}</div>}
        </Drawer>
      </>
    );
  },
);

Burger.displayName = 'Burger';

export default Burger;

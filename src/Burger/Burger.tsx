'use client';

import { Menu, X } from 'lucide-react';
import { memo } from 'react';

import ActionIcon from '@/ActionIcon';
import { Drawer } from '@/Drawer';
import burgerMessages from '@/i18n/resources/en/burger';
import { useTranslation } from '@/i18n/useTranslation';
import List, { type ListItem } from '@/List';

import { styles } from './style';
import type { BurgerProps } from './type';

const withoutIcons = (items: ListItem[]): ListItem[] =>
  items.flatMap((item) => (item.type === 'divider' ? [] : [{ ...item, icon: undefined }]));

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
          classNames={{ bodyContent: styles.body }}
          height={fullscreen ? '100dvh' : `calc(100dvh - ${headerHeight}px)`}
          open={opened}
          placement="top"
          styles={fullscreen ? undefined : { popup: { insetBlockStart: headerHeight } }}
          onClose={close}
        >
          {fullscreen && (
            <div className={styles.fullHeader} style={{ height: headerHeight }}>
              <ActionIcon aria-label={t('burger.close')} icon={X} size={size} onClick={close} />
            </div>
          )}
          <List
            selectable
            activeKey={activeKey ?? null}
            classNames={{ item: fullscreen ? styles.largeRow : styles.row }}
            items={fullscreen ? withoutIcons(items) : items}
            onClick={({ key }) => {
              onSelect?.(key);
              close();
            }}
          />
          {fullscreen && footer && <div className={styles.footer}>{footer}</div>}
        </Drawer>
      </>
    );
  },
);

Burger.displayName = 'Burger';

export default Burger;

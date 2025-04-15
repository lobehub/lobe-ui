'use client';

import { Anchor } from 'antd';
import { memo } from 'react';

import { default as TocMobile } from './TocMobile';
import { useStyles } from './style';
import type { TocProps } from './type';
import { mapItems } from './utils';

const Toc = memo<TocProps>(
  ({ activeKey, items, getContainer, isMobile, headerHeight = 64, tocWidth = 176 }) => {
    const { styles, cx } = useStyles({ headerHeight, tocWidth });

    if (isMobile)
      return (
        <TocMobile
          activeKey={activeKey}
          getContainer={getContainer}
          headerHeight={headerHeight}
          items={items}
        />
      );

    return (
      <section className={cx(styles.container, styles.anchor)}>
        <h4>Table of Contents</h4>
        <Anchor
          getContainer={getContainer}
          items={mapItems(items)}
          targetOffset={headerHeight + 12}
        />
      </section>
    );
  },
);

Toc.displayName = 'Toc';

export default Toc;

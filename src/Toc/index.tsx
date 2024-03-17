'use client';

import { Anchor } from 'antd';
import { memo } from 'react';

import { default as TocMobile, type TocMobileProps, mapItems } from './TocMobile';
import { useStyles } from './style';

export interface TocProps extends TocMobileProps {
  /**
   * @description Whether the component is being rendered on a mobile device or not
   * @default false
   */
  isMobile?: boolean;
}
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

export default Toc;

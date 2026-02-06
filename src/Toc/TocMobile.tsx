'use client';

import { Anchor, Collapse, ConfigProvider } from 'antd';
import { PanelTopClose, PanelTopOpen } from 'lucide-react';
import { memo, useMemo } from 'react';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';

import { styles } from './style';
import type { TocMobileProps } from './type';
import { mapItems } from './utils';

const TocMobile = memo<TocMobileProps>(
  ({ items, activeKey, onChange, getContainer, headerHeight = 64, tocWidth = 176 }) => {
    // tocWidth is part of the interface but not used in this component
    void tocWidth;
    const [activeLink, setActiveLink] = useControlledState<string>('', {
      onChange,
      value: activeKey,
    });

    const activeAnchor = items.find((item) => item.id === activeLink);

    const tocItems = useMemo(() => mapItems(items), [items]);

    return (
      <ConfigProvider theme={{ token: { fontSize: 12, sizeStep: 3 } }}>
        <section className={styles.mobileCtn}>
          <Collapse
            ghost
            className={styles.expand}
            expandIconPlacement={'end'}
            expandIcon={({ isActive }) => (
              <ActionIcon icon={isActive ? PanelTopClose : PanelTopOpen} size={'small'} />
            )}
          >
            <Collapse.Panel
              forceRender
              header={activeAnchor ? activeAnchor.title : 'TOC'}
              key={'toc'}
            >
              <ConfigProvider theme={{ token: { fontSize: 14, sizeStep: 4 } }}>
                <Anchor
                  getContainer={getContainer}
                  items={tocItems}
                  targetOffset={headerHeight + 48}
                  onChange={(currentLink) => {
                    setActiveLink(currentLink.replace('#', ''));
                  }}
                />
              </ConfigProvider>
            </Collapse.Panel>
          </Collapse>
        </section>
      </ConfigProvider>
    );
  },
);

TocMobile.displayName = 'TocMobile';

export default TocMobile;

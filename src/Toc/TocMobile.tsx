'use client';

import { Anchor, AnchorProps, Collapse, ConfigProvider } from 'antd';
import { PanelTopClose, PanelTopOpen } from 'lucide-react';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';

import { useStyles } from './style';
import { mapItems } from './utils';

export interface AnchorItem {
  children?: AnchorItem[];
  id: string;
  title: string;
}

export interface TocMobileProps {
  activeKey?: string;
  getContainer?: AnchorProps['getContainer'];
  headerHeight?: number;
  items: AnchorItem[];
  onChange?: (activeKey: string) => void;
  tocWidth?: number;
}

const TocMobile = memo<TocMobileProps>(
  ({ items, activeKey, onChange, getContainer, headerHeight = 64, tocWidth = 176 }) => {
    const [activeLink, setActiveLink] = useControlledState<string>('', {
      onChange,
      value: activeKey,
    });
    const { styles } = useStyles({ headerHeight, tocWidth });

    const activeAnchor = items.find((item) => item.id === activeLink);

    return (
      <ConfigProvider theme={{ token: { fontSize: 12, sizeStep: 3 } }}>
        <section className={styles.mobileCtn}>
          <Collapse
            bordered={false}
            className={styles.expand}
            expandIcon={({ isActive }) => (
              <ActionIcon icon={isActive ? PanelTopClose : PanelTopOpen} size={'small'} />
            )}
            expandIconPosition={'end'}
            ghost
          >
            <Collapse.Panel
              forceRender
              header={activeAnchor ? activeAnchor.title : 'TOC'}
              key={'toc'}
            >
              <ConfigProvider theme={{ token: { fontSize: 14, sizeStep: 4 } }}>
                <Anchor
                  getContainer={getContainer}
                  items={mapItems(items)}
                  onChange={(currentLink) => {
                    setActiveLink(currentLink.replace('#', ''));
                  }}
                  targetOffset={headerHeight + 48}
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

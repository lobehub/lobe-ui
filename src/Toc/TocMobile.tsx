import { ActionIcon } from '@lobehub/ui';
import { Anchor, AnchorProps, Collapse, ConfigProvider } from 'antd';
import { PanelTopClose, PanelTopOpen } from 'lucide-react';
import { memo } from 'react';
import useControlledState from 'use-merge-value';

import { useStyles } from './style';

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

export const mapItems = (items: AnchorItem[]) =>
  items.map((item) => ({
    href: `#${item.id}`,
    title: item.title,
    key: item.id,
    children: item.children?.map((child) => ({
      href: `#${child.id}`,
      title: child?.title,
      key: child.id,
    })),
  }));

const TocMobile = memo<TocMobileProps>(
  ({ items, activeKey, onChange, getContainer, headerHeight = 64, tocWidth = 176 }) => {
    const [activeLink, setActiveLink] = useControlledState<string>('', {
      value: activeKey,
      onChange,
    });
    const { styles } = useStyles({ headerHeight, tocWidth });

    const activeAnchor = items.find((item) => item.id === activeLink);

    return (
      <ConfigProvider theme={{ token: { fontSize: 12, sizeStep: 3 } }}>
        <section className={styles.mobileCtn}>
          <Collapse
            bordered={false}
            className={styles.expand}
            expandIcon={({ isActive }) =>
              isActive ? (
                <ActionIcon
                  icon={PanelTopClose}
                  size={{ fontSize: 16, strokeWidth: 1, blockSize: 24, borderRadius: 3 }}
                />
              ) : (
                <ActionIcon
                  icon={PanelTopOpen}
                  size={{ fontSize: 16, strokeWidth: 1, blockSize: 24, borderRadius: 3 }}
                />
              )
            }
            expandIconPosition={'end'}
            ghost
          >
            <Collapse.Panel
              forceRender
              header={!activeAnchor ? 'TOC' : activeAnchor.title}
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

export default TocMobile;

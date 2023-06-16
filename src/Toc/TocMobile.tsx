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
    children: item.children?.map((child) => ({
      href: `#${child.id}`,
      key: child.id,
      title: child?.title,
    })),
    href: `#${item.id}`,
    key: item.id,
    title: item.title,
  }));

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
            expandIcon={({ isActive }) =>
              isActive ? (
                <ActionIcon
                  icon={PanelTopClose}
                  size={{ blockSize: 24, borderRadius: 3, fontSize: 16, strokeWidth: 1 }}
                />
              ) : (
                <ActionIcon
                  icon={PanelTopOpen}
                  size={{ blockSize: 24, borderRadius: 3, fontSize: 16, strokeWidth: 1 }}
                />
              )
            }
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

export default TocMobile;

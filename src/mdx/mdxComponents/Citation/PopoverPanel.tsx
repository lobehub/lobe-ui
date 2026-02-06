'use client';

import { Popover } from 'antd';
import { ArrowRightIcon } from 'lucide-react';
import { type FC, type ReactNode, useMemo } from 'react';

import { Flexbox } from '@/Flex';
import Icon from '@/Icon';

import { styles } from './style';

interface PopoverPanelProps {
  alt?: string;
  children?: ReactNode;
  title?: string;
  url?: string;
  usePopover?: boolean;
}

const PopoverPanel: FC<PopoverPanelProps> = ({ children, usePopover, title, alt, url }) => {
  const [displayTitle, domain, host] = useMemo(() => {
    try {
      const urlObj = new URL(url!);
      const hostForUrl = urlObj.host;

      let displayTitle = title;

      if (title === url) {
        displayTitle = '';
      }

      let domain = urlObj.hostname.replace('www.', '');
      if (!displayTitle) domain = url!;

      return [displayTitle, domain, hostForUrl];
    } catch {
      return [title, url, url];
    }
  }, [url, title]);

  return usePopover && url ? (
    <Popover
      arrow={false}
      trigger={'hover'}
      content={
        <Flexbox gap={8}>
          <Flexbox
            horizontal
            className={styles.link}
            gap={12}
            justify={'space-between'}
            onClick={() => {
              window.open(url, '_blank');
            }}
          >
            <Flexbox horizontal align={'center'} gap={4}>
              <img
                alt={alt || title || url}
                height={14}
                src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
                style={{ borderRadius: 4 }}
                width={14}
              />
              <span className={styles.url}>{domain}</span>
            </Flexbox>
            <Icon icon={ArrowRightIcon} />
          </Flexbox>
          {displayTitle}
        </Flexbox>
      }
    >
      {children}
    </Popover>
  ) : (
    children
  );
};

PopoverPanel.displayName = 'MdxPopoverPanel';

export default PopoverPanel;

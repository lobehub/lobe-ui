'use client';

import { Popover } from 'antd';
import { createStyles } from 'antd-style';
import { ArrowRightIcon } from 'lucide-react';
import { type FC, type ReactNode, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';

const useStyles = createStyles(({ css, token }) => ({
  link: css`
    cursor: pointer;
    color: ${token.colorTextSecondary};

    :hover {
      color: ${token.colorText};
    }
  `,
  url: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    max-width: 400px;

    text-overflow: ellipsis;
  `,
}));

interface PopoverPanelProps {
  alt?: string;
  children?: ReactNode;
  title?: string;
  url?: string;
  usePopover?: boolean;
}

const PopoverPanel: FC<PopoverPanelProps> = ({ children, usePopover, title, alt, url }) => {
  const { styles } = useStyles();

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
      content={
        <Flexbox gap={8}>
          <Flexbox
            className={styles.link}
            gap={12}
            horizontal
            justify={'space-between'}
            onClick={() => {
              window.open(url, '_blank');
            }}
          >
            <Flexbox align={'center'} gap={4} horizontal>
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
      trigger={'hover'}
    >
      {children}
    </Popover>
  ) : (
    children
  );
};

PopoverPanel.displayName = 'MdxPopoverPanel';

export default PopoverPanel;

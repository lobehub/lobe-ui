'use client';

import { Popover, Typography } from 'antd';
import { createStyles } from 'antd-style';
import { ReactNode, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  url: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

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

const PopoverPanel = ({ children, usePopover, title, alt, url }: PopoverPanelProps) => {
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
          <Flexbox align={'center'} gap={4} horizontal>
            <img
              alt={alt || title || url}
              height={14}
              src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
              width={14}
            />
            <Typography.Text className={styles.url} type={'secondary'}>
              {domain}
            </Typography.Text>
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

export default PopoverPanel;

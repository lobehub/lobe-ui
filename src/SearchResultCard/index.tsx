'use client';

import { Typography } from 'antd';
import { forwardRef, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { AProps } from '@/types';

import { useStyles } from './style';

interface SearchResultCardProps extends AProps {
  alt?: string;
  title?: string;
  url: string;
}

const SearchResultCard = forwardRef<HTMLAnchorElement, SearchResultCardProps>(
  ({ url, title, alt, ...rest }, ref) => {
    const { styles } = useStyles();

    const [displayTitle, domain, host] = useMemo(() => {
      try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        const hostForUrl = urlObj.host;

        let displayTitle = title;
        if (title === url) {
          displayTitle = hostForUrl + urlObj.pathname;
        }

        return [displayTitle, domain, hostForUrl];
      } catch {
        return [title, url, url];
      }
    }, [url, title]);

    return (
      <a href={url} ref={ref} rel="noreferrer" target={'_blank'} {...rest}>
        <Flexbox className={styles.container} gap={2} justify={'space-between'} key={url}>
          <div className={styles.title}>{displayTitle}</div>
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
        </Flexbox>
      </a>
    );
  },
);

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;

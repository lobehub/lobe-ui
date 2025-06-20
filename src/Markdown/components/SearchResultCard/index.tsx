'use client';

import { Ref, memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Block from '@/Block';
import Text from '@/Text';
import { AProps } from '@/types';

import { useStyles } from './style';

export interface SearchResultCardProps extends AProps {
  alt?: string;
  ref?: Ref<HTMLAnchorElement>;
  title?: string;
  url: string;
}

const SearchResultCard = memo<SearchResultCardProps>(({ ref, url, title, alt, ...rest }) => {
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
      <Block
        className={styles.container}
        clickable
        gap={2}
        justify={'space-between'}
        key={url}
        paddingBlock={6}
        paddingInline={8}
        variant={'outlined'}
      >
        <Text ellipsis={{ rows: 2 }}>{displayTitle}</Text>
        <Flexbox align={'center'} gap={4} horizontal>
          <img
            alt={alt || title || url}
            height={14}
            src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
            width={14}
          />
          <Text className={styles.url} ellipsis type={'secondary'}>
            {domain}
          </Text>
        </Flexbox>
      </Block>
    </a>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;

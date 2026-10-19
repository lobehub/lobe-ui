'use client';

import './style.css';

import clsx from 'clsx';
import { memo, type Ref, useMemo } from 'react';

import A from '@/A';
import Block from '@/Block';
import { Flexbox } from '@/Flex';
import Img from '@/Img';
import Text from '@/Text';
import { type AProps } from '@/types';

import { searchResultCardsClasses } from '../../stable';

export interface SearchResultCardProps extends AProps {
  alt?: string;
  ref?: Ref<HTMLAnchorElement>;
  title?: string;
  url: string;
}

const SearchResultCard = memo<SearchResultCardProps>(({ ref, url, title, alt, ...rest }) => {
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
    <A href={url} ref={ref} rel="noreferrer" target={'_blank'} {...rest}>
      <Block
        clickable
        className={clsx('lobe-search-result-card', searchResultCardsClasses('card'))}
        gap={2}
        height={'100%'}
        justify={'space-between'}
        key={url}
        paddingBlock={6}
        paddingInline={8}
        variant={'outlined'}
      >
        <Text className={searchResultCardsClasses('title')} ellipsis={{ rows: 2 }}>
          {displayTitle}
        </Text>
        <Flexbox horizontal align={'center'} gap={4}>
          <Img
            alt={alt || title || url}
            className={searchResultCardsClasses('favicon')}
            height={14}
            src={`https://icons.duckduckgo.com/ip3/${host}.ico`}
            width={14}
          />
          <Text
            ellipsis
            className={clsx('lobe-search-result-card-url', searchResultCardsClasses('url'))}
            type={'secondary'}
          >
            {domain}
          </Text>
        </Flexbox>
      </Block>
    </A>
  );
});

SearchResultCard.displayName = 'SearchResultCard';

export default SearchResultCard;

'use client';

import { Ref, memo } from 'react';

import { FlexboxProps } from '@/Flex';
import ScrollShadow from '@/ScrollShadow';

import SearchResultCard from './SearchResultCard';

export interface SearchResultItem {
  alt?: string;
  summary?: string;
  title?: string;
  url: string;
}

export interface SearchResultCardsProps extends FlexboxProps {
  dataSource: string[] | SearchResultItem[];
  ref?: Ref<HTMLDivElement>;
}

const SearchResultCards = memo<SearchResultCardsProps>(({ ref, dataSource, style, ...rest }) => {
  return (
    <ScrollShadow
      gap={12}
      hideScrollBar
      horizontal
      orientation={'horizontal'}
      ref={ref}
      size={10}
      style={{ minHeight: 80, overflowX: 'scroll', paddingInlineEnd: 24, width: '100%', ...style }}
      {...rest}
    >
      {dataSource.map((link) =>
        typeof link === 'string' ? (
          <SearchResultCard key={link} url={link} />
        ) : (
          <SearchResultCard key={link.url} {...link} />
        ),
      )}
    </ScrollShadow>
  );
});

SearchResultCards.displayName = 'SearchResultCards';

export default SearchResultCards;

'use client';

import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import type { SearchResultCardsProps } from '../../type';
import SearchResultCard from '../SearchResultCard';

const SearchResultCards = memo<SearchResultCardsProps>(({ ref, dataSource, style, ...rest }) => {
  return (
    <Flexbox
      gap={12}
      horizontal
      ref={ref}
      style={{ minHeight: 80, overflowX: 'scroll', width: '100%', ...style }}
      {...rest}
    >
      {dataSource.map((link) =>
        typeof link === 'string' ? (
          <SearchResultCard key={link} url={link} />
        ) : (
          <SearchResultCard key={link.url} {...link} />
        ),
      )}
    </Flexbox>
  );
});

SearchResultCards.displayName = 'SearchResultCards';

export default SearchResultCards;

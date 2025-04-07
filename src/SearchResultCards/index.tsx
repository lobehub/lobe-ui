'use client';

import { forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import SearchResultCard from '@/SearchResultCard';

export interface SearchResultItem {
  alt?: string;
  summary?: string;
  title?: string;
  url: string;
}

export interface SearchResultCardsProps extends FlexboxProps {
  dataSource: string[] | SearchResultItem[];
}

const SearchResultCards = forwardRef<HTMLDivElement, SearchResultCardsProps>(
  ({ dataSource, style, ...rest }, ref) => {
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
  },
);

SearchResultCards.displayName = 'SearchResultCards';

export default SearchResultCards;

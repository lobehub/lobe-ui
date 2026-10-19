'use client';

import clsx from 'clsx';
import { memo, type Ref } from 'react';

import { type FlexboxProps } from '@/Flex';
import ScrollShadow from '@/ScrollShadow';
import { styleProps } from '@/styles/stylex/props';

import { searchResultCardsClasses } from '../../stable';
import SearchResultCard from './SearchResultCard';
import { styles } from './style';

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

const SearchResultCards = memo<SearchResultCardsProps>(
  ({ ref, className, dataSource, style, ...rest }) => {
    return (
      <ScrollShadow
        hideScrollBar
        horizontal
        className={styleProps(styles.root, clsx(searchResultCardsClasses(), className)).className}
        gap={12}
        orientation={'horizontal'}
        ref={ref}
        size={10}
        style={{ overflowX: 'scroll', ...style }}
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
  },
);

SearchResultCards.displayName = 'SearchResultCards';

export default SearchResultCards;

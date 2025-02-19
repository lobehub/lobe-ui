import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import SearchResultCard from '@/SearchResultCard';

export interface SearchResultItem {
  alt?: string;
  summary?: string;
  title?: string;
  url: string;
}

interface SearchResultCardsProps {
  dataSource: string[] | SearchResultItem[];
}

const SearchResultCards = memo<SearchResultCardsProps>(({ dataSource }) => {
  return (
    <Flexbox gap={12} horizontal style={{ minHeight: 80, overflowX: 'scroll', width: '100%' }}>
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

export default SearchResultCards;

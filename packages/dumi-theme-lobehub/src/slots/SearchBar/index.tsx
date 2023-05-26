import { SearchBar as Input } from '@lobehub/ui';
import { useSiteSearch } from 'dumi';
import SearchResult from 'dumi/theme-default/slots/SearchResult';
import { memo, useState } from 'react';
import { useStyles } from './style';

const SearchBar = memo(() => {
  const { styles } = useStyles();
  const [focusing, setFocusing] = useState(false);
  const { keywords, setKeywords, result, loading } = useSiteSearch();

  return (
    <div className={styles.container}>
      <Input
        enableShortKey
        onFocus={() => setFocusing(true)}
        onBlur={() => {
          // wait for item click
          setTimeout(() => {
            setFocusing(false);
          }, 1);
        }}
        onChange={(e) => setKeywords(e.target.value)}
      />
      {keywords.trim() && focusing && (result.length || !loading) && (
        <div className={styles.popover}>
          <section>
            <SearchResult data={result} loading={loading} />
          </section>
        </div>
      )}
    </div>
  );
});

export default SearchBar;

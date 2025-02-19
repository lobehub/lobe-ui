import { Typography } from 'antd';
import { createStyles } from 'antd-style';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    cursor: pointer;

    min-width: 160px;
    max-width: 160px;
    height: 100%;
    padding: 8px;
    border-radius: 8px;

    font-size: 12px;
    color: initial;

    background: ${token.colorFillQuaternary};

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  title: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    text-overflow: ellipsis;
  `,
  url: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;

    text-overflow: ellipsis;
  `,
}));

interface SearchResultCardProps {
  alt?: string;
  title?: string;
  url: string;
}

const SearchResultCard = memo<SearchResultCardProps>(({ url, title, alt }) => {
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
    <a href={url} rel="noreferrer" target={'_blank'}>
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
});

export default SearchResultCard;

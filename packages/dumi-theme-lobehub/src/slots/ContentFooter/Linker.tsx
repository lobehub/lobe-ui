import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Link } from 'dumi';
import type { FC } from 'react';

import { memo, useMemo } from 'react';

import { Flexbox } from 'react-layout-kit';
import { useStyles } from './Linker.style';

interface LinkerProps {
  title: string;
  link: string;
  type?: 'prev' | 'next';
}

const Linker: FC<LinkerProps> = ({ title, link, type }) => {
  const { styles, cx } = useStyles();
  const navContent = useMemo(() => {
    switch (type) {
      case 'prev':
        return (
          <>
            <ArrowLeftOutlined /> 上一篇
          </>
        );
      case 'next':
        return (
          <>
            下一篇 <ArrowRightOutlined />
          </>
        );
    }
  }, [type]);

  return (
    <Link to={link}>
      <Flexbox className={styles.container} gap={8}>
        <Flexbox
          horizontal
          gap={4}
          className={cx(styles.nav, type === 'next' && styles.alignmentEnd)}
        >
          {navContent}
        </Flexbox>
        <Flexbox horizontal className={cx(styles.title, type === 'next' && styles.alignmentEnd)}>
          {title}
        </Flexbox>
      </Flexbox>
    </Link>
  );
};

export default memo(Linker);

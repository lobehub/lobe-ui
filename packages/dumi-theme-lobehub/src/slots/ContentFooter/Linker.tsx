import { Icon } from '@lobehub/ui';
import { Link } from 'dumi';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
            <Icon icon={ArrowLeft} size={{ fontSize: 14 }} />
            <span style={{ lineHeight: '14px' }}>Previous</span>
          </>
        );
      case 'next':
        return (
          <>
            <span style={{ lineHeight: '14px' }}>Next</span>
            <Icon icon={ArrowRight} size={{ fontSize: 14 }} />
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

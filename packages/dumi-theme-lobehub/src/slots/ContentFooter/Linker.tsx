import { Icon } from '@lobehub/ui';
import { Link } from 'dumi';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { memo, useMemo } from 'react';
import { Flexbox } from 'react-layout-kit';
import { useStyles } from './Linker.style';

interface LinkerProps {
  title: string;
  link: string;
  type?: 'prev' | 'next';
}

const Linker = memo<LinkerProps>(({ title, link, type }) => {
  const { styles, cx } = useStyles();
  const navContent = useMemo(() => {
    switch (type) {
      case 'prev':
        return (
          <>
            <Icon icon={ArrowLeft} />
            <span style={{ lineHeight: 1 }}>Previous</span>
          </>
        );
      case 'next':
        return (
          <>
            <span style={{ lineHeight: 1 }}>Next</span>
            <Icon icon={ArrowRight} />
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
});

export default Linker;

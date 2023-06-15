import RcFooter, { FooterProps as RcProps } from 'rc-footer';
import { memo } from 'react';

import { useStyle } from './style';

export interface FooterProps {
  bottom?: RcProps['bottom'];
  columns: RcProps['columns'];
  contentMaxWidth?: number;
  theme?: RcProps['theme'];
}

const Footer = memo<FooterProps>(({ columns, bottom, theme, contentMaxWidth = 960 }) => {
  const isEmpty = !columns || columns?.length === 0;

  const { styles } = useStyle({ isEmpty, contentMaxWidth });

  return (
    <section className={styles.container}>
      <RcFooter bottom={bottom} className={styles.footer} columns={columns} theme={theme} />
    </section>
  );
});

export default Footer;

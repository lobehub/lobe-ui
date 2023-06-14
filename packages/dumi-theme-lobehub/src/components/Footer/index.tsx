import RcFooter, { FooterProps as RcProps } from 'rc-footer';
import { memo } from 'react';

import { useStyles } from './style';

export interface FooterProps {
  bottom?: RcProps['bottom'];
  columns: RcProps['columns'];
  theme?: RcProps['theme'];
}

const Footer = memo<FooterProps>(({ columns, bottom, theme }) => {
  const isEmpty = !columns || columns?.length === 0;

  const { styles } = useStyles(isEmpty);

  return (
    <section className={styles.container}>
      <RcFooter bottom={bottom} className={styles.footer} columns={columns} theme={theme} />
    </section>
  );
});

export default Footer;

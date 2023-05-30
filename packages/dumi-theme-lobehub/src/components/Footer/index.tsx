import RcFooter, { FooterProps as RcProps } from 'rc-footer';
import { memo } from 'react';

import { useStyles } from './style';

export interface FooterProps {
  columns: RcProps['columns'];
  bottom?: RcProps['bottom'];
  theme?: RcProps['theme'];
}

const Footer = memo<FooterProps>(({ columns, bottom, theme }) => {
  const isEmpty = !columns || columns?.length === 0;

  const { styles } = useStyles(isEmpty);

  return (
    <footer className={styles.container}>
      <RcFooter theme={theme} className={styles.footer} columns={columns} bottom={bottom} />
    </footer>
  );
});

export default Footer;

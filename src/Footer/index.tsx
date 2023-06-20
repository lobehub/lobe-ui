import RcFooter, { type FooterProps as RcProps } from 'rc-footer';
import { type ReactNode, memo } from 'react';

import { useStyles } from './style';

export interface FooterProps {
  /**
   * @description The bottom content of the footer
   */
  bottom?: ReactNode;
  /**
   * @description The columns of the footer
   */
  columns: RcProps['columns'];
  /**
   * @description The maximum width of the content in the footer
   * @type number
   * @default 960
   */
  contentMaxWidth?: number;
  /**
   * @description The theme of the footer
   */
  theme?: 'light' | 'dark';
}

const Footer = memo<FooterProps>(({ columns, bottom, theme, contentMaxWidth = 960 }) => {
  const isEmpty = !columns || columns?.length === 0;

  const { styles } = useStyles({ contentMaxWidth, isEmpty });

  return (
    <section className={styles.container}>
      <RcFooter bottom={bottom} className={styles.footer} columns={columns} theme={theme} />
    </section>
  );
});

export default Footer;

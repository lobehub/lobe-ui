'use client';

import RcFooter, { type FooterProps as RcProps } from 'rc-footer';
import { type ReactNode, memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import { useStyles } from './style';

export interface FooterProps extends FlexboxProps {
  bottom?: ReactNode;
  columns: RcProps['columns'];
  contentMaxWidth?: number;
  theme?: 'light' | 'dark';
}

const Footer = memo<FooterProps>(
  ({ columns, bottom, theme, contentMaxWidth = 960, children, ...rest }) => {
    const isEmpty = !columns || columns?.length === 0;

    const { styles } = useStyles({ contentMaxWidth, isEmpty });

    return (
      <Flexbox as={'section'} className={styles.root} width={'100%'} {...rest}>
        <RcFooter bottom={bottom} className={styles.footer} columns={columns} theme={theme} />
        {children}
      </Flexbox>
    );
  },
);

Footer.displayName = 'Footer';

export default Footer;

'use client';

import RcFooter from 'rc-footer';
import { memo } from 'react';

import { Flexbox } from '@/Flex';

import { useStyles } from './style';
import type { FooterProps } from './type';

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

'use client';

import RcFooter from 'rc-footer';
import { memo, useMemo } from 'react';

import { Flexbox } from '@/Flex';

import { styles } from './style';
import type { FooterProps } from './type';

const Footer = memo<FooterProps>(
  ({ columns, bottom, theme, contentMaxWidth = 960, children, style, ...rest }) => {
    const isEmpty = !columns || columns?.length === 0;

    // Convert contentMaxWidth prop to CSS variable
    const cssVariables = useMemo<Record<string, string>>(
      () => ({
        '--footer-content-max-width': `${contentMaxWidth}px`,
      }),
      [contentMaxWidth],
    );

    return (
      <Flexbox
        as={'section'}
        className={styles.root}
        width={'100%'}
        style={{
          ...cssVariables,
          ...style,
        }}
        {...rest}
      >
        <RcFooter
          bottom={bottom}
          className={isEmpty ? styles.footerEmpty : styles.footer}
          columns={columns}
          theme={theme}
        />
        {children}
      </Flexbox>
    );
  },
);

Footer.displayName = 'Footer';

export default Footer;

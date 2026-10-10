'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo } from 'react';

import Snippet from '@/Snippet';
import { styleProps } from '@/styles/stylex/props';

import { styles } from './style';
import type { InstallBannerProps } from './type';

const InstallBanner = memo<InstallBannerProps>(
  ({ className, command, footnote, prefix = '$', style, title, ...rest }) => (
    <section {...styleProps(styles.root, className, style)} {...rest}>
      <div {...stylex.props(styles.content)}>
        {title && <h2 {...stylex.props(styles.title)}>{title}</h2>}
        <Snippet language={'bash'} prefix={prefix} style={{ borderRadius: 999 }}>
          {command}
        </Snippet>
        {footnote && (
          <p
            className={clsx(
              stylex.props(styles.footnote).className,
              'lobe-install-banner-footnote',
            )}
          >
            {footnote}
          </p>
        )}
      </div>
    </section>
  ),
);

InstallBanner.displayName = 'InstallBanner';

export default InstallBanner;

'use client';

import './style.css';

import clsx from 'clsx';
import { memo } from 'react';

import Snippet from '@/Snippet';
import { styleProps } from '@/styles/stylex/props';

import { awesomeInstallBannerClasses } from './stable';
import { styles } from './style';
import type { InstallBannerProps } from './type';

const InstallBanner = memo<InstallBannerProps>(
  ({ className, command, footnote, prefix = '$', style, title, ...rest }) => (
    <section
      {...styleProps(styles.root, clsx(awesomeInstallBannerClasses(), className), style)}
      {...rest}
    >
      <div {...styleProps(styles.content, awesomeInstallBannerClasses('content'))}>
        {title && (
          <h2 {...styleProps(styles.title, awesomeInstallBannerClasses('title'))}>{title}</h2>
        )}
        <Snippet
          className={awesomeInstallBannerClasses('command')}
          language={'bash'}
          prefix={prefix}
        >
          {command}
        </Snippet>
        {footnote && (
          <p
            className={clsx(
              styleProps(styles.footnote, awesomeInstallBannerClasses('footnote')).className,
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

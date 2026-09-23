'use client';

import { cx } from 'antd-style';
import { memo } from 'react';

import Snippet from '@/Snippet';

import { styles } from './style';
import type { InstallBannerProps } from './type';

const InstallBanner = memo<InstallBannerProps>(
  ({ className, command, footnote, prefix = '$', title, ...rest }) => (
    <section className={cx(styles.root, className)} {...rest}>
      <div className={styles.content}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <Snippet className={styles.snippet} language={'bash'} prefix={prefix}>
          {command}
        </Snippet>
        {footnote && <p className={styles.footnote}>{footnote}</p>}
      </div>
    </section>
  ),
);

InstallBanner.displayName = 'InstallBanner';

export default InstallBanner;

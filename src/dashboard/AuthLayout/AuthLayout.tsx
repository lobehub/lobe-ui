'use client';

import { cx } from 'antd-style';

import Text from '@/base-ui/Text';
import { Flexbox } from '@/Flex';

import { styles as surfaceStyles } from '../Surface/style';
import { styles } from './style';
import type { AuthLayoutProps } from './type';

function AuthLayout({
  aside,
  brand,
  children,
  className,
  description,
  title,
  tools,
  ...rest
}: AuthLayoutProps) {
  const split = Boolean(aside);
  return (
    <div className={className ? `${styles.page} ${className}` : styles.page} {...rest}>
      <header className={styles.header}>
        {brand}
        {tools ? <div className={styles.tools}>{tools}</div> : null}
      </header>
      <main className={styles.main}>
        <div className={cx(styles.lift, split && styles.liftSplit, surfaceStyles.card)}>
          <div className={cx(styles.frame, split && styles.split)}>
            <div className={cx(styles.form, split && styles.formSplit)}>
              <Flexbox gap={8}>
                <Text as="h1" className={styles.title} weight="bold">
                  {title}
                </Text>
                {description ? (
                  <Text className={styles.description} type="secondary">
                    {description}
                  </Text>
                ) : null}
              </Flexbox>
              {children}
            </div>
            {aside ? <div className={styles.aside}>{aside}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

AuthLayout.displayName = 'AuthLayout';

export default AuthLayout;

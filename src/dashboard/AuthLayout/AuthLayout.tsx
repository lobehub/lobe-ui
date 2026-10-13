'use client';

import { cx } from 'antd-style';
import { isValidElement } from 'react';

import Skeleton from '@/base-ui/Skeleton';
import Text from '@/base-ui/Text';
import { Flexbox } from '@/Flex';

import { useSurfaceCardClassName } from '../Surface/link';
import Aside from './Aside';
import { styles } from './style';
import type { AuthLayoutProps } from './type';

const FormSkeleton = () => (
  <Flexbox aria-hidden gap={12}>
    <Skeleton height={36} radius={8} width="100%" />
    <Skeleton height={36} radius={8} width="100%" />
    <Skeleton height={36} radius={8} width="100%" />
  </Flexbox>
);

function AuthLayout({
  alert,
  aside,
  background = 'plain',
  brand,
  card = true,
  children,
  className,
  description,
  footer,
  loading,
  logo,
  title,
  tools,
  variant = 'default',
  ...rest
}: AuthLayoutProps) {
  const cardClassName = useSurfaceCardClassName();
  const split = Boolean(aside);
  const art = isValidElement(background) ? background : null;
  const heading =
    title === undefined || title === null ? null : typeof title === 'string' ? (
      <Text as="h1" className={styles.title} weight="bold">
        {title}
      </Text>
    ) : (
      <div className={styles.titleNode}>{title}</div>
    );
  const intro =
    logo || heading || description ? (
      <Flexbox gap={8}>
        {logo ? <div className={styles.logo}>{logo}</div> : null}
        {heading}
        {description ? (
          <Text className={styles.description} type="secondary">
            {description}
          </Text>
        ) : null}
      </Flexbox>
    ) : null;

  return (
    <div
      className={cx(styles.page, background === 'grid' && styles.grid, className)}
      data-auth-layout=""
      {...rest}
    >
      {art ? <div className={styles.backdrop}>{art}</div> : null}
      <header className={styles.header}>
        {brand}
        {tools ? <div className={styles.tools}>{tools}</div> : null}
      </header>
      <main className={styles.main}>
        {card ? (
          <div
            data-auth-card=""
            className={cx(
              styles.lift,
              split && styles.liftSplit,
              cardClassName,
              variant === 'elevated' && styles.elevated,
            )}
          >
            <div className={cx(styles.frame, split && styles.split)}>
              <div className={cx(styles.form, split && styles.formSplit)}>
                {intro}
                {alert}
                {loading ? <FormSkeleton /> : children}
                {footer ? <div className={styles.footer}>{footer}</div> : null}
              </div>
              {aside ? <div className={styles.aside}>{aside}</div> : null}
            </div>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

AuthLayout.displayName = 'AuthLayout';
AuthLayout.Aside = Aside;

export default AuthLayout;

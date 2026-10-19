'use client';

import './style.css';

import clsx from 'clsx';
import { isValidElement } from 'react';

import { Flexbox } from '@/Flex';
import Skeleton from '@/Skeleton';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import Text from '@/Text';
import { toDataAttributes } from '@/utils/bem';

import Aside from './Aside';
import { dashboardAuthLayoutClasses } from './stable';
import { styles } from './style';
import type { AuthLayoutProps } from './type';

const FormSkeleton = () => (
  <Flexbox aria-hidden className={dashboardAuthLayoutClasses('skeleton')} gap={12}>
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
  style,
  title,
  tools,
  variant = 'default',
  ...rest
}: AuthLayoutProps) {
  const { isDarkMode } = useThemeMode();
  const split = Boolean(aside);
  const art = isValidElement(background) ? background : null;
  const heading =
    title === undefined || title === null ? null : typeof title === 'string' ? (
      <Text as="h1" className={dashboardAuthLayoutClasses('title')} weight="bold">
        {title}
      </Text>
    ) : (
      <div {...styleProps(styles.titleNode, dashboardAuthLayoutClasses('title'))}>{title}</div>
    );
  const intro =
    logo || heading || description ? (
      <Flexbox className={dashboardAuthLayoutClasses('intro')} gap={8}>
        {logo ? (
          <div {...styleProps(styles.logo, dashboardAuthLayoutClasses('logo'))}>{logo}</div>
        ) : null}
        {heading}
        {description ? (
          <Text className={dashboardAuthLayoutClasses('description')} type="secondary">
            {description}
          </Text>
        ) : null}
      </Flexbox>
    ) : null;

  return (
    <div
      data-auth-layout=""
      {...rest}
      {...styleProps(
        [
          styles.page,
          background === 'grid' && styles.grid,
          background === 'grid' && isDarkMode && styles.gridDark,
        ],
        clsx(dashboardAuthLayoutClasses(), className),
        style,
      )}
      {...toDataAttributes({
        background: typeof background === 'string' ? background : undefined,
        loading,
        split,
        variant,
      })}
    >
      {art ? (
        <div {...styleProps(styles.backdrop, dashboardAuthLayoutClasses('backdrop'))}>{art}</div>
      ) : null}
      <header {...styleProps(styles.header, dashboardAuthLayoutClasses('header'))}>
        {brand}
        {tools ? (
          <div {...styleProps(styles.tools, dashboardAuthLayoutClasses('tools'))}>{tools}</div>
        ) : null}
      </header>
      <main {...styleProps(styles.main, dashboardAuthLayoutClasses('main'))}>
        {card ? (
          <div
            data-auth-card=""
            {...styleProps(
              [styles.lift, split && styles.liftSplit, variant === 'elevated' && styles.elevated],
              dashboardAuthLayoutClasses('card'),
            )}
          >
            <div
              {...styleProps(
                [styles.frame, split && styles.split],
                dashboardAuthLayoutClasses('frame'),
              )}
            >
              <div
                {...styleProps(
                  [styles.form, split && styles.formSplit],
                  dashboardAuthLayoutClasses('form'),
                )}
              >
                {intro}
                {alert}
                {loading ? <FormSkeleton /> : children}
                {footer ? (
                  <div
                    {...styleProps(
                      styles.footer,
                      clsx(dashboardAuthLayoutClasses('footer'), 'lobe-auth-layout-footer'),
                    )}
                  >
                    {footer}
                  </div>
                ) : null}
              </div>
              {aside ? (
                <div {...styleProps(styles.aside, dashboardAuthLayoutClasses('aside'))}>
                  {aside}
                </div>
              ) : null}
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

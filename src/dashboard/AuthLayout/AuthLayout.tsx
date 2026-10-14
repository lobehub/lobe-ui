'use client';

import './style.css';

import * as stylex from '@stylexjs/stylex';
import { isValidElement } from 'react';

import { Flexbox } from '@/Flex';
import Skeleton from '@/Skeleton';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import { useThemeMode } from '@/styles/theme/scope';
import Text from '@/Text';

import Aside from './Aside';
import { styles } from './style';
import type { AuthLayoutProps } from './type';

const titleStyle = {
  fontSize: cssVar.fontSizeHeading3,
  lineHeight: cssVar.lineHeightHeading3,
  margin: 0,
};
const descriptionStyle = { color: cssVar.colorTextSecondary, lineHeight: 1.6 };

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
      <Text as="h1" style={titleStyle} weight="bold">
        {title}
      </Text>
    ) : (
      <div {...stylex.props(styles.titleNode)}>{title}</div>
    );
  const intro =
    logo || heading || description ? (
      <Flexbox gap={8}>
        {logo ? <div {...stylex.props(styles.logo)}>{logo}</div> : null}
        {heading}
        {description ? (
          <Text style={descriptionStyle} type="secondary">
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
        className,
        style,
      )}
    >
      {art ? <div {...stylex.props(styles.backdrop)}>{art}</div> : null}
      <header {...stylex.props(styles.header)}>
        {brand}
        {tools ? <div {...stylex.props(styles.tools)}>{tools}</div> : null}
      </header>
      <main {...stylex.props(styles.main)}>
        {card ? (
          <div
            data-auth-card=""
            {...stylex.props(
              styles.lift,
              split && styles.liftSplit,
              variant === 'elevated' && styles.elevated,
            )}
          >
            <div {...stylex.props(styles.frame, split && styles.split)}>
              <div {...stylex.props(styles.form, split && styles.formSplit)}>
                {intro}
                {alert}
                {loading ? <FormSkeleton /> : children}
                {footer ? (
                  <div {...styleProps(styles.footer, 'lobe-auth-layout-footer')}>{footer}</div>
                ) : null}
              </div>
              {aside ? <div {...stylex.props(styles.aside)}>{aside}</div> : null}
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

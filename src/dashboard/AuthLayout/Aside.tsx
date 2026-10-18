'use client';

import clsx from 'clsx';

import { styleProps } from '@/styles/stylex/props';

import { dashboardAuthLayoutClasses } from './stable';
import { styles } from './style';
import type { AuthLayoutAsideProps } from './type';

/** Inset art panel for `AuthLayout`'s `aside` slot, with a scrim and copy at the bottom. */
function AuthLayoutAside({
  background,
  className,
  kicker,
  line,
  style,
  ...rest
}: AuthLayoutAsideProps) {
  return (
    <div
      {...rest}
      {...styleProps(
        styles.asidePlate,
        clsx(dashboardAuthLayoutClasses('aside-plate'), className),
        style,
      )}
    >
      <div {...styleProps(styles.asidePanel, dashboardAuthLayoutClasses('aside-panel'))}>
        {background}
        {kicker || line ? (
          <>
            <div {...styleProps(styles.asideScrim, dashboardAuthLayoutClasses('aside-scrim'))} />
            <div {...styleProps(styles.asideCopy, dashboardAuthLayoutClasses('aside-copy'))}>
              {kicker ? (
                <p {...styleProps(styles.asideKicker, dashboardAuthLayoutClasses('aside-kicker'))}>
                  {kicker}
                </p>
              ) : null}
              {line ? (
                <p {...styleProps(styles.asideLine, dashboardAuthLayoutClasses('aside-line'))}>
                  {line}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

AuthLayoutAside.displayName = 'AuthLayoutAside';

export default AuthLayoutAside;

'use client';

import * as stylex from '@stylexjs/stylex';

import { styleProps } from '@/styles/stylex/props';

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
    <div {...rest} {...styleProps(styles.asidePlate, className, style)}>
      <div {...stylex.props(styles.asidePanel)}>
        {background}
        {kicker || line ? (
          <>
            <div {...stylex.props(styles.asideScrim)} />
            <div {...stylex.props(styles.asideCopy)}>
              {kicker ? <p {...stylex.props(styles.asideKicker)}>{kicker}</p> : null}
              {line ? <p {...stylex.props(styles.asideLine)}>{line}</p> : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

AuthLayoutAside.displayName = 'AuthLayoutAside';

export default AuthLayoutAside;

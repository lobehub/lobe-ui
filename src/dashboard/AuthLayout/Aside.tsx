'use client';

import { cx } from 'antd-style';

import { styles } from './style';
import type { AuthLayoutAsideProps } from './type';

/** Inset art panel for `AuthLayout`'s `aside` slot, with a scrim and copy at the bottom. */
function AuthLayoutAside({ background, className, kicker, line, ...rest }: AuthLayoutAsideProps) {
  return (
    <div className={cx(styles.asidePlate, className)} {...rest}>
      <div className={styles.asidePanel}>
        {background}
        {kicker || line ? (
          <>
            <div className={styles.asideScrim} />
            <div className={styles.asideCopy}>
              {kicker ? <p className={styles.asideKicker}>{kicker}</p> : null}
              {line ? <p className={styles.asideLine}>{line}</p> : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

AuthLayoutAside.displayName = 'AuthLayoutAside';

export default AuthLayoutAside;

'use client';

import { createStyles } from 'antd-style';
import { FC, PropsWithChildren } from 'react';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      --lobe-markdown-header-multiple: 0.5;
      --lobe-markdown-margin-multiple: 1;

      position: relative;
      margin-block: calc(var(--lobe-markdown-margin-multiple) * 1em);
      padding-inline-start: 2.5em;

      &::before {
        content: '';

        position: absolute;
        inset-block-start: 0.25em;
        inset-inline-start: 0.9em;

        display: block;

        width: 1px;
        height: calc(100% - 0.5em);

        background: ${token.colorBorderSecondary};
      }

      h3 {
        counter-increment: step;

        &::before {
          content: counter(step);

          position: absolute;
          z-index: 1;
          inset-inline-start: 0;

          display: inline-block;

          width: 1.8em;
          height: 1.8em;
          margin-block-start: -0.05em;

          font-size: 0.8em;
          font-weight: 500;
          line-height: 1.8em;
          color: ${token.colorTextSecondary};
          text-align: center;

          background: ${token.colorBgElevated};
          border-radius: 9999px;
          box-shadow: 0 0 0 2px ${token.colorBgLayout};
        }

        &:not(:first-child) {
          margin-block-start: 2em;
        }
      }
    `,
  };
});

const Steps: FC<PropsWithChildren> = ({ children }) => {
  const { styles } = useStyles();

  return <div className={styles.container}>{children}</div>;
};

export default Steps;

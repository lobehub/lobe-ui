'use client';

import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  // Optional hidden input for keyboard navigation (opt-in).
  hiddenInput: css`
    position: absolute;

    overflow: hidden;

    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;

    white-space: nowrap;

    clip: rect(0, 0, 0, 0);
  `,
  list: css`
    overflow: auto;
    max-height: 320px;
  `,
}));

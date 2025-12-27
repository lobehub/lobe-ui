import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, responsive }) => ({
  hidden: css`
    pointer-events: none;

    position: absolute;
    inset-block-end: 16px;
    inset-inline-end: 16px;
    transform: translateY(16px);

    opacity: 0;

    ${responsive.sm} {
      inset-inline-end: 0;
      border-inline-end: none;
      border-start-end-radius: 0 !important;
      border-end-end-radius: 0 !important;
    }
  `,
  visible: css`
    pointer-events: all;

    position: absolute;
    inset-block-end: 16px;
    inset-inline-end: 16px;
    transform: translateY(0);

    opacity: 1;

    ${responsive.sm} {
      inset-inline-end: 0;
      border-inline-end: none;
      border-start-end-radius: 0 !important;
      border-end-end-radius: 0 !important;
    }
  `,
}));

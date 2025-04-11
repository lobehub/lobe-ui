import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, responsive }, visible: boolean) => css`
    pointer-events: ${visible ? 'all' : 'none'};

    position: absolute;
    inset-block-end: 16px;
    inset-inline-end: 16px;
    transform: translateY(${visible ? 0 : '16px'});

    opacity: ${visible ? 1 : 0};

    ${responsive.mobile} {
      inset-inline-end: 0;
      border-inline-end: none;
      border-start-end-radius: 0 !important;
      border-end-end-radius: 0 !important;
    }
  `,
);

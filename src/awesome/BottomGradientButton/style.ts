import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ css, token }) => css`
    overflow: hidden;
    font-weight: bold;
    color: ${token.colorTextSecondary};
    transition: all 0.2s ease-in-out;

    &::before {
      content: '';

      position: absolute;
      inset-block-end: 0;

      display: block;

      width: 50%;
      height: 1px;

      opacity: 0;
      background-image: linear-gradient(to right, transparent, ${token.gold}, transparent);

      transition: all 0.2s ease-in-out;
    }

    &:hover {
      &::before {
        opacity: 1;
      }
    }
  `,
);

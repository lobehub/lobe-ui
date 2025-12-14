import { createStyles, keyframes } from 'antd-style';

const shimmer = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
  100% {
    opacity: 1;
  }
`;

export const useStyles = createStyles(({ css, token }) => {
  const spacing = token.paddingXS ?? 8;
  return {
    active: css`
      background: ${token.colorFillSecondary};
      animation: ${shimmer} 2s linear infinite;
    `,

    avatar: css`
      flex-shrink: 0;
    `,

    base: css`
      user-select: none;

      position: relative;

      overflow: hidden;

      border-radius: ${token.borderRadius}px;

      background: ${token.colorFillTertiary};
    `,

    text: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: ${spacing}px;

      width: 100%;
    `,
  };
});

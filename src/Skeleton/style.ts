import { createStaticStyles, keyframes } from 'antd-style';

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

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    active: css`
      background: ${cssVar.colorFillSecondary};
      animation: ${shimmer} 2s linear infinite;
    `,

    avatar: css`
      flex-shrink: 0;
    `,

    base: css`
      user-select: none;

      position: relative;

      overflow: hidden;

      border-radius: ${cssVar.borderRadius};

      background: ${cssVar.colorFillTertiary};
    `,

    text: css`
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: ${cssVar.paddingXS};

      width: 100%;
    `,
  };
});

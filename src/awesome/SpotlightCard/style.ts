import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const CHILDREN_CLASSNAME = 'hover-card';

export const useStyles = createStyles(
  (
    { css, responsive, token, isDarkMode },
    { size, borderRadius }: { borderRadius: number; size: number },
  ) => ({
    container: css`
      &:hover > .${CHILDREN_CLASSNAME}::after {
        opacity: 1;
      }
    `,

    content: css`
      z-index: 2;

      flex-grow: 1;

      height: 100%;
      margin: 1px;

      background: ${token.colorBgContainer};
      border-radius: ${borderRadius - 1}px;
    `,
    grid: css`
      display: grid;

      ${responsive.mobile} {
        display: flex;
        flex-direction: column;
      }
    `,
    itemContainer: css`
      cursor: pointer;

      position: relative;

      overflow: hidden;

      width: 100%;

      background: ${rgba(token.colorBorderSecondary, 0.75)};
      border-radius: ${borderRadius}px;

      &::before,
      &::after {
        content: '';

        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;

        width: 100%;
        height: 100%;

        opacity: 0;
        border-radius: inherit;

        transition: opacity 500ms;
      }

      &::before {
        pointer-events: none;
        user-select: none;
        z-index: 3;
        background: radial-gradient(
          ${size}px circle at var(--mouse-x) var(--mouse-y),
          ${rgba(token.colorTextBase, isDarkMode ? 0.06 : 0.02)},
          transparent 40%
        );
      }

      &::after {
        z-index: 1;
        background: radial-gradient(
          ${size * 0.75}px circle at var(--mouse-x) var(--mouse-y),
          ${rgba(token.colorTextBase, isDarkMode ? 0.4 : 0.2)},
          transparent 40%
        );
      }

      :hover::before {
        opacity: 1;
      }
    `,
  }),
);

import { createStaticStyles, responsive } from 'antd-style';

export const CHILDREN_CLASSNAME = 'hover-card';

export const styles = createStaticStyles(({ css, cssVar }) => ({
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
    border-radius: calc(var(--spotlight-card-border-radius, 12px) - 1px);

    background: ${cssVar.colorBgContainer};
  `,
  grid: css`
    display: grid;

    ${responsive.sm} {
      display: flex;
      flex-direction: column;
    }
  `,
  itemContainerDark: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    width: 100%;
    border-radius: var(--spotlight-card-border-radius, 12px);

    background: color-mix(in srgb, ${cssVar.colorBorderSecondary} 75%, transparent);

    &::before,
    &::after {
      content: '';

      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;

      width: 100%;
      height: 100%;
      border-radius: inherit;

      opacity: 0;

      transition: opacity 500ms;
    }

    &::before {
      pointer-events: none;
      user-select: none;
      z-index: 3;
      background: radial-gradient(
        var(--spotlight-card-size, 800px) circle at var(--mouse-x) var(--mouse-y),
        color-mix(in srgb, ${cssVar.colorTextBase} 6%, transparent),
        transparent 40%
      );
    }

    &::after {
      z-index: 1;
      background: radial-gradient(
        calc(var(--spotlight-card-size, 800px) * 0.75) circle at var(--mouse-x) var(--mouse-y),
        color-mix(in srgb, ${cssVar.colorTextBase} 40%, transparent),
        transparent 40%
      );
    }

    :hover::before {
      opacity: 1;
    }
  `,

  itemContainerLight: css`
    cursor: pointer;

    position: relative;

    overflow: hidden;

    width: 100%;
    border-radius: var(--spotlight-card-border-radius, 12px);

    background: color-mix(in srgb, ${cssVar.colorBorderSecondary} 75%, transparent);

    &::before,
    &::after {
      content: '';

      position: absolute;
      inset-block-start: 0;
      inset-inline-start: 0;

      width: 100%;
      height: 100%;
      border-radius: inherit;

      opacity: 0;

      transition: opacity 500ms;
    }

    &::before {
      pointer-events: none;
      user-select: none;
      z-index: 3;
      background: radial-gradient(
        var(--spotlight-card-size, 800px) circle at var(--mouse-x) var(--mouse-y),
        color-mix(in srgb, ${cssVar.colorTextBase} 2%, transparent),
        transparent 40%
      );
    }

    &::after {
      z-index: 1;
      background: radial-gradient(
        calc(var(--spotlight-card-size, 800px) * 0.75) circle at var(--mouse-x) var(--mouse-y),
        color-mix(in srgb, ${cssVar.colorTextBase} 20%, transparent),
        transparent 40%
      );
    }

    :hover::before {
      opacity: 1;
    }
  `,
}));

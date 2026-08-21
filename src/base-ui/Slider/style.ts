import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  control: css`
    display: flex;
    align-items: center;
    width: 100%;
    height: 20px;
  `,
  indicator: css`
    border-radius: inherit;
    background: ${cssVar.colorPrimary};

    [data-disabled] & {
      background: ${cssVar.colorTextQuaternary};
    }
  `,
  root: css`
    display: flex;
    align-items: center;
    width: 100%;

    &[data-disabled] {
      cursor: not-allowed;
    }
  `,
  thumb: css`
    flex-shrink: 0;

    width: 8px;
    height: 16px;
    border-radius: 100px;

    background: ${cssVar.colorPrimary};
    box-shadow: 0 0 0 1px ${cssVar.colorBgContainer};

    transition: box-shadow 150ms ${cssVar.motionEaseOut};

    &::before {
      content: '';

      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;

      width: 24px;
      height: 40px;
    }

    &:hover:not([data-disabled] *) {
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    [data-dragging] & {
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }

    [data-disabled] & {
      background: ${cssVar.colorTextQuaternary};
      box-shadow: 0 0 0 1px ${cssVar.colorBgContainer};
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  track: css`
    width: 100%;
    height: 4px;
    border-radius: 100px;
    background: ${cssVar.colorFillSecondary};
  `,
}));

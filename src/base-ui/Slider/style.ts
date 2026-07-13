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
    width: 14px;
    height: 14px;
    border-radius: 50%;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 0 0 1px ${cssVar.colorBorder},
      0 1px 2px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 30 80 / 12%);

    transition: box-shadow 150ms ${cssVar.motionEaseOut};

    &:hover:not([data-disabled] *) {
      box-shadow:
        0 0 0 1px ${cssVar.colorPrimary},
        0 1px 2px rgb(0 0 0 / 12%),
        0 3px 8px rgb(0 30 80 / 18%);
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    [data-dragging] & {
      box-shadow:
        0 0 0 1px ${cssVar.colorPrimary},
        0 1px 2px rgb(0 0 0 / 12%),
        0 3px 8px rgb(0 30 80 / 18%);
    }
  `,
  track: css`
    width: 100%;
    height: 4px;
    border-radius: 100px;
    background: ${cssVar.colorFillSecondary};
  `,
}));

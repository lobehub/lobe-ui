import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  icon: css`
    pointer-events: none;

    position: absolute;
    inset-block: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    color: ${cssVar.colorTextLightSolid};
  `,
  iconLeft: css`
    inset-inline-start: 5px;
  `,
  iconLeftSmall: css`
    inset-inline-start: 4px;
  `,
  iconRight: css`
    inset-inline-end: 5px;
  `,
  iconRightSmall: css`
    inset-inline-end: 4px;
  `,
  iconThumb: css`
    position: relative;
    inset: unset;
    transform: none;
    color: ${cssVar.colorPrimary};
  `,
  loading: css`
    @keyframes lobe-switch-loading {
      0% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(360deg);
      }
    }

    animation: lobe-switch-loading 1s linear infinite;
  `,
  root: css`
    cursor: pointer;
    user-select: none;

    position: relative;

    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;

    box-sizing: border-box;
    padding: 2px;
    border: 0;
    border-radius: 100px;

    background: ${cssVar.colorTextQuaternary};
    outline: none;

    transition: background 150ms ${cssVar.motionEaseOut};

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &:hover:not([data-disabled]) {
      background: ${cssVar.colorTextTertiary};
    }

    &[data-checked] {
      justify-content: flex-end;
      background: ${cssVar.colorPrimary};

      &:hover:not([data-disabled]) {
        background: ${cssVar.colorPrimaryHover};
      }
    }

    &[data-disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  rootDefault: css`
    width: 44px;
    min-width: 44px;
    height: 22px;
  `,
  rootSmall: css`
    width: 28px;
    min-width: 28px;
    height: 16px;
  `,
  thumb: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 2px 4px 0 rgb(0 35 11 / 20%),
      0 1px 2px 0 rgb(0 0 0 / 8%);

    [data-disabled] > & {
      box-shadow: none;
    }
  `,
  thumbDefault: css`
    width: 18px;
    height: 18px;
  `,
  thumbSmall: css`
    width: 12px;
    height: 12px;
  `,
}));

export const rootVariants = cva(styles.root, {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: styles.rootDefault,
      small: styles.rootSmall,
    },
  },
});

export const thumbVariants = cva(styles.thumb, {
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: styles.thumbDefault,
      small: styles.thumbSmall,
    },
  },
});

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

    color: ${cssVar.colorBgLayout};

    transition:
      opacity 200ms ${cssVar.motionEaseOut},
      scale 200ms ${cssVar.motionEaseOut};

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  iconLeft: css`
    inset-inline-start: 4px;
    scale: 0;
    opacity: 0;

    [data-checked] & {
      scale: 1;
      opacity: 1;
    }
  `,
  iconLeftSmall: css`
    inset-inline-start: 4px;
    scale: 0;
    opacity: 0;

    [data-checked] & {
      scale: 1;
      opacity: 1;
    }
  `,
  iconRight: css`
    inset-inline-end: 4px;

    [data-checked] & {
      scale: 0;
      opacity: 0;
    }
  `,
  iconRightSmall: css`
    inset-inline-end: 4px;

    [data-checked] & {
      scale: 0;
      opacity: 0;
    }
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

    @media (prefers-reduced-motion: reduce) {
      animation-duration: 0s;
    }
  `,
  root: css`
    --switch-dir: 1;

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

    background: ${cssVar.colorFillSecondary};
    outline: none;
    box-shadow: inset 0 1.5px 2px rgb(0 0 0 / 8%);

    transition:
      background 200ms ${cssVar.motionEaseOut},
      box-shadow 200ms ${cssVar.motionEaseOut};

    &:dir(rtl) {
      --switch-dir: -1;
    }

    [dir='rtl'] & {
      --switch-dir: -1;
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &:hover:not([data-disabled]) {
      background: ${cssVar.colorFill};
    }

    &[data-checked] {
      background: ${cssVar.colorPrimary};
      box-shadow: inset 0 1.5px 3px rgb(0 0 0 / 18%);

      &:hover:not([data-disabled]) {
        background: ${cssVar.colorPrimaryHover};
      }
    }

    &[data-disabled] {
      cursor: not-allowed;
      opacity: 0.45;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  rootDefault: css`
    width: 36px;
    min-width: 36px;
    height: 22px;
  `,
  rootSmall: css`
    width: 28px;
    min-width: 28px;
    height: 16px;
  `,
  thumb: css`
    transform: translateX(calc(var(--switch-x, 0px) * var(--switch-dir, 1)));

    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    background: ${cssVar.colorBgContainer};
    box-shadow:
      0 0 0 0.5px rgb(0 0 0 / 4%),
      0 1px 1px rgb(0 0 0 / 6%),
      0 3px 8px rgb(0 30 80 / 16%);

    transition: box-shadow 200ms ${cssVar.motionEaseOut};

    [role='switch']:hover:not([data-disabled]) > & {
      box-shadow:
        0 0 0 0.5px rgb(0 0 0 / 4%),
        0 1px 1px rgb(0 0 0 / 8%),
        0 6px 14px rgb(0 30 80 / 24%);
    }

    [data-disabled] > & {
      box-shadow: none;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
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

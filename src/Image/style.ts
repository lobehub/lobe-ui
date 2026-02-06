import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    actionsHidden: css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-end: 0;

      opacity: 0;
    `,
    actionsVisible: css`
      cursor: pointer;

      position: absolute;
      z-index: 1;
      inset-block-start: 0;
      inset-inline-end: 0;

      opacity: 1;
    `,
    borderless: lobeStaticStylish.variantBorderlessWithoutHover,
    filled: css`
      ${lobeStaticStylish.variantOutlinedWithoutHover};
      ${lobeStaticStylish.variantFilledWithoutHover};
    `,
    image: css`
      display: flex;
      align-items: center;
      justify-content: center;

      width: auto;
      height: auto;
    `,
    mask: css`
      ${lobeStaticStylish.blur};
      backdrop-filter: blur(8px);
    `,
    outlined: lobeStaticStylish.variantOutlinedWithoutHover,
    preview: css`
      .${prefixCls}-image-preview-mask {
        background: color-mix(in srgb, ${cssVar.colorBgLayout} 90%, transparent);
      }

      .${prefixCls}-image-preview-close {
        color: ${cssVar.colorTextDescription};
        background: ${cssVar.colorBgContainer};
        box-shadow: ${cssVar.boxShadowTertiary};

        svg {
          stroke: ${cssVar.colorTextDescription};
        }

        &:hover {
          color: ${cssVar.colorText};
          background: ${cssVar.colorBgContainer};

          svg {
            stroke: ${cssVar.colorText};
          }
        }
      }

      .${prefixCls}-image-preview-img {
        width: 100%;
      }

      .${prefixCls}-image-preview-switch {
        display: flex;
        align-items: center;
        justify-content: center;

        width: 32px;
        height: 32px;
        padding: 0;

        color: ${cssVar.colorTextDescription};

        background: ${cssVar.colorBgContainer};
        box-shadow: ${cssVar.boxShadowTertiary};

        svg {
          transform: scale(0.75);
        }

        &:hover {
          color: ${cssVar.colorText};
          background: ${cssVar.colorBgContainer};
        }
      }

      .${prefixCls}-image-preview-switch-disabled {
        display: none;
      }

      .ant-image-preview-progress {
        color: ${cssVar.colorTextDescription};
      }

      img {
        min-width: 100%;
      }
    `,
    root: css`
      cursor: pointer;
      user-select: none;

      position: relative;

      overflow: hidden;

      width: fit-content;
      border-radius: ${cssVar.borderRadius};

      line-height: 1;

      .${prefixCls}-image-cover {
        display: none !important;
      }

      &:hover {
        .actions-hidden {
          opacity: 1;
        }
      }
    `,
    toolbar: css`
      ${lobeStaticStylish.variantOutlinedWithoutHover};
      padding: 4px;
      border-color: ${cssVar.colorFillTertiary};
      border-radius: ${cssVar.borderRadiusLG};
    `,

    wrapper: css`
      position: relative;
      overflow: hidden;
      max-width: 100%;
      height: auto;
    `,
  };
});

export const variants = cva(styles.root, {
  defaultVariants: {
    variant: 'filled',
  },

  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
  },
});

export const FALLBACK_DARK =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjM0IzQjNCIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjNjI2MjYyIiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
export const FALLBACK_LIGHT =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiBmaWxsPSIjRUNFQ0VDIi8+CjxwYXRoIGQ9Ik0xNTYuODg4IDkxLjAwMkgxMDAuMTEyQzk1LjYzMjkgOTEuMDAyIDkyLjAwMTUgOTQuNjMzNCA5Mi4wMDE1IDk5LjExMjdWMTU1Ljg4OEM5Mi4wMDE1IDE2MC4zNjcgOTUuNjMyOSAxNjMuOTk5IDEwMC4xMTIgMTYzLjk5OUgxNTYuODg4QzE2MS4zNjcgMTYzLjk5OSAxNjQuOTk4IDE2MC4zNjcgMTY0Ljk5OCAxNTUuODg4Vjk5LjExMjdDMTY0Ljk5OCA5NC42MzM0IDE2MS4zNjcgOTEuMDAyIDE1Ni44ODggOTEuMDAyWiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0Ljk5OCAxMzkuNjY4TDE1Mi40ODQgMTI3LjE1M0MxNTAuOTYyIDEyNS42MzIgMTQ4LjkgMTI0Ljc3OCAxNDYuNzQ5IDEyNC43NzhDMTQ0LjU5OSAxMjQuNzc4IDE0Mi41MzYgMTI1LjYzMiAxNDEuMDE1IDEyNy4xNTNMMTA0LjE2OCAxNjRNMTE2LjMzNCAxMjMuNDQ1QzEyMC44MTMgMTIzLjQ0NSAxMjQuNDQ1IDExOS44MTQgMTI0LjQ0NSAxMTUuMzM0QzEyNC40NDUgMTEwLjg1NSAxMjAuODEzIDEwNy4yMjQgMTE2LjMzNCAxMDcuMjI0QzExMS44NTUgMTA3LjIyNCAxMDguMjIzIDExMC44NTUgMTA4LjIyMyAxMTUuMzM0QzEwOC4yMjMgMTE5LjgxNCAxMTEuODU1IDEyMy40NDUgMTE2LjMzNCAxMjMuNDQ1WiIgc3Ryb2tlPSIjRDdEN0Q3IiBzdHJva2Utd2lkdGg9IjguMTEwNzciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';

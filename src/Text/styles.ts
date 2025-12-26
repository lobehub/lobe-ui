import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  code: css`
    font-family: ${cssVar.fontFamilyCode};
  `,
  danger: css`
    color: ${cssVar.colorError};
  `,
  delete: css`
    text-decoration: line-through;
  `,
  disabled: css`
    cursor: not-allowed;
    color: ${cssVar.colorTextDisabled};
  `,
  ellipsis: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  ellipsisMulti: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  `,
  // Heading styles
  h1: css`
    font-size: calc(${cssVar.fontSize} * 2.5);
    font-weight: bold;
    line-height: 1.25;
  `,

  h2: css`
    font-size: calc(${cssVar.fontSize} * 2);
    font-weight: bold;
    line-height: 1.25;
  `,

  h3: css`
    font-size: calc(${cssVar.fontSize} * 1.5);
    font-weight: bold;
    line-height: 1.25;
  `,

  h4: css`
    font-size: calc(${cssVar.fontSize} * 1.25);
    font-weight: bold;
    line-height: 1.25;
  `,

  h5: css`
    font-size: ${cssVar.fontSize};
    font-weight: bold;
    line-height: 1.25;
  `,
  info: css`
    color: ${cssVar.colorInfo};
  `,

  italic: css`
    font-style: italic;
  `,

  mark: css`
    color: #000;
    background-color: ${cssVar.yellow};
  `,

  p: css`
    margin-block: 0;
  `,

  secondary: css`
    color: ${cssVar.colorTextDescription};
  `,

  strong: css`
    font-weight: bold;
  `,
  success: css`
    color: ${cssVar.colorSuccess};
  `,
  text: css`
    color: ${cssVar.colorText};
  `,
  underline: css`
    text-decoration: underline;
  `,
  warning: css`
    color: ${cssVar.colorWarning};
  `,
}));

export const variants = cva(styles.text, {
  defaultVariants: {},
  variants: {
    as: {
      h1: styles.h1,
      h2: styles.h2,
      h3: styles.h3,
      h4: styles.h4,
      h5: styles.h5,
      p: styles.p,
    },
    code: {
      true: styles.code,
    },
    delete: {
      true: styles.delete,
    },
    disabled: {
      true: styles.disabled,
    },
    ellipsis: {
      multi: styles.ellipsisMulti,
      true: styles.ellipsis,
    },
    italic: {
      true: styles.italic,
    },
    mark: {
      true: styles.mark,
    },
    strong: {
      true: styles.strong,
    },
    type: {
      danger: styles.danger,
      info: styles.info,
      secondary: styles.secondary,
      success: styles.success,
      warning: styles.warning,
    },
    underline: {
      true: styles.underline,
    },
  },
});

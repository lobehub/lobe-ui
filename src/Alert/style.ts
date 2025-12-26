import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    banner: css`
      border: none !important;
      border-radius: 0 !important;
    `,
    borderless: css`
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    `,
    borderlessExtraHeaderNoTitle: css`
      margin-block-start: 8px;
      padding-inline: 0;
    `,
    borderlessExtraHeaderWithTitle: css`
      margin-block-start: 16px;
      padding-inline: 0;
    `,
    colorfulText: css`
      .${prefixCls}-alert-message,.${prefixCls}-alert-description {
        color: inherit;
      }
    `,
    expandText: css`
      padding-inline-end: 12px;

      &:hover {
        cursor: pointer;
      }
    `,
    extra: css`
      position: relative;

      overflow: hidden;

      max-width: 100%;
      border: 1px solid;
      border-block-start: none;
      border-end-start-radius: ${cssVar.borderRadiusLG};
      border-end-end-radius: ${cssVar.borderRadiusLG};
    `,
    extraHeader: css`
      border-block-start: 1px dashed;
      border-radius: 0;
      background: transparent !important;
    `,
    filled: css``,
    glass: lobeStaticStylish.blur,
    hasExtra: css`
      border-block-end: none;
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    `,
    outlined: css`
      background: transparent !important;
    `,
    // Root variants based on closable, hasTitle, showIcon combinations
    rootBase: css`
      position: relative;

      display: flex;
      flex-direction: row;
      align-items: flex-start;

      max-width: 100%;

      .${prefixCls}-alert-icon {
        display: flex;
        align-items: center;
        height: 24px;
        margin: 0;
      }
      .${prefixCls}-alert-close-icon {
        display: flex;
        align-items: center;
        height: 24px;
        margin: 0;
      }
    `,
    rootNoTitleNoIconNoClosable: css`
      gap: 8px;
      padding-block: 8px;
      padding-inline: 12px;

      .${prefixCls}-alert-title {
        font-weight: 400;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
    `,
    rootNoTitleNoIconWithClosable: css`
      gap: 8px;
      padding-block: 8px;
      padding-inline: 12px 9px;

      .${prefixCls}-alert-title {
        font-weight: 400;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
    `,
    rootNoTitleWithIconNoClosable: css`
      gap: 8px;
      padding-block: 8px;
      padding-inline: 9px 12px;

      .${prefixCls}-alert-title {
        font-weight: 400;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
    `,
    rootNoTitleWithIconWithClosable: css`
      gap: 8px;
      padding-block: 8px;
      padding-inline: 9px;

      .${prefixCls}-alert-title {
        font-weight: 400;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
    `,
    rootWithTitleNoIconNoClosable: css`
      gap: 12px;
      padding-block: 16px;
      padding-inline: 16px;

      .${prefixCls}-alert-title {
        font-weight: 500;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
      .${prefixCls}-alert-description {
        line-height: 1.5;
        word-break: normal;
        opacity: 0.75;
      }
    `,
    rootWithTitleNoIconWithClosable: css`
      gap: 12px;
      padding-block: 16px;
      padding-inline: 16px 12px;

      .${prefixCls}-alert-title {
        font-weight: 500;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
      .${prefixCls}-alert-description {
        line-height: 1.5;
        word-break: normal;
        opacity: 0.75;
      }
    `,
    rootWithTitleWithIconNoClosable: css`
      gap: 12px;
      padding-block: 16px;
      padding-inline: 12px 16px;

      .${prefixCls}-alert-title {
        font-weight: 500;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
      .${prefixCls}-alert-description {
        line-height: 1.5;
        word-break: normal;
        opacity: 0.75;
      }
    `,
    rootWithTitleWithIconWithClosable: css`
      gap: 12px;
      padding-block: 16px;
      padding-inline: 12px;

      .${prefixCls}-alert-title {
        font-weight: 500;
        line-height: 24px;
        color: inherit;
        word-break: normal;
      }
      .${prefixCls}-alert-description {
        line-height: 1.5;
        word-break: normal;
        opacity: 0.75;
      }
    `,
  };
});

export const extraVariants = cva(styles.extra, {
  defaultVariants: {
    variant: 'filled',
  },
  /* eslint-disable sort-keys-fix/sort-keys-fix */
  variants: {
    variant: {
      filled: styles.filled,
      outlined: styles.outlined,
      borderless: styles.borderless,
    },
    banner: {
      false: null,
      true: styles.banner,
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});

// extraHeaderVariants 依赖 hasTitle，需要在组件中动态创建

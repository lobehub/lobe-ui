import { createStaticStyles, responsive } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css }) => ({
  root: css`
    position: relative;

    display: flex;
    flex-direction: column;
    gap: 16px;

    width: 100%;

    ${responsive.sm} {
      gap: 0 !important;
    }
  `,
  rootBorderless: css`
    gap: 48px;
  `,
}));

export const rootVariants = cva(styles.root, {
  defaultVariants: {
    variant: 'borderless',
  },
  variants: {
    variant: {
      borderless: styles.rootBorderless,
      filled: null,
      outlined: null,
    },
  },
});

export const fieldStyles = createStaticStyles(({ css, cssVar }) => ({
  control: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: flex-end;

    min-width: var(--form-field-min-width, unset);
  `,
  controlVertical: css`
    align-items: stretch;
    width: 100%;
  `,
  error: css`
    font-size: 12px;
    color: ${cssVar.colorError};
  `,
  horizontal: css`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `,
  label: css`
    display: block;
    flex: 1;
    max-width: 100%;
    text-align: start;
  `,
  root: css`
    display: flex;
    gap: 12px;

    box-sizing: border-box;
    width: 100%;
    padding-block: 16px;
  `,
  vertical: css`
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  `,
}));

export const fieldVariants = cva(fieldStyles.root, {
  defaultVariants: {
    layout: 'horizontal',
  },
  variants: {
    layout: {
      horizontal: fieldStyles.horizontal,
      vertical: fieldStyles.vertical,
    },
  },
});

export const dividerStyles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    width: 100%;
    height: 1px;
    margin: 0;
    border: none;

    background: ${cssVar.colorBorderSecondary};
  `,
}));

export const groupStyles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    display: flex;
    flex-direction: column;
  `,
  bodyBoxed: css`
    padding-inline: 16px;
  `,
  chevron: css`
    flex: none;
    color: ${cssVar.colorTextDescription};
    transition: transform 200ms ${cssVar.motionEaseOut};

    [data-panel-open] & {
      transform: rotate(180deg);
    }
  `,
  desc: css`
    font-size: 12px;
    font-weight: 400;
    color: ${cssVar.colorTextDescription};
  `,
  header: css`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    width: 100%;
  `,
  headerBorderless: css`
    padding-block-end: 16px;
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  headerBoxed: css`
    padding: 16px;
  `,
  mobileBody: css`
    padding-block: 0;
    padding-inline: 16px;
    background: ${cssVar.colorBgContainer};
  `,
  mobileHeader: css`
    padding: 16px;
    background: ${cssVar.colorBgLayout};
  `,
  mobileTitle: css`
    font-size: 14px;
    font-weight: 400;
    opacity: 0.5;
  `,
  panel: css`
    overflow: hidden;
    height: var(--collapsible-panel-height);
    transition: height 200ms ${cssVar.motionEaseOut};

    &[data-starting-style],
    &[data-ending-style] {
      height: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  rootFilled: css`
    border-radius: ${cssVar.borderRadiusLG};
    ${lobeStaticStylish.variantFilledWithoutHover}
    background: ${cssVar.colorFillQuaternary};
  `,
  rootOutlined: css`
    border-radius: ${cssVar.borderRadiusLG};
    ${lobeStaticStylish.variantOutlinedWithoutHover}
  `,
  title: css`
    display: flex;
    gap: 8px;
    align-items: center;

    font-size: 16px;
    font-weight: bold;
    color: ${cssVar.colorText};
  `,
  titleBorderless: css`
    font-size: 18px;
  `,
  trigger: css`
    cursor: pointer;

    display: flex;
    flex: 1;
    gap: 12px;
    align-items: center;

    margin: 0;
    padding: 0;
    border: none;

    text-align: start;

    background: none;
    outline: none;

    &:focus-visible {
      border-radius: ${cssVar.borderRadius};
      box-shadow: 0 0 0 2px ${cssVar.colorPrimaryBorder};
    }
  `,
}));

export const groupVariants = cva(null, {
  defaultVariants: {
    variant: 'borderless',
  },
  variants: {
    variant: {
      borderless: null,
      filled: groupStyles.rootFilled,
      outlined: groupStyles.rootOutlined,
    },
  },
});

export const flatGroupStyles = createStaticStyles(({ cx, css, cssVar }) => ({
  borderless: cx(
    lobeStaticStylish.variantBorderlessWithoutHover,
    css`
      padding-inline: 0;
    `,
  ),
  filled: cx(
    lobeStaticStylish.variantFilledWithoutHover,
    css`
      background: ${cssVar.colorFillQuaternary};
    `,
  ),
  mobile: css`
    padding-block: 0;
    padding-inline: 16px;
    border-radius: 0;
    background: ${cssVar.colorBgContainer};
  `,
  outlined: lobeStaticStylish.variantOutlinedWithoutHover,
  root: css`
    padding-inline: 16px;
    border-radius: ${cssVar.borderRadiusLG};
  `,
}));

export const flatGroupVariants = cva(flatGroupStyles.root, {
  defaultVariants: {
    variant: 'borderless',
  },
  variants: {
    variant: {
      borderless: flatGroupStyles.borderless,
      filled: flatGroupStyles.filled,
      outlined: flatGroupStyles.outlined,
    },
  },
});

export const footerStyles = createStaticStyles(({ css, cssVar }) => ({
  root: css`
    ${responsive.sm} {
      padding: 16px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
      background: ${cssVar.colorBgContainer};
    }
  `,
}));

export const submitFooterStyles = createStaticStyles(({ css, cssVar }) => ({
  floatFooter: css`
    position: fixed;
    z-index: 1000;
    inset-block-end: 24px;
    inset-inline-start: 50%;
    transform: translateX(-50%);

    width: max-content;
    padding: 8px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 48px;

    background: ${cssVar.colorBgContainer};
    box-shadow: ${cssVar.boxShadowSecondary};
  `,
  footer: css`
    ${responsive.sm} {
      margin-block-start: calc(-1 * ${cssVar.borderRadius});
      padding: 16px;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
      background: ${cssVar.colorBgContainer};
    }
  `,
}));

export const titleStyles = createStaticStyles(({ css, cssVar }) => ({
  content: css`
    position: relative;
    text-align: start;
  `,
  desc: css`
    display: block;

    font-size: 12px;
    font-weight: 400;
    line-height: 1.44;
    color: ${cssVar.colorTextDescription};
    word-wrap: break-word;
    white-space: pre-wrap;
  `,
  title: css`
    font-weight: 500;
    line-height: 1;
    color: ${cssVar.colorText};
  `,
}));

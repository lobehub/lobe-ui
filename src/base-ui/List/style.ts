import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  actions: css`
    position: absolute;
    inset-block-start: 50%;
    inset-inline-end: 8px;
    transform: translateY(-50%);

    display: none;
    gap: 4px;
    align-items: center;
  `,
  active: css`
    font-weight: 500;
    color: ${cssVar.colorText};
    background: ${cssVar.colorFillSecondary};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  body: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1px;

    min-width: 0;
  `,
  compact: css`
    gap: 2px;

    & > li > a,
    & > li > button {
      padding-inline: 8px;
    }
  `,
  danger: css`
    color: ${cssVar.colorError};

    &:hover {
      color: ${cssVar.colorError};
    }
  `,
  description: css`
    overflow: hidden;

    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    color: ${cssVar.colorTextDescription};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  disabled: css`
    cursor: not-allowed;
    opacity: 0.45;
  `,
  divider: css`
    height: 1px;
    margin-block: 4px;
    background: ${cssVar.colorBorderSecondary};
  `,
  extra: css`
    flex: none;
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  filled: css`
    padding: 4px;
    border-radius: ${cssVar.borderRadiusLG};
    background: ${cssVar.colorFillQuaternary};
  `,
  item: css`
    position: relative;

    &:hover > span:last-child,
    &:focus-within > span:last-child {
      display: inline-flex;
    }
  `,
  label: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  outlined: css`
    padding: 4px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 2px;

    margin: 0;
    padding: 0;

    list-style: none;
  `,
  row: css`
    ${focusRing};
    cursor: pointer;

    display: flex;
    gap: 12px;
    align-items: center;

    box-sizing: border-box;
    width: 100%;
    min-height: 32px;
    padding-block: 6px;
    padding-inline: 12px;
    border: 0;
    border-radius: ${cssVar.borderRadius};

    font: inherit;
    font-size: 14px;
    color: ${cssVar.colorTextSecondary};
    text-align: start;
    text-decoration: none;

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }
  `,
  showAction: css`
    & > span:last-child {
      display: inline-flex;
    }
  `,
}));

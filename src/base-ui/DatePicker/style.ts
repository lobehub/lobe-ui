import { createStaticStyles } from 'antd-style';

import { focusRing } from '@/base-ui/focusRing';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  band: css`
    background: ${cssVar.colorFillSecondary};
  `,
  bandEnd: css`
    background: linear-gradient(to left, transparent 50%, ${cssVar.colorFillSecondary} 50%);
  `,
  bandStart: css`
    background: linear-gradient(to right, transparent 50%, ${cssVar.colorFillSecondary} 50%);
  `,
  calendar: css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 266px;
  `,
  cell: css`
    display: flex;
    justify-content: center;
  `,
  day: css`
    ${focusRing};
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 34px;
    height: 34px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    font: inherit;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorText};

    background: none;

    &:hover:not(:disabled, [aria-pressed='true']) {
      background: ${cssVar.colorFillTertiary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-outside] {
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-today] {
      box-shadow: inset 0 0 0 1px ${cssVar.colorText};
    }

    &[aria-pressed='true'] {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
  footer: css`
    display: flex;
    justify-content: center;

    margin-block-start: 12px;
    padding-block-start: 12px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  grid: css`
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    row-gap: 2px;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-block-end: 4px;
  `,
  icon: css`
    display: inline-flex;
    flex: none;
    color: ${cssVar.colorTextTertiary};
  `,
  navGroup: css`
    display: flex;
    gap: 2px;
  `,
  placeholder: css`
    color: ${cssVar.colorTextPlaceholder};
  `,
  range: css`
    display: flex;
    gap: 28px;
  `,
  rangeHalf: css`
    min-width: 0;
    padding-block: 2px;

    &[data-active] {
      box-shadow: inset 0 -2px 0 ${cssVar.colorText};
    }
  `,
  rangeTrigger: css`
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;

    min-width: 0;
  `,
  tile: css`
    ${focusRing};
    cursor: pointer;

    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 999px;

    font: inherit;
    font-size: 14px;
    color: ${cssVar.colorText};

    background: none;

    &:hover:not(:disabled, [aria-pressed='true']) {
      background: ${cssVar.colorFillTertiary};
    }

    &:disabled {
      cursor: not-allowed;
      color: ${cssVar.colorTextQuaternary};
    }

    &[data-today] {
      box-shadow: inset 0 0 0 1px ${cssVar.colorText};
    }

    &[aria-pressed='true'] {
      font-weight: 600;
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorText};
    }
  `,
  tiles: css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px 4px;
    width: 266px;
  `,
  trigger: css`
    ${focusRing};
    cursor: pointer;

    display: flex;
    flex: 1;
    align-items: center;

    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;

    font: inherit;
    color: inherit;
    text-align: start;
    white-space: nowrap;

    background: none;

    &:disabled {
      cursor: not-allowed;
    }
  `,
  weekday: css`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
  `,
}));

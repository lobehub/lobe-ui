import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  body: css`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  `,
  connector: css`
    flex: 1;
    min-width: 16px;
    height: 1px;
    background: ${cssVar.colorBorderSecondary};

    li[data-status='finish'] > & {
      background: ${cssVar.colorPrimary};
    }
  `,
  description: css`
    font-size: 13px;
    line-height: 1.5;
    color: ${cssVar.colorTextSecondary};
  `,
  dot: css`
    & > li > span:first-child {
      width: 7px;
      height: 7px;
      margin-block-start: 8px;
      border: 0;

      background: ${cssVar.colorTextQuaternary};
    }

    & > li[data-status='process'] > span:first-child,
    & > li[data-status='finish'] > span:first-child {
      background: ${cssVar.colorPrimary};
    }
  `,
  horizontal: css`
    display: flex;
    gap: 8px;
    align-items: center;

    & > li {
      display: flex;
      flex: 1;
      gap: 8px;
      align-items: center;

      min-width: 0;
    }

    & > li:last-child {
      flex: none;
    }
  `,
  indicator: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    width: 22px;
    height: 22px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 50%;

    font-size: 12px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextDescription};

    li[data-status='process'] > & {
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorBgContainer};
      background: ${cssVar.colorPrimary};
    }

    li[data-status='finish'] > & {
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorPrimary};
    }

    li[data-status='error'] > & {
      border-color: ${cssVar.colorError};
      color: ${cssVar.colorError};
    }

    li[data-status='guide'] > & {
      color: ${cssVar.colorTextSecondary};
    }
  `,
  root: css`
    margin: 0;
    padding: 0;
    list-style: none;
  `,
  title: css`
    font-size: 14px;
    line-height: 22px;
    color: ${cssVar.colorTextDescription};
    white-space: nowrap;

    li[data-status='process'] &,
    li[data-status='finish'] &,
    li[data-status='guide'] & {
      color: ${cssVar.colorText};
    }

    li[data-status='process'] & {
      font-weight: 500;
    }

    li[data-status='error'] & {
      color: ${cssVar.colorError};
    }
  `,
  vertical: css`
    display: flex;
    flex-direction: column;

    & > li {
      position: relative;

      display: grid;
      grid-template-columns: auto minmax(0, 1fr);
      column-gap: 12px;

      padding-block-end: 18px;
    }

    & > li:last-child {
      padding-block-end: 0;
    }

    & > li > span[aria-hidden] {
      position: absolute;
      inset-block: 26px 4px;
      inset-inline-start: 11px;

      width: 1px;
      min-width: 0;
      height: auto;
    }

    & > li > div > div:first-child {
      white-space: normal;
    }
  `,
}));

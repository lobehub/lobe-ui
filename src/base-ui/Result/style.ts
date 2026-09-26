import { createStaticStyles, cssVar } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  extra: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    align-self: stretch;
    justify-content: center;

    margin-block-start: 10px;

    > :is(div, section, form) {
      flex: 1 1 100%;
    }
  `,
  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 72px;
    height: 72px;
    margin-block-end: 12px;
    border-radius: 50%;

    svg {
      width: 36px;
      height: 36px;
    }
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;

    padding-block: 16px;
    padding-inline: 8px;

    text-align: center;
  `,
  subTitle: css`
    max-width: 36ch;
    margin: 0;
    font-size: 13px;
    color: ${cssVar.colorTextTertiary};
  `,
  title: css`
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    text-wrap: balance;
  `,
}));

export const statusColor: Record<'success' | 'error' | 'warning', string> = {
  error: cssVar.colorError,
  success: cssVar.colorSuccess,
  warning: cssVar.colorWarning,
};

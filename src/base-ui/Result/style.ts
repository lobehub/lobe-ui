import { createStaticStyles, cssVar } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  extra: css`
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    margin-block-start: 10px;
  `,
  icon: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 56px;
    height: 56px;
    border-radius: 50%;
  `,
  root: css`
    display: flex;
    flex-direction: column;
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
    font-size: 16px;
    font-weight: 600;
    text-wrap: balance;
  `,
}));

export const statusColor: Record<'success' | 'error' | 'warning', string> = {
  error: cssVar.colorError,
  success: cssVar.colorSuccess,
  warning: cssVar.colorWarning,
};

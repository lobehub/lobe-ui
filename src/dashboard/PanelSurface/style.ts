import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css }) => ({
  body: css`
    --surface-pad-inline: 16px;
    --surface-pad-block: 16px;

    padding: 16px;
  `,
  bodySmall: css`
    --surface-pad-inline: 16px;
    --surface-pad-block: 12px;

    padding-block: 12px;
    padding-inline: 16px;
  `,
  loadingBody: css`
    padding-block: 4px 8px;
  `,
}));

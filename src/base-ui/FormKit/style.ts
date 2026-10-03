import { createStaticStyles } from 'antd-style';

export const fieldKitStyles = createStaticStyles(({ css, cssVar }) => ({
  extra: css`
    font-size: 12px;
    color: ${cssVar.colorTextDescription};
  `,
  required: css`
    margin-inline-start: 4px;
    color: ${cssVar.colorError};
  `,
}));

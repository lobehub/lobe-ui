import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  action: css`
    margin-block-start: 8px;
  `,
  dashed: css`
    padding-block: 24px;
    padding-inline: 16px;
    border: 1px dashed ${cssVar.colorBorder};
    border-radius: ${cssVar.borderRadiusLG};
  `,
  dashedClickable: css`
    cursor: pointer;
    transition:
      border-color 0.15s,
      background 0.15s;

    &:hover {
      border-color: ${cssVar.colorTextTertiary};
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  extraPage: css`
    display: flex;
    gap: 8px;
    margin-block-start: 14px;
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;

    padding-block: 16px;
    padding-inline: 8px;
  `,
  rootPage: css`
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 8px;
  `,
}));

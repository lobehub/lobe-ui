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

    transition:
      border-color 0.15s,
      background 0.15s;

    &:hover {
      border-color: ${cssVar.colorTextTertiary};
      background: ${cssVar.colorFillQuaternary};
    }
  `,
  dashedClickable: css`
    cursor: pointer;
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
  rootStack: css`
    padding-block: 12px;
    padding-inline: 8px;
  `,
  stack: css`
    position: relative;
    width: 48px;
    height: 40px;
  `,
  stackCard: css`
    position: absolute;
    inset-inline: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    height: 28px;
    border: 1px solid ${cssVar.colorBorder};
    border-radius: 5px;

    color: ${cssVar.colorTextQuaternary};

    background: ${cssVar.colorBgContainer};

    &:nth-child(1) {
      inset-block-start: 0;
      scale: 0.8;
      opacity: 0.4;
    }

    &:nth-child(2) {
      inset-block-start: 6px;
      scale: 0.9;
      opacity: 0.7;
    }

    &:nth-child(3) {
      inset-block-start: 12px;
    }
  `,
}));

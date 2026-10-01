import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bordered: css`
    box-shadow: inset 0 0 0 1px ${cssVar.colorBorderSecondary};
  `,
  icon: css`
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    transform: translate(-50%, -50%);

    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    box-shadow: 0 0 0 4px #fff;
  `,
  overlay: css`
    position: absolute;
    inset: 0;

    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;

    border-radius: 16px;

    color: #080808;

    background: rgb(255 255 255 / 95%);
  `,
  overlayTitle: css`
    font-size: 17px;
    font-weight: 600;
  `,
  root: css`
    position: relative;
    display: inline-flex;
    padding: 16px;
    border-radius: 16px;
  `,
}));

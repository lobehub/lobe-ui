import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  dashed: css`
    border-style: dashed;

    &::before,
    &::after {
      border-block-start-style: dashed;
    }
  `,
  horizontal: css`
    flex-shrink: 0;

    width: 100%;
    height: 0;
    margin: 0;
    border: 0;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  text: css`
    flex: none;
    font-size: 12px;
    line-height: 1.5;
    color: ${cssVar.colorTextDescription};
  `,
  vertical: css`
    display: inline-block;
    flex-shrink: 0;
    align-self: center;

    width: 0;
    height: 1em;
    margin: 0;
    border: 0;
    border-inline-start: 1px solid ${cssVar.colorBorderSecondary};

    vertical-align: middle;
  `,
  withText: css`
    display: flex;
    gap: 12px;
    align-items: center;

    width: 100%;
    margin: 0;

    &::before,
    &::after {
      content: '';
      flex: 1;
      border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    }
  `,
}));

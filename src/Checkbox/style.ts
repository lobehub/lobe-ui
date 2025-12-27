import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => {
  return {
    checked: css`
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorBgLayout};
      background-color: ${cssVar.colorPrimary};
    `,
    disabled: css`
      cursor: not-allowed;

      border-color: ${cssVar.colorFill};

      color: ${cssVar.colorText};

      opacity: 0.25;
      background-color: ${cssVar.colorFill};
    `,
    indeterminate: css`
      border-color: ${cssVar.colorPrimary};
      color: ${cssVar.colorBgLayout};
      background-color: ${cssVar.colorPrimary};
    `,
    root: css`
      cursor: pointer;
      display: inline-flex;
    `,
  };
});

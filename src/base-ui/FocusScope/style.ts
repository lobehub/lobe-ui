import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  debugOutline: css`
    &[data-scope-active] {
      outline: 2px dashed color-mix(in srgb, ${cssVar.colorInfo} 60%, transparent);
      outline-offset: -2px;
    }
  `,
  root: css`
    position: relative;
    outline: none;
  `,
}));

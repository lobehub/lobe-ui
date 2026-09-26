import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  button: css`
    cursor: pointer;

    padding: 0;
    border: 0;

    font: inherit;
    color: inherit;

    background: none;
  `,
  item: css`
    display: flex;
    gap: 4px;
    align-items: center;
    color: ${cssVar.colorTextDescription};

    &[aria-current='page'] {
      font-weight: 500;
      color: ${cssVar.colorText};
    }
  `,
  link: css`
    border-radius: 4px;
    color: inherit;
    text-decoration: none;
  `,
  list: css`
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;

    margin: 0;
    padding: 0;

    list-style: none;
  `,
  root: css`
    font-size: 14px;
    line-height: 1.5;

    & a:hover,
    & button:hover {
      color: ${cssVar.colorText};
    }
  `,
  separator: css`
    display: inline-flex;
    align-items: center;
    color: ${cssVar.colorTextQuaternary};
  `,
}));

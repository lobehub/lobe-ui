import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  ancestor: css`
    color: ${cssVar.colorTextSecondary};
    white-space: nowrap;
  `,
  link: css`
    color: ${cssVar.colorTextSecondary};
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: ${cssVar.colorText};
    }
  `,
  optional: css`
    display: flex;
    flex: none;
    gap: 6px;
    align-items: center;

    ${responsive.mobile} {
      /* Outranks the root's direct-child span rule. */
      &&& {
        display: none;
      }
    }
  `,
  page: css`
    overflow: hidden;

    min-inline-size: 0;

    font-weight: 600;
    color: ${cssVar.colorText};
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  root: css`
    overflow: hidden;
    display: flex;
    flex: 1;
    align-items: center;

    min-inline-size: 0;

    font-size: ${cssVar.fontSize};
    line-height: 1.4;

    > span {
      display: flex;
      align-items: center;
      min-inline-size: 0;
    }
  `,
  separator: css`
    flex: none;
    margin-inline: 8px;
    color: ${cssVar.colorTextQuaternary};
  `,
}));

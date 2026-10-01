import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  link: css`
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    font-size: 14px;
    line-height: 1.4;
    color: ${cssVar.colorTextSecondary};
    overflow-wrap: anywhere;

    transition: color 0.15s ease;

    &:hover {
      color: ${cssVar.colorText};
    }

    &[aria-current='location'] {
      font-weight: 500;
      color: ${cssVar.colorText};
    }

    &:focus-visible {
      border-radius: 4px;
      outline: 2px solid ${cssVar.colorText};
      outline-offset: 2px;
    }
  `,
  list: css`
    display: flex;
    flex-direction: column;
    gap: 8px;

    margin: 0;
    padding: 0;

    list-style: none;

    & & {
      margin-block-start: 8px;
      padding-inline-start: 12px;
    }
  `,
}));

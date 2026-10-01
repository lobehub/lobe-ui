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
    padding-block: 0;
    padding-inline: 14px 0;
    border-inline-start: 1px solid ${cssVar.colorBorderSecondary};

    list-style: none;

    & & {
      margin-block-start: 8px;
      padding-inline-start: 12px;
      border-inline-start: none;

      a {
        font-size: 13px;
      }
    }
  `,
  marker: css`
    pointer-events: none;

    position: absolute;
    inset-inline-start: -1px;

    width: 2px;
    border-radius: 2px;

    background: ${cssVar.colorText};

    transition:
      inset-block-start 0.2s ${cssVar.motionEaseOut},
      height 0.2s ${cssVar.motionEaseOut};

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  `,
  root: css`
    position: relative;
  `,
}));

import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  dragger: css`
    cursor: pointer;

    display: flex;
    flex-direction: column;
    gap: 6px;
    align-items: center;
    justify-content: center;

    padding-block: 28px;
    padding-inline: 20px;
    border: 1px dashed ${cssVar.colorBorder};
    border-radius: ${cssVar.borderRadiusLG};

    text-align: center;

    background: ${cssVar.colorFillQuaternary};

    transition:
      border-color 0.15s,
      background 0.15s;

    &:hover {
      border-color: ${cssVar.colorTextTertiary};
      background: ${cssVar.colorFillTertiary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  draggerDescription: css`
    font-size: 12px;
    color: ${cssVar.colorTextTertiary};
  `,
  draggerIcon: css`
    color: ${cssVar.colorTextTertiary};
  `,
  draggerOver: css`
    border-color: ${cssVar.colorTextTertiary};
    background: ${cssVar.colorFillTertiary};
  `,
  draggerTitle: css`
    font-weight: 500;
    color: ${cssVar.colorText};
  `,
  trigger: css`
    cursor: pointer;
    display: inline-block;

    &[aria-disabled='true'] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimary};
      outline-offset: 2px;
    }
  `,
}));

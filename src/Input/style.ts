import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }, { type }: { type: 'ghost' | 'block' }) => ({
  input: css`
    position: relative;

    max-width: 100%;
    height: 36px;
    padding: 0 12px;

    background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
    border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};

    transition: background-color 100ms ${token.motionEaseOut};

    input {
      background: transparent;
    }

    &:hover {
      background-color: ${token.colorFillTertiary};
    }
  `,
  textarea: css`
    position: relative;

    max-width: 100%;
    padding: 8px 12px;

    background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
    border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};

    transition: background-color 100ms ${token.motionEaseOut};

    textarea {
      background: transparent;
    }

    &:hover {
      background-color: ${token.colorFillTertiary};
    }
  `,
}));

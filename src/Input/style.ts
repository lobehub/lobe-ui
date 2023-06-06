import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ cx, css, token }, { type }: { type: 'ghost' | 'block' }) => {
    const typeStylish = css`
      background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
    `;

    return {
      input: cx(
        typeStylish,
        css`
          position: relative;

          max-width: 100%;
          height: 36px;
          padding: 0 12px;

          transition: background-color 100ms ${token.motionEaseOut};

          input {
            background: transparent;
          }

          &:hover {
            background-color: ${token.colorFillTertiary};
          }
        `,
      ),
      textarea: cx(
        typeStylish,
        css`
          position: relative;
          max-width: 100%;
          padding: 8px 12px;
          transition: background-color 100ms ${token.motionEaseOut};

          textarea {
            background: transparent;
          }

          &:hover {
            background-color: ${token.colorFillTertiary};
          }
        `,
      ),
    };
  },
);

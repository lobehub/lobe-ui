import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ cx, css, token }, { type }: { type: 'ghost' | 'block' | 'pure' }) => {
    const typeStylish = css`
      background-color: ${type === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${type === 'block' ? 'transparent' : token.colorBorder};
      transition: background-color 100ms ${token.motionEaseOut},
        border-color 200ms ${token.motionEaseOut};

      &:hover {
        background-color: ${token.colorFillTertiary};
      }

      &:focus {
        border-color: ${token.colorTextQuaternary};
      }

      &.ant-input-affix-wrapper-focused {
        border-color: ${token.colorTextQuaternary};
      }
    `;

    return {
      input: cx(
        type !== 'pure' && typeStylish,
        css`
          position: relative;
          max-width: 100%;
          height: ${type === 'pure' ? 'unset' : '36px'};
          padding: ${type === 'pure' ? '0' : '0 12px'};

          input {
            background: transparent;
          }
        `,
      ),
      textarea: cx(
        type !== 'pure' && typeStylish,
        css`
          position: relative;
          max-width: 100%;
          padding: ${type === 'pure' ? '0' : '8px 12px'};

          textarea {
            background: transparent;
          }
        `,
      ),
    };
  },
);

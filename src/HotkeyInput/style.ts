import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ cx, css, token, prefixCls }, { variant }: { variant: 'ghost' | 'block' | 'pure' }) => {
    const typeStylish = css`
      background-color: ${variant === 'block' ? token.colorFillTertiary : 'transparent'};
      border: 1px solid ${variant === 'block' ? 'transparent' : token.colorBorder};
      border-radius: ${token.borderRadius}px;
      transition:
        background-color 100ms ${token.motionEaseOut},
        border-color 200ms ${token.motionEaseOut};

      &:hover {
        background-color: ${token.colorFillTertiary};
      }

      &:focus {
        border-color: ${token.colorTextQuaternary};
      }

      &.${prefixCls}-input-affix-wrapper-focused {
        border-color: ${token.colorTextQuaternary};
      }
    `;

    return {
      errorText: css`
        font-size: 12px;
        color: ${token.colorError};
      `,
      hiddenInput: css`
        cursor: text;

        position: absolute;
        z-index: -1;
        inset-block-start: 0;
        inset-inline-start: 0;

        width: 100%;
        height: 100%;

        opacity: 0;
      `,
      input: cx(
        variant !== 'pure' && typeStylish,
        css`
          position: relative;
          max-width: 100%;
          height: ${variant === 'pure' ? 'unset' : '36px'};
          padding: ${variant === 'pure' ? '0' : '0 12px'};
        `,
      ),
      inputDisabled: cx(
        css`
          cursor: not-allowed;
          opacity: 0.65;
        `,
        variant !== 'pure' &&
          css`
            background: ${token.colorFillTertiary};
          `,
      ),
      inputError: css`
        border: 1px solid ${token.colorError};
      `,
      inputFocused: cx(
        variant !== 'pure' &&
          css`
            border-color: ${token.colorTextQuaternary};
          `,
      ),
      placeholder: css`
        color: ${token.colorTextDescription};
      `,
    };
  },
);

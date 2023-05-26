import { createStyles } from 'antd-style';
import { rgba } from 'polished';

export const useStyles = createStyles(({ css, token }, { type }: { type: 'ghost' | 'block' }) => ({
  search: css`
    position: relative;
    max-width: 100%;
    height: 36px;
  `,
  input: css`
    position: relative;
    height: inherit;
    padding: 0 8px 0 12px;
    transition: background-color 100ms ${token.motionEaseOut};

    ${type === 'block'
      ? css`
          background-color: ${rgba(token.colorBgElevated, 0.6)} !important;
        `
      : css`
          background: transparent !important;
          border: 1px solid ${token.colorBorder} !important;
        `}

    &:hover {
      background-color: ${token.colorFillTertiary} !important;
    }

    input {
      background: transparent;
    }
  `,
  tag: css`
    position: absolute;
    z-index: 5;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  `,

  icon: css`
    color: ${token.colorTextPlaceholder};
  `,
}));

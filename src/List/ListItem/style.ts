import { createStyles } from 'antd-style';

import { convertAlphaToSolid } from '@/utils/colorUtils';

export const useStyles = createStyles(({ css, cx, token }) => {
  const textOverlay = css`
    --overlay-background: ${token.colorBgContainer};

    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;

    width: 32px;
    height: 44px;

    background: linear-gradient(to right, transparent, var(--overlay-background));
  `;

  const overlayColor = convertAlphaToSolid(token.colorFillContent, token.colorBgContainer);

  const hoverOverlay = css`
    .${cx(textOverlay)} {
      --overlay-background: ${overlayColor};
    }
  `;

  return {
    active: css`
      color: ${token.colorText};
      background: ${token.colorFillContent};

      ${hoverOverlay}
    `,
    container: css`
      cursor: pointer;
      color: ${token.colorTextTertiary};

      &:hover {
        background: ${token.colorFillContent};
        ${hoverOverlay}
      }
    `,

    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
    `,

    desc: css`
      overflow: hidden;

      width: 100%;
      margin-top: 2px;

      font-size: 12px;
      color: ${token.colorTextDescription};
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    textOverlay,
    time: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,
    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
  };
});

import { createStyles } from 'antd-style';

export const useStyles = createStyles(
  ({ token, prefixCls, css, cx }, { rowNum, hasLink }: { hasLink?: boolean; rowNum: number }) => {
    const prefix = `${prefixCls}-features`;
    const coverCls = `${prefix}-cover`;
    const descCls = `${prefix}-description`;
    const titleCls = `${prefix}-title`;
    const imgCls = `${prefix}-img`;

    const scaleUnit = 20;

    const genSize = (size: number) => css`
      width: ${size}px;
      height: ${size}px;
      font-size: ${size * (22 / 24)}px;
    `;

    const withTransition = css`
      transition: all ${token.motionDurationSlow} ${token.motionEaseInOutCirc};
    `;

    return {
      cell: css`
        overflow: hidden;
      `,

      container: cx(
        withTransition,
        css`
          position: relative;
          z-index: 1;

          overflow: hidden;

          height: 228px;
          max-height: 228px;
          padding: 24px;

          p {
            font-size: 16px;
            line-height: 1.2;
            text-align: start;
            word-break: break-word;
          }

          &:hover {
            .${coverCls} {
              width: 100%;
              height: ${scaleUnit * rowNum}px;
              padding: 0;
              background: ${token.colorFillContent};
            }

            .${imgCls} {
              ${genSize(100)};
            }

            .${descCls} {
              position: absolute;
              visibility: hidden;
              opacity: 0;
            }

            .${titleCls} {
              font-size: ${hasLink ? 14 : 20}px;
            }
          }
        `,
      ),
      desc: cx(
        descCls,
        withTransition,
        css`
          pointer-events: none;
          color: ${token.colorTextSecondary};

          quotient {
            position: relative;

            display: block;

            margin-block: 12px;
            margin-inline: 0;
            padding-inline-start: 12px;

            color: ${token.colorTextDescription};
          }
        `,
      ),
      img: cx(
        imgCls,
        withTransition,
        css`
          ${genSize(20)};
          color: ${token.colorText};
        `,
      ),

      imgContainer: cx(
        coverCls,
        withTransition,
        css`
          ${genSize(24)};
          padding: 4px;
          opacity: 0.8;
          border-radius: ${token.borderRadius}px;
        `,
      ),

      link: css`
        ${withTransition};
        margin-block-start: 24px;
      `,

      title: cx(
        titleCls,
        withTransition,
        css`
          pointer-events: none;

          margin-block: 16px;
          margin-inline: 0;

          font-size: 20px;
          line-height: ${token.lineHeightHeading3};
          color: ${token.colorText};
        `,
      ),
    };
  },
);

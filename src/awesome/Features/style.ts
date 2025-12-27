import { createStaticStyles } from 'antd-style';

const prefixCls = 'ant';

export const styles = createStaticStyles(({ css, cssVar }) => {
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
    transition: all ${cssVar.motionDurationSlow} ${cssVar.motionEaseInOutCirc};
  `;

  return {
    cell: css`
      overflow: hidden;
    `,

    container: css`
      ${withTransition}
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
          height: calc(var(--features-row-num, 7) * ${scaleUnit}px);
          padding: 0;
          background: ${cssVar.colorFillContent};
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
          font-size: var(--features-title-hover-size, 20px);
        }
      }
    `,

    containerHasLink: css`
      ${withTransition}
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
          height: calc(var(--features-row-num, 7) * ${scaleUnit}px);
          padding: 0;
          background: ${cssVar.colorFillContent};
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
          font-size: 14px;
        }
      }
    `,
    desc: css`
      ${descCls}
      ${withTransition}
      pointer-events: none;
      color: ${cssVar.colorTextSecondary};

      quotient {
        position: relative;

        display: block;

        margin-block: 12px;
        margin-inline: 0;
        padding-inline-start: 12px;

        color: ${cssVar.colorTextDescription};
      }
    `,
    img: css`
      ${imgCls}
      ${withTransition}
      ${genSize(20)};
      color: ${cssVar.colorText};
    `,

    imgContainer: css`
      ${coverCls}
      ${withTransition}
      ${genSize(24)};
      padding: 4px;
      opacity: 0.8;
      border-radius: ${cssVar.borderRadius};
    `,

    link: css`
      ${withTransition};
      margin-block-start: 24px;
    `,

    title: css`
      ${titleCls}
      ${withTransition}
      pointer-events: none;

      margin-block: 16px;
      margin-inline: 0;

      font-size: 20px;
      line-height: ${cssVar.lineHeightHeading3};
      color: ${cssVar.colorText};
    `,
  };
});

import { createStaticStyles, keyframes } from 'antd-style';
import { cva } from 'class-variance-authority';

const shimmer = keyframes`
  from {
    background-position: -80px 0;
  }
  to {
    background-position: 200px 0;
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  bar: css`
    height: 100%;
    border-radius: 999px;
    transition: width 0.3s;
  `,
  barActive: css`
    background-image: linear-gradient(
      90deg,
      transparent,
      color-mix(in srgb, ${cssVar.colorWhite} 35%, transparent),
      transparent
    );
    background-size: 80px 100%;
    animation: ${shimmer} 1.2s linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  blockLg: css`
    height: 12px;
  `,
  blockMd: css`
    height: 8px;
  `,
  blockSm: css`
    height: 4px;
  `,
  circleInfo: css`
    position: absolute;
    font-family: ${cssVar.fontFamilyCode};
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorText};
  `,
  circleRoot: css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `,
  circleSvg: css`
    rotate: -90deg;
  `,
  circleTrack: css`
    fill: none;
    stroke: ${cssVar.colorFillTertiary};
  `,
  insetBarWrapper: css`
    position: relative;
    overflow: hidden;
    height: 100%;
    border-radius: 999px;
  `,
  insetCap: css`
    position: absolute;
    inset-block: 0;
    inset-inline-end: 0;

    width: 4px;
    border-radius: 999px;

    opacity: 0.6;
    background: ${cssVar.colorBgContainer};
  `,
  insetTrack: css`
    padding: 2px;
    border-radius: 999px;
    background: ${cssVar.colorFillTertiary};
  `,
  lineLg: css`
    height: 6px;
  `,
  lineMd: css`
    height: 4px;
  `,
  lineMeta: css`
    display: flex;
    gap: 12px;
    align-items: baseline;
    justify-content: space-between;

    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextSecondary};
  `,
  lineRoot: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  `,
  lineSm: css`
    height: 2px;
  `,
  lineTrack: css`
    overflow: hidden;
    border-radius: 999px;
    background: ${cssVar.colorFillTertiary};
  `,
  lineValue: css`
    font-family: ${cssVar.fontFamilyCode};
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorText};
  `,
  rowInfo: css`
    min-width: 3.5ch;

    font-family: ${cssVar.fontFamilyCode};
    font-size: ${cssVar.fontSizeSM};
    font-variant-numeric: tabular-nums;
    color: ${cssVar.colorTextSecondary};
    text-align: end;
  `,
  rowRoot: css`
    display: flex;
    flex: 1;
    gap: 10px;
    align-items: center;

    width: 100%;
  `,
  rowTrack: css`
    flex: 1;
  `,
  segment: css`
    flex: 1;
    border-radius: 1px;
    background: ${cssVar.colorFillTertiary};
  `,
  segmentOn: css`
    background: ${cssVar.colorPrimary};
  `,
  segments: css`
    display: flex;
    gap: 2px;
  `,
}));

export const trackHeight = cva(undefined, {
  compoundVariants: [
    { className: styles.lineSm, family: 'line', size: 'small' },
    { className: styles.lineMd, family: 'line', size: 'middle' },
    { className: styles.lineLg, family: 'line', size: 'large' },
    { className: styles.blockSm, family: 'block', size: 'small' },
    { className: styles.blockMd, family: 'block', size: 'middle' },
    { className: styles.blockLg, family: 'block', size: 'large' },
  ],
  defaultVariants: {
    family: 'line',
    size: 'middle',
  },
  variants: {
    family: {
      block: null,
      line: null,
    },
    size: {
      large: null,
      middle: null,
      small: null,
    },
  },
});

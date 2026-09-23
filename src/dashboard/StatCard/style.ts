import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  badge: css`
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    inline-size: 24px;
    block-size: 24px;
    border: 1px solid ${cssVar.colorFillSecondary};
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: ${cssVar.colorFillTertiary};
  `,
  body: css`
    position: relative;
    z-index: 1;
  `,
  copy: css`
    flex-wrap: nowrap;
    min-inline-size: 0;
  `,
  delta: css`
    display: inline-flex;
    gap: 2px;
    align-items: center;

    font-size: ${cssVar.fontSizeSM};
    font-variant-numeric: tabular-nums;
  `,
  deltaDown: css`
    color: ${cssVar.colorError};
  `,
  deltaFlat: css`
    color: ${cssVar.colorTextTertiary};
  `,
  deltaUp: css`
    color: ${cssVar.colorSuccess};
  `,
  frame: css`
    &&& {
      border-color: ${cssVar.colorBorderSecondary};
    }
  `,
  gray: css`
    &::before {
      background: linear-gradient(
        to bottom,
        ${cssVar.colorBgElevated} 0%,
        color-mix(in srgb, ${cssVar.colorText} 4%, ${cssVar.colorBgElevated}) 100%
      );
    }
  `,
  hint: css`
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextTertiary};
  `,
  label: css`
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextSecondary};
  `,
  lift: css`
    display: flex;
    min-inline-size: 0;
    border-radius: ${cssVar.borderRadiusLG};
    box-shadow: ${cssVar.boxShadowTertiary};
  `,
  metricFoot: css`
    margin-block-start: 14px;
  `,
  metricHint: css`
    && {
      font-size: ${cssVar.fontSize};
      color: ${cssVar.colorText};
    }
  `,
  metricLabel: css`
    && {
      font-size: ${cssVar.fontSize};
      font-weight: 500;
      color: ${cssVar.colorText};
    }
  `,
  metricValue: css`
    && {
      margin-block-start: 6px;

      font-size: ${cssVar.fontSizeHeading2};
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      line-height: 1.05;
      color: ${cssVar.colorText};
    }
  `,
  root: css`
    position: relative;

    overflow: hidden;
    flex: 1;

    min-inline-size: 0;
    padding: 16px;
  `,
  value: css`
    font-size: ${cssVar.fontSizeHeading2};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    line-height: 1.2;
    color: ${cssVar.colorText};

    ${responsive.mobile} {
      font-size: ${cssVar.fontSizeHeading3};
    }
  `,
  wash: css`
    isolation: isolate;

    &::before {
      pointer-events: none;
      content: '';

      position: absolute;
      z-index: 0;
      inset: 0;
    }
  `,
}));

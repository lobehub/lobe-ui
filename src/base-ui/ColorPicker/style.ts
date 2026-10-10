import { focusRing } from '@/base-ui/focusRing';
import { createStaticStyles } from '@/styles';

const checker = (color: string) => `
  background-image:
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%),
    linear-gradient(45deg, ${color} 25%, transparent 25%, transparent 75%, ${color} 75%);
  background-position: 0 0, 4px 4px;
  background-size: 8px 8px;
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  alphaField: css`
    flex: none;
    width: 76px;
  `,
  alphaTrack: css`
    height: 10px;
    border-radius: 999px;

    background-image:
      linear-gradient(to right, transparent, var(--lobe-color-picker-alpha)),
      linear-gradient(
        45deg,
        ${cssVar.colorFillSecondary} 25%,
        transparent 25%,
        transparent 75%,
        ${cssVar.colorFillSecondary} 75%
      ),
      linear-gradient(
        45deg,
        ${cssVar.colorFillSecondary} 25%,
        transparent 25%,
        transparent 75%,
        ${cssVar.colorFillSecondary} 75%
      );
    background-position:
      0 0,
      0 0,
      4px 4px;
    background-size:
      100% 100%,
      8px 8px,
      8px 8px;
  `,
  hexRow: css`
    display: flex;
    gap: 6px;

    & > * {
      min-width: 0;
    }
  `,
  hidden: css`
    background: transparent !important;
  `,
  hueTrack: css`
    height: 10px;
    border-radius: 999px;
    background: linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  `,
  panel: css`
    display: flex;
    flex-direction: column;
    gap: 14px;
    width: 240px;
  `,
  preset: css`
    ${focusRing};
    cursor: pointer;

    width: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    &[aria-pressed='true'] {
      box-shadow:
        0 0 0 2px ${cssVar.colorBgElevated},
        0 0 0 4px ${cssVar.colorText};
    }
  `,
  presets: css`
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    padding-block-start: 14px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
  `,
  saturation: css`
    ${focusRing};
    touch-action: none;
    cursor: crosshair;

    position: relative;

    height: 164px;
    border-radius: 12px;
  `,
  swatch: css`
    ${checker(cssVar.colorFillSecondary)};
    overflow: hidden;
    display: inline-flex;
    flex: none;

    border-radius: 50%;

    box-shadow: inset 0 0 0 1px ${cssVar.colorFillSecondary};

    & > span {
      flex: 1;
    }
  `,
  swatchButton: css`
    ${focusRing};
    cursor: pointer;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 50%;

    background: none;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `,
  textTrigger: css`
    cursor: pointer;
    width: auto;
  `,
  thumb: css`
    position: absolute;

    box-sizing: border-box;
    width: 18px;
    height: 18px;
    margin-block: -9px 0;
    margin-inline: -9px 0;
    border: 3px solid #fff;
    border-radius: 50%;

    box-shadow:
      0 0 0 1px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 0 0 / 25%);
  `,
  sliderThumb: css`
    width: 18px !important;
    height: 18px !important;
    border: 3px solid #fff !important;

    background: transparent !important;
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 12%),
      0 2px 6px rgb(0 0 0 / 25%) !important;
  `,
  summary: css`
    display: flex;
    gap: 12px;
    align-items: center;
  `,
  value: css`
    font-family: ${cssVar.fontFamilyCode};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  `,
}));

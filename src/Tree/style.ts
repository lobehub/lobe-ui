import { focusRing } from '@/internal/focusRing';
import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  checkbox: css`
    margin-inline-end: 8px;
  `,
  guide: css`
    pointer-events: none;

    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;

    overflow: visible;

    height: 100%;

    path {
      fill: none;
      stroke: ${cssVar.colorBorderSecondary};
      stroke-linecap: round;
      stroke-width: 1;
    }
  `,
  icon: css`
    display: inline-flex;
    flex: none;
    align-items: center;

    margin-inline-end: 6px;

    color: ${cssVar.colorTextSecondary};
  `,
  node: css`
    position: relative;

    display: flex;
    align-items: center;

    border-radius: ${cssVar.borderRadius};

    color: ${cssVar.colorText};

    outline: none;
    ${focusRing}
  `,
  nodeBlock: css`
    cursor: pointer;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    &[aria-selected='true'] {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  nodeDisabled: css`
    cursor: not-allowed;
    color: ${cssVar.colorTextDisabled};

    &:hover {
      background: transparent;
    }
  `,
  panel: css`
    overflow: hidden;
    height: var(--collapsible-panel-height);
    transition: height 200ms ${cssVar.motionEaseOut};

    &[data-starting-style],
    &[data-ending-style] {
      height: 0;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  root: css`
    user-select: none;
    display: flex;
    flex-direction: column;
    outline: none;
  `,
  switcher: css`
    cursor: pointer;

    display: grid;
    flex: none;
    place-items: center;

    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextSecondary};

    background: none;

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillSecondary};
    }

    svg {
      transition: transform 200ms ${cssVar.motionEaseOut};
    }

    [aria-expanded='true'] > & svg {
      transform: rotate(90deg);
    }

    @media (prefers-reduced-motion: reduce) {
      svg {
        transition-duration: 0s;
      }
    }
  `,
  switcherLeaf: css`
    pointer-events: none;
    visibility: hidden;
  `,
  title: css`
    overflow: hidden;
    display: inline-flex;
    gap: 6px;
    align-items: center;

    min-width: 0;
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: ${cssVar.borderRadiusSM};

    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  titleBlock: css`
    flex: 1;
  `,
  titleInline: css`
    cursor: pointer;

    &:hover {
      background: ${cssVar.colorFillTertiary};
    }

    [aria-selected='true'] > & {
      background: ${cssVar.colorFillSecondary};
    }

    [aria-disabled='true'] > & {
      cursor: not-allowed;
      background: transparent;
    }
  `,
}));

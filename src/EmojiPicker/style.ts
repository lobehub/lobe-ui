import { createStaticStyles } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  picker: css`
    position: relative;

    em-emoji-picker {
      --rgb-accent: var(--emoji-picker-rgb-accent, 0, 0, 0);
      --shadow: none;
      --rgb-background: var(--emoji-picker-rgb-background, 255, 255, 255);
      --border-radius: 0;
    }
  `,
  popover: css`
    overflow: hidden;
    padding: 0;
  `,
  positioner: css`
    width: fit-content !important;
  `,
  root: css`
    position: relative;
    transition: background 150ms ${cssVar.motionEaseOut};

    &:hover {
      background: ${cssVar.colorFillSecondary};
    }
  `,
  tab: css`
    && {
      width: 32px;
      height: 32px;
      padding: 0;
      border-radius: ${cssVar.borderRadius};

      transition: background-color 100ms ease-out;
    }

    &&:hover:not([data-disabled]) {
      background: ${cssVar.colorFillTertiary};
    }
  `,
  tabs: css`
    border-block-end: 1px solid ${cssVar.colorBorderSecondary};
  `,
  tabsIndicator: css`
    && {
      height: 3px;
      border-start-start-radius: 3px;
      border-start-end-radius: 3px;
    }
  `,
  tabsList: css`
    && {
      gap: 8px;
      padding: 4px;
      box-shadow: none;
    }
  `,
  tabsRoot: css`
    && {
      width: auto;
    }
  `,
}));

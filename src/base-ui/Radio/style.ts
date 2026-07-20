import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  indicator: css`
    display: block;
    flex: none;
    border-radius: 50%;
    background: currentcolor;
  `,
  label: css`
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    align-items: center;

    &:has([data-disabled]) {
      cursor: not-allowed;
    }
  `,
  root: css`
    cursor: pointer;

    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;

    margin: 0;
    padding: 0;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 50%;

    color: ${cssVar.colorBgLayout};

    background: ${cssVar.colorBgContainer};
    outline: none;

    transition:
      background 150ms ${cssVar.motionEaseOut},
      border-color 150ms ${cssVar.motionEaseOut};

    &:hover:not([data-disabled], [data-checked]) {
      border-color: ${cssVar.colorBorder};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &[data-checked] {
      border-color: var(--lobe-radio-bg, ${cssVar.colorPrimary});
      background: var(--lobe-radio-bg, ${cssVar.colorPrimary});
    }

    &[data-disabled] {
      cursor: not-allowed;

      border-color: ${cssVar.colorFill};

      color: ${cssVar.colorText};

      opacity: 0.25;
      background: ${cssVar.colorFill};
    }
  `,
}));

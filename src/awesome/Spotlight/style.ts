import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  spotlightDark: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    border-radius: inherit;

    opacity: var(--spotlight-opacity, 0.1);
    background: radial-gradient(
      var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0),
      ${cssVar.colorText},
      transparent
    );

    transition: all 0.2s;
  `,

  spotlightDarkOutside: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    border-radius: inherit;

    opacity: 0;
    background: radial-gradient(
      var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0),
      ${cssVar.colorText},
      transparent
    );

    transition: all 0.2s;
  `,

  spotlightLight: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    border-radius: inherit;

    opacity: var(--spotlight-opacity, 0.1);
    background: radial-gradient(
      var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0),
      #fff,
      ${cssVar.colorTextQuaternary}
    );

    transition: all 0.2s;
  `,

  spotlightLightOutside: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    border-radius: inherit;

    opacity: 0;
    background: radial-gradient(
      var(--spotlight-size, 64px) circle at var(--spotlight-x, 0) var(--spotlight-y, 0),
      #fff,
      ${cssVar.colorTextQuaternary}
    );

    transition: all 0.2s;
  `,
}));

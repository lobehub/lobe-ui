import { createStaticStyles } from 'antd-style';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  aside: css`
    position: relative;

    flex: none;

    box-sizing: border-box;
    inline-size: 50%;
    min-inline-size: 0;
    max-inline-size: 50%;

    background: ${cssVar.colorFillSecondary};

    ${responsive.laptop} {
      display: none;
    }
  `,
  asideCopy: css`
    pointer-events: none;

    position: absolute;
    z-index: 2;
    inset-block-end: 64px;
    inset-inline: 40px;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  asideKicker: css`
    margin: 0;

    font-size: ${cssVar.fontSize};
    line-height: 1.4;
    color: #fff;

    opacity: 0.82;
  `,
  asideLine: css`
    margin: 0;

    font-size: ${cssVar.fontSizeHeading2};
    font-weight: 600;
    line-height: 1.25;
    color: #fff;
    letter-spacing: -0.02em;
  `,
  asidePanel: css`
    position: absolute;
    inset: 8px;

    overflow: hidden;

    border-radius: 20px;

    background: linear-gradient(165deg, #ff9ffc 0%, #5227ff 46%, #b497cf 100%);
  `,
  asidePlate: css`
    position: absolute;
    inset: 0;
    background: var(--lobe-surface-bg-solid, ${cssVar.colorBgContainer});
  `,
  asideScrim: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset-block-end: 0;
    inset-inline: 0;

    block-size: 58%;

    background: linear-gradient(to top, rgb(24 10 48 / 42%), transparent);
  `,
  backdrop: css`
    pointer-events: none;
    position: absolute;
    z-index: 0;
    inset: 0;
  `,
  description: css`
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};
  `,
  elevated: css`
    &&&,
    &&&:hover {
      border-radius: 28px;
    }
  `,
  footer: css`
    margin: 0;
    font-size: ${cssVar.fontSizeSM};
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};

    a {
      font-weight: 600;
      color: ${cssVar.colorLink};
      text-decoration: none;
    }
  `,
  form: css`
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 24px;
    justify-content: center;

    box-sizing: border-box;
    inline-size: 100%;
    min-inline-size: 0;
    padding-block: 40px;
    padding-inline: 36px;

    ${responsive.laptop} {
      padding-block: 28px;
      padding-inline: 24px;
    }
  `,
  formSplit: css`
    inline-size: 50%;
    max-inline-size: 50%;

    ${responsive.laptop} {
      inline-size: 100%;
      max-inline-size: 100%;
    }
  `,
  frame: css`
    overflow: hidden;
    display: flex;
    flex: none;

    inline-size: 100%;
    min-inline-size: 0;
    border-radius: inherit;
  `,
  grid: css`
    && {
      background-color: color-mix(in srgb, ${cssVar.colorBgLayout}, ${cssVar.colorBgElevated} 70%);
      background-image:
        linear-gradient(
          color-mix(in srgb, ${cssVar.colorText} 5%, transparent) 1px,
          transparent 1px
        ),
        linear-gradient(
          90deg,
          color-mix(in srgb, ${cssVar.colorText} 5%, transparent) 1px,
          transparent 1px
        );
      background-position: -1px -1px;
      background-size: 32px 32px;
    }
  `,
  header: css`
    position: relative;
    z-index: 1;

    display: flex;
    flex: none;
    gap: 12px;
    align-items: center;
    justify-content: space-between;

    block-size: 56px;
    padding-inline: 16px;
  `,
  lift: css`
    position: relative;
    display: flex;
    inline-size: min(440px, 100%);
  `,
  liftSplit: css`
    inline-size: min(880px, 100%);

    ${responsive.laptop} {
      inline-size: min(440px, 100%);
    }
  `,
  logo: css`
    display: flex;
    margin-block-end: 8px;
  `,
  main: css`
    position: relative;
    z-index: 1;

    display: grid;
    flex: 1;
    place-items: center;

    padding-block: 24px 48px;
    padding-inline: 16px;
  `,
  page: css`
    position: relative;

    overflow: auto;
    display: flex;
    flex: 1;
    flex-direction: column;

    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    min-block-size: 100dvh;

    background: ${cssVar.colorBgLayout};
  `,
  split: css`
    min-block-size: 520px;

    ${responsive.laptop} {
      min-block-size: 0;
    }
  `,
  title: css`
    margin: 0;
    font-size: ${cssVar.fontSizeHeading3};
    line-height: ${cssVar.lineHeightHeading3};
  `,
  titleNode: css`
    display: flex;
    min-inline-size: 0;
  `,
  tools: css`
    display: flex;
    gap: 6px;
    align-items: center;
    margin-inline-start: auto;
  `,
}));

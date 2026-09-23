import { createStaticStyles } from 'antd-style';

import { accentGradient } from '@/awesome/landingTokens';

const splitStack = '@media (max-width: 860px)';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  accent: css`
    background: ${accentGradient};
    background-clip: text;

    -webkit-text-fill-color: transparent;
  `,
  actions: css`
    justify-content: center;
    margin-block-start: 36px;

    [data-layout='split'] & {
      justify-content: flex-start;
    }
  `,
  aside: css`
    display: flex;
    justify-content: center;
    min-inline-size: 0;

    > * {
      inline-size: 100%;
    }
  `,
  badge: css`
    display: inline-flex;
    gap: 6px;
    align-items: center;

    margin-block-end: 24px;
    padding-block: 4px;
    padding-inline: 12px;
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 999px;

    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextSecondary};

    background: color-mix(in srgb, ${cssVar.colorBgContainer} 70%, transparent);
    backdrop-filter: blur(8px);

    a {
      color: inherit;
      text-decoration: none;
    }

    a:hover {
      color: ${cssVar.colorText};
    }
  `,
  content: css`
    position: relative;
    z-index: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    inline-size: 100%;
  `,
  description: css`
    max-inline-size: 36rem;
    margin-block: 20px 0;
    margin-inline: 0;

    font-size: clamp(16px, 2vw, 19px);
    line-height: 1.6;
    color: ${cssVar.colorTextSecondary};
    text-wrap: balance;
  `,
  intro: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-inline-size: 0;

    [data-layout='split'] & {
      align-items: flex-start;
      text-align: start;
    }

    ${splitStack} {
      [data-layout='split'] & {
        align-items: center;
        text-align: center;
      }
    }
  `,
  main: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    inline-size: 100%;

    [data-layout='split'] & {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
      gap: clamp(32px, 5vw, 64px);
      align-items: center;
    }

    ${splitStack} {
      [data-layout='split'] & {
        grid-template-columns: minmax(0, 1fr);
        gap: 48px;
      }
    }
  `,
  extra: css`
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;

    inline-size: 100%;
    margin-block-start: 48px;
  `,
  root: css`
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-block: clamp(72px, 13vh, 128px) clamp(40px, 7vh, 72px);

    text-align: center;

    &[data-layout='split'] {
      padding-block-start: clamp(56px, 10vh, 104px);
    }
  `,
  title: css`
    margin: 0;

    font-size: clamp(44px, 8vw, 84px);
    font-weight: 700;
    line-height: 1.02;
    color: ${cssVar.colorText};
    text-wrap: balance;
    letter-spacing: -0.045em;

    [data-layout='split'] & {
      font-size: clamp(44px, 6vw, 72px);
    }
  `,
}));

import { createStaticStyles, keyframes } from 'antd-style';

const slide = keyframes`
  to {
    transform: translateX(calc(-100% - var(--logo-marquee-gap)));
  }
`;

export const styles = createStaticStyles(({ css, cssVar }) => ({
  caption: css`
    margin: 0;
    font-size: ${cssVar.fontSizeSM};
    color: ${cssVar.colorTextTertiary};

    a {
      color: inherit;
      text-decoration: none;
      transition: color 140ms ease;
    }

    a:hover {
      color: ${cssVar.colorText};
    }
  `,
  item: css`
    display: inline-flex;
    gap: 8px;
    align-items: center;

    font-size: ${cssVar.fontSize};
    color: ${cssVar.colorTextTertiary};
    white-space: nowrap;
  `,
  root: css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;

    inline-size: 100%;
  `,
  track: css`
    display: flex;
    flex: none;
    gap: var(--logo-marquee-gap);
    align-items: center;

    animation: ${slide} var(--logo-marquee-duration) linear infinite;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
  viewport: css`
    overflow: hidden;
    display: flex;
    gap: var(--logo-marquee-gap);

    inline-size: min(100%, var(--logo-marquee-max-width));

    mask-image: linear-gradient(90deg, transparent, #000 18%, #000 82%, transparent);

    &:hover > * {
      animation-play-state: paused;
    }
  `,
}));

'use client';

import { createStyles, keyframes } from 'antd-style';
import { memo } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

const useStyles = createStyles(({ isDarkMode, css }) => {
  const aurora = keyframes`
  0% {
    background-position: 50% 50%, 50% 50%;
  }
  100% {
    background-position: 350% 50%, 350% 50%;
  }
`;

  const dark = css`
    background-image: repeating-linear-gradient(
        100deg,
        rgb(0, 0, 0) 0%,
        rgb(0, 0, 0) 7%,
        rgba(0, 0, 0, 0%) 10%,
        rgba(0, 0, 0, 0%) 12%,
        rgb(0, 0, 0) 16%
      ),
      repeating-linear-gradient(
        100deg,
        rgb(59, 130, 246) 10%,
        rgb(165, 180, 252) 15%,
        rgb(147, 197, 253) 20%,
        rgb(221, 214, 254) 25%,
        rgb(96, 165, 250) 30%
      );
  `;

  const light = css`
    background-image: repeating-linear-gradient(
        100deg,
        rgb(255, 255, 255) 0%,
        rgb(255, 255, 255) 7%,
        rgba(0, 0, 0, 0%) 10%,
        rgba(0, 0, 0, 0%) 12%,
        rgb(255, 255, 255) 16%
      ),
      repeating-linear-gradient(
        100deg,
        rgb(59, 130, 246) 10%,
        rgb(165, 180, 252) 15%,
        rgb(147, 197, 253) 20%,
        rgb(221, 214, 254) 25%,
        rgb(96, 165, 250) 30%
      );
  `;

  const background = isDarkMode ? dark : light;

  return {
    bg: css`
      ${background};
      animation: ${aurora} 100s linear infinite;

      background-size: 300%, 200%;
      background-position:
        50% 50%,
        50% 50%;
      filter: blur(10px) invert(${isDarkMode ? 0 : 1});

      pointer-events: none;

      position: absolute;
      inset: -10px;

      mask-image: radial-gradient(at 100% 0, rgb(0, 0, 0) 10%, rgba(0, 0, 0, 0%) 70%);

      opacity: ${isDarkMode ? 0.3 : 0.6};

      will-change: transform;

      max-height: 100vh;

      &::after {
        ${background};
        position: absolute;

        content: '';

        inset: 0;

        animation: ${aurora} 100s linear infinite;

        mix-blend-mode: difference;
        background-attachment: fixed;
        background-size: 200%, 100%;
      }
    `,
    wrapper: css`
      position: absolute;
      z-index: 0;
      inset: 0;
      overflow: hidden;
    `,
  };
});

const AuroraBackground = memo<FlexboxProps>(({ children, ...rest }) => {
  const { styles } = useStyles();
  return (
    <Flexbox {...rest}>
      <Flexbox className={styles.wrapper}>
        <div className={styles.bg} />
      </Flexbox>
      <Flexbox flex={1} style={{ zIndex: 1 }} width={'100%'}>
        {children}
      </Flexbox>
    </Flexbox>
  );
});

export default AuroraBackground;

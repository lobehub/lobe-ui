import { createStaticStyles, cx } from 'antd-style';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => {
  const borderRadius = 'var(--gradient-button-border-radius, var(--ant-border-radius))';

  return {
    buttonDark: css`
      position: relative;
      z-index: 1;
      border: none;
      border-radius: ${borderRadius} !important;

      &::before {
        ${lobeStaticStylish.gradientAnimation}
        content: '';

        position: absolute;
        z-index: -2;
        inset: 0;

        border-radius: ${borderRadius};
      }

      &::after {
        content: '';

        position: absolute;
        z-index: -1;
        inset-block-start: 1px;
        inset-inline-start: 1px;

        width: calc(100% - 2px);
        height: calc(100% - 2px);
        border-radius: calc(${borderRadius} - 1px);

        background: ${cssVar.colorBgLayout};
      }

      &:hover {
        &::after {
          background: color-mix(in srgb, ${cssVar.colorBgLayout} 90%, transparent);
        }
      }

      &:active {
        &::after {
          background: color-mix(in srgb, ${cssVar.colorBgLayout} 85%, transparent);
        }
      }
    `,
    buttonLight: css`
      position: relative;
      z-index: 1;
      border: none;
      border-radius: ${borderRadius} !important;

      &::before {
        ${lobeStaticStylish.gradientAnimation}
        content: '';

        position: absolute;
        z-index: -2;
        inset: 0;

        border-radius: ${borderRadius};
      }

      &::after {
        content: '';

        position: absolute;
        z-index: -1;
        inset-block-start: 1px;
        inset-inline-start: 1px;

        width: calc(100% - 2px);
        height: calc(100% - 2px);
        border-radius: calc(${borderRadius} - 1px);

        background: ${cssVar.colorBgContainer};
      }

      &:hover {
        &::after {
          background: color-mix(in srgb, ${cssVar.colorBgContainer} 95%, transparent);
        }
      }

      &:active {
        &::after {
          background: color-mix(in srgb, ${cssVar.colorBgContainer} 90%, transparent);
        }
      }
    `,
    glow: cx(
      lobeStaticStylish.gradientAnimation,
      css`
        position: absolute;
        z-index: -2;
        inset-block-start: 0;
        inset-inline-start: 0;

        width: 100%;
        height: 100%;
        border-radius: inherit;

        opacity: 0.5;
        filter: blur(0.5em);
      `,
    ),
  };
});

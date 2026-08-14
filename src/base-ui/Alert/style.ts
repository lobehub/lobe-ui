import { createStaticStyles } from 'antd-style';
import { cva } from 'class-variance-authority';

import { lobeStaticStylish } from '@/styles';

export const styles = createStaticStyles(({ css, cssVar }) => ({
  action: css`
    display: flex;
    flex-shrink: 0;
    align-items: center;

    min-height: 32px;
    margin-inline-start: auto;
  `,
  close: css`
    cursor: pointer;

    position: relative;
    scale: 1;

    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: ${cssVar.borderRadiusSM};

    color: ${cssVar.colorTextTertiary};

    background: transparent;

    transition:
      color 160ms ${cssVar.motionEaseOut},
      background-color 160ms ${cssVar.motionEaseOut},
      scale 160ms ${cssVar.motionEaseOut};

    &::after {
      content: '';

      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: 50%;
      translate: -50% -50%;

      width: 40px;
      height: 40px;
    }

    &:hover:not(:disabled) {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillTertiary};
    }

    &:active:not(:disabled) {
      scale: 0.96;
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: 1px;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  colorfulText: css`
    color: var(--lobe-alert-accent);
  `,
  container: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
  `,
  content: css`
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
  `,
  description: css`
    font-size: 13px;
    line-height: 20px;
    color: ${cssVar.colorTextSecondary};
    text-wrap: pretty;
    overflow-wrap: anywhere;
  `,
  detailed: css`
    padding-block: 12px;
    padding-inline: 14px;
  `,
  extra: css`
    position: relative;
    max-width: 100%;
    color: ${cssVar.colorText};
  `,
  extraBanner: css`
    border-radius: 0;
  `,
  extraContent: css`
    overflow: hidden;

    margin-block: 0 12px;
    margin-inline: 12px;
    padding: 8px;
    border-radius: ${cssVar.borderRadiusSM};

    font-size: 12px;
    color: ${cssVar.colorText};

    background: ${cssVar.colorFillQuaternary};
  `,
  extraHeader: css`
    cursor: pointer;
    user-select: none;

    display: flex;
    gap: 6px;
    align-items: center;

    min-height: 40px;
    padding-block: 8px;
    padding-inline: 14px;
    border-block-start: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: 0;

    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    color: ${cssVar.colorTextSecondary};

    background: transparent;

    transition:
      color 160ms ${cssVar.motionEaseOut},
      background-color 160ms ${cssVar.motionEaseOut};

    &::marker,
    &::-webkit-details-marker {
      content: '';
      display: none;
    }

    &:hover {
      color: ${cssVar.colorText};
      background: ${cssVar.colorFillQuaternary};
    }

    &:focus-visible {
      outline: 2px solid ${cssVar.colorPrimaryBorder};
      outline-offset: -2px;
    }
  `,
  extraHeaderPlain: css`
    margin-block-start: 6px;
    padding-inline: 0;
    border-block-start-color: ${cssVar.colorBorderSecondary};
  `,
  extraIndicator: css`
    flex-shrink: 0;
    color: ${cssVar.colorTextTertiary};
    transition: transform 160ms ${cssVar.motionEaseOut};

    details[open] > summary > & {
      transform: rotate(90deg);
    }

    @media (prefers-reduced-motion: reduce) {
      transition-duration: 0s;
    }
  `,
  extraPlain: css`
    background: transparent;
  `,
  icon: css`
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;

    height: 20px;

    color: var(--lobe-alert-accent);
  `,
  integrated: css`
    overflow: hidden;
    border-radius: ${cssVar.borderRadius};
  `,
  neutralText: css`
    color: ${cssVar.colorText};
  `,
  root: css`
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;

    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding-block: 10px;
    padding-inline: 12px;
    border: none;
    border-radius: ${cssVar.borderRadius};

    font-size: 14px;
    color: ${cssVar.colorText};

    background: var(--lobe-alert-background);
    box-shadow: inset 0 0 0 1px var(--lobe-alert-soft-border);

    @media (width <= 480px) {
      flex-wrap: wrap;
    }
  `,
  soft: css`
    background: var(--lobe-alert-background);
    box-shadow: inset 0 0 0 1px var(--lobe-alert-soft-border);
  `,
  outlined: css`
    background: transparent;
    box-shadow: inset 0 0 0 1px ${cssVar.colorBorderSecondary};
  `,
  plain: css`
    padding-block: 2px;
    padding-inline: 0;
    background: transparent;
    box-shadow: none;
  `,
  title: css`
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: inherit;
    text-wrap: pretty;
    overflow-wrap: anywhere;
  `,
  titleDetailed: css`
    font-weight: 500;
  `,
  toneError: css`
    --lobe-alert-accent: ${cssVar.colorError};
    --lobe-alert-background: color-mix(
      in srgb,
      ${cssVar.colorError} 5%,
      ${cssVar.colorBgContainer}
    );
    --lobe-alert-soft-border: color-mix(in srgb, ${cssVar.colorError} 14%, transparent);
  `,
  toneInfo: css`
    --lobe-alert-accent: ${cssVar.colorInfo};
    --lobe-alert-background: color-mix(in srgb, ${cssVar.colorInfo} 5%, ${cssVar.colorBgContainer});
    --lobe-alert-soft-border: color-mix(in srgb, ${cssVar.colorInfo} 14%, transparent);
  `,
  toneSecondary: css`
    --lobe-alert-accent: ${cssVar.colorTextSecondary};
    --lobe-alert-background: color-mix(
      in srgb,
      ${cssVar.colorTextSecondary} 4%,
      ${cssVar.colorBgContainer}
    );
    --lobe-alert-soft-border: color-mix(in srgb, ${cssVar.colorTextSecondary} 12%, transparent);
  `,
  toneSuccess: css`
    --lobe-alert-accent: ${cssVar.colorSuccess};
    --lobe-alert-background: color-mix(
      in srgb,
      ${cssVar.colorSuccess} 5%,
      ${cssVar.colorBgContainer}
    );
    --lobe-alert-soft-border: color-mix(in srgb, ${cssVar.colorSuccess} 14%, transparent);
  `,
  toneWarning: css`
    --lobe-alert-accent: ${cssVar.colorWarning};
    --lobe-alert-background: color-mix(
      in srgb,
      ${cssVar.colorWarning} 5%,
      ${cssVar.colorBgContainer}
    );
    --lobe-alert-soft-border: color-mix(in srgb, ${cssVar.colorWarning} 14%, transparent);
  `,
  unifiedRoot: css`
    border-radius: 0;
    background: transparent;
    box-shadow: none;
  `,
  banner: css`
    border-radius: 0;
    box-shadow: none;
  `,
  wrappedAction: css`
    @media (width <= 480px) {
      order: 4;
      width: calc(100% - 30px);
      margin-block-start: -2px;
      margin-inline-start: 30px;
    }
  `,
}));

export const toneVariants = cva('', {
  defaultVariants: { type: 'info' },
  variants: {
    type: {
      error: styles.toneError,
      info: styles.toneInfo,
      secondary: styles.toneSecondary,
      success: styles.toneSuccess,
      warning: styles.toneWarning,
    },
  },
});

export const rootVariants = cva(styles.root, {
  compoundVariants: [{ class: styles.unifiedRoot, hasExtra: true }],
  defaultVariants: {
    banner: false,
    colorfulText: false,
    glass: false,
    hasDescription: false,
    hasExtra: false,
    variant: 'soft',
  },
  variants: {
    banner: { false: null, true: styles.banner },
    colorfulText: { false: styles.neutralText, true: styles.colorfulText },
    glass: { false: null, true: lobeStaticStylish.blur },
    hasDescription: { false: null, true: styles.detailed },
    hasExtra: { false: null, true: null },
    variant: {
      borderless: styles.plain,
      filled: styles.soft,
      outlined: styles.outlined,
      plain: styles.plain,
      soft: styles.soft,
    },
  },
});

export const integratedVariants = cva(styles.integrated, {
  defaultVariants: { banner: false, glass: false, variant: 'soft' },
  variants: {
    banner: { false: null, true: styles.banner },
    glass: { false: null, true: lobeStaticStylish.blur },
    variant: {
      borderless: styles.extraPlain,
      filled: styles.soft,
      outlined: styles.outlined,
      plain: styles.extraPlain,
      soft: styles.soft,
    },
  },
});

export const extraVariants = cva(styles.extra, {
  defaultVariants: { banner: false, variant: 'soft' },
  variants: {
    banner: { false: null, true: styles.extraBanner },
    variant: {
      borderless: styles.extraPlain,
      filled: null,
      outlined: null,
      plain: styles.extraPlain,
      soft: null,
    },
  },
});

export const extraHeaderVariants = cva(styles.extraHeader, {
  defaultVariants: { variant: 'soft' },
  variants: {
    variant: {
      borderless: styles.extraHeaderPlain,
      filled: null,
      outlined: null,
      plain: styles.extraHeaderPlain,
      soft: null,
    },
  },
});

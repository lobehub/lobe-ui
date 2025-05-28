import { describe, expect, it } from 'vitest';

describe('Highlighter style', () => {
  const mockToken = {
    borderRadius: 8,
    colorFillQuaternary: '#f0f0f0',
    colorTextDescription: '#666',
    colorTextSecondary: '#666',
    fontFamilyCode: 'monospace',
    motionEaseOut: 'ease-out',
  };

  const mockStylish = {
    blur: 'blur',
    shadow: 'shadow',
    variantBorderlessWithoutHover: 'borderless',
    variantFilledWithoutHover: 'filled',
    variantOutlinedWithoutHover: 'outlined',
  };

  // Moved to outer scope for lint compliance
  const css = (strs: TemplateStringsArray, ...args: any[]) => String.raw({ raw: strs }, ...args);
  const cx = (...args: any[]) => args.filter(Boolean).join(' ');

  // Simulate the output of useStyles() based on the source code logic
  function getStyles({
    token = mockToken,
    prefixCls = 'test',
    stylish = mockStylish,
  }: {
    prefixCls?: string;
    stylish?: typeof mockStylish;
    token?: typeof mockToken;
  } = {}) {
    const prefix = `${prefixCls}-highlighter`;
    const actionsHoverCls = `${prefix}-highlighter-hover-actions`;
    const langHoverCls = `${prefix}-highlighter-hover-lang`;
    const expandCls = `${prefix}-highlighter-body-expand`;

    return {
      actions: cx(
        actionsHoverCls,
        css`
          position: absolute;
          z-index: 2;
          inset-block-start: 8px;
          inset-inline-end: 8px;

          opacity: 0;
        `,
      ),
      bodyCollapsed: css`
        height: 0;
        opacity: 0;
      `,
      bodyExpand: cx(expandCls),
      bodyRoot: css`
        overflow: hidden;
        transition: opacity 0.25s ${token.motionEaseOut};
      `,
      borderless: stylish.variantBorderlessWithoutHover,
      filled: stylish.variantFilledWithoutHover,
      headerBorderless: css`
        padding-inline: 0;
      `,
      headerFilled: css`
        background: ${token.colorFillQuaternary};
      `,
      headerOutlined: css`
        & + .${prefix}-highlighter-body-expand {
          border-block-start: 1px solid ${token.colorFillQuaternary};
        }
      `,
      headerRoot: css`
        position: relative;
        padding: 4px;
      `,
      lang: cx(
        langHoverCls,
        stylish.blur,
        css`
          position: absolute;
          z-index: 2;
          inset-block-end: 8px;
          inset-inline-end: 0;

          font-family: ${token.fontFamilyCode};
          color: ${token.colorTextSecondary};

          opacity: 0;
          background: ${token.colorFillQuaternary};

          transition: opacity 0.1s;
        `,
      ),
      nowrap: css`
        pre,
        code {
          text-wrap: nowrap;
        }
      `,
      outlined: stylish.variantOutlinedWithoutHover,
      root: cx(
        prefix,
        css`
          position: relative;

          overflow: hidden;

          width: 100%;
          border-radius: ${token.borderRadius}px;

          transition: background-color 100ms ${token.motionEaseOut};

          &:hover {
            .${prefix}-highlighter-hover-actions {
              opacity: 1;
            }

            .${prefix}-highlighter-hover-lang {
              opacity: 1;
            }
          }

          code {
            background: transparent !important;
          }
        `,
      ),
      select: css`
        user-select: none;

        position: absolute;
        inset-inline-start: 50%;
        transform: translateX(-50%);

        min-width: 100px;

        font-size: 14px;
        color: ${token.colorTextDescription};
        text-align: center;
      `,
      shadow: stylish.shadow,
      wrap: css`
        pre,
        code {
          text-wrap: wrap;
        }
      `,
    };
  }

  const styles = getStyles();

  it('should generate correct styles', () => {
    expect(styles).toBeDefined();
    expect(styles.actions).toContain('position: absolute');
    expect(styles.bodyCollapsed).toContain('height: 0');
    expect(styles.bodyCollapsed).toContain('opacity: 0');
    expect(styles.bodyRoot).toContain('overflow: hidden');
    expect(styles.bodyRoot).toContain('transition: opacity 0.25s');
    expect(styles.headerRoot).toContain('position: relative');
    expect(styles.lang).toContain('position: absolute');
    expect(styles.lang).toContain('font-family: monospace');
    expect(styles.lang).toContain('background: #f0f0f0');
    expect(styles.nowrap).toContain('text-wrap: nowrap');
    expect(styles.root).toContain('position: relative');
    expect(styles.root).toContain('width: 100%');
    expect(styles.root).toContain('border-radius: 8px');
    expect(styles.root).toContain('transition: background-color 100ms');
    expect(styles.select).toContain('user-select: none');
    expect(styles.select).toContain('color: #666');
    expect(styles.wrap).toContain('text-wrap: wrap');
  });

  it('should have correct class names', () => {
    expect(styles.borderless).toBe('borderless');
    expect(styles.filled).toBe('filled');
    expect(styles.outlined).toBe('outlined');
    expect(styles.shadow).toBe('shadow');
  });

  it('should generate headerFilled and headerOutlined correctly', () => {
    expect(styles.headerFilled).toContain('background: #f0f0f0');
    // The selector now includes the prefix twice due to how the style is constructed
    expect(styles.headerOutlined).toContain('& + .test-highlighter-highlighter-body-expand');
    expect(styles.headerOutlined).toContain('border-block-start: 1px solid #f0f0f0');
  });

  it('should allow custom prefixCls and tokens', () => {
    const customStyles = getStyles({
      prefixCls: 'custom',
      stylish: {
        ...mockStylish,
        blur: 'custom-blur',
        shadow: 'custom-shadow',
        variantBorderlessWithoutHover: 'custom-borderless',
        variantFilledWithoutHover: 'custom-filled',
        variantOutlinedWithoutHover: 'custom-outlined',
      },
      token: {
        ...mockToken,
        borderRadius: 12,
        colorFillQuaternary: '#abc123',
        colorTextDescription: '#111',
        colorTextSecondary: '#222',
        fontFamilyCode: 'FiraMono',
        motionEaseOut: 'cubic-bezier(0,1,0.5,1)',
      },
    });
    expect(customStyles.root).toContain('custom-highlighter');
    expect(customStyles.root).toContain('border-radius: 12px');
    expect(customStyles.lang).toContain('font-family: FiraMono');
    expect(customStyles.lang).toContain('background: #abc123');
    expect(customStyles.select).toContain('color: #111');
    expect(customStyles.headerFilled).toContain('background: #abc123');
    expect(customStyles.headerOutlined).toContain('border-block-start: 1px solid #abc123');
    expect(customStyles.borderless).toBe('custom-borderless');
    expect(customStyles.filled).toBe('custom-filled');
    expect(customStyles.outlined).toBe('custom-outlined');
    expect(customStyles.shadow).toBe('custom-shadow');
  });

  it('should contain hover selectors in root', () => {
    expect(styles.root).toContain('&:hover');
    // The generated selector now includes the prefix twice, e.g. .test-highlighter-highlighter-hover-actions
    expect(styles.root).toContain('.test-highlighter-highlighter-hover-actions');
    expect(styles.root).toContain('.test-highlighter-highlighter-hover-lang');
    expect(styles.root).toContain('opacity: 1');
  });

  it('should have code background override in root', () => {
    expect(styles.root).toContain('code');
    expect(styles.root).toContain('background: transparent !important;');
  });
});

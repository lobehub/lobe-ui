import {
  createLobeToken,
  cssVar,
  type LobeAppearance,
  type LobePrimaryColor,
  type LobeToken,
  type NeutralColors,
  ThemeScope,
} from '@lobehub/ui';
import { type CSSProperties, type ReactNode, useMemo, useSyncExternalStore } from 'react';

import { boardCss } from './boardCss';
import type { Preview, TokenKey, TokenSpec } from './tokens';

export const appearances: LobeAppearance[] = ['light', 'dark'];

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributeFilter: ['data-primary-color', 'data-neutral-color'],
    attributes: true,
  });
  return () => observer.disconnect();
};

const readSiteColors = () => {
  const { neutralColor = '', primaryColor = '' } = document.documentElement.dataset;
  return `${primaryColor}|${neutralColor}`;
};

export const useTokens = (): Record<LobeAppearance, LobeToken> => {
  const colors = useSyncExternalStore(subscribe, readSiteColors, () => '|');
  return useMemo(() => {
    const [primaryColor, neutralColor] = colors.split('|');
    const params = {
      neutralColor: (neutralColor || undefined) as NeutralColors | undefined,
      primaryColor: (primaryColor || undefined) as LobePrimaryColor | undefined,
    };
    return {
      dark: createLobeToken({ appearance: 'dark', ...params }),
      light: createLobeToken({ appearance: 'light', ...params }),
    };
  }, [colors]);
};

export const varName = (key: TokenKey) => String(cssVar[key]).replace(/^var\((.*)\)$/, '$1');

export const formatValue = (value: unknown) =>
  typeof value === 'number' ? `${value}px` : String(value);

export const valueLine = (key: TokenKey, tokens: Record<LobeAppearance, LobeToken>) => {
  const light = formatValue(tokens.light[key]);
  const dark = formatValue(tokens.dark[key]);
  return light === dark ? `${light} · both themes` : `L ${light} · D ${dark}`;
};

const ring = `inset 0 0 0 1px ${cssVar.colorFillSecondary}`;

const layoutParent = new Set<Preview>(['surface', 'shadow', 'radius']);

const Art = ({ preview, tokenKey }: { preview: Preview; tokenKey: TokenKey }) => {
  const value = cssVar[tokenKey];
  switch (preview) {
    case 'text': {
      return (
        <>
          <span style={{ color: value, fontSize: 30, fontWeight: 600, lineHeight: 1 }}>Aa</span>
          <span style={{ color: value, fontSize: 12 }}>Settings</span>
        </>
      );
    }
    case 'border': {
      return <div className="dt-swatch" style={{ border: `2px solid ${value}` }} />;
    }
    case 'shadow': {
      return (
        <div
          className="dt-swatch"
          style={{
            background: cssVar.colorBgElevated,
            borderRadius: 10,
            boxShadow: value,
            margin: 10,
          }}
        />
      );
    }
    case 'radius': {
      return (
        <div
          style={{
            alignSelf: 'center',
            background: cssVar.colorBgContainer,
            border: `1.5px solid ${cssVar.colorText}`,
            borderRadius: value,
            height: 56,
            width: 84,
          }}
        />
      );
    }
    case 'font': {
      return <span style={{ fontFamily: value, fontSize: 22, fontWeight: 500 }}>Ag 0123</span>;
    }
    case 'fontSize': {
      return <span style={{ fontSize: value, fontWeight: 600, lineHeight: 1.1 }}>Aa</span>;
    }
    default: {
      return <div className="dt-swatch" style={{ background: value, boxShadow: ring }} />;
    }
  }
};

export const Split = ({
  children,
  onLayout,
}: {
  children: (appearance: LobeAppearance) => ReactNode;
  onLayout?: boolean;
}) => (
  <div className="dt-split">
    {appearances.map((appearance) => (
      <ThemeScope
        appearance={appearance}
        className={onLayout ? 'dt-half dt-on-layout' : 'dt-half'}
        key={appearance}
      >
        {children(appearance)}
      </ThemeScope>
    ))}
  </div>
);

export const TokenCard = ({
  preview,
  spec,
  tokens,
}: {
  preview: Preview;
  spec: TokenSpec;
  tokens: Record<LobeAppearance, LobeToken>;
}) => (
  <div className="dt-card">
    <Split onLayout={layoutParent.has(preview)}>
      {() => <Art preview={preview} tokenKey={spec.key} />}
    </Split>
    <div className="dt-meta">
      <div className="dt-name">
        <span>{spec.key}</span>
        {spec.alias && <span className="dt-chip">{`= ${spec.alias}`}</span>}
      </div>
      <div className="dt-mono">{varName(spec.key)}</div>
      {preview !== 'shadow' && (
        <div className="dt-mono" data-strong="">
          {valueLine(spec.key, tokens)}
        </div>
      )}
      <div className="dt-role">{spec.role}</div>
    </div>
  </div>
);

export const CardGrid = ({
  preview,
  specs,
  wide,
}: {
  preview: Preview;
  specs: TokenSpec[];
  wide?: boolean;
}) => {
  const tokens = useTokens();
  return (
    <div className={wide ? 'dt-grid dt-wide' : 'dt-grid'}>
      {specs.map((spec) => (
        <TokenCard key={spec.key} preview={preview} spec={spec} tokens={tokens} />
      ))}
    </div>
  );
};

// Rendered into the SSR head so scene layout (position, overflow) holds on the first paint.
export const Board = ({ children }: { children: ReactNode }) => (
  <div className="dt-board">
    <style href="lobe-design-tokens" precedence="default">
      {boardCss}
    </style>
    {children}
  </div>
);

export const ThemePair = ({
  children,
  onContainer,
  style,
}: {
  children: (appearance: LobeAppearance) => ReactNode;
  onContainer?: boolean;
  style?: CSSProperties;
}) => (
  <div className="dt-pair">
    {appearances.map((appearance) => (
      <ThemeScope
        appearance={appearance}
        className={onContainer ? 'dt-scene dt-on-container' : 'dt-scene'}
        key={appearance}
        style={style}
      >
        <span className="dt-label">{appearance}</span>
        {children(appearance)}
      </ThemeScope>
    ))}
  </div>
);

export const Label = ({ children }: { children: ReactNode }) => (
  <span className="dt-label">{children}</span>
);

'use client';

interface CdnMermaidConfig {
  fontFamily?: string;
  gantt?: { useWidth?: number };
  securityLevel?: string;
  startOnLoad?: boolean;
  theme?: string;
  themeVariables?: Record<string, string | undefined>;
}

interface CdnMermaidApi {
  initialize: (config: CdnMermaidConfig) => void;
  render: (id: string, content: string) => Promise<{ svg: string }>;
}

const DEFAULT_MERMAID_CDN_URL = 'https://esm.sh/mermaid@11';

let mermaidCdnUrl = DEFAULT_MERMAID_CDN_URL;
let mermaidPromise: Promise<CdnMermaidApi | null> | null = null;

/**
 * Point the fallback loader at a mirror, or at a self-hosted copy for offline
 * and strict-CSP deployments. Resets any in-flight load.
 */
export const setMermaidCdnUrl = (url: string) => {
  if (url === mermaidCdnUrl) return;
  mermaidCdnUrl = url;
  mermaidPromise = null;
};

export const getMermaidCdnUrl = () => mermaidCdnUrl;

export const loadCdnMermaid = (): Promise<CdnMermaidApi | null> => {
  if (typeof window === 'undefined') return Promise.resolve(null);

  mermaidPromise ??= import(/* @vite-ignore */ mermaidCdnUrl)
    .then((mod) => (mod.default ?? mod) as CdnMermaidApi)
    .catch(() => null);

  return mermaidPromise;
};

/**
 * Upstream mermaid runs colour maths over themeVariables, so it needs literal
 * values rather than var() references. Reading antd's CSS variables here keeps
 * the cost off the render path — no theme context subscription, and it only
 * runs for the diagram types that actually fall back to the CDN.
 */
const readCssVars = <T extends string>(names: Record<T, string>): Record<T, string | undefined> => {
  const result = {} as Record<T, string | undefined>;
  if (typeof document === 'undefined') return result;

  const computed = globalThis.getComputedStyle(document.documentElement);
  for (const [key, variable] of Object.entries(names) as [T, string][]) {
    result[key] = computed.getPropertyValue(variable).trim() || undefined;
  }
  return result;
};

export const createCdnMermaidConfig = (
  isDarkMode: boolean,
  customTheme?: string,
): CdnMermaidConfig => {
  const token = readCssVars({
    border: '--lobe-color-border',
    error: '--lobe-color-error',
    fontFamily: '--lobe-font-family',
    fontFamilyCode: '--lobe-font-family-code',
    infoBg: '--lobe-color-info-bg',
    infoBorder: '--lobe-color-info-border',
    infoText: '--lobe-color-info-text',
    primary: '--lobe-color-primary',
    success: '--lobe-color-success',
    successBg: '--lobe-color-success-bg',
    successBorder: '--lobe-color-success-border',
    successText: '--lobe-color-success-text',
    text: '--lobe-color-text',
    textDescription: '--lobe-color-text-description',
    textSecondary: '--lobe-color-text-secondary',
    bgContainer: '--lobe-color-bg-container',
    warning: '--lobe-color-warning',
  });

  return {
    fontFamily: token.fontFamilyCode,
    gantt: { useWidth: 1920 },
    // SECURITY: 'strict' keeps Mermaid from rendering node labels via innerHTML,
    // which would be an XSS vector for model-generated diagram content.
    securityLevel: 'strict',
    startOnLoad: false,
    theme: customTheme || (isDarkMode ? 'dark' : 'neutral'),
    themeVariables: customTheme
      ? undefined
      : {
          errorBkgColor: token.textDescription,
          errorTextColor: token.textDescription,
          fontFamily: token.fontFamily,
          lineColor: token.textSecondary,
          mainBkg: token.bgContainer,
          noteBkgColor: token.infoBg,
          noteTextColor: token.infoText,
          pie1: token.primary,
          pie2: token.warning,
          pie3: token.success,
          pie4: token.error,
          primaryBorderColor: token.border,
          primaryColor: token.bgContainer,
          primaryTextColor: token.text,
          secondaryBorderColor: token.infoBorder,
          secondaryColor: token.infoBg,
          secondaryTextColor: token.infoText,
          tertiaryBorderColor: token.successBorder,
          tertiaryColor: token.successBg,
          tertiaryTextColor: token.successText,
          textColor: token.text,
        },
  };
};

export const renderWithCdnMermaid = async (
  content: string,
  id: string,
  config: CdnMermaidConfig,
): Promise<string> => {
  const mermaid = await loadCdnMermaid();
  if (!mermaid) return '';

  mermaid.initialize(config);
  const { svg } = await mermaid.render(id, content);
  return svg;
};

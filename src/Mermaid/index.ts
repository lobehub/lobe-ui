export { mermaidThemes } from './const';
export { default } from './Mermaid';
export { default as SyntaxMermaid } from './SyntaxMermaid';
export type { MermaidThemeName } from './themes';
export type * from './type';

/**
 * @deprecated Every diagram type now renders locally with pele; the CDN mermaid fallback is gone and this is a no-op.
 */
export const setMermaidCdnUrl = (_url: string) => {};

/**
 * @deprecated Every diagram type now renders locally with pele; the CDN mermaid fallback is gone.
 */
export const getMermaidCdnUrl = (): string | undefined => undefined;

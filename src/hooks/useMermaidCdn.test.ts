import { afterEach, describe, expect, it } from 'vitest';

import { getMermaidCdnUrl, renderWithCdnMermaid, setMermaidCdnUrl } from './useMermaidCdn';

const defaultUrl = getMermaidCdnUrl();

afterEach(() => {
  setMermaidCdnUrl(defaultUrl);
});

describe('mermaid CDN fallback', () => {
  it('defaults to a pinned major version', () => {
    expect(getMermaidCdnUrl()).toBe('https://esm.sh/mermaid@11');
  });

  it('allows pointing at a self-hosted copy', () => {
    setMermaidCdnUrl('/assets/mermaid.mjs');
    expect(getMermaidCdnUrl()).toBe('/assets/mermaid.mjs');
  });

  it('degrades to an empty result when the CDN is unreachable', async () => {
    setMermaidCdnUrl('https://127.0.0.1:1/mermaid-does-not-exist.mjs');

    await expect(renderWithCdnMermaid('pie title Pets\n  "Dogs": 3', 'x', {})).resolves.toBe('');
  });
});

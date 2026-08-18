import { describe, expect, it } from 'vitest';

import { buildAntdStaticCss } from './buildAntdStaticCss';
import { antdProbeNames } from './registry';

describe('antdProbeRegistry', () => {
  it('renders every probe and extracts style rules', () => {
    const payload = buildAntdStaticCss({ included: antdProbeNames });

    expect(payload.failedProbes).toEqual([]);
    expect(payload.styleKeys.length).toBeGreaterThan(0);
    expect(payload.css.length).toBeGreaterThan(1000);
    expect(payload.href).toBe(`/antd.css?v=${payload.hash}`);
  });

  it('produces deterministic hash for identical input', () => {
    const first = buildAntdStaticCss({ included: ['button'] });
    const second = buildAntdStaticCss({ included: ['button'] });

    expect(first.hash).toBe(second.hash);
    expect(first.styleKeys).toEqual(second.styleKeys);
  });

  it('registers distinct style keys for tag color variants', () => {
    const base = buildAntdStaticCss({ included: ['tag'] });
    const withPreset = buildAntdStaticCss({ included: ['tag', 'tag-preset', 'tag-status'] });

    expect(withPreset.styleKeys.length).toBeGreaterThan(base.styleKeys.length);
  });
});

import { describe, expect, it } from 'vitest';

import { lobeUiAntdBaseline } from './baseline';
import { expandComponentsToProbes } from './registry';
import { scanAntdUsage } from './scan';

const repoRoot = process.cwd();

describe('lobeUiAntdBaseline', () => {
  it('matches the antd usage of the lobe-ui source tree', () => {
    const usage = scanAntdUsage({
      cwd: repoRoot,
      exclude: [
        /node_modules/,
        /\.test\./,
        /\.d\.[cm]?ts$/,
        /__tests__/,
        /\/demos\//,
        /src\/static-css\//,
      ],
      roots: ['src'],
    });

    expect(usage.wildcard).toBe(false);

    const expanded = expandComponentsToProbes(usage.components);

    expect(expanded.unmatched).toEqual([]);
    expect(expanded.probes).toEqual([...lobeUiAntdBaseline].sort());
  });
});

import { createCache, extractStyle as extractCssinjsStyle } from '@ant-design/cssinjs';
import type { ThemeConfig } from 'antd';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { StyleProvider } from 'antd-style';
import type { ReactElement } from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import { createLobeAntdTheme } from '@/styles/theme/antdTheme';

import { lobeUiAntdBaseline } from './baseline';
import { hashCss } from './hash';
import type { AntdProbeName } from './registry';
import { antdProbeNames, antdProbeRegistry, expandComponentsToProbes } from './registry';
import type { ScanAntdUsageOptions } from './scan';
import { scanAntdUsage } from './scan';
import { styleKeysOf } from './shared';

export interface AntdStaticCssOptions {
  /** escape hatch for render paths the registry has no probe for */
  customProbes?: [name: string, render: () => ReactElement][];
  /** extra probes on top of 'auto' scan results */
  extraIncluded?: AntdProbeName[];
  hrefTemplate?: (hash: string) => string;
  included?: 'auto' | AntdProbeName[];
  scan?: ScanAntdUsageOptions;
  /** must equal the ConfigProvider theme used at SSR — token hash decides styleKeys matching */
  theme?: ThemeConfig;
}

export interface AntdStaticCssPayload {
  css: string;
  failedProbes: string[];
  hash: string;
  href: string;
  probes: string[];
  styleKeys: string[];
  /** antd exports found by 'auto' scan that no registry probe covers */
  unmatchedComponents: string[];
}

export const createProbeAntdTheme = (): ThemeConfig => {
  const config = createLobeAntdTheme({ appearance: 'light' });
  return {
    ...config,
    algorithm: [antdTheme.defaultAlgorithm, config.algorithm ?? []].flat(),
  };
};

const resolveProbes = (options: AntdStaticCssOptions) => {
  const { included = 'auto', extraIncluded = [], customProbes = [], scan } = options;

  const names = new Set<AntdProbeName>();
  const unmatchedComponents: string[] = [];

  if (included === 'auto') {
    const usage = scanAntdUsage(scan);
    if (usage.wildcard) {
      for (const name of antdProbeNames) names.add(name);
    } else {
      const expanded = expandComponentsToProbes(usage.components);
      for (const name of expanded.probes) names.add(name);
      unmatchedComponents.push(...expanded.unmatched);
    }
    if (usage.importsLobeUi) for (const name of lobeUiAntdBaseline) names.add(name);
  } else {
    for (const name of included) names.add(name);
  }

  for (const name of extraIncluded) names.add(name);

  const probes: [string, () => ReactElement][] = [...names]
    .sort()
    .map((name) => [name, antdProbeRegistry[name].render]);

  return { probes: [...probes, ...customProbes], unmatchedComponents };
};

export const buildAntdStaticCss = (options: AntdStaticCssOptions = {}): AntdStaticCssPayload => {
  const { theme = createProbeAntdTheme(), hrefTemplate = (hash) => `/antd.css?v=${hash}` } =
    options;

  const { probes, unmatchedComponents } = resolveProbes(options);

  const cache = createCache();
  const failedProbes: string[] = [];

  for (const [name, probe] of probes) {
    try {
      renderToString(
        createElement(StyleProvider, {
          cache,
          children: createElement(ConfigProvider, { theme }, probe()),
        }),
      );
    } catch {
      failedProbes.push(name);
    }
  }

  const css = extractCssinjsStyle(cache, { plain: true, types: ['style'] });
  const hash = hashCss(css);

  return {
    css,
    failedProbes,
    hash,
    href: hrefTemplate(hash),
    probes: probes.map(([name]) => name),
    styleKeys: styleKeysOf(cache as unknown as { cache: Map<string, unknown> }).sort(),
    unmatchedComponents,
  };
};

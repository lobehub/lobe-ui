import { createCache, extractStyle as extractCssinjsStyle } from '@ant-design/cssinjs';
import { createLobeAntdTheme } from '@lobehub/ui/es/styles/theme/antdTheme';
import {
  Alert,
  Anchor,
  App,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Checkbox,
  Collapse,
  ConfigProvider,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  FloatButton,
  Image,
  Input,
  InputNumber,
  Menu,
  Modal,
  Pagination,
  Popover,
  Progress,
  QRCode,
  Radio,
  Rate,
  Segmented,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  theme as antdTheme,
  Tooltip,
  Tree,
  Typography,
} from 'antd';
import { StyleProvider } from 'antd-style';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';

const themeConfig = (() => {
  const config = createLobeAntdTheme({ appearance: 'light' });
  return {
    ...config,
    algorithm: [antdTheme.defaultAlgorithm, config.algorithm]
      .flat()
      .filter((algorithm) => algorithm !== undefined),
  };
})();

// One probe per antd component the docs (incl. @lobehub/ui internals) can render.
// A missed component is not fatal: entry.server keeps its rules inline as fallback.
const PROBES: [string, () => ReactElement][] = [
  ['alert', () => <Alert message={'-'} />],
  ['anchor', () => <Anchor items={[]} />],
  ['app', () => <App>{'-'}</App>],
  ['avatar', () => <Avatar />],
  ['badge', () => <Badge count={1} />],
  ['breadcrumb', () => <Breadcrumb items={[]} />],
  ['button', () => <Button>{'-'}</Button>],
  ['checkbox', () => <Checkbox />],
  ['collapse', () => <Collapse items={[]} />],
  ['divider', () => <Divider />],
  ['drawer', () => <Drawer open={false} />],
  [
    'dropdown',
    () => (
      <Dropdown menu={{ items: [] }}>
        <span />
      </Dropdown>
    ),
  ],
  ['empty', () => <Empty />],
  ['float-button', () => <FloatButton />],
  ['image', () => <Image src={''} />],
  ['input', () => <Input />],
  ['input-number', () => <InputNumber />],
  ['menu', () => <Menu items={[]} />],
  ['modal', () => <Modal open={false} />],
  ['pagination', () => <Pagination />],
  [
    'popover',
    () => (
      <Popover>
        <span />
      </Popover>
    ),
  ],
  ['progress', () => <Progress percent={0} />],
  ['qrcode', () => <QRCode value={'-'} />],
  ['radio', () => <Radio />],
  ['rate', () => <Rate />],
  ['segmented', () => <Segmented options={['-']} />],
  ['select', () => <Select />],
  ['skeleton', () => <Skeleton />],
  ['slider', () => <Slider />],
  [
    'space',
    () => (
      <Space>
        <span />
      </Space>
    ),
  ],
  ['spin', () => <Spin />],
  ['steps', () => <Steps items={[]} />],
  ['switch', () => <Switch />],
  ['table', () => <Table columns={[]} dataSource={[]} />],
  ['tabs', () => <Tabs items={[]} />],
  ['tag', () => <Tag>{'-'}</Tag>],
  [
    'tooltip',
    () => (
      <Tooltip title={'-'}>
        <span />
      </Tooltip>
    ),
  ],
  ['tree', () => <Tree treeData={[]} />],
  ['typography', () => <Typography.Text>{'-'}</Typography.Text>],
];

interface CssinjsCache {
  cache: Map<string, unknown>;
  extracted: Set<string>;
  updateTimes: Map<string, number>;
}

const styleKeysOf = (cache: CssinjsCache) =>
  [...cache.cache.keys()].filter((key) => key.startsWith('style%'));

const build = () => {
  const cache = createCache();
  const failed: string[] = [];

  for (const [name, probe] of PROBES) {
    try {
      renderToString(
        <StyleProvider cache={cache}>
          <ConfigProvider theme={themeConfig}>{probe()}</ConfigProvider>
        </StyleProvider>,
      );
    } catch {
      failed.push(name);
    }
  }

  if (failed.length > 0) {
    console.warn(`[antd-static-css] probe render failed: ${failed.join(', ')}`);
  }

  return {
    css: extractCssinjsStyle(cache, { plain: true, types: ['style'] }),
    styleKeys: new Set(styleKeysOf(cache as unknown as CssinjsCache)),
  };
};

let cache: ReturnType<typeof build> | undefined;

export const getAntdStaticCss = () => {
  cache ??= build();
  return cache;
};

// Replaces antd-style's inline antd entry: component css-var blocks always stay inline
// (their values are the light-theme truth for this render), while style rules ship via
// /antd.css — except components the probe list missed, which fall back to inline.
export const buildInlineAntdStyle = (runtimeCache: unknown) => {
  const { styleKeys } = getAntdStaticCss();
  const cssinjsCache = runtimeCache as CssinjsCache;

  const cssVarCss = extractCssinjsStyle(cssinjsCache as never, {
    plain: true,
    types: ['cssVar'],
  });

  const uncovered = styleKeysOf(cssinjsCache).filter((key) => !styleKeys.has(key));
  let uncoveredCss = '';
  if (uncovered.length > 0) {
    const pseudoCache = {
      cache: new Map(uncovered.map((key) => [key, cssinjsCache.cache.get(key)])),
      extracted: new Set<string>(),
      updateTimes: cssinjsCache.updateTimes,
    };
    uncoveredCss = extractCssinjsStyle(pseudoCache as never, { plain: true, types: ['style'] });
    console.warn(
      `[antd-static-css] inline fallback for uncovered antd styles: ${uncovered
        .map((key) => key.split('%')[2] ?? key)
        .join(', ')}`,
    );
  }

  const css = cssVarCss + uncoveredCss;
  return css ? `<style data-rc-order="prepend" data-rc-priority="-9999">${css}</style>` : '';
};

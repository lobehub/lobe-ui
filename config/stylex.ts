import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

interface CssRule {
  type: string;
  value?: any;
}

interface CssSheet {
  rules: CssRule[];
}

// lightningcss 1.33 serializes absent options as `null` (e.g. `var()`'s `from` and `fallback`) but
// cannot deserialize them back, so a visitor returning the stylesheet must drop those fields.
export const dropNullFields = <T>(node: T): T => {
  if (Array.isArray(node)) return node.map(dropNullFields) as T;
  if (node === null || typeof node !== 'object') return node;
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key, value]) => value !== null || !(key === 'from' || key === 'fallback'))
      .map(([key, value]) => [key, dropNullFields(value)]),
  ) as T;
};

const isLayerRule = (rule: CssRule) =>
  rule.type === 'layer-statement' || rule.type === 'layer-block';

// processStylexRules leaves its priority-0 group (keyframes, custom-property rules) outside any
// layer by design; move it into the first declared sublayer so all StyleX output stays in lobe-ui.
export const layerStylexBase = <T extends CssSheet>(sheet: T): T | undefined => {
  const header = sheet.rules.find((rule) => rule.type === 'layer-statement');
  const base = sheet.rules.filter((rule) => !isLayerRule(rule));
  if (!header || base.length === 0) return;
  const rules = sheet.rules.filter(isLayerRule);
  rules.splice(rules.indexOf(header) + 1, 0, {
    type: 'layer-block',
    value: { loc: header.value.loc, name: header.value.names[0], rules: base },
  });
  return dropNullFields({ ...sheet, rules });
};

export const stylexOptions = {
  aliases: { '@/*': [`${rootDir}src/*`] },
  classNamePrefix: 'lb',
  lightningcssOptions: {
    // Features.DirSelector (4) | Features.LogicalProperties (524288): lowering `:dir()` to `:lang()`
    // and logical properties to physical fallbacks breaks StyleX's RTL rules; vendor prefixing stays.
    exclude: 4 | 524_288,
    visitor: { StyleSheetExit: layerStylexBase },
  },
  unstable_moduleResolution: { rootDir, type: 'commonJS' as const },
  useCSSLayers: { prefix: 'lobe-ui' },
};

export default stylexOptions;

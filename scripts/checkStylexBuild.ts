import { existsSync, globSync, readFileSync } from 'node:fs';
import path from 'node:path';

const es = path.resolve(import.meta.dirname, '../es');
const migrated = [
  'base-ui/Button',
  'base-ui/Divider',
  'base-ui/Spin',
  'base-ui/Switch',
  'base-ui/Tag',
  'base-ui/Tooltip',
];

const errors: string[] = [];
const fail = (message: string) => errors.push(message);

const stylePath = path.join(es, 'style.css');
if (existsSync(stylePath)) {
  const css = readFileSync(stylePath, 'utf8').replaceAll(/\/\*[\S\s]*?\*\//g, '');
  const layerOrder = '@layer lobe-base, lobe-popup, lobe-ui;';
  if (!css.trimStart().startsWith(layerOrder)) fail(`es/style.css must start with ${layerOrder}`);
  let first = true;
  let depth = 0;
  let statement = '';
  for (const char of css) {
    if (depth === 0) statement += char;
    if (char === '{') depth++;
    if (char === '}') depth--;
    if (depth === 0 && (char === '}' || char === ';')) {
      const head = statement.trim();
      if (!(first && head === layerOrder) && !/^@layer lobe-ui[\s.,;{]/.test(head))
        fail(`rule outside @layer lobe-ui: ${head.slice(0, 80)}`);
      statement = '';
      first = false;
    }
  }
  if (!/@property --lobe-scroll-area-fade-top\b/.test(css))
    fail('ScrollArea @property rules missing');
  const selectors = css
    .replaceAll(/@layer[^;{]*/g, '')
    .replaceAll(/url\([^)]*\)/g, '')
    .replaceAll(/"[^"]*"|'[^']*'/g, '');
  for (const [, name] of selectors.matchAll(/\.(-?[A-Z_a-z][\w-]*)/g)) {
    if (!/^(lb|lobe-)/.test(name)) fail(`class without lb/lobe- prefix: .${name}`);
  }
} else {
  fail('es/style.css is missing');
}

for (const file of globSync('**/*.mjs', { cwd: es })) {
  const code = readFileSync(path.join(es, file), 'utf8');
  if (/^import\s+["'][^"']+\.css["']/m.test(code)) fail(`${file} keeps a .css import`);
  if (
    migrated.some((dir) => file.startsWith(`${dir}/`)) &&
    /from\s+["'](@emotion\/[^"']+|[^"']*\/styles\/(css|index)\.mjs)["']/.test(code)
  ) {
    fail(`${file} imports emotion`);
  }
  if (file.startsWith('base-ui/ScrollArea/') && code.includes('createGlobalStyle')) {
    fail(`${file} injects global styles at runtime`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`es/style.css ok; checked ${migrated.join(', ')}, base-ui/ScrollArea`);

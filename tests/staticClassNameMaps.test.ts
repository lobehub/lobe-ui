// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { stylexOptions } from '../config/stylex';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const babel = unpluginRequire('@babel/core');
const stylexBabel = unpluginRequire('@stylexjs/babel-plugin');
const syntaxTs = unpluginRequire('@babel/plugin-syntax-typescript');

const root = path.resolve(import.meta.dirname, '..');

const maps = [
  { exportName: 'actionIconStyles', file: 'src/ActionIcon/style.ts' },
  { exportName: 'alertStyles', file: 'src/Alert/style.ts' },
  { exportName: 'accordionStyles', file: 'src/Accordion/style.ts', runtime: ['panel'] },
  { exportName: 'buttonStyles', file: 'src/Button/style.ts' },
  { exportName: 'checkboxStyles', file: 'src/Checkbox/style.ts' },
  { exportName: 'menuSharedClassNames', file: 'src/DropdownMenu/style.ts' },
  { exportName: 'radioStyles', file: 'src/Radio/style.ts' },
  { exportName: 'sliderStyles', file: 'src/Slider/style.ts' },
  { exportName: 'switchStyles', file: 'src/Switch/style.ts' },
  { exportName: 'tabsStyles', file: 'src/Tabs/style.ts', runtime: ['panel', 'tab'] },
  { exportName: 'textStyles', file: 'src/Text/style.ts', runtime: ['shiny'] },
  { exportName: 'toggleGroupStyles', file: 'src/ToggleGroup/style.ts' },
];

const isStatic = (node: any): boolean => {
  if (!node || typeof node !== 'object') return true;
  if (Array.isArray(node)) return node.every(isStatic);
  if (node.type === 'CallExpression' || node.type === 'NewExpression') return false;
  return Object.entries(node).every(
    ([key, value]) =>
      ['loc', 'leadingComments', 'trailingComments'].includes(key) || isStatic(value),
  );
};

const compiledMap = (file: string, exportName: string) => {
  const filename = path.join(root, file);
  const { ast } = babel.transformSync(readFileSync(filename, 'utf8'), {
    ast: true,
    babelrc: false,
    code: false,
    configFile: false,
    filename,
    plugins: [
      [syntaxTs, { isTSX: file.endsWith('.tsx') }],
      [
        stylexBabel,
        {
          aliases: stylexOptions.aliases,
          classNamePrefix: stylexOptions.classNamePrefix,
          dev: false,
          unstable_moduleResolution: stylexOptions.unstable_moduleResolution,
        },
      ],
    ],
  });
  let init: any;
  babel.traverse(ast, {
    VariableDeclarator(declarator: any) {
      if (declarator.node.id.name === exportName) init = declarator.node.init;
    },
  });
  if (!init) throw new Error(`${exportName} is not declared in ${file}`);
  while (init.type === 'TSSatisfiesExpression' || init.type === 'TSAsExpression') {
    init = init.expression;
  }
  return init;
};

describe('exported class name maps', () => {
  it.each(maps)(
    '$exportName is computed by the StyleX compiler',
    ({ exportName, file, runtime = [] }) => {
      const map = compiledMap(file, exportName);

      expect(map.type).toBe('ObjectExpression');
      const dynamic = map.properties
        .filter((property: any) => property.type !== 'ObjectProperty' || !isStatic(property.value))
        .map((property: any) => property.key?.name ?? property.type);
      expect(dynamic).toEqual(runtime);
    },
  );
});

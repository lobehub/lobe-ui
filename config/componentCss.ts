import { createRequire } from 'node:module';

import { dropNullFields, stylexOptions } from './stylex.ts';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const { browserslistToTargets, transform } = unpluginRequire(
  'lightningcss',
) as typeof import('lightningcss');
const browserslist = unpluginRequire('browserslist') as () => string[];
const targets = browserslistToTargets(browserslist());

type Rule = { type: string; value: any };

const inLobeUi = (rule: Rule) =>
  (rule.type === 'layer-block' && rule.value.name?.[0] === 'lobe-ui') ||
  (rule.type === 'layer-statement' &&
    rule.value.names.every((name: string[]) => name[0] === 'lobe-ui'));

export const layerComponentCss = (css: string, filename: string) =>
  transform({
    code: Buffer.from(css),
    exclude: stylexOptions.lightningcssOptions.exclude,
    filename,
    targets,
    visitor: {
      StyleSheetExit(sheet) {
        const rules: Rule[] = [];
        let pending: Rule[] = [];
        const flush = () => {
          if (pending.length === 0) return;
          rules.push({
            type: 'layer-block',
            value: { loc: pending[0].value.loc, name: ['lobe-ui'], rules: pending },
          });
          pending = [];
        };
        for (const rule of sheet.rules as Rule[]) {
          if (inLobeUi(rule)) {
            flush();
            rules.push(rule);
          } else {
            pending.push(rule);
          }
        }
        flush();
        return dropNullFields({ ...sheet, rules } as typeof sheet);
      },
    },
  })
    .code.toString()
    .trim();

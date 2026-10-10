// @vitest-environment node
import { createRequire } from 'node:module';

import { stylexOptions } from './stylex';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const { browserslistToTargets, transform } = unpluginRequire(
  'lightningcss',
) as typeof import('lightningcss');
const browserslist = unpluginRequire('browserslist') as () => string[];

const run = (css: string) =>
  transform({
    code: Buffer.from(css),
    filename: 'stylex.css',
    targets: browserslistToTargets(browserslist()),
    ...stylexOptions.lightningcssOptions,
  }).code.toString();

const topLevel = (css: string) => {
  const statements: string[] = [];
  transform({
    code: Buffer.from(css),
    filename: 'out.css',
    visitor: {
      StyleSheetExit(sheet) {
        for (const rule of sheet.rules)
          statements.push(
            rule.type === 'layer-block' || rule.type === 'layer-statement'
              ? `${rule.type} ${JSON.stringify(rule.value.name ?? rule.value.names)}`
              : rule.type,
          );
      },
    },
  });
  return statements;
};

describe('StyleX lightningcss options', () => {
  const stylexOutput = `/* {;} */
@layer lobe-ui.priority1, lobe-ui.priority2;
@keyframes lbk-B{from{opacity:0}to{opacity:1}}
.lbvar{--switch-dir:1}
.lbrtl:dir(rtl){--switch-dir:-1}
@layer lobe-ui.priority2{
.lbcontent{content:"}{;"}
.lbpad{padding-inline:2px}
.lbvars{transform:translateX(calc(var(--switch-x, 0px) * var(--switch-dir)))}
.lbsel{user-select:none}
}`;

  it('moves priority-0 keyframes and custom-property rules into the first sublayer', () => {
    const css = run(stylexOutput);
    const priority1 = css.slice(0, css.indexOf('@layer lobe-ui.priority2'));

    expect(topLevel(css)).toEqual([
      'layer-block ["lobe-ui","priority1"]',
      'layer-block ["lobe-ui","priority2"]',
    ]);
    expect(priority1).toContain('@keyframes lbk-B');
    expect(priority1).toContain('--switch-dir: 1');
    expect(priority1).toContain('.lbrtl:dir(rtl)');
  });

  it('round-trips strings with braces and var() references', () => {
    const css = run(stylexOutput);

    expect(css).toContain('content: "}{;"');
    expect(css).toContain('translateX(calc(var(--switch-x, 0px) * var(--switch-dir)))');
  });

  it('keeps :dir() and logical properties but still adds vendor prefixes', () => {
    const css = run(stylexOutput);

    expect(css).toContain(':dir(rtl)');
    expect(css).not.toContain(':lang(');
    expect(css).toContain('padding-inline: 2px');
    expect(css).not.toContain('padding-left');
    expect(css).toContain('-webkit-user-select: none');
  });

  it('layers the @property rules emitted by dynamic styles', () => {
    const css = run(`@layer lobe-ui.priority1, lobe-ui.priority2;
@property --x-width { syntax: "*"; inherits: false; }
@property --x-color { syntax: "<color>"; inherits: true; initial-value: red; }
@layer lobe-ui.priority2{
.lbw{width:var(--x-width)}
}`);

    expect(topLevel(css)).toEqual([
      'layer-block ["lobe-ui","priority1"]',
      'layer-block ["lobe-ui","priority2"]',
    ]);
    expect(css).toContain('@property --x-width');
    expect(css).toContain('initial-value: red');
  });

  it('leaves output without priority-0 rules or a layer header alone', () => {
    expect(topLevel(run('.lbx{width:var(--w)}'))).toEqual(['style']);
    expect(
      run('@layer lobe-ui.priority1;\n@layer lobe-ui.priority1{.lbx{width:var(--w)}}'),
    ).toContain('width: var(--w)');
  });
});

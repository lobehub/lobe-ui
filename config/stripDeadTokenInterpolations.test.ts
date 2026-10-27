// @vitest-environment node
import { stripDeadTokenInterpolations } from './stripDeadTokenInterpolations';

describe('stripDeadTokenInterpolations', () => {
  it('blanks interpolation-only statements left behind by tree shaking', () => {
    expect(stripDeadTokenInterpolations('`${cssVar.colorError}`;')).toBe('');
    expect(stripDeadTokenInterpolations('`${colorText}${colorBorder}`;')).toBe('');
    expect(stripDeadTokenInterpolations('\t`${cssVar.colorFillTertiary}`;  ')).toBe('');
  });

  it('keeps line numbers so the emitted source maps stay aligned', () => {
    const code = 'import { cssVar } from "./x.mjs";\n`${cssVar.a}`;\nexport const keep = 1;\n';
    expect(stripDeadTokenInterpolations(code)).toBe(
      'import { cssVar } from "./x.mjs";\n\nexport const keep = 1;\n',
    );
  });

  it('leaves live code untouched', () => {
    for (const code of [
      'const tone = `${cssVar.colorText}`;',
      'const hex = `${Color.parse(cssVar.colorText)}`;',
      '`${cssVar.colorText} 88%, white`;',
      'console.log(`${cssVar.colorText}`);',
      '`${"literal"}`;',
    ]) {
      expect(stripDeadTokenInterpolations(code)).toBe(code);
    }
  });
});

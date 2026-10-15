import { parse } from './ast';

describe('parse', () => {
  it('accepts TypeScript decorators', () => {
    expect(() =>
      parse(`@Controller()\nexport class A {\n  @Get('/') get() {}\n}`, 'a.ts'),
    ).not.toThrow();
  });

  it('accepts a top-level return in CommonJS files', () => {
    expect(() => parse(`if (x) return;\nmodule.exports = {};`, 'main.js')).not.toThrow();
  });
});

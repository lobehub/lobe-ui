import { createRequire } from 'node:module';

const unpluginRequire = createRequire(createRequire(import.meta.url).resolve('@stylexjs/unplugin'));
const { transform } = unpluginRequire('lightningcss') as typeof import('lightningcss');

const PREFIX = /^(lb|lobe-)/;

const collectClasses = (selector: any[], classes: string[]) => {
  for (const component of selector) {
    if (component.type === 'class') classes.push(component.name);
    if (Array.isArray(component.selectors)) {
      for (const inner of component.selectors) collectClasses(inner, classes);
    }
  }
  return classes;
};

export const unscopedSelectors = (css: string, filename = 'style.css') => {
  const unscoped: string[] = [];
  transform({
    code: Buffer.from(css),
    filename,
    visitor: {
      Rule: {
        style(rule) {
          for (const selector of rule.value.selectors) {
            const classes = collectClasses(selector, []);
            if (classes.length > 0 && !classes.some((name) => PREFIX.test(name)))
              unscoped.push(classes.map((name) => `.${name}`).join(' '));
          }
        },
      },
    },
  });
  return unscoped;
};

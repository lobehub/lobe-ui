import type { Root, RootContent } from 'hast';

import type { DocumentHeading } from '../../types/content';
import { readText, visitElements } from './rehypeHeadingIds';

const literal = (value: number | string) => ({
  raw: JSON.stringify(value),
  type: 'Literal',
  value,
});

const headingExpression = (heading: DocumentHeading) => ({
  properties: Object.entries(heading).map(([key, value]) => ({
    computed: false,
    key: { name: key, type: 'Identifier' },
    kind: 'init',
    method: false,
    shorthand: false,
    type: 'Property',
    value: literal(value),
  })),
  type: 'ObjectExpression',
});

export function rehypeTocExport(): (tree: Root) => void {
  return (tree) => {
    const headings: DocumentHeading[] = [];
    visitElements(tree, (element) => {
      if (element.tagName !== 'h2' && element.tagName !== 'h3') return;
      const id = element.properties?.id;
      const title = readText(element).trim();
      if (typeof id !== 'string' || !id || !title) return;
      headings.push({ id, level: element.tagName === 'h3' ? 3 : 2, title });
    });

    const declaration = `export const toc = ${JSON.stringify(headings)};`;
    tree.children.push({
      data: {
        estree: {
          body: [
            {
              declaration: {
                declarations: [
                  {
                    id: { name: 'toc', type: 'Identifier' },
                    init: { elements: headings.map(headingExpression), type: 'ArrayExpression' },
                    type: 'VariableDeclarator',
                  },
                ],
                kind: 'const',
                type: 'VariableDeclaration',
              },
              source: null,
              specifiers: [],
              type: 'ExportNamedDeclaration',
            },
          ],
          sourceType: 'module',
          type: 'Program',
        },
      },
      type: 'mdxjsEsm',
      value: declaration,
    } as unknown as RootContent);
  };
}

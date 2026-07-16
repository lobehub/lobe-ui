import type { Element, Nodes, Parent, Root } from 'hast';

const headingTagPattern = /^h[1-6]$/;
const reservedShellIds = new Set(['docs-content', 'docs-page-content']);

const visitElements = (node: Nodes, visitor: (element: Element) => void): void => {
  if (node.type === 'element') visitor(node);
  if ('children' in node) {
    for (const child of (node as Parent).children) visitElements(child, visitor);
  }
};

const readText = (node: Nodes): string => {
  if (node.type === 'text') return node.value;
  if (!('children' in node)) return '';
  return (node as Parent).children.map((child) => readText(child)).join('');
};

export const createHeadingSlug = (value: string): string =>
  value
    .normalize('NFKC')
    .trim()
    .toLocaleLowerCase('en')
    .replaceAll(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replaceAll(/(^-|-$)/g, '') || 'section';

export function rehypeHeadingIds(): (tree: Root) => void {
  return (tree) => {
    const explicitIds = new Set<string>();
    visitElements(tree, (element) => {
      const id = element.properties?.id;
      if (typeof id === 'string' && id) explicitIds.add(id);
    });

    const usedIds = new Set([...reservedShellIds, ...explicitIds]);
    visitElements(tree, (element) => {
      if (!headingTagPattern.test(element.tagName)) return;
      const explicitId = element.properties?.id;
      if (typeof explicitId === 'string' && explicitId) return;

      const baseId = createHeadingSlug(readText(element));
      let id = baseId;
      let suffix = 2;
      while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
      usedIds.add(id);
      element.properties ??= {};
      element.properties.id = id;
    });
  };
}

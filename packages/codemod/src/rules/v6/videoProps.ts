import { namedImports, walk } from '../../ast';
import type { Rule } from '../../report';

const REMOVED_PROPS: Record<string, string> = {
  classNames:
    '`classNames.wrapper` / `classNames.video` are now `classNames.root` / `classNames.frame`; `classNames.mask` is gone',
  isLoading: '`isLoading` is gone; render `Skeleton` yourself while loading',
  maxWidth: '`maxWidth` is gone; pass it through `style`',
  minHeight: '`minHeight` is gone; pass it through `style`',
  minWidth: '`minWidth` is gone; pass it through `style`',
  preview: '`preview` (the hover mask) is gone; the player controls replace it',
  size: '`size` is gone; use `width` / `height`',
  styles:
    '`styles.wrapper` / `styles.video` are now `styles.root` / `styles.frame`; `styles.mask` is gone',
  variant: '`variant` is gone; the frame is borderless, wrap it in `Block` for a border',
};

export const videoProps: Rule = ({ ast, report }) => {
  const locals = new Set(
    namedImports(ast, (source) => source === '@lobehub/ui').flatMap(({ name, specifier }) =>
      name === 'Video' && specifier.type === 'ImportSpecifier' ? [specifier.local.name] : [],
    ),
  );
  if (locals.size === 0) return;

  walk(ast, (node) => {
    if (node.type !== 'JSXOpeningElement' || node.name.type !== 'JSXIdentifier') return;
    if (!locals.has(node.name.name)) return;
    for (const attribute of node.attributes) {
      if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') continue;
      const fix = REMOVED_PROPS[attribute.name.name];
      if (fix) report(attribute, { anchor: 'components', message: `${fix}.`, rule: 'R10' });
    }
  });
};

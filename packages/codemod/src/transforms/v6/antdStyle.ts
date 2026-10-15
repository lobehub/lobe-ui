import type { ImportDeclaration, ImportSpecifier, Node } from '@babel/types';

import { boundNames, importedName, walk } from '../../ast';
import type { Transform } from '../../transform';

export const SUPPORTED_ANTD_STYLE_VALUES = new Set([
  'createGlobalStyle',
  'createStaticStyles',
  'css',
  'cssVar',
  'cx',
  'extractStaticStyle',
  'injectGlobal',
  'keyframes',
  'responsive',
  'useResponsive',
  'useTheme',
  'useThemeMode',
]);

export const ANTD_STYLE_TYPE_RENAMES: Record<string, string> = {
  Theme: 'LobeTheme',
  ThemeAppearance: 'LobeAppearance',
};

const TYPE_REFERENCE_PARENTS: Record<string, string> = {
  TSClassImplements: 'expression',
  TSExpressionWithTypeArguments: 'expression',
  TSInterfaceHeritage: 'expression',
  TSQualifiedName: 'left',
  TSTypeQuery: 'exprName',
  TSTypeReference: 'typeName',
};

const renameTypeReferences = (
  ast: Node,
  from: string,
  to: string,
  overwrite: (node: Node) => void,
) => {
  walk(ast, (node, parent) => {
    if (node.type !== 'Identifier' || node.name !== from || !parent) return;
    const key = TYPE_REFERENCE_PARENTS[parent.type];
    if (key && (parent as any)[key] === node) overwrite(node);
  });
};

const DECLARATION_TYPES = new Set([
  'ClassDeclaration',
  'TSEnumDeclaration',
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
]);

const isShadowed = (ast: Node, name: string) => {
  let shadowed = false;
  walk(ast, (node) => {
    if (shadowed) return;
    if (node.type === 'TSTypeParameter') {
      const param = node.name as unknown;
      shadowed = (typeof param === 'string' ? param : (param as { name: string }).name) === name;
    } else if (DECLARATION_TYPES.has(node.type)) {
      shadowed = (node as { id?: { name?: string } }).id?.name === name;
    } else if (node.type === 'ExportSpecifier' && node.local.type === 'Identifier') {
      shadowed = node.local.name === name;
    }
  });
  return shadowed;
};

export const antdStyle: Transform = ({ ast, code, ms }) => {
  const declarations = ast.program.body.filter(
    (node): node is ImportDeclaration =>
      node.type === 'ImportDeclaration' && node.source.value === 'antd-style',
  );
  if (declarations.length === 0) return;

  const bound = boundNames(ast);

  for (const declaration of declarations) {
    if (declaration.specifiers.some((s) => s.type !== 'ImportSpecifier')) continue;
    const specifiers = declaration.specifiers as ImportSpecifier[];

    const renames = new Map<ImportSpecifier, string>();
    const moved = specifiers.filter((specifier) => {
      const name = importedName(specifier);
      if (SUPPORTED_ANTD_STYLE_VALUES.has(name)) return true;
      const target = ANTD_STYLE_TYPE_RENAMES[name];
      if (!target || bound.has(target) || isShadowed(ast, specifier.local.name)) return false;
      renames.set(specifier, target);
      return true;
    });
    if (moved.length === 0) continue;

    const specifierText = (specifier: ImportSpecifier) => {
      const text = code.slice(specifier.start!, specifier.end!);
      const target = renames.get(specifier);
      if (!target) return text;
      const offset = specifier.imported.start! - specifier.start!;
      return (
        text.slice(0, offset) + target + text.slice(specifier.imported.end! - specifier.start!)
      );
    };

    for (const [specifier, target] of renames) {
      if (specifier.local.name === importedName(specifier)) {
        renameTypeReferences(ast, specifier.local.name, target, (node) =>
          ms.overwrite(node.start!, node.end!, target),
        );
      }
    }

    const quote = code[declaration.source.start!];
    if (moved.length === specifiers.length) {
      for (const specifier of renames.keys()) {
        ms.overwrite(specifier.imported.start!, specifier.imported.end!, renames.get(specifier)!);
      }
      ms.overwrite(
        declaration.source.start!,
        declaration.source.end!,
        `${quote}@lobehub/ui${quote}`,
      );
      continue;
    }

    const keyword = declaration.importKind === 'type' ? 'import type' : 'import';
    const rest = specifiers.filter((s) => !moved.includes(s));
    const line = (list: ImportSpecifier[], source: string) =>
      `${keyword} { ${list.map(specifierText).join(', ')} } from ${quote}${source}${quote};`;
    ms.overwrite(
      declaration.start!,
      declaration.end!,
      `${line(moved, '@lobehub/ui')}\n${line(rest, 'antd-style')}`,
    );
  }
};

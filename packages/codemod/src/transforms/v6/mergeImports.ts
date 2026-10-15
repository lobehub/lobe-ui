import type { ImportDeclaration } from '@babel/types';

import type { Transform } from '../../transform';

const MAX_LINE = 100;

const isMergeable = (node: ImportDeclaration) =>
  node.source.value.startsWith('@lobehub/ui') &&
  node.specifiers.length > 0 &&
  node.specifiers.every((s) => s.type === 'ImportSpecifier');

export const mergeImports: Transform = ({ ast, code, ms }) => {
  const groups = new Map<string, ImportDeclaration[]>();
  for (const [index, node] of ast.program.body.entries()) {
    if (node.type !== 'ImportDeclaration' || !isMergeable(node)) continue;
    if (index > 0 && node.leadingComments?.length) continue;
    const key = `${node.importKind === 'type' ? 'type' : 'value'}:${node.source.value}`;
    groups.set(key, [...(groups.get(key) ?? []), node]);
  }

  for (const declarations of groups.values()) {
    if (declarations.length < 2) continue;
    const [first, ...others] = declarations;
    const specifiers = declarations.flatMap((d) =>
      d.specifiers.map((s) => code.slice(s.start!, s.end!)),
    );
    const keyword = first.importKind === 'type' ? 'import type' : 'import';
    const quote = code[first.source.start!];
    const source = `${quote}${first.source.value}${quote}`;
    const inline = `${keyword} { ${specifiers.join(', ')} } from ${source};`;
    const wasMultiline = declarations.some((d) => code.slice(d.start!, d.end!).includes('\n'));
    const text =
      wasMultiline || inline.length > MAX_LINE
        ? `${keyword} {\n${specifiers.map((s) => `  ${s},`).join('\n')}\n} from ${source};`
        : inline;
    ms.overwrite(first.start!, first.end!, text);
    for (const declaration of others) {
      if (code[declaration.end!] === '\n') ms.remove(declaration.start!, declaration.end! + 1);
      else if (code[declaration.start! - 1] === '\n')
        ms.remove(declaration.start! - 1, declaration.end!);
      else ms.remove(declaration.start!, declaration.end!);
    }
  }
};

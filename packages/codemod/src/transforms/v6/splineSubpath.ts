import type {
  ExportNamedDeclaration,
  ExportSpecifier,
  ImportDeclaration,
  ImportSpecifier,
} from '@babel/types';

import { moduleSources } from '../../ast';
import type { Transform } from '../../transform';

export const SPLINE_SUBPATH = '@lobehub/ui/spline';

export const SPLINE_MOVES: Record<string, Set<string>> = {
  '@lobehub/ui/awesome': new Set(['Spline', 'SplineProps']),
  '@lobehub/ui/brand': new Set(['LogoSpline', 'LogoSplineProps', 'LogoThree', 'LogoThreeProps']),
};

const DEEP_PATHS: [RegExp, string][] = [
  [/^@lobehub\/ui\/es\/awesome\/Spline(?=\/|$)/, '@lobehub/ui/es/spline/Spline'],
  [/^@lobehub\/ui\/es\/brand\/LogoThree(?=\/|$)/, '@lobehub/ui/es/spline/LogoThree'],
];

type NamedSpecifier = ImportSpecifier | ExportSpecifier;

const nameOf = (node: ImportSpecifier['imported'] | ExportSpecifier['local']) =>
  node.type === 'Identifier' ? node.name : node.value;

const sourceName = (specifier: NamedSpecifier) =>
  specifier.type === 'ImportSpecifier' ? nameOf(specifier.imported) : nameOf(specifier.local);

export const splineSubpath: Transform = ({ ast, code, ms }) => {
  for (const source of moduleSources(ast)) {
    for (const [pattern, replacement] of DEEP_PATHS) {
      if (!pattern.test(source.value)) continue;
      ms.overwrite(source.start! + 1, source.end! - 1, source.value.replace(pattern, replacement));
      break;
    }
  }

  for (const node of ast.program.body) {
    const declaration =
      node.type === 'ImportDeclaration' || (node.type === 'ExportNamedDeclaration' && node.source)
        ? (node as ImportDeclaration | ExportNamedDeclaration)
        : undefined;
    const moves = declaration?.source && SPLINE_MOVES[declaration.source.value];
    if (!declaration || !moves) continue;
    if (
      declaration.specifiers.some(
        (s) => s.type !== 'ImportSpecifier' && s.type !== 'ExportSpecifier',
      )
    )
      continue;

    const specifiers = declaration.specifiers as NamedSpecifier[];
    const moved = specifiers.filter((specifier) => moves.has(sourceName(specifier)));
    if (moved.length === 0) continue;

    const quote = code[declaration.source!.start!];
    if (moved.length === specifiers.length) {
      ms.overwrite(
        declaration.source!.start!,
        declaration.source!.end!,
        `${quote}${SPLINE_SUBPATH}${quote}`,
      );
      continue;
    }

    const isExport = declaration.type === 'ExportNamedDeclaration';
    const kind = isExport ? declaration.exportKind : declaration.importKind;
    const keyword = `${isExport ? 'export' : 'import'}${kind === 'type' ? ' type' : ''}`;
    const rest = specifiers.filter((specifier) => !moved.includes(specifier));
    const line = (list: NamedSpecifier[], target: string) =>
      `${keyword} { ${list.map((s) => code.slice(s.start!, s.end!)).join(', ')} } from ${quote}${target}${quote};`;
    ms.overwrite(
      declaration.start!,
      declaration.end!,
      `${line(moved, SPLINE_SUBPATH)}\n${line(rest, declaration.source!.value)}`,
    );
  }
};

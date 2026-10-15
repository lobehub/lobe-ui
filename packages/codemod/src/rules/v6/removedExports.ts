import { namedImports } from '../../ast';
import type { Rule } from '../../report';
import removed from '../../transforms/v6/data/removed-exports.json';
import typeOnlyExports from '../../transforms/v6/data/type-only-exports.json';
import { REMOVED_TOKEN_HELPERS } from './staticCss';
import { THEME_PROVIDER_NAMES } from './themeProvider';

const table = removed as Record<string, Record<string, string | null>>;
const typeOnly = new Set<string>(typeOnlyExports);

const isTypeImport = (
  declaration: { importKind?: string | null; exportKind?: string | null },
  specifier: object,
) =>
  declaration.importKind === 'type' ||
  declaration.exportKind === 'type' ||
  (specifier as { importKind?: string | null }).importKind === 'type' ||
  (specifier as { exportKind?: string | null }).exportKind === 'type';

const subpathOf = (source: string) => {
  if (source === '@lobehub/ui') return '.';
  if (source.startsWith('@lobehub/ui/')) return `./${source.slice('@lobehub/ui/'.length)}`;
};

export const removedExports: Rule = ({ ast, report }) => {
  for (const { declaration, name, specifier } of namedImports(ast, (s) => Boolean(subpathOf(s)))) {
    const entry = table[subpathOf(declaration.source!.value)!];
    if (
      !entry ||
      !(name in entry) ||
      THEME_PROVIDER_NAMES.has(name) ||
      name in REMOVED_TOKEN_HELPERS
    ) {
      continue;
    }
    if (typeOnly.has(name) && isTypeImport(declaration, specifier)) continue;
    const replacement = entry[name];
    report(specifier, {
      anchor: 'components',
      message: replacement
        ? `\`${name}\` was removed from ${declaration.source!.value}. Use ${replacement}.`
        : `\`${name}\` was removed from ${declaration.source!.value} and has no successor.`,
      rule: 'R4',
    });
  }
};

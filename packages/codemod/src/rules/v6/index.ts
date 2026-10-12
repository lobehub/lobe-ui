import type { Rule } from '../../report';
import { antClassNames } from './antClassNames';
import { antdImports } from './antdImports';
import { changedComponents } from './changedComponents';
import { removedExports } from './removedExports';
import { removedSubpathStrings } from './removedSubpathStrings';
import { staticCss } from './staticCss';
import { styleProvider } from './styleProvider';
import { themeMode } from './themeMode';
import { themeProvider } from './themeProvider';

export const v6Rules: Rule[] = [
  themeProvider,
  styleProvider,
  staticCss,
  removedExports,
  removedSubpathStrings,
  changedComponents,
  antdImports,
  themeMode,
  antClassNames,
];

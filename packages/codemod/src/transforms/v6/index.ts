import type { Transform } from '../../transform';
import { antdStyle } from './antdStyle';
import { baseUiSubpath } from './baseUiSubpath';
import { mergeImports } from './mergeImports';

export const v6Transforms: Transform[] = [baseUiSubpath, antdStyle, mergeImports];

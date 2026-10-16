import type { Transform } from '../../transform';
import { antdStyle } from './antdStyle';
import { baseUiSubpath } from './baseUiSubpath';
import { mergeImports } from './mergeImports';
import { splineSubpath } from './splineSubpath';

export const v6Transforms: Transform[] = [baseUiSubpath, antdStyle, splineSubpath, mergeImports];

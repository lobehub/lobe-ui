import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';

import { menuClassNames, menuStyles } from './style';

export { menuClassNames, menuStyles } from './style';

export const styles = Object.fromEntries(
  Object.entries(menuStyles).map(([key, value]) => [
    key,
    clsx(stylex.props(value).className, menuClassNames[key as keyof typeof menuClassNames]),
  ]),
) as Record<keyof typeof menuStyles, string>;

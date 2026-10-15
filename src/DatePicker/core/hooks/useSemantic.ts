import { useMemo } from 'react';

import type { SharedPickerProps } from '../interface';

export type FilledPanelClassNames = NonNullable<
  NonNullable<SharedPickerProps['classNames']>['popup']
>;

export type FilledPanelStyles = NonNullable<NonNullable<SharedPickerProps['styles']>['popup']>;

export type FilledClassNames = NonNullable<SharedPickerProps['classNames']> & {
  popup: FilledPanelClassNames;
};

export type FilledStyles = NonNullable<SharedPickerProps['styles']> & {
  popup: FilledPanelStyles;
};

/**
 * Convert `classNames` & `styles` to a fully filled object
 */
export default function useSemantic(
  classNames?: SharedPickerProps['classNames'],
  styles?: SharedPickerProps['styles'],
) {
  return useMemo(() => {
    const mergedClassNames: FilledClassNames = {
      ...classNames,
      popup: classNames?.popup || {},
    };

    const mergedStyles: FilledStyles = {
      ...styles,
      popup: styles?.popup || {},
    };

    return [mergedClassNames, mergedStyles] as const;
  }, [classNames, styles]);
}

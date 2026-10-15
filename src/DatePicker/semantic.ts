import clsx from 'clsx';
import type { CSSProperties } from 'react';

import type {
  PickerClassNames,
  PickerPopupSemanticName,
  PickerSemanticClassNames,
  PickerSemanticName,
  PickerSemanticStyles,
  PickerStyles,
} from './type';

export interface FilledPickerClassNames extends Partial<Record<PickerSemanticName, string>> {
  popup: Partial<Record<PickerPopupSemanticName, string>>;
}

export interface FilledPickerStyles extends Partial<Record<PickerSemanticName, CSSProperties>> {
  popup: Partial<Record<PickerPopupSemanticName, CSSProperties>>;
}

const resolve = <T, P>(value: T | ((info: { props: P }) => T) | undefined, props: P) =>
  typeof value === 'function' ? (value as (info: { props: P }) => T)({ props }) : value;

export const mergePickerSemantic = <P>({
  classNames,
  popupClassName,
  popupStyle,
  props,
  styles,
}: {
  classNames?: PickerClassNames<P>;
  popupClassName?: string;
  popupStyle?: CSSProperties;
  props: P;
  styles?: PickerStyles<P>;
}): [FilledPickerClassNames, FilledPickerStyles] => {
  const resolvedClassNames: PickerSemanticClassNames = resolve(classNames, props) ?? {};
  const resolvedStyles: PickerSemanticStyles = resolve(styles, props) ?? {};
  const { popup, ...rootClassNames } = resolvedClassNames;
  const popupClassNames = typeof popup === 'string' ? { root: popup } : popup;

  return [
    {
      ...rootClassNames,
      popup: { ...popupClassNames, root: clsx(popupClassNames?.root, popupClassName) || undefined },
    },
    {
      ...resolvedStyles,
      popup: { ...resolvedStyles.popup, root: { ...resolvedStyles.popup?.root, ...popupStyle } },
    },
  ];
};

import type { CSSProperties } from 'react';

import { cx } from '@/utils/styleEngine';

import type {
  PickerClassNames,
  PickerPopupSemanticName,
  PickerSemanticClassNames,
  PickerSemanticName,
  PickerSemanticStyles,
  PickerStyles,
} from './type';

/** What rc-picker reads: every popup entry is an object. */
export interface FilledPickerClassNames extends Partial<Record<PickerSemanticName, string>> {
  popup: Partial<Record<PickerPopupSemanticName, string>>;
}

export interface FilledPickerStyles extends Partial<Record<PickerSemanticName, CSSProperties>> {
  popup: Partial<Record<PickerPopupSemanticName, CSSProperties>>;
}

const resolve = <T, P>(value: T | ((info: { props: P }) => T) | undefined, props: P) =>
  typeof value === 'function' ? (value as (info: { props: P }) => T)({ props }) : value;

/**
 * antd's `useMergedPickerSemantic`: resolves the function forms with `{ props }`, expands a
 * `classNames.popup` string to `popup.root`, and merges the deprecated `popupClassName` /
 * `dropdownClassName` / `popupStyle` into `popup.root`.
 */
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
      popup: { ...popupClassNames, root: cx(popupClassNames?.root, popupClassName) || undefined },
    },
    {
      ...resolvedStyles,
      popup: { ...resolvedStyles.popup, root: { ...resolvedStyles.popup?.root, ...popupStyle } },
    },
  ];
};

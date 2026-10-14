import * as React from 'react';

import { useEvent } from '../../hooks/react';

// ============================= Types =============================
/** Focus event source. / 焦点事件来源。 */
export type FocusSource = 'input' | 'panel';

/** React focus event used by Picker elements. / Picker 元素使用的 React 焦点事件。 */
export type PickerFocusEvent = React.FocusEvent<HTMLElement>;

/** Focus event handler. / 聚焦事件处理函数。 */
export type FieldFocusHandler = (
  index: number,
  source: FocusSource,
  event: PickerFocusEvent,
) => void;

/** Blur event handler. / 失焦事件处理函数。 */
export type FieldBlurHandler = (
  index: number,
  source: FocusSource,
  event: PickerFocusEvent,
) => void;

/** Check whether an element belongs to the current focus scope. / 检查元素是否属于当前焦点范围。 */
export type IsInternalElement = (element: EventTarget | null) => boolean;

/** Notify a Picker focus or blur event. / 通知 Picker 的聚焦或失焦事件。 */
export type FocusEventHandler = (index: number, event: PickerFocusEvent) => void;

export type UseFocusEventsReturn = [
  focused: boolean,
  onFieldFocus: FieldFocusHandler,
  onFieldBlur: FieldBlurHandler,
];

// ============================= Utils =============================
/** Check whether the target belongs to any container. / 判断目标是否属于任意一个容器。 */
export function isTargetInContainers(
  target: EventTarget | null,
  containers: readonly (Element | null | undefined)[],
) {
  return containers.some(
    (container) => !!container && (container === target || container.contains(target as Node)),
  );
}

/**
 * Handle field focus and blur events.
 * 处理 field 的聚焦与失焦事件。
 *
 * Always forward the actual element focus events. Only the internal Picker
 * blur is skipped when `relatedTarget` still belongs to the Picker or the
 * focused panel control becomes disabled.
 * 始终转发元素实际发生的焦点事件。当 `relatedTarget` 仍属于 Picker，或面板中
 * 获得焦点的控件变为禁用时，跳过 Picker 的整体失焦逻辑。
 */
export default function useFocusEvents(
  isInternalElement: IsInternalElement,
  onFocus?: FocusEventHandler,
  onBlur?: FocusEventHandler,
  onConfirmedBlur?: FocusEventHandler,
): UseFocusEventsReturn {
  // Keep the actual focused field so every field focus causes a render. This
  // gives `useFocusLock` a commit in which it can correct an invalid switch.
  // 记录实际获得焦点的 field，使每次 field focus 都会触发渲染；
  // `useFocusLock` 因此可以在 commit 后纠正不允许的切换。
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(null);

  const onFieldFocus = useEvent((index: number, _source: FocusSource, event: PickerFocusEvent) => {
    setFocusedIndex(index);
    onFocus?.(index, event);
  });

  const onFieldBlur = useEvent((index: number, source: FocusSource, event: PickerFocusEvent) => {
    const isDisabledTarget = source === 'panel' && event.target.hasAttribute('disabled');

    if (isDisabledTarget) {
      event.currentTarget.focus({ preventScroll: true });
    } else if (!isInternalElement(event.relatedTarget)) {
      setFocusedIndex(null);
      onConfirmedBlur?.(index, event);
    }

    onBlur?.(index, event);
  });

  return [focusedIndex !== null, onFieldFocus, onFieldBlur];
}

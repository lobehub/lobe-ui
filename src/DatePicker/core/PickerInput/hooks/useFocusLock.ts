import * as React from 'react';

import { useEvent, useLayoutEffect } from '../../hooks/react';
import { isTargetInContainers } from './useFocusEvents';

interface FocusLockSelectorRef {
  endInput: HTMLElement;
  focus: (index?: number) => void;
  startInput: HTMLElement;
}

/**
 * Keep focus on the specified input field while focus moves inside the Picker.
 * 当焦点在 Picker 内移动时，将其锁定在指定的输入框上。
 */
export default function useFocusLock(
  index: number | null,
  forceFocus: boolean,
  selectorRef: React.RefObject<FocusLockSelectorRef | null>,
  popupRef: React.RefObject<HTMLElement | null>,
  triggerOpen: (open: boolean) => void,
) {
  const openPicker = useEvent(() => {
    triggerOpen(true);
  });

  // Only a strong transition actively opens the Picker and moves DOM focus.
  // Weak transitions keep the expected index without stealing external focus.
  // 仅强切换会主动打开 Picker 并移动 DOM 焦点；弱切换只保留预期 index，
  // 不抢占外部元素的焦点。
  React.useEffect(() => {
    if (index !== null && forceFocus) {
      openPicker();
      selectorRef.current?.focus(index);
    }
  }, [index, forceFocus, openPicker]);

  // DOM focus may change while `index` stays the same, so check after every commit.
  // DOM 焦点变化时 `index` 可能保持不变，因此每次 commit 后都需要检查。
  useLayoutEffect(() => {
    if (index === null) {
      return;
    }

    const inputFields = [selectorRef.current?.startInput, selectorRef.current?.endInput];
    const inputRoot = inputFields[index]?.getRootNode() as Document | ShadowRoot | undefined;

    // `document.activeElement` stops at the shadow host. Read from the input's
    // own root first so focus locking can identify the actual field.
    // `document.activeElement` 在 Shadow DOM 中只会返回 host。优先读取 input
    // 所属 root，才能识别实际聚焦的 field。
    const activeElement = inputRoot?.activeElement ?? document.activeElement;

    if (isTargetInContainers(activeElement, [popupRef.current])) {
      return;
    }

    const focusInOtherField = inputFields.some(
      (field, fieldIndex) => fieldIndex !== index && isTargetInContainers(activeElement, [field]),
    );

    if (focusInOtherField) {
      inputFields[index]?.focus();
    }
  });
}

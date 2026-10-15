import * as React from 'react';

import { useEvent, useLatestState } from '../../hooks/react';

// ============================= Types =============================

/** Change source of a field. / Field 的变更来源。 */
export type RangeValueChangeSource =
  | 'input'
  | 'remove'
  | 'keyboard-submit'
  | 'keyboard-submit-weak'
  | 'esc'
  | 'panel-intermediate'
  | 'panel-final'
  | 'popupClose'
  | 'field-switch'
  | 'confirm';

/** Resolved operation for one field interaction. / 一次 field 交互最终执行的操作。 */
export type RangeValueChangeAction =
  | 'modify'
  | 'submitCurrent'
  | 'switchNext'
  | 'finish'
  | 'abort'
  | 'resetCurrent'
  | 'resetCurrentAndSwitchNext'
  | 'resetAll';

/** Receive a field interaction and its optional value. / 接收 field 交互及可选变更值。 */
export type TriggerChange<FieldValue> = (
  index: number,
  source: RangeValueChangeSource,
  value?: FieldValue,
) => void;

/** Read the latest temporary CalendarValue. / 读取最新的临时 CalendarValue。 */
export type GetCalendarValue<FieldValue> = () => readonly (FieldValue | null | undefined)[];

/** Update one field in CalendarValue. / 更新 CalendarValue 中的一个 field。 */
export type TriggerCalendarChange<FieldValue> = (index: number, value: FieldValue) => void;

/**
 * Flush one field and optionally emit the final change.
 * 提交一个 field，并按需触发最终 change。
 */
export type FlushSubmit = (index: number, needTriggerChange: boolean) => void;

/**
 * Reset one field, or all fields when index is omitted.
 * 重置指定 field；未传 index 时重置全部 field。
 */
export type ResetValue = (index?: number) => void;

export type UseRangeValueChangeReturn<FieldValue> = [
  currentIndex: number | null,
  activeIndex: number,
  forceFocus: boolean,
  triggeredFields: number[],
  triggerChange: TriggerChange<FieldValue>,
  reset: VoidFunction,
];

interface TriggeredField {
  index: number;
  modified: boolean;
}

// ============================== Hook ==============================

/**
 * Coordinate CalendarValue updates, part submits and final submits for any
 * number of fields.
 * 统一管理任意数量 field 的 CalendarValue 更新、局部提交与最终提交。
 *
 * Flow / 流程：
 * Every event is first resolved from `source`, `needConfirm`, `allowEmpty` and
 * the field indexes to one action. State changes only happen while executing
 * that action, so event sources never submit or reset values on their own.
 * 每个事件先根据 `source`、`needConfirm`、`allowEmpty` 与 field index 得到唯一
 * action。状态只在执行 action 时改变，事件来源本身不直接提交或重置值。
 *
 * Index transitions also expose whether focus must follow the next field.
 * Confirm-like operations and a popup close following a panel operation
 * switch focus strongly. A popup close following input, Tab and an actual
 * field focus switch only update the expected index.
 * index 切换还会同步给出是否必须跟随聚焦下一个 field。确认类操作，以及面板
 * 操作后的 popup 关闭使用强切换；input 后的 popup 关闭、Tab 与真实 field
 * 聚焦切换只更新预期 index。
 *
 * Source resolution / 事件解析：
 *
 * - `esc` always resolves to `resetAll`.
 *   `esc` 始终解析为 `resetAll`。
 * - With no current field, `popupClose` resolves to `resetAll`; any other
 *   non-cancel event starts a new interaction from its field.
 *   没有当前 field 时，`popupClose` 解析为 `resetAll`；其余非撤销事件从
 *   对应 field 开始新一轮交互。
 * - `field-switch` advances exactly one field in circular order. `needConfirm`
 *   locks an unconfirmed non-empty field unless it allows empty; an allow-empty
 *   field is reset before advancing.
 *   `field-switch` 只允许按循环顺序推进一个 field。`needConfirm` 会锁定未确认
 *   且非空的 field；允许空值时先重置再推进。
 * - Other sources must target the current field. `input` and
 *   `panel-intermediate` modify it; `remove` explicitly submits the removed
 *   value even when the field does not allow empty. `panel-final` advances only
 *   without confirmation; `keyboard-submit-weak` part-submits without
 *   advancing; `keyboard-submit` and `confirm` advance only when the field has
 *   a value or allows empty.
 *   其余来源必须指向当前 field。`input` 与 `panel-intermediate` 只修改；
 *   `remove` 会明确提交删除后的值，即使 field 不允许为空；`panel-final`
 *   仅在无需确认时推进；`keyboard-submit-weak` 只做局部提交而不推进；
 *   `keyboard-submit` 与 `confirm` 仅在有值或允许空值时推进。
 * - `popupClose` finishes an untouched interaction. Without confirmation it
 *   submits a valid field; with confirmation it submits only after every field
 *   has participated, otherwise it resets all temporary values. A modified
 *   allow-empty field is reset before the final submit.
 *   `popupClose` 会直接结束未修改的交互。无需确认时提交有效 field；需要确认时
 *   仅在所有 field 都参与过后提交，否则重置全部临时值。当前 field 已修改且
 *   允许为空时，会先重置当前值再完成提交。
 *
 * Action execution / Action 执行：
 *
 * - `modify`: update or record the current CalendarValue.
 *   更新或记录当前 CalendarValue。
 * - `submitCurrent`: part-submit the current field without advancing.
 *   局部提交当前 field，但不推进。
 * - `switchNext`: submit the current field and advance to the next field.
 *   提交当前 field 并推进到下一个 field。
 * - `finish`: end an interaction in which no field was modified without
 *   resetting values. / 结束所有 field 均未修改的交互，不重置任何值。
 * - `abort`: stop without changing any state.
 *   直接短路，不改变任何状态。
 * - `resetCurrent`: discard only the current field.
 *   仅撤销当前 field。
 * - `resetCurrentAndSwitchNext`: discard the current temporary value and
 *   advance without submitting. Revisiting a field starts a new round.
 *   撤销当前临时值并直接推进，不触发提交；再次进入已访问 field 时开启新一轮。
 * - `resetAll`: discard all temporary values and end the interaction.
 *   撤销全部临时值并结束本轮交互。
 */
export default function useRangeValueChange<FieldValue = unknown>(
  fieldCount: number,
  needConfirm: boolean,
  allowEmpty: readonly boolean[],
  getCalendarValue: GetCalendarValue<FieldValue>,
  triggerCalendarChange: TriggerCalendarChange<FieldValue>,
  flushSubmit: FlushSubmit,
  resetValue: ResetValue,
): UseRangeValueChangeReturn<FieldValue> {
  // ============================= State =============================

  // Record fields involved in the current interaction and whether each field
  // has been modified since it became active.
  // 记录当前一轮交互中触发过的 field，以及它从本次激活后是否发生过修改。
  const triggeredFieldsRef = React.useRef<TriggeredField[]>([]);

  // Track the last explicitly confirmed field. `triggeredFields` also records
  // focus, so it cannot tell confirmed and unconfirmed values apart.
  // 记录最后一个明确确认过的 field。`triggeredFields` 同时记录 focus，
  // 因此无法单独区分已确认值与未确认值。
  const confirmedIndexRef = React.useRef<number | null>(null);

  // Mark whether the latest value update came from the input.
  // 标记最近一次值更新是否来自 input。
  const isLastInputRef = React.useRef(false);

  // Keep a render value and a synchronous getter for event handlers.
  // 同时保存渲染值，以及供事件处理函数同步读取的 getter。
  const [getCurrentIndex, setCurrentIndex] = useLatestState<number | null>(null);

  // Record whether the latest index transition must actively move DOM focus.
  // 记录最近一次 index 切换是否需要主动移动 DOM 焦点。
  const [getForceFocus, setForceFocus] = useLatestState(false);

  // Keep the latest accepted field for panel and selector rendering.
  // 保留最后一个被业务接受的 field，供 panel 和 selector 渲染使用；
  const lastValidIndexRef = React.useRef<number | undefined>(undefined);

  // ============================= Reset =============================

  // End the current interaction without changing CalendarValue or the
  // committed value. External events such as Clear can reset bookkeeping and
  // handle their own value update separately.
  // 结束当前交互，但不修改 CalendarValue 或已提交值。Clear 等外部事件可先
  // 重置交互记录，再独立处理自身的值变更。
  const reset = useEvent(() => {
    triggeredFieldsRef.current = [];
    confirmedIndexRef.current = null;
    isLastInputRef.current = false;
    setCurrentIndex(null);
    setForceFocus(false);
  });

  // ============================= Record ============================

  // Keep fields unique while preserving their first-triggered order. Omit
  // `modified` to keep the existing state, or pass it to start a new field
  // visit and record a modification.
  // field 保持唯一并保留首次触发顺序。省略 `modified` 时保留原状态；传入时
  // 用于开始一次新的 field 访问，或记录本次修改。
  const recordTriggeredField = (index: number, modified?: boolean) => {
    const field = triggeredFieldsRef.current.find((item) => item.index === index);

    if (field) {
      if (modified !== undefined) {
        field.modified = modified;
      }
    } else {
      triggeredFieldsRef.current = [
        ...triggeredFieldsRef.current,
        { index, modified: modified ?? false },
      ];
    }
  };

  // ============================= Submit ============================

  // Flush the current field and report whether the whole round is complete.
  // Index and focus transitions are handled by the resolved action.
  // 提交当前 field，并返回本轮是否已经完成。index 与焦点切换由解析后的
  // action 负责。
  const submitField = (index: number) => {
    recordTriggeredField(index);

    // Trigger final change after every field has participated once.
    // 所有 field 都参与过一次后，触发最终 change。
    const allFieldsTriggered = triggeredFieldsRef.current.length >= fieldCount;
    flushSubmit(index, allFieldsTriggered);

    if (allFieldsTriggered) {
      reset();
    }

    return allFieldsTriggered;
  };

  // ============================= Resolve ===========================

  // Resolve an interaction to one action without changing any state.
  // 仅根据当前状态解析 action，不在判断过程中修改任何状态。
  const resolveAction = (
    currentIndex: number | null,
    index: number,
    source: RangeValueChangeSource,
    value?: FieldValue,
  ): RangeValueChangeAction => {
    if (source === 'esc') {
      return 'resetAll';
    }

    if (currentIndex === null) {
      // Closing the popup after the interaction has completed still needs to
      // discard any temporary CalendarValue left by a controlled value.
      // 一轮交互结束后关闭 popup，仍需清理受控值留下的临时 CalendarValue。
      return source === 'popupClose' ? 'resetAll' : 'abort';
    }

    const currentValue = value === undefined ? getCalendarValue()[currentIndex] : value;
    const currentEmpty = currentValue === null || currentValue === undefined;
    const canSwitch = !currentEmpty || allowEmpty[currentIndex];
    const canSubmit = source === 'remove' || canSwitch;

    if (source === 'field-switch') {
      if (index === currentIndex) {
        return 'abort';
      }

      const nextIndex = (currentIndex + 1) % fieldCount;
      if (index !== nextIndex) {
        return 'abort';
      }

      const nextFieldTriggered = triggeredFieldsRef.current.some(
        (field) => field.index === nextIndex,
      );

      if (needConfirm) {
        if (confirmedIndexRef.current === currentIndex) {
          return 'switchNext';
        }

        // An allowEmpty field may be left without confirmation. Discard any
        // unconfirmed CalendarValue before moving to the next field.
        // allowEmpty field 可以在未确认时离开；切换前需要丢弃未确认的
        // CalendarValue，再进入下一个 field。
        return allowEmpty[currentIndex] ? 'resetCurrentAndSwitchNext' : 'abort';
      }

      if (canSwitch) {
        return 'switchNext';
      }

      // Revisiting the next field starts another circular round. Discard the
      // invalid current field and finish the old round before entering it.
      // 再次进入已触发的 next field 表示开始新一轮循环。进入前先丢弃当前
      // 无效 field，并结束旧的一轮。
      return nextFieldTriggered ? 'resetCurrentAndSwitchNext' : 'resetCurrent';
    }

    if (index !== currentIndex) {
      return 'abort';
    }

    if (source === 'popupClose') {
      const interactionModified = triggeredFieldsRef.current.some((field) => field.modified);

      if (!interactionModified) {
        return 'finish';
      }

      if (needConfirm) {
        const currentModified = triggeredFieldsRef.current.some(
          (field) => field.index === currentIndex && field.modified,
        );
        const allFieldsTriggered = triggeredFieldsRef.current.length >= fieldCount;

        // Closing the popup ends the interaction instead of advancing to an
        // unvisited field. When the current field allows empty, discard its
        // unconfirmed value before finishing the round.
        // 关闭 popup 用于结束交互，不应继续推进到尚未访问的 field。当前
        // field 允许为空时，先丢弃未确认值，再结束本轮。
        if (!allFieldsTriggered || !canSwitch) {
          return 'resetAll';
        }

        if (currentModified) {
          return allowEmpty[currentIndex] ? 'resetCurrentAndSwitchNext' : 'resetAll';
        }

        return 'switchNext';
      }

      if (!canSubmit) {
        return 'resetAll';
      }

      return 'switchNext';
    }

    if (source === 'input' || source === 'panel-intermediate') {
      return 'modify';
    }

    if (source === 'panel-final') {
      return needConfirm ? 'modify' : 'switchNext';
    }

    if (source === 'keyboard-submit-weak') {
      return canSubmit ? 'submitCurrent' : 'abort';
    }

    if (source === 'keyboard-submit' || source === 'confirm' || source === 'remove') {
      return canSubmit ? 'switchNext' : 'abort';
    }

    return 'abort';
  };

  // ============================= Trigger ===========================

  // Route every interaction through action resolution, then execute the
  // resolved action in one place.
  // 所有交互先统一解析 action，再在一个位置执行对应操作。
  const triggerChange = useEvent(
    (index: number, source: RangeValueChangeSource, value?: FieldValue) => {
      let currentIndex = getCurrentIndex();

      // Popup close consumes the previous update type instead of replacing it.
      // popup 关闭消费上一次更新类型，自身不覆盖该标记。
      if (source !== 'popupClose') {
        isLastInputRef.current = source === 'input';
      }

      // Start a new interaction from the first non-close event. Closing the
      // popup may clean temporary values but must not create an active field.
      // 第一条非关闭事件用于建立新一轮交互；关闭 popup 可以清理临时值，
      // 但不应因此创建 currentIndex。
      if (currentIndex === null && source !== 'popupClose' && source !== 'esc') {
        currentIndex = index;
        setCurrentIndex(index);
        setForceFocus(false);
        recordTriggeredField(index, false);
      }

      const action = resolveAction(currentIndex, index, source, value);
      const actionIndex = currentIndex ?? index;

      switch (action) {
        case 'modify': {
          recordTriggeredField(actionIndex, true);
          if (confirmedIndexRef.current === actionIndex) {
            confirmedIndexRef.current = null;
          }
          if (value !== undefined) {
            triggerCalendarChange(actionIndex, value);
          }
          break;
        }

        case 'submitCurrent': {
          if (needConfirm) {
            confirmedIndexRef.current = actionIndex;
          }
          submitField(actionIndex);
          break;
        }

        case 'switchNext': {
          if (source === 'panel-final' || value !== undefined) {
            recordTriggeredField(actionIndex, true);
          }
          if (value !== undefined) {
            triggerCalendarChange(actionIndex, value);
          }
          if (needConfirm && (source === 'keyboard-submit' || source === 'confirm')) {
            confirmedIndexRef.current = actionIndex;
          }

          // Confirm-like operations and panel-originated popup closes must
          // move focus to the next field. Input-originated closes remain weak.
          // 确认类操作和面板操作后的 popup 关闭必须主动聚焦下一个 field；
          // input 操作后的关闭仍保持弱切换。
          const forceFocus =
            source === 'confirm' ||
            source === 'keyboard-submit' ||
            source === 'panel-final' ||
            (source === 'popupClose' && !isLastInputRef.current);

          const allFieldsTriggered = submitField(actionIndex);

          if (allFieldsTriggered && source === 'field-switch') {
            // The focus switch finishes the previous round and also starts a
            // new round from its target field.
            // 本次 focus 切换既结束上一轮，也以目标 field 开始新一轮。
            setCurrentIndex(index);
            setForceFocus(false);
          } else if (!allFieldsTriggered) {
            const nextIndex = (actionIndex + 1) % fieldCount;
            setCurrentIndex(nextIndex);
            setForceFocus(forceFocus);
          }

          if (source === 'field-switch') {
            recordTriggeredField(index, false);
          }
          break;
        }

        case 'finish': {
          reset();
          break;
        }

        case 'resetCurrent': {
          resetValue(actionIndex);
          if (confirmedIndexRef.current === actionIndex) {
            confirmedIndexRef.current = null;
          }
          triggeredFieldsRef.current = triggeredFieldsRef.current.filter(
            (field) => field.index !== actionIndex,
          );
          break;
        }

        case 'resetCurrentAndSwitchNext': {
          resetValue(actionIndex);
          if (confirmedIndexRef.current === actionIndex) {
            confirmedIndexRef.current = null;
          }

          if (source === 'field-switch') {
            const nextFieldTriggered = triggeredFieldsRef.current.some(
              (field) => field.index === index,
            );

            // A reset never submits or checks whether all fields were handled.
            // Revisiting the target discards the old round before starting the
            // next one from that target.
            // reset 不触发提交，也不判断所有 field 是否已处理。再次进入目标
            // field 时丢弃旧一轮记录，并从该 field 开启新一轮。
            if (nextFieldTriggered) {
              triggeredFieldsRef.current = [];
            }

            setCurrentIndex(index);
            setForceFocus(false);
            recordTriggeredField(index, false);
          } else {
            // Closing the popup ends the whole Picker interaction instead of
            // focusing the next field.
            // 关闭 popup 表示结束整个 Picker 交互，因此不再聚焦下一个 field。
            reset();
          }
          break;
        }

        case 'resetAll': {
          resetValue();
          reset();
          break;
        }

        case 'abort': {
          if (source === 'field-switch' && index === actionIndex) {
            recordTriggeredField(index);
          }
          break;
        }
      }
    },
  );

  const currentIndex = getCurrentIndex();
  lastValidIndexRef.current = currentIndex ?? lastValidIndexRef.current ?? 0;

  const triggeredFields = triggeredFieldsRef.current.map((field) => field.index);

  return [
    currentIndex,
    lastValidIndexRef.current,
    getForceFocus(),
    triggeredFields,
    triggerChange,
    reset,
  ];
}

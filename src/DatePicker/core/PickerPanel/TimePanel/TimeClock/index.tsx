import { clsx } from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import type { SharedTimeProps } from '../../../interface';
import { usePanelContext } from '../../context';
import type { Unit } from '../TimePanelBody/TimeColumn';
import useTimeState from '../TimePanelBody/useTimeState';
import ClockDial from './ClockDial';
import { type DialNumber, isInnerRing, nearestOnCircle, pad, stepCircular } from './geometry';

type View = 'hour' | 'minute';

const enabledValues = (units: Unit<number>[]) =>
  units.filter((unit) => !unit.disabled).map((unit) => unit.value);

const isEnabled = (units: Unit<number>[], value: number) =>
  units.some((unit) => unit.value === value && !unit.disabled);

export default function TimeClock<DateType extends object = any>(props: SharedTimeProps<DateType>) {
  const { showHour, showMinute, showSecond, use12Hours } = props;
  const { prefixCls, locale } = usePanelContext<DateType>();
  const state = useTimeState(props);
  const [view, setView] = React.useState<View>(showHour ? 'hour' : 'minute');

  const cls = `${prefixCls}-time-clock`;
  const hour = state.hour ?? null;
  const minute = state.minute ?? null;
  const second = state.second ?? null;
  const pm = hour !== null && hour >= 12;

  const hourNumbers: DialNumber[] = [];
  for (let index = 0; index < 12; index++) {
    const outer = index === 0 ? 12 : index;
    const angle = index * 30;
    if (use12Hours) {
      const value = index + (pm ? 12 : 0);
      hourNumbers.push({
        angle,
        disabled: !isEnabled(state.hourUnits, value),
        inner: false,
        label: String(outer),
        value,
      });
      continue;
    }
    const inner = index === 0 ? 0 : index + 12;
    hourNumbers.push(
      {
        angle,
        disabled: !isEnabled(state.hourUnits, outer),
        inner: false,
        label: String(outer),
        value: outer,
      },
      {
        angle,
        disabled: !isEnabled(state.hourUnits, inner),
        inner: true,
        label: pad(inner),
        value: inner,
      },
    );
  }

  const minuteNumbers: DialNumber[] = Array.from({ length: 12 }, (_, index) => ({
    angle: index * 30,
    disabled: !isEnabled(state.minuteUnits, index * 5),
    inner: false,
    label: pad(index * 5),
    value: index * 5,
  }));

  const hourValues = enabledValues(state.hourUnits);
  const minuteValues = enabledValues(state.minuteUnits);
  const secondValues = enabledValues(state.secondUnits);

  const pickHourAt = (angle: number, distance: number) => {
    const index = Math.round(angle / 30) % 12;
    const value = use12Hours
      ? index + (pm ? 12 : 0)
      : isInnerRing(distance)
        ? index === 0
          ? 0
          : index + 12
        : index === 0
          ? 12
          : index;
    return isEnabled(state.hourUnits, value) ? value : undefined;
  };

  const pickMinuteAt = (angle: number) =>
    nearestOnCircle(Math.round(angle / 6) % 60, minuteValues, 60);

  const stepSecond = (direction: 1 | -1) => {
    const next = stepCircular(second, secondValues, direction);
    if (next !== undefined) state.onSecondChange(next);
  };

  const hourView = view === 'hour';
  const displayHour = hour === null ? '--' : pad(use12Hours ? hour % 12 || 12 : hour);
  const segment = (target: View, label: string | undefined, text: string) => (
    <button
      aria-label={label}
      aria-pressed={view === target}
      className={clsx(`${cls}-segment`, view === target && `${cls}-segment-active`)}
      type="button"
      onClick={() => setView(target)}
    >
      {text}
    </button>
  );

  return (
    <>
      <div className={`${prefixCls}-header`}>
        <div className={`${cls}-header`}>
          {showHour && segment('hour', locale.hours ?? 'Hours', displayHour)}
          {showHour && showMinute && <span className={`${cls}-colon`}>:</span>}
          {showMinute &&
            segment('minute', locale.minutes ?? 'Minutes', minute === null ? '--' : pad(minute))}
          {showSecond && (
            <>
              <span className={`${cls}-colon`}>:</span>
              <div className={`${cls}-stepper`}>
                <button
                  aria-label={locale.nextSecond ?? 'Next second'}
                  tabIndex={-1}
                  type="button"
                  onClick={() => stepSecond(1)}
                >
                  <ChevronUp size={12} />
                </button>
                <span
                  aria-label={locale.seconds ?? 'Seconds'}
                  className={`${cls}-stepper-value`}
                  onWheel={(event) => stepSecond(event.deltaY > 0 ? -1 : 1)}
                >
                  {second === null ? '--' : pad(second)}
                </span>
                <button
                  aria-label={locale.previousSecond ?? 'Previous second'}
                  tabIndex={-1}
                  type="button"
                  onClick={() => stepSecond(-1)}
                >
                  <ChevronDown size={12} />
                </button>
              </div>
            </>
          )}
          {use12Hours && (
            <div className={`${cls}-meridiem`}>
              {state.meridiemUnits.map((unit) => (
                <button
                  aria-pressed={state.meridiem === unit.value}
                  disabled={unit.disabled}
                  key={unit.value}
                  type="button"
                  className={clsx(
                    `${cls}-segment`,
                    state.meridiem === unit.value && `${cls}-segment-active`,
                  )}
                  onClick={() => state.onMeridiemChange(unit.value)}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={`${cls}-body`}>
        <ClockDial
          ariaPrefix={hourView ? (locale.hour ?? 'Hour') : (locale.minute ?? 'Minute')}
          enabledValues={hourView ? hourValues : minuteValues}
          key={view}
          label={hourView ? (locale.hours ?? 'Hours') : (locale.minutes ?? 'Minutes')}
          numbers={hourView ? hourNumbers : minuteNumbers}
          prefixCls={prefixCls}
          selected={hourView ? hour : minute}
          selectedAngle={hourView ? ((hour ?? 0) % 12) * 30 : (minute ?? 0) * 6}
          selectedInner={hourView && !use12Hours && hour !== null && (hour === 0 || hour > 12)}
          selectedOffTick={!hourView && minute !== null && minute % 5 !== 0}
          pickAt={(angle, distance) =>
            hourView ? pickHourAt(angle, distance) : pickMinuteAt(angle)
          }
          onPick={(value) => (hourView ? state.onHourChange(value) : state.onMinuteChange(value))}
          onDone={() => {
            if (hourView && showMinute) setView('minute');
          }}
        />
      </div>
    </>
  );
}

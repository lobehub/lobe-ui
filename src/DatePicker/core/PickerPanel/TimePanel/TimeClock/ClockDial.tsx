import { clsx } from 'clsx';
import * as React from 'react';

import {
  DIAL_SIZE,
  type DialNumber,
  INNER_RADIUS,
  OUTER_RADIUS,
  pointerToPolar,
  stepCircular,
  toPosition,
} from './geometry';

export interface ClockDialProps {
  ariaPrefix: string;
  enabledValues: number[];
  label: string;
  numbers: DialNumber[];
  onDone: () => void;
  onPick: (value: number) => void;
  pickAt: (angle: number, distance: number) => number | undefined;
  prefixCls: string;
  selected: number | null;
  selectedAngle: number;
  selectedInner: boolean;
  selectedOffTick: boolean;
}

const STEP_KEYS: Record<string, 1 | -1> = {
  ArrowDown: -1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: 1,
};

export default function ClockDial({
  ariaPrefix,
  enabledValues,
  label,
  numbers,
  onDone,
  onPick,
  pickAt,
  prefixCls,
  selected,
  selectedAngle,
  selectedInner,
  selectedOffTick,
}: ClockDialProps) {
  const cls = `${prefixCls}-time-clock`;
  const [dragging, setDragging] = React.useState(false);
  const lastPickedRef = React.useRef<number | null>(null);

  const applyPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const { angle, distance } = pointerToPolar(event.currentTarget, event.clientX, event.clientY);
    const value = pickAt(angle, distance);
    if (value === undefined || value === lastPickedRef.current) return;
    lastPickedRef.current = value;
    onPick(value);
  };

  const radius = selectedInner ? INNER_RADIUS : OUTER_RADIUS;
  const knob = toPosition(selectedAngle, radius);

  return (
    <div
      aria-label={label}
      className={clsx(`${cls}-dial`, dragging && `${cls}-dial-dragging`)}
      role="group"
      style={{ height: DIAL_SIZE, width: DIAL_SIZE }}
      tabIndex={0}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(event) => {
        const direction = STEP_KEYS[event.key];
        if (direction) {
          const next = stepCircular(selected, enabledValues, direction);
          if (next !== undefined) onPick(next);
        } else if (event.key === 'Enter') {
          onDone();
        } else {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        lastPickedRef.current = selected;
        setDragging(true);
        applyPointer(event);
      }}
      onPointerMove={(event) => {
        if (dragging) applyPointer(event);
      }}
      onPointerUp={(event) => {
        if (!dragging) return;
        applyPointer(event);
        setDragging(false);
        onDone();
      }}
    >
      {selected !== null && (
        <>
          <span
            aria-hidden
            className={`${cls}-hand`}
            style={{
              height: radius,
              top: DIAL_SIZE / 2 - radius,
              transform: `rotate(${selectedAngle}deg)`,
            }}
          />
          <span aria-hidden className={`${cls}-center`} />
          <span
            aria-hidden
            style={{ left: knob.x, top: knob.y }}
            className={clsx(
              `${cls}-knob`,
              selectedInner && `${cls}-knob-inner`,
              selectedOffTick && `${cls}-knob-off-tick`,
            )}
          />
        </>
      )}
      {numbers.map((number) => {
        const position = toPosition(number.angle, number.inner ? INNER_RADIUS : OUTER_RADIUS);
        return (
          <button
            aria-label={`${ariaPrefix} ${number.value}`}
            aria-pressed={number.value === selected}
            disabled={number.disabled}
            key={`${number.inner ? 'inner' : 'outer'}-${number.value}`}
            style={{ left: position.x, top: position.y }}
            tabIndex={-1}
            type="button"
            className={clsx(
              `${cls}-number`,
              number.inner && `${cls}-number-inner`,
              number.value === selected && `${cls}-number-selected`,
            )}
            onClick={() => {
              onPick(number.value);
              onDone();
            }}
          >
            {number.label}
          </button>
        );
      })}
    </div>
  );
}

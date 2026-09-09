import { animate, type MotionValue, motionValue } from 'motion/react';

import type { Axis, Placement } from './axes';
import { AXES } from './axes';
import { isRtl, lockBody } from './dom';
import { timing } from './transition';
import { clamp, emitter } from './utils';

const KEY_STEP = 10;
const KEY_STEP_FAST = 50;

const SCREEN_DELTA: Record<string, number> = {
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  ArrowUp: -1,
};

export interface PanelControllerOptions {
  collapseThreshold?: number;
  defaultSize: number;
  expand: boolean;
  max?: number;
  min: number;
  onExpandChange?: (expand: boolean) => void;
  onSizeChange?: (size: number, delta: number) => void;
  onSizeDragging?: (size: number, delta: number) => void;
  placement: Placement;
  size: number;
}

export interface PanelState {
  collapsing: boolean;
  dragging: boolean;
  folding: boolean;
}

export interface PanelKeyEvent {
  key: string;
  preventDefault: () => void;
  shiftKey: boolean;
}

export interface PanelController {
  attach: (element: HTMLElement) => () => void;
  axis: Axis;
  bounds: () => { max: number; min: number };
  destroy: () => void;
  drag: {
    cancel: () => void;
    end: () => void;
    move: (offset: { x: number; y: number }) => void;
    start: () => void;
  };
  motion: { content: MotionValue<number>; size: MotionValue<number> };
  options: PanelControllerOptions;
  reset: () => void;
  resizeByKey: (event: PanelKeyEvent) => void;
  state: PanelState;
  subscribe: (listener: () => void) => () => void;
  sync: (options: PanelControllerOptions) => void;
  target: number;
}

export const createPanelController = (initial: PanelControllerOptions): PanelController => {
  const { clear, emit: notify, subscribe } = emitter();

  let element: HTMLElement | null = null;
  let options = initial;
  let target = initial.expand ? initial.size : 0;
  let state: PanelState = { collapsing: false, dragging: false, folding: false };
  let unlock: (() => void) | undefined;
  let foldTo = target;

  const size = motionValue(target);
  const content = motionValue(initial.size);

  const session = {
    collapsing: false,
    max: 0,
    min: 0,
    sign: 1,
    start: 0,
  };

  const patch = (next: Partial<PanelState>) => {
    const entries = Object.entries(next) as [keyof PanelState, boolean][];
    if (entries.some(([key, value]) => state[key] !== value)) {
      state = { ...state, ...next };
      notify();
    }
  };

  const bounds = () => {
    const min = Math.max(0, options.min);
    const max = options.max === undefined ? Number.POSITIVE_INFINITY : Math.max(min, options.max);
    return { max, min };
  };

  const growSign = () => {
    const axis = AXES[options.placement];
    return axis.grow * (axis.vertical || !isRtl(element) ? 1 : -1);
  };

  const fold = (to: number) => {
    foldTo = to;
    patch({ folding: true });
    if (size.get() === 0) content.jump(to || content.get());
    else if (to > 0) animate(content, to, timing());
    animate(size, to, timing());
  };

  const stopSettle = size.on('animationComplete', () => {
    if (size.get() === target) patch({ folding: false });
  });

  const release = () => {
    unlock?.();
    unlock = undefined;
  };

  const stopDragging = () => {
    release();
    patch({ collapsing: false, dragging: false });
  };

  const drag = {
    cancel: () => {
      if (!state.dragging) return;
      size.jump(session.start);
      content.jump(session.start);
      stopDragging();
    },
    end: () => {
      if (!state.dragging) return;
      const { collapsing, start } = session;
      const committed = collapsing ? start : size.get();
      stopDragging();
      if (collapsing) {
        content.jump(start);
        options.onExpandChange?.(false);
      }
      options.onSizeChange?.(committed, committed - start);
    },
    move: (offset: { x: number; y: number }) => {
      if (!state.dragging) return;
      const axis = AXES[options.placement];
      const pixels = session.start + offset[axis.point] * session.sign;
      const collapsing =
        options.collapseThreshold !== undefined && pixels < options.collapseThreshold;
      const next = collapsing ? 0 : Math.round(clamp(pixels, session.min, session.max));

      size.jump(next);
      if (!collapsing) content.jump(next);
      if (collapsing !== session.collapsing) {
        session.collapsing = collapsing;
        patch({ collapsing });
      }
      const reported = collapsing ? session.start : next;
      options.onSizeDragging?.(reported, reported - session.start);
    },
    start: () => {
      Object.assign(session, {
        ...bounds(),
        collapsing: false,
        sign: growSign(),
        start: size.get(),
      });
      release();
      unlock = lockBody(AXES[options.placement].cursor, drag.cancel);
      patch({ dragging: true, folding: false });
    },
  };

  const resizeByKey = (event: PanelKeyEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      if (!options.onExpandChange) return;
      event.preventDefault();
      options.onExpandChange(!options.expand);
      return;
    }

    const { max, min } = bounds();
    const fast = event.shiftKey || event.key === 'PageUp' || event.key === 'PageDown';
    const step = (fast ? KEY_STEP_FAST : KEY_STEP) * growSign();
    const axis = AXES[options.placement];
    const onAxis = axis.vertical
      ? event.key === 'ArrowUp' || event.key === 'ArrowDown'
      : event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const screen = onAxis ? SCREEN_DELTA[event.key] : undefined;
    const moves: Record<string, number> = {
      End: Number.isFinite(max) ? max : target,
      Home: min,
      PageDown: target + step,
      PageUp: target - step,
    };
    const next = screen === undefined ? moves[event.key] : target + screen * step;
    if (next === undefined) return;

    event.preventDefault();
    const value = clamp(next, min, max);
    if (!options.expand && value > 0) options.onExpandChange?.(true);
    options.onSizeChange?.(value, value - target);
  };

  const sync = (next: PanelControllerOptions) => {
    options = next;
    const value = next.expand ? next.size : 0;
    if (size.get() === 0 && value > 0) content.jump(next.size);
    if (value !== target) {
      target = value;
      notify();
    }
    if (state.dragging) return;
    if (size.get() === target) {
      if (state.folding) {
        patch({ folding: false });
        content.jump(target || content.get());
      }
      // A settled panel still needs its content aligned after a controlled reset.
      foldTo = target;
    } else if (!state.folding || foldTo !== target) {
      fold(target);
    }
  };

  return {
    attach: (node) => {
      element = node;
      return () => {
        release();
        element = null;
      };
    },
    get axis() {
      return AXES[options.placement];
    },
    bounds,
    destroy: () => {
      release();
      stopSettle();
      clear();
    },
    drag,
    motion: { content, size },
    get options() {
      return options;
    },
    reset: () => {
      if (!options.expand) options.onExpandChange?.(true);
      options.onSizeChange?.(options.defaultSize, options.defaultSize - target);
    },
    resizeByKey,
    get state() {
      return state;
    },
    subscribe,
    sync,
    get target() {
      return target;
    },
  };
};

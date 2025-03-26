'use client';

import { Application } from '@splinetool/runtime';
import type { SplineEvent, SplineEventName } from '@splinetool/runtime';
import { type HTMLAttributes, forwardRef, useEffect, useRef, useState } from 'react';

import ParentSize from './ParentSize';

export interface SplineProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'onLoad' | 'onMouseDown' | 'onMouseUp' | 'onMouseHover' | 'onKeyDown' | 'onKeyUp' | 'onWheel'
  > {
  onFollow?: (e: SplineEvent) => void;
  onKeyDown?: (e: SplineEvent) => void;
  onKeyUp?: (e: SplineEvent) => void;
  onLoad?: (e: Application) => void;
  onLookAt?: (e: SplineEvent) => void;
  onMouseDown?: (e: SplineEvent) => void;
  onMouseHover?: (e: SplineEvent) => void;
  onMouseUp?: (e: SplineEvent) => void;
  onStart?: (e: SplineEvent) => void;
  onWheel?: (e: SplineEvent) => void;
  renderOnDemand?: boolean;
  scene: string;
}

const Spline = forwardRef<HTMLDivElement, SplineProps>(
  (
    {
      scene,
      style,
      onMouseDown,
      onMouseUp,
      onMouseHover,
      onKeyDown,
      onKeyUp,
      onStart,
      onLookAt,
      onFollow,
      onWheel,
      onLoad,
      renderOnDemand = true,
      ...props
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);

    const init = async (
      speApp: Application,
      events: {
        cb?: (e: SplineEvent) => void;
        name: SplineEventName;
      }[],
    ) => {
      await speApp.load(scene);

      for (let event of events) {
        if (event.cb) {
          speApp.addEventListener(event.name, event.cb);
        }
      }

      setIsLoading(false);
      onLoad?.(speApp);
    };

    // Initialize runtime when component is mounted
    useEffect(() => {
      setIsLoading(true);

      let speApp: Application;
      const events: {
        cb?: (e: SplineEvent) => void;
        name: SplineEventName;
      }[] = [
        {
          cb: onMouseDown,
          name: 'mouseDown',
        },
        {
          cb: onMouseUp,
          name: 'mouseUp',
        },
        {
          cb: onMouseHover,
          name: 'mouseHover',
        },
        {
          cb: onKeyDown,
          name: 'keyDown',
        },
        {
          cb: onKeyUp,
          name: 'keyUp',
        },
        {
          cb: onStart,
          name: 'start',
        },
        {
          cb: onLookAt,
          name: 'lookAt',
        },
        {
          cb: onFollow,
          name: 'follow',
        },
        {
          cb: onWheel,
          name: 'scroll',
        },
      ];

      if (canvasRef.current) {
        speApp = new Application(canvasRef.current, { renderOnDemand });
        init(speApp, events);
      }

      return () => {
        for (let event of events) {
          if (event.cb) {
            speApp.removeEventListener(event.name, event.cb);
          }
        }
        speApp.dispose();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scene]);

    return (
      <ParentSize debounceTime={50} parentSizeStyles={style} ref={ref} {...props}>
        {() => {
          return (
            <canvas
              ref={canvasRef}
              style={{
                display: isLoading ? 'none' : 'block',
              }}
            />
          );
        }}
      </ParentSize>
    );
  },
);

export default Spline;

export { type SPEObject, type SplineEvent, type SplineEventName } from '@splinetool/runtime';

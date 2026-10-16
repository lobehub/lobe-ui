'use client';

import type { Application, SplineEvent, SplineEventName } from '@splinetool/runtime';
import { memo, useEffect, useRef, useState } from 'react';

import ParentSize from './ParentSize';
import { type SplineProps } from './type';

const Spline = memo<SplineProps>(
  ({
    ref,
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
  }) => {
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

      for (const event of events) {
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

      const canvas = canvasRef.current;
      if (!canvas) return;

      let disposed = false;
      let speApp: Application | undefined;
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

      void import('@splinetool/runtime').then((runtime) => {
        if (disposed) return;
        speApp = new runtime.Application(canvas, { renderOnDemand });
        void init(speApp, events);
      });

      return () => {
        disposed = true;
        if (!speApp) return;
        for (const event of events) {
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

Spline.displayName = 'Spline';

export default Spline;

export type { SPEObject, SplineEvent, SplineEventName } from '@splinetool/runtime';

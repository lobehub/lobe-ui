import { debounce } from 'lodash-es';
import {
  type CSSProperties,
  type ReactNode,
  type Ref,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';

interface ResizeObserverCallback {
  (entries: ResizeObserverEntry[], observer: ResizeObserver): void;
}

interface ResizeObserverPolyfill {
  new (callback: ResizeObserverCallback): ResizeObserver;
}

// @TODO remove when upgraded to TS 4 which has its own declaration
interface PrivateWindow {
  ResizeObserver: ResizeObserverPolyfill;
}

export interface ParentSizeProps {
  /** Child render function `({ width, height, top, left, ref, resize }) => ReactNode`. */
  children: (
    args: {
      ref: HTMLDivElement | null;
      resize: (state: ParentSizeState) => void;
    } & ParentSizeState,
  ) => ReactNode;
  /** Optional `className` to add to the parent `div` wrapper used for size measurement. */
  className?: string;
  /** Child render updates upon resize are delayed until `debounceTime` milliseconds _after_ the last resize event is observed. */
  debounceTime?: number;
  /** Optional flag to toggle leading debounce calls. When set to true this will ensure that the component always renders immediately. (defaults to true) */
  enableDebounceLeadingCall?: boolean;
  /** Optional dimensions provided won't trigger a state change when changed. */
  ignoreDimensions?: keyof ParentSizeState | (keyof ParentSizeState)[];
  /** Optional `style` object to apply to the parent `div` wrapper used for size measurement. */
  parentSizeStyles?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
  /** Optionally inject a ResizeObserver polyfill, else this *must* be globally available. */
  resizeObserverPolyfill?: ResizeObserverPolyfill;
}

type ParentSizeState = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type ParentSizeProvidedProps = ParentSizeState;

const defaultIgnoreDimensions: ParentSizeProps['ignoreDimensions'] = [];
const defaultParentSizeStyles = { height: '100%', width: '100%' };

const ParentSize = memo<ParentSizeProps>(
  ({
    ref,
    className,
    children,
    debounceTime = 300,
    ignoreDimensions = defaultIgnoreDimensions,
    parentSizeStyles,
    enableDebounceLeadingCall = true,
    resizeObserverPolyfill,
    ...restProps
  }) => {
    const target = useRef<HTMLDivElement | null>(null);
    const animationFrameID = useRef(0);

    const [state, setState] = useState<ParentSizeState>({
      height: 0,
      left: 0,
      top: 0,
      width: 0,
    });

    const resize = useMemo(() => {
      const normalized = Array.isArray(ignoreDimensions) ? ignoreDimensions : [ignoreDimensions];

      return debounce(
        (incoming: ParentSizeState) => {
          setState((existing) => {
            const stateKeys = Object.keys(existing) as (keyof ParentSizeState)[];
            const keysWithChanges = stateKeys.filter((key) => existing[key] !== incoming[key]);
            const shouldBail = keysWithChanges.every((key) => normalized.includes(key));

            return shouldBail ? existing : incoming;
          });
        },
        debounceTime,
        { leading: enableDebounceLeadingCall },
      );
    }, [debounceTime, enableDebounceLeadingCall, ignoreDimensions]);

    useEffect(() => {
      const LocalResizeObserver =
        resizeObserverPolyfill || (window as unknown as PrivateWindow).ResizeObserver;

      const observer = new LocalResizeObserver((entries) => {
        for (const entry of entries) {
          const { left, top, width, height } = entry?.contentRect ?? {};
          animationFrameID.current = window.requestAnimationFrame(() => {
            resize({ height, left, top, width });
          });
        }
      });
      if (target.current) observer.observe(target.current);

      return () => {
        window.cancelAnimationFrame(animationFrameID.current);
        observer.disconnect();
        resize.cancel();
      };
    }, [resize, resizeObserverPolyfill]);

    return (
      <div
        className={className}
        ref={mergeRefs<HTMLDivElement>([ref, target])}
        style={{ ...defaultParentSizeStyles, ...parentSizeStyles }}
        {...restProps}
      >
        {children({
          ...state,
          ref: target.current,
          resize,
        })}
      </div>
    );
  },
);

export default ParentSize;

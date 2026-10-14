export const isNonNullable = <T>(value: T): value is NonNullable<T> =>
  value !== undefined && value !== null;

export const isReactRenderable = (value: unknown): boolean =>
  isNonNullable(value) && value !== false && value !== '';

export const omit = <T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Omit<T, K> => {
  const clone = { ...object };
  for (const key of keys) delete clone[key];
  return clone;
};

const attributes = `accept acceptCharset accessKey action allowFullScreen allowTransparency
  alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge
  charSet checked classID className colSpan cols content contentEditable contextMenu
  controls coords crossOrigin data dateTime default defer dir disabled download draggable
  encType form formAction formEncType formMethod formNoValidate formTarget frameBorder
  headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity
  is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media
  mediaGroup method min minLength multiple muted name noValidate nonce open
  optimum pattern placeholder poster preload radioGroup readOnly rel required
  reversed role rowSpan rows sandbox scope scoped scrolling seamless selected
  shape size sizes span spellCheck src srcDoc srcLang srcSet start step style
  summary tabIndex target title type useMap value width wmode wrap`;

const events = `onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown
  onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick
  onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown
  onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel
  onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough
  onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata
  onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad
  onPointerDown onPointerMove onPointerUp onPointerCancel onPointerEnter onPointerLeave onPointerOver onPointerOut onGotPointerCapture onLostPointerCapture
  onAnimationStart onAnimationEnd onAnimationIteration
  onTransitionEnd onTransitionRun onTransitionStart onTransitionCancel
  onBeforeInput onReset onInvalid
  onAuxClick onToggle onBeforeToggle onCancel onClose onResize onScrollEnd`;

const domProps = new Set(`${attributes} ${events}`.split(/\s+/));

export const pickAttrs = (
  props: object,
  {
    aria = true,
    attr = true,
    data = true,
  }: { aria?: boolean; attr?: boolean; data?: boolean } = {},
): Record<string, unknown> => {
  const picked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (
      (aria && (key === 'role' || key.startsWith('aria-'))) ||
      (data && key.startsWith('data-')) ||
      (attr && domProps.has(key))
    ) {
      picked[key] = value;
    }
  }
  return picked;
};

export const isVisible = (element: Element | null | undefined): boolean => {
  if (!element) return false;
  if ((element as HTMLElement).offsetParent) return true;
  const { height, width } = element.getBoundingClientRect();
  return !!(width || height);
};

let rafUid = 0;
const rafIds = new Map<number, number>();

export const raf = Object.assign(
  (callback: () => void, times = 1): number => {
    rafUid += 1;
    const id = rafUid;
    const step = (left: number) => {
      if (left === 0) {
        rafIds.delete(id);
        callback();
        return;
      }
      rafIds.set(
        id,
        requestAnimationFrame(() => step(left - 1)),
      );
    };
    step(times);
    return id;
  },
  {
    cancel: (id: number | undefined) => {
      if (id === undefined) return;
      const frame = rafIds.get(id);
      rafIds.delete(id);
      if (frame !== undefined) cancelAnimationFrame(frame);
    },
  },
);

const warned = new Set<string>();

export const warning = (valid: boolean, message: string) => {
  if (valid || process.env.NODE_ENV === 'production' || warned.has(message)) return;
  warned.add(message);
  console.error(`Warning: ${message}`);
};

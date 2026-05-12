'use client';

import { createStyles, cx, keyframes } from 'antd-style';
import { Download, Expand } from 'lucide-react';
import { memo, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { Flexbox } from '@/Flex';
import { actionsHoverCls, variants } from '@/Highlighter/style';
import SyntaxHighlighter from '@/Highlighter/SyntaxHighlighter';
import NeuralNetworkLoading from '@/NeuralNetworkLoading';
import Segmented from '@/Segmented';
import { stopPropagation } from '@/utils/dom';
import { downloadBlob } from '@/utils/downloadBlob';

import { containsScript, DEFAULT_HEIGHT, isFullHtmlDocument, isHtmlContentClosed } from './const';
import HtmlPreviewIframe from './Iframe';
import type { HtmlPreviewMode, HtmlPreviewProps } from './type';

// Sheen sweep direction: left → right.
// `background-position` works inversely from "where the image is drawn":
// at `200%` the over-sized gradient starts off to the left of the
// container, at `-200%` it ends off to the right — so animating
// 200% → -200% moves the visible bright spot from left to right.
const shimmer = keyframes`
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

const useStyles = createStyles(({ css, cssVar, isDarkMode }) => ({
  loadingBackdrop: css`
    pointer-events: none;

    position: absolute;
    z-index: 1;
    inset: 0;

    /* Subtle moving sheen so it doesn't look frozen. */
    background: linear-gradient(
      90deg,
      transparent 0%,
      ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'} 50%,
      transparent 100%
    );
    background-repeat: no-repeat;
    background-size: 200% 100%;

    animation: ${shimmer} 1.6s ${cssVar.motionEaseInOut} infinite;
  `,
  loadingBadge: css`
    position: absolute;
    z-index: 2;
    inset-block-end: 12px;
    inset-inline-start: 12px;

    display: inline-flex;
    gap: 8px;
    align-items: center;

    padding-block: 4px;
    padding-inline: 6px 10px;
    border-radius: 999px;

    font-size: 12px;
    color: ${cssVar.colorTextDescription};

    background: ${cssVar.colorBgContainer};
    backdrop-filter: blur(8px);
    box-shadow: 0 0 0 1px ${cssVar.colorBorderSecondary};
  `,
  // The streaming source visible during Phase 1 — heavily faded so it
  // reads as "this is preview-pending content" rather than the finished
  // article. Auto-follows the tail so the user can see new tokens land
  // even on slow models.
  loadingSource: css`
    pointer-events: none;
    overflow: hidden;
    height: 100%;

    /* Faded out so the iframe transition feels like content lighting up,
       not like one document jump-cutting to another. */
    opacity: 0.45;

    /* SyntaxHighlighter sets its own background; flatten so the shimmer
       overlay reads cleanly on top. */
    & [data-code-type='highlighter'] {
      background: transparent;
      box-shadow: none;
    }

    /* Tail-follow is layout-only — we anchor the scrollable element to
       its scrollHeight via the ref + effect; CSS just keeps the
       overflow hidden. */
    & pre,
    & code {
      background: transparent !important;
    }
  `,
  loadingRoot: css`
    position: relative;
    overflow: hidden;
    background: ${isDarkMode ? '#1f1f1f' : '#fafafa'};
  `,
  // Inline top-right toolbar. Tagged with `actionsHoverCls` so the Highlighter
  // container's `&:hover .${actionsHoverCls} { opacity: 1 }` rule flips it
  // in/out as the user moves over the preview — same UX as the regular code
  // block actions.
  toolbar: cx(
    actionsHoverCls,
    css`
      position: absolute;
      z-index: 2;
      inset-block-start: 8px;
      inset-inline-end: 8px;

      padding: 4px;
      border-radius: ${cssVar.borderRadiusLG};

      opacity: 0;
      background: ${cssVar.colorBgContainer};
      backdrop-filter: blur(8px);
      box-shadow: 0 0 0 1px ${cssVar.colorBorderSecondary};

      transition: opacity 0.2s ${cssVar.motionEaseOut};

      &:focus-within {
        opacity: 1;
      }
    `,
  ),
}));

const themeBackground = (theme?: 'light' | 'dark') => {
  if (theme === 'dark') return '#1f1f1f';
  if (theme === 'light') return '#ffffff';
  return undefined;
};

const downloadHtml = async (content: string, fileName: string) => {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    await downloadBlob(url, fileName);
  } finally {
    URL.revokeObjectURL(url);
  }
};

const HtmlPreview = memo<HtmlPreviewProps>(
  ({
    actionIconSize,
    actionsRender,
    animated,
    bodyRender,
    children,
    className,
    classNames,
    copyable = true,
    defaultHeight,
    defaultMode = 'preview',
    downloadable = true,
    fileName,
    language = 'html',
    onExpand,
    sandbox,
    shadow,
    streamingMode = 'auto',
    style,
    styles: customStyles,
    theme,
    variant = 'filled',
    // `fullFeatured` / `showLanguage` / `defaultExpand` are accepted for API
    // compatibility with the rest of the Pre family but no longer drive a
    // separate header — the inline toolbar is always rendered.
    fullFeatured: _fullFeatured,
    showLanguage: _showLanguage,
    defaultExpand: _defaultExpand,
    ...rest
  }) => {
    const trimmedChildren = useMemo(() => (children || '').trim(), [children]);
    const isFragment = useMemo(() => !isFullHtmlDocument(trimmedChildren), [trimmedChildren]);

    // Per-session tracking. Reset on `animated` edge false → true.
    const [scriptLocked, setScriptLocked] = useState(false);
    const [headClosed, setHeadClosed] = useState(false);
    const [liveCommitted, setLiveCommitted] = useState(false);
    const prevAnimatedRef = useRef(animated);
    const lastCommitRef = useRef(0);
    const pendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestContentRef = useRef(trimmedChildren);
    useEffect(() => {
      latestContentRef.current = trimmedChildren;
    }, [trimmedChildren]);
    useEffect(() => {
      if (animated && !prevAnimatedRef.current) {
        setScriptLocked(false);
        setHeadClosed(false);
        setLiveCommitted(false);
        lastCommitRef.current = 0;
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current);
          pendingTimerRef.current = null;
        }
      }
      prevAnimatedRef.current = animated;
    }, [animated]);

    // Sticky script detection: once a `<script>` appears in this session,
    // auto mode locks into defer.
    useEffect(() => {
      if (animated && !scriptLocked && containsScript(trimmedChildren)) {
        setScriptLocked(true);
      }
    }, [trimmedChildren, animated, scriptLocked]);

    // Track whether the head section has closed. Until it does, the iframe
    // would render either nothing or invalid HTML (style tag mid-stream).
    // After `</head>` (or `</style>` as a fallback for documents that skip
    // an explicit head close) we know the visual baseline is locked in.
    useEffect(() => {
      if (animated && !headClosed) {
        const lowered = trimmedChildren.toLowerCase();
        if (lowered.includes('</head>') || lowered.includes('</style>')) {
          setHeadClosed(true);
        }
      }
    }, [trimmedChildren, animated, headClosed]);

    // Two-phase streaming commit:
    //   Phase 1 (head still streaming) — don't mount iframe at all. There's
    //     nothing meaningful to render and styles aren't applied yet.
    //   Phase 2 (head closed, body streaming) — commit at most once every
    //     ~250ms. Important: this is a TRUE throttle, not a debounce. The
    //     pending timer is held in a ref so it survives effect re-runs;
    //     when it fires it commits the latest content (via another ref)
    //     and clears itself, allowing a fresh schedule. If chunks come in
    //     faster than the throttle window (which they do at ~50/sec) we
    //     still get a commit every 250ms instead of waiting for streaming
    //     to pause.
    //   On streaming end → flush immediately, cancel any pending timer.
    const [throttledContent, setThrottledContent] = useState(trimmedChildren);
    useEffect(() => {
      if (!animated) {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current);
          pendingTimerRef.current = null;
        }
        lastCommitRef.current = Date.now();
        setThrottledContent(trimmedChildren);
        return;
      }
      if (!headClosed) return;

      const throttleMs = 250;
      const now = Date.now();
      const elapsed = now - lastCommitRef.current;

      if (elapsed >= throttleMs) {
        if (pendingTimerRef.current) {
          clearTimeout(pendingTimerRef.current);
          pendingTimerRef.current = null;
        }
        lastCommitRef.current = now;
        setThrottledContent(trimmedChildren);
        return;
      }

      // Schedule a future commit, but only if one isn't already pending —
      // every chunk arrival re-runs this effect; we don't want to reset
      // the timer each time (that's debounce, and during continuous
      // streaming it would never fire).
      if (pendingTimerRef.current === null) {
        pendingTimerRef.current = setTimeout(() => {
          lastCommitRef.current = Date.now();
          pendingTimerRef.current = null;
          setThrottledContent(latestContentRef.current);
        }, throttleMs - elapsed);
      }
    }, [trimmedChildren, animated, headClosed]);
    useEffect(
      () => () => {
        if (pendingTimerRef.current) clearTimeout(pendingTimerRef.current);
      },
      [],
    );

    // Live-streaming commitment is sticky for the rest of the session. The
    // decision is made the moment the head seals:
    //   • `live` → commit unconditionally
    //   • `auto` → commit only if no `<script>` has appeared yet (script-
    //     bearing docs go down the defer path to avoid running setup() on
    //     partial source)
    //   • `defer` → never commit; wait for `</html>`
    // Sticky-ness matters for `auto`: if a `<script>` arrives *after* the
    // head has already closed and we've started live-streaming, we keep
    // streaming rather than yanking the rendered content back into a
    // loading state mid-flight. The shell→static swap at end of streaming
    // re-runs the document cleanly anyway.
    useEffect(() => {
      if (!animated || liveCommitted || !headClosed) return;
      if (streamingMode === 'live' || (streamingMode === 'auto' && !scriptLocked)) {
        setLiveCommitted(true);
      }
    }, [animated, headClosed, liveCommitted, scriptLocked, streamingMode]);

    // Streaming gate. The iframe can mount in three situations:
    //   1. content is no longer animating
    //   2. `</html>` has arrived
    //   3. live streaming has been committed this session
    const isStable = !animated || isHtmlContentClosed(trimmedChildren) || liveCommitted;

    const [mode, setMode] = useState<HtmlPreviewMode>(defaultMode);

    // Fragments cannot meaningfully render in preview — force source view.
    // For streaming content that's not yet stable we keep the user's mode
    // choice and substitute a loading placeholder in the body instead, so
    // the toggle UI doesn't flip back and forth as content arrives.
    const effectiveMode: HtmlPreviewMode = isFragment ? 'source' : mode;

    const contentRef = useRef(trimmedChildren);
    useEffect(() => {
      contentRef.current = trimmedChildren;
    }, [trimmedChildren]);

    // Tail-follow the streaming source visible during Phase 1 — anchor
    // the scroll position to the latest tokens so a slow model's output
    // doesn't sit pinned to the document head while the user waits.
    const loadingSourceRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      if (isStable) return;
      const node = loadingSourceRef.current;
      if (!node) return;
      node.scrollTop = node.scrollHeight;
    }, [trimmedChildren, isStable]);

    const getCopyContent = useCallback(() => contentRef.current, []);

    const handleDownload = useCallback(() => {
      void downloadHtml(contentRef.current, fileName || 'preview.html');
    }, [fileName]);

    const handleExpand = useCallback(() => {
      onExpand?.(contentRef.current);
    }, [onExpand]);

    const background = themeBackground(theme);

    const sourceBody = useMemo(
      () => (
        <SyntaxHighlighter
          animated={animated}
          className={classNames?.content}
          language={'html'}
          style={{ height: '100%', ...customStyles?.content }}
          variant={variant}
        >
          {trimmedChildren}
        </SyntaxHighlighter>
      ),
      [animated, classNames?.content, customStyles?.content, trimmedChildren, variant],
    );

    const { styles } = useStyles();

    const iframeBody = useMemo(
      () => (
        <HtmlPreviewIframe
          animated={animated}
          background={background}
          className={classNames?.iframe}
          content={throttledContent}
          defaultHeight={defaultHeight}
          sandbox={sandbox}
          style={customStyles?.iframe}
        />
      ),
      [
        background,
        classNames?.iframe,
        customStyles?.iframe,
        defaultHeight,
        sandbox,
        throttledContent,
      ],
    );

    // Shown when the user is on preview mode but the iframe isn't ready
    // yet (Phase 1 of streaming: head still arriving). Holds the eventual
    // iframe height to avoid layout shift on mount.
    //
    // Stream the raw source through `SyntaxHighlighter` at low opacity so
    // the user sees real progress on slow models (a 30-tps DeepSeek
    // pumping a ~5 KB head can otherwise sit on a static spinner for
    // 20+ seconds). A small "Preparing preview…" badge keeps the loading
    // state unambiguous. Tail-follow keeps the visible region anchored
    // to the latest tokens — see the `useEffect` below.
    const loadingBody = useMemo(
      () => (
        <div className={styles.loadingRoot} style={{ height: defaultHeight ?? DEFAULT_HEIGHT }}>
          <div className={styles.loadingSource} ref={loadingSourceRef}>
            <SyntaxHighlighter animated={animated} language={'html'} variant={'borderless'}>
              {trimmedChildren}
            </SyntaxHighlighter>
          </div>
          <div className={styles.loadingBackdrop} />
          <div className={styles.loadingBadge}>
            <NeuralNetworkLoading size={16} />
            <span>Preparing preview…</span>
          </div>
        </div>
      ),
      [animated, defaultHeight, styles, trimmedChildren],
    );

    const previewBody = isStable ? iframeBody : loadingBody;

    const defaultBody = effectiveMode === 'preview' ? previewBody : sourceBody;

    const body = useMemo(() => {
      if (!bodyRender) return defaultBody;
      return bodyRender({
        content: trimmedChildren,
        mode: effectiveMode,
        originalNode: defaultBody,
      });
    }, [bodyRender, defaultBody, effectiveMode, trimmedChildren]);

    const segmentOptions = useMemo(
      () => [
        { label: 'Preview', value: 'preview' as const },
        { label: 'Source', value: 'source' as const },
      ],
      [],
    );

    const iconSize = actionIconSize || 'small';

    const originalActions: ReactNode = (
      <>
        {!isFragment && (
          <Segmented
            options={segmentOptions}
            size={'small'}
            value={effectiveMode}
            onChange={(v) => setMode(v as HtmlPreviewMode)}
          />
        )}
        {copyable && <CopyButton content={getCopyContent} size={iconSize} />}
        {downloadable && (
          <ActionIcon
            icon={Download}
            size={iconSize}
            title={'Download HTML'}
            onClick={handleDownload}
          />
        )}
        {onExpand && (
          <ActionIcon
            icon={Expand}
            size={iconSize}
            title={'Open full preview'}
            onClick={handleExpand}
          />
        )}
      </>
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize: iconSize,
          content: trimmedChildren,
          getContent: getCopyContent,
          mode: effectiveMode,
          originalNode: originalActions,
          setMode,
        })
      : originalActions;

    return (
      <div
        className={cx(variants({ shadow, variant }), className)}
        data-code-type="html-preview"
        data-html-preview-language={language}
        style={style}
        {...rest}
      >
        <Flexbox
          horizontal
          align={'center'}
          className={cx(styles.toolbar, classNames?.header)}
          flex={'none'}
          gap={4}
          style={customStyles?.header}
          onClick={stopPropagation}
        >
          {actions}
        </Flexbox>
        {body}
      </div>
    );
  },
);

HtmlPreview.displayName = 'HtmlPreview';

export default HtmlPreview;

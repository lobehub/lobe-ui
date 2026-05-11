'use client';

import { createStyles, cx } from 'antd-style';
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { buildShellSrcDoc, SHELL_UPDATE_MESSAGE_TYPE } from './buildShellSrcDoc';
import { buildStaticSrcDoc } from './buildStaticSrcDoc';
import { DEFAULT_HEIGHT, DEFAULT_SANDBOX, SRCDOC_MAX_LENGTH } from './const';
import { AUTO_HEIGHT_MESSAGE_TYPE } from './injectAutoHeightScript';
import type { HtmlPreviewIframeProps } from './type';

const useStyles = createStyles(({ css, cssVar }) => ({
  fallback: css`
    padding: 16px;
    font-size: 13px;
    color: ${cssVar.colorTextDescription};
  `,
  iframe: css`
    display: block;
    width: 100%;
    border: none;
    background: transparent;
  `,
}));

interface Payload {
  bodyHtml: string;
  /**
   * Non-inline-style children of `<head>` serialised in document order:
   * `<script src=…>`, `<script>…</script>`, `<link>`, `<meta>`, `<base>`,
   * `<title>` etc. The shell appends/dedupes these into its own head so
   * head-loaded resources (Tailwind CDN, p5.js, fonts, …) work for full
   * documents. Inline `<style>` is intentionally excluded — those flow
   * through `styleContent` so streaming partial CSS grows in place rather
   * than stacking duplicate `<style>` blocks.
   *
   * Empty until the user's `<head>` is *sealed* (a `</head>` close tag has
   * arrived, or `<body>` has opened — browsers auto-close head at that
   * point). Holding off prevents partial `src="https://cd"` URLs from
   * being mounted and 404-ing while the model is still streaming.
   */
  headExtrasHtml: string;
  styleContent: string;
}

// Head is "sealed" as soon as we see a close tag or the body has begun;
// after that point, additional chunks land in body and head extras won't
// change.
const headSealedPattern = /<\/head\s*>|<body[\s>]/i;
const isHeadSealed = (raw: string): boolean => headSealedPattern.test(raw);

const parseContent = (() => {
  // Lazy-init: only need one parser instance, and only in the browser.
  let parser: DOMParser | null = null;
  return (content: string): Payload | null => {
    if (typeof window === 'undefined') return null;
    if (!content) return { bodyHtml: '', headExtrasHtml: '', styleContent: '' };
    if (!parser) parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    const styleParts: string[] = [];
    const headExtras: string[] = [];

    if (doc.head) {
      for (const child of Array.from(doc.head.children)) {
        if (child.tagName === 'STYLE') {
          styleParts.push(child.textContent || '');
        } else {
          headExtras.push(child.outerHTML);
        }
      }
    }

    return {
      bodyHtml: doc.body ? doc.body.innerHTML : '',
      headExtrasHtml: isHeadSealed(content) ? headExtras.join('') : '',
      styleContent: styleParts.join('\n'),
    };
  };
})();

export const HtmlPreviewIframe = memo<HtmlPreviewIframeProps>(
  ({
    animated,
    background,
    content,
    className,
    defaultHeight = DEFAULT_HEIGHT,
    ref,
    sandbox = DEFAULT_SANDBOX,
    style,
    title = 'HTML preview',
  }) => {
    const { styles } = useStyles();
    const innerRef = useRef<HTMLIFrameElement | null>(null);
    const frameId = useId();
    const [height, setHeight] = useState<number>(defaultHeight);

    const tooLarge = content.length > SRCDOC_MAX_LENGTH;

    // ── Static mode ─────────────────────────────────────────────────────
    // When the content isn't being streamed we can hand the iframe the
    // user's HTML directly. The browser's normal HTML parser runs:
    //   <script src=…> tags fetch and execute as if on a regular page,
    //   inline <script> blocks run in DOM order, MutationObservers (like
    //   Tailwind Play CDN's) get the document at its expected lifecycle
    //   stage. Anything that a model can produce as a standalone web
    //   page works without special handling on our side.
    const staticSrcDoc = useMemo(() => {
      if (animated || tooLarge) return null;
      return buildStaticSrcDoc({ background, content, frameId });
    }, [animated, background, content, frameId, tooLarge]);

    // ── Shell mode ─────────────────────────────────────────────────────
    // For streaming we keep one shell iframe loaded for the lifetime of
    // the session and pump content updates through postMessage. The
    // shell's morph script handles in-place DOM diffing + fade-in for
    // new nodes (see buildShellSrcDoc.ts). Tradeoff: external <script
    // src> tags appended this way don't always integrate cleanly with
    // class-engine CDNs, so static content is preferred when possible.
    const shellSrcDoc = useMemo(() => {
      if (!animated || tooLarge) return null;
      return buildShellSrcDoc({ background, frameId });
    }, [animated, background, frameId, tooLarge]);

    const [shellReady, setShellReady] = useState(false);
    useEffect(() => {
      // Each time we swap between shell and static modes (or rebuild the
      // shell because the theme changed) we need to wait for a fresh
      // ready ping before posting content.
      setShellReady(false);
    }, [shellSrcDoc]);

    const payload = useMemo<Payload | null>(() => {
      if (!animated || tooLarge) return null;
      return parseContent(content);
    }, [animated, content, tooLarge]);

    // Push content into the shell iframe whenever it changes — but only
    // after the shell has signalled ready, so its listener exists.
    useEffect(() => {
      if (!animated) return;
      if (!shellReady || !payload) return;
      const win = innerRef.current?.contentWindow;
      if (!win) return;
      win.postMessage(
        {
          frameId,
          payload,
          type: SHELL_UPDATE_MESSAGE_TYPE,
        },
        '*',
      );
    }, [animated, payload, shellReady, frameId]);

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.frameId !== frameId) return;
        if (event.source !== innerRef.current?.contentWindow) return;

        if (data.type === `${SHELL_UPDATE_MESSAGE_TYPE}:ready`) {
          setShellReady(true);
          return;
        }

        if (data.type === AUTO_HEIGHT_MESSAGE_TYPE) {
          const next = Number(data.height);
          if (!Number.isFinite(next) || next <= 0) return;
          setHeight((prev) => (Math.abs(prev - next) < 1 ? prev : next));
        }
      };

      window.addEventListener('message', handler);
      return () => window.removeEventListener('message', handler);
    }, [frameId]);

    const setRef = useCallback(
      (node: HTMLIFrameElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLIFrameElement | null }).current = node;
      },
      [ref],
    );

    if (tooLarge) {
      return (
        <div className={cx(styles.fallback, className)} style={style}>
          Content too large to preview inline.
        </div>
      );
    }

    const srcDoc = staticSrcDoc ?? shellSrcDoc ?? '';

    // Key the iframe by mode so React fully unmounts the previous DOM
    // element when we switch from shell (streaming) to static (finalised).
    // Setting iframe.srcdoc on an already-loaded element doesn't reliably
    // re-navigate in Chromium when the previous document was also srcdoc-
    // based — the new srcdoc attribute lands, but the document doesn't
    // reload, so the user sees stale (often empty) shell content. A fresh
    // element forces the browser to parse and load the new srcdoc.
    const iframeKey = animated ? 'shell' : 'static';

    return (
      <iframe
        className={cx(styles.iframe, className)}
        key={iframeKey}
        ref={setRef}
        sandbox={sandbox}
        srcDoc={srcDoc}
        style={{ height, ...style }}
        title={title}
      />
    );
  },
);

HtmlPreviewIframe.displayName = 'HtmlPreviewIframe';

export default HtmlPreviewIframe;

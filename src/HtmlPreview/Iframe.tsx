'use client';

import { createStyles, cx } from 'antd-style';
import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

import { buildShellSrcDoc, SHELL_UPDATE_MESSAGE_TYPE } from './buildShellSrcDoc';
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
   */
  headExtrasHtml: string;
  styleContent: string;
}

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
      headExtrasHtml: headExtras.join(''),
      styleContent: styleParts.join('\n'),
    };
  };
})();

export const HtmlPreviewIframe = memo<HtmlPreviewIframeProps>(
  ({
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
    const [ready, setReady] = useState(false);

    // The shell document is the *only* srcDoc this iframe ever loads. It's
    // memoized so React never replaces the srcDoc attribute → the iframe
    // mounts once and stays mounted.
    const shellSrcDoc = useMemo(
      () => buildShellSrcDoc({ background, frameId }),
      [background, frameId],
    );

    const tooLarge = content.length > SRCDOC_MAX_LENGTH;

    const payload = useMemo<Payload | null>(() => {
      if (tooLarge) return null;
      return parseContent(content);
    }, [content, tooLarge]);

    // Push content into the iframe whenever it changes — but only after
    // the shell has signaled ready, so the listener actually exists.
    useEffect(() => {
      if (!ready || !payload) return;
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
    }, [payload, ready, frameId]);

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        const data = event.data;
        if (!data || typeof data !== 'object') return;
        if (data.frameId !== frameId) return;
        if (event.source !== innerRef.current?.contentWindow) return;

        if (data.type === `${SHELL_UPDATE_MESSAGE_TYPE}:ready`) {
          setReady(true);
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

    return (
      <iframe
        className={cx(styles.iframe, className)}
        ref={setRef}
        sandbox={sandbox}
        srcDoc={shellSrcDoc}
        style={{ height, ...style }}
        title={title}
      />
    );
  },
);

HtmlPreviewIframe.displayName = 'HtmlPreviewIframe';

export default HtmlPreviewIframe;

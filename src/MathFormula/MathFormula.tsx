'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import katex from 'katex';
import { memo, useEffect, useMemo } from 'react';

import { useCdnFn } from '@/ConfigProvider';
import { KATEX_CSS_VERSION } from '@/ConfigProvider/cdnAssets';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';

import { mathFormulaClasses } from './stable';
import type { MathFormulaProps } from './type';

/**
 * Adds the KaTeX stylesheet once when the page has none (`ConfigProvider` loads it with its default
 * web fonts; a host without them still gets typeset math). Same CDN and version as there.
 */
const useKatexStylesheet = () => {
  const genCdnUrl = useCdnFn();
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const loaded = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].some(
      (link) => /katex(?:\.min)?\.css/.test(link.href),
    );
    if (loaded || document.querySelector('[data-lobe-katex]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = genCdnUrl({ path: 'dist/katex.min.css', pkg: 'katex', version: KATEX_CSS_VERSION });
    link.dataset.lobeKatex = '';
    document.head.append(link);
  }, [genCdnUrl]);
};

const styles = stylex.create({
  a2uiBlock: {
    display: 'block',
    fontSize: 16,
  },
  block: {
    display: 'block',
    maxInlineSize: '100%',
  },
  dBlock: {
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingBlock: 3,
  },
  root: {
    color: cssVar.colorText,
  },
});

/**
 * A TeX formula typeset with KaTeX (the renderer lobe-ui's `Markdown` uses), inline or as a
 * centred block. An invalid formula shows its source in the error colour instead of throwing;
 * links and raw HTML commands stay off (`trust: false`). Adapted from CopilotKit
 * `@copilotkit/react-core` (MIT), Gen UI standard `Math`.
 */
const MathFormula = memo<MathFormulaProps>(
  ({ block = false, className, ref, style, value, variant = 'default', ...rest }) => {
    const isA2ui = variant === 'a2ui';
    useKatexStylesheet();
    // KaTeX escapes the source and adds MathML for screen readers.
    const html = useMemo(
      () =>
        katex.renderToString(value ?? '', {
          displayMode: block,
          errorColor: 'var(--lobe-color-error)',
          strict: 'ignore',
          throwOnError: false,
          trust: false,
        }),
      [value, block],
    );
    // The Gen UI standard Math sets a display formula without KaTeX's 1em block margin; an inline
    // style, since the KaTeX stylesheet loads unlayered after ours.
    const shown = isA2ui
      ? html.replace(
          '<span class="katex-display">',
          '<span class="katex-display" style="margin:0">',
        )
      : html;
    const Tag = block ? 'div' : 'span';
    return (
      <Tag
        dir="ltr"
        ref={ref as never}
        {...rest}
        {...styleProps(
          [
            styles.root,
            block && styles.block,
            block && (isA2ui ? styles.a2uiBlock : styles.dBlock),
          ],
          clsx(mathFormulaClasses(), className),
          style,
        )}
        dangerouslySetInnerHTML={{ __html: shown }}
        data-display={block ? 'block' : 'inline'}
        data-variant={variant}
      />
    );
  },
);

MathFormula.displayName = 'MathFormula';

export default MathFormula;

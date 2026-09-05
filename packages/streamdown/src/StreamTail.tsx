import { type Element } from 'hast';
import { type CSSProperties, useRef } from 'react';

import { getNow } from './internal';
import { STREAM_FADE_DURATION } from './styles';

// hast-util-to-jsx-runtime keys siblings as `<tag>-<n>`, so dropping a faded
// span from the front of a text run would re-key (and remount, restarting the
// CSS animation of) every span after it. Each text run is therefore emitted
// as one always-present custom element whose component renders the faded
// prefix as plain text and the in-flight chars as spans keyed by char index.
export const STREAM_TAIL_TAG = 'streamdown-tail';

export interface StreamCharItem {
  birth: number | null;
  key: number;
  value: string;
}

export interface StreamTailData {
  items: (string | StreamCharItem)[];
  text: string;
}

interface StreamTailElementData {
  streamdown?: StreamTailData;
}

// The full run is kept as a text child so hast consumers that walk the
// tree for text (table copy, plain-text extraction) still see it; the
// component ignores `children` and renders from `data`.
export const createStreamTailNode = (data: StreamTailData): Element => ({
  children: [
    {
      type: 'text',
      value:
        data.text +
        data.items.map((item) => (typeof item === 'string' ? item : item.value)).join(''),
    },
  ],
  data: { streamdown: data } as StreamTailElementData as Element['data'],
  properties: {},
  tagName: STREAM_TAIL_TAG,
  type: 'element',
});

export const readStreamTailData = (node?: Element): StreamTailData | undefined =>
  (node?.data as StreamTailElementData | undefined)?.streamdown;

// Delays are frozen per mounted instance, not in the plugin runtime: a
// structural remount (a paragraph turning into a setext heading swaps <p>
// for <h2>) restarts every CSS animation, and the fresh instance has to
// resume each char from its real elapsed time instead of replaying the
// delay captured at its first ever render.
export const StreamTail = ({ node }: { node?: Element }) => {
  const delaysRef = useRef<Map<number, CSSProperties | null>>(new Map());
  const data = readStreamTailData(node);
  if (!data) return null;

  const now = getNow();
  const styleOf = (item: StreamCharItem): CSSProperties | null => {
    if (item.birth === null) return null;
    const cached = delaysRef.current.get(item.key);
    if (cached !== undefined) return cached;
    const elapsed = now - item.birth;
    const style = elapsed >= STREAM_FADE_DURATION ? null : { animationDelay: `${-elapsed}ms` };
    delaysRef.current.set(item.key, style);
    return style;
  };

  return (
    <>
      {data.text}
      {data.items.map((item) => {
        if (typeof item === 'string') return item;
        const style = styleOf(item);
        return (
          <span
            className={style ? 'stream-char' : 'stream-char stream-char-revealed'}
            key={item.key}
            style={style ?? undefined}
          >
            {item.value}
          </span>
        );
      })}
    </>
  );
};

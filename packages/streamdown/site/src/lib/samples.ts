export const heroSample = `## Streaming markdown, the smooth way

**Streamdown** turns raw LLM token streams into calm, readable pages:

1. Splits content into *blocks* and only re-renders the streaming tail
2. Smooths bursty chunk arrival into a steady per-char reveal
3. Fades each character in with CSS — no layout thrash

\`\`\`tsx
import { Streamdown } from '@lobehub/streamdown';

<Streamdown content={tokens} smoothing="balanced" />
\`\`\`

| Feature | Built in |
| --- | --- |
| Block caching | ✅ |
| Unclosed-syntax repair | ✅ |
| LaTeX guard | ✅ |

> Headless by design — bring your own components and typography.
`;

export const markdownSample = `# Markdown Kitchen Sink

A quick tour through **bold**, *italic*, ~~strikethrough~~ and \`inline code\`.

## Lists

1. Ordered items stream block by block
2. The tail block re-renders per reveal commit
   - Nested bullets work too
   - [x] Task list item

## Code

\`\`\`ts
const reveal = (chars: string[]) =>
  chars.map((char, i) => ({ char, delay: i * 18 }));
\`\`\`

## Quote & table

> Streaming UIs should feel like typing, not like a slideshow.

| Preset | Feel |
| --- | --- |
| realtime | snappy |
| balanced | default |
| silky | cinematic |

Final paragraph to give the smoother a long tail of prose to pace out evenly across commits, demonstrating steady per-character reveal even when upstream chunks arrive in bursts.
`;

export const latexSample = `# LaTeX Streaming

Inline math like $E = mc^2$ streams safely, and display math is guarded so a
half-arrived formula never flashes raw source:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} \\, dx = \\sqrt{\\pi}
$$

The Fourier transform pair:

$$
\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\, e^{-2\\pi i x \\xi} \\, dx
$$

With the **latexGuard** enabled, the previous valid frame is held while the
trailing \`$$\` block is still incomplete.

$$
\\nabla \\times \\mathbf{B} = \\mu_0 \\mathbf{J} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{E}}{\\partial t}
$$
`;

export const codeSample = `# Long Code Fence

Code fences skip per-char animation and stream as a block:

\`\`\`tsx
import { memo, useMemo } from 'react';
import { Streamdown } from '@lobehub/streamdown';

interface ChatMessageProps {
  content: string;
  streaming: boolean;
}

export const ChatMessage = memo<ChatMessageProps>(({ content, streaming }) => {
  const plugins = useMemo(() => [remarkGfm], []);

  if (!streaming) {
    return <StaticMarkdown remarkPlugins={plugins}>{content}</StaticMarkdown>;
  }

  return (
    <Streamdown
      content={content}
      granularity="char"
      remarkPlugins={plugins}
      smoothing="balanced"
    />
  );
});

ChatMessage.displayName = 'ChatMessage';
\`\`\`

And prose after the fence resumes the per-character fade, so the transition
between code and text stays seamless.
`;

export const stressSample = `Stress Test
===

Everything below is deliberately hostile: deep nesting, nested fences, math that
collides with markdown syntax, and the exact shapes an LLM emits that break naive
renderers. Toggle **Preprocess** off to see which ones need it.

## 1. Delimiters an LLM actually emits

Models love bracket delimiters instead of dollars. Inline \\(a^2 + b^2 = c^2\\)
and display:

\\[
\\sum_{k=1}^{n} k = \\frac{n(n+1)}{2}
\\]

Without preprocessing these render as literal backslashes.

## 2. Dollars that are *not* math

The plan costs $9.99 per seat, or $1,200 annually — and the enterprise tier is
$25,000, while compute runs at $\\alpha$ per unit. Naive matching pairs the first
two dollars into a formula and eats the sentence — and because real math follows
later in the same paragraph, this is the case that regressed in practice.

## 3. Math colliding with table pipes

| Case | Formula | Note |
| :--- | :---: | ---: |
| Absolute | $\\lvert x \\rvert$ | pipe-free |
| Norm | $\\|v\\|_2 = \\sqrt{\\sum v_i^2}$ | raw pipes vs. columns |
| Set | $\\{x \\mid x > 0\\}$ | \`\\mid\` inside a cell |

## 4. Underscores inside \\text{}

$$
\\text{node_domain} \\rightarrow \\text{edge_gateway} \\rightarrow \\text{sink_pool}
$$

Unescaped underscores in \`\\text{}\` are a subscript error in KaTeX.

## 5. Chemistry (mhchem)

Combustion: $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$, and equilibrium:

$$
\\ce{CO2(g) + H2O(l) <=> H2CO3(aq)}
$$

## 6. CJK 与公式混排

在流式输出里,中文和公式常常直接相邻:设 $f(x) = x^2$ 则导数为 $f'(x) = 2x$,
这里没有空格分隔,预处理需要判断边界。日本語でも同様に $\\alpha + \\beta$ が続く。

## 7. Deeply nested structure

1. Top level
   - Second level bullet
     1. Third level ordered
        - [x] Fourth level task, done
        - [ ] Fourth level task, pending
          > A blockquote at depth five
          >
          > \`\`\`ts
          > const deep = { level: 5, ok: true };
          > \`\`\`
     2. Third level, second item
   - Back to second
2. Top level again

   A loose paragraph belonging to item 2.

   | inline | table | in list |
   | --- | --- | --- |
   | a | b | c |

## 8. Nested code fences

\`\`\`\`md
Here is a fenced block *inside* a fenced block:

\`\`\`python
def reveal(chars):
    return [(c, i * 18) for i, c in enumerate(chars)]
\`\`\`

The outer fence uses four backticks.
\`\`\`\`

## 9. Long unbroken tokens

A path that must not break the layout:
\`/usr/local/lib/node_modules/@lobehub/streamdown/es/useSmoothStreamContent.mjs\`

And a hash: \`d41d8cd98f00b204e9800998ecf8427ed41d8cd98f00b204e9800998ecf8427e\`

## 10. Emphasis edge cases

***Bold italic***, **bold with \`code\` inside**, *italic with [a link](https://example.com)*,
~~strikethrough with **bold**~~, and snake_case_words_that_are_not_emphasis.

Escaped characters: \\*not italic\\*, \\_not emphasis\\_, \\\`not code\\\`.

## 11. Known limitation: cross-block references

Streaming works by splitting the document into top-level blocks and parsing each
one independently — that is what keeps the cost per token bounded. The trade-off:
**a reference cannot resolve a target that lives in a different block.**

These three stay literal instead of resolving:

- a footnote[^1]
- a reference-style link: [the docs][d]
- a reference-style image: ![diagram][img]

[^1]: This definition renders as nothing, because its reference is in another block.
[d]: https://example.com
[img]: https://example.com/diagram.png

Inline forms are unaffected — [this link](https://example.com) works, because it
carries its target inside the same block. If you need footnotes while streaming,
supply a remark/rehype plugin pair that resolves them out of band.

## 12. Hard breaks & rules

Line one with two trailing spaces
line two after a hard break.

---

Final paragraph, deliberately long so the smoother has a substantial tail to pace out across reveal commits — this is where per-character stagger has to stay continuous even though commits are throttled well below the display refresh rate, and where a naive implementation visibly stutters.
`;

export const apiReference = `## API

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| \`content\` | \`string\` | — | The (partial) markdown to render |
| \`smoothing\` | \`'realtime' \\| 'balanced' \\| 'silky'\` | \`'balanced'\` | Reveal pacing preset |
| \`granularity\` | \`'char' \\| 'word'\` | \`'char'\` | Fade animation unit |
| \`latexGuard\` | \`boolean\` | \`false\` | Hold last frame while trailing formula is incomplete |
| \`preprocess\` | \`(text: string) => string\` | — | Transform content before rendering |
| \`components\` / \`remarkPlugins\` / \`rehypePlugins\` | — | — | Passed through to react-markdown |

Lower-level hooks — \`useSmoothStreamContent\`, \`useStreamQueue\`,
\`rehypeStreamAnimated\` and the LaTeX preprocessing helpers — are exported for
custom pipelines. Profiling lives in \`@lobehub/streamdown/profiler\`.

### Limitation: cross-block references

Each top-level block is parsed independently, so a reference whose target sits in
another block stays literal: GFM footnotes, reference-style links
(\`[text][ref]\`) and reference-style images. Inline forms are unaffected. Supply
a remark/rehype plugin pair if you need to resolve these out of band.
`;

export const samples = {
  code: { content: codeSample, label: 'Long code' },
  latex: { content: latexSample, label: 'LaTeX' },
  markdown: { content: markdownSample, label: 'Markdown' },
  stress: { content: stressSample, label: 'Stress test' },
} as const;

export type SampleKey = keyof typeof samples;

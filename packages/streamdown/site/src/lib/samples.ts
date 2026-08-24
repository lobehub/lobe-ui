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

## 13. Mermaid diagrams

Three back-to-back diagram fences. Each one arrives as a long fence with no
renderable intermediate state — the fence guard has to hold them inert until the
closing delimiter lands.

\`\`\`mermaid
flowchart LR
  A[Token stream] --> B{Block boundary?}
  B -- no --> C[Append to tail block]
  B -- yes --> D[Seal block]
  D --> E[Memoize]
  C --> F[Reveal queue]
  E --> F
  F --> G[[CSS animation-delay stagger]]
\`\`\`

\`\`\`mermaid
sequenceDiagram
  participant M as Model
  participant Q as useStreamQueue
  participant R as Streamdown
  M->>Q: chunk (6 chars)
  Q->>Q: smooth to per-char cadence
  Q->>R: committed slice
  R->>R: parse tail block only
  R-->>M: backpressure signal
\`\`\`

\`\`\`mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Streaming: first chunk
  Streaming --> Guarded: unbalanced delimiter
  Guarded --> Streaming: delimiter closed
  Streaming --> Settled: stream end
  Settled --> [*]
\`\`\`

## 14. Code block rendering

A tight run of fences in different languages, including the shapes that break
naive highlighters.

\`\`\`ts
export const useStreamQueue = (source: string, { chunkSize = 8, delayMs = 60 } = {}) => {
  const [text, setText] = useState('');
  useEffect(() => { /* … */ }, [source, chunkSize, delayMs]);
  return { text } as const;
};
\`\`\`

\`\`\`python
def reveal(chars: list[str], *, stagger_ms: int = 18) -> list[dict]:
    return [{"char": c, "delay": i * stagger_ms} for i, c in enumerate(chars)]
\`\`\`

\`\`\`json
{ "smoothing": "balanced", "granularity": "char", "latexGuard": true, "preprocess": "preprocessLaTeX", "plugins": ["remark-gfm", "remark-math", "rehype-katex"] }
\`\`\`

\`\`\`diff
- <Streamdown content={text} />
+ <Streamdown content={text} smoothing="silky" latexGuard />
\`\`\`

A fence with no language tag, containing a very long single line that has to scroll horizontally without widening the pane:

\`\`\`
2026-08-24T12:00:00.482Z  commit=418  block=24  tail="…continuous even though commits are throttled well below the display refresh rate"  reveal=0.08ms  backlog=3  granularity=char  smoothing=balanced
\`\`\`

Inline \`code\` right next to a fence, and an empty fence:

\`\`\`
\`\`\`

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

export const mathEdgeSample = `# Math Edge Cases

Delimiter styles the guard has to recognise, mixed into one stream.

## Bracket delimiters

\\[
f(x) = f(a) + f'(a)(x-a) + \\frac{f''(a)}{2!}(x-a)^2 + \\cdots + \\frac{f^{(n)}(a)}{n!}(x-a)^n + R_n(x)
\\]

Inline bracket form: \\(\\boldsymbol{\\alpha}^T \\boldsymbol{\\beta} = 0\\) means the two
vectors are orthogonal.

## Math inside list items

- **Exponential**
  \\[
  e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots, \\quad x \\in \\mathbb{R}
  \\]
- **Natural log**
  \\[
  \\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\cdots, \\quad -1 < x \\le 1
  \\]
- **Thin-space and comma escapes**
  \\[
  \\frac{363}{15,\\!135} \\times 100\\% = 2.398\\%
  \\]

## Environments

$$
\\begin{bmatrix}
2x_2 - 8x_3 = 8 \\\\
5x_1 - 5x_3 = 10
\\end{bmatrix}
$$

$$i\\hbar \\frac{\\partial}{\\partial t} \\Psi(\\mathbf{r},t) = \\left[ -\\frac{\\hbar^2}{2m} \\nabla^2 + V(\\mathbf{r},t) \\right] \\Psi(\\mathbf{r},t)$$

Trailing inline math right before the end of the stream: $W^\\perp = \\{ \\mathbf{v} \\in \\mathbb{R}^3 \\mid \\mathbf{v} \\cdot \\mathbf{w} = 0 \\}$
`;

export const inlineSample = `# Inline Torture

Links in every shape, arriving one character at a time.

[Markdown link](https://simonhe.me/) · <a href="https://simonhe.me/">raw anchor tag</a>

Bare autolink: https://github.com/lobehub/lobe-ui

- **[Bold wrapping a link](https://example.com)**
- [*Italic inside a link*](https://example.com)
- [\`code inside a link\`](https://example.com)
- Bracketed label: [【Author: Simon】](https://simonhe.me/)

Trailing two-space line breaks:

1. [GitHub](https://github.com)
2. [Wikipedia](https://www.wikipedia.org)
3. Plain text URL: https://markdown-guide.readthedocs.io

## Inline HTML

Text with <sub>subscript</sub>, <sup>superscript</sup> and <ins>inserted text</ins>.

## Mixed scripts and punctuation

这是 ~~已删除的文本~~，这是一个表情 :smile:。中英混排 hello world，标点密度高的一段：\`1-(5)\`、\`3-(3)\`、\`3-(4)\` 的 complex test \`1-(4)\`"heiheihei"中。

مرحبا بكم في عالم اللغة العربية!

## Nested emphasis

Use \`npm install\` to install dependencies. The \`--save-dev\` flag marks it as a
dev dependency. **Bold with _nested italic_ and \`code\`** all in one run.
`;

export const gfmEdgeSample = `# GFM Edge Cases

## Task list

- [ ] Star this repo
- [x] Fork this repo
- [ ] Create issues
- [x] Submit PRs

## Aligned table

| Left | Centered | Right |
|:-----|:--------:|------:|
| 内容1 | 内容2 | 内容3 |
| a long-ish cell | 25 | 1,024 |
| \`code\` | **bold** | [link](https://example.com) |

## Nested blockquote

> This is a blockquote with **bold**, *italic*, and \`inline code\`.
>
> > Nested blockquotes work too, and keep streaming in order.

## Heading levels

### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Footnotes (known limitation)

Each top-level block parses independently, so a footnote reference[^1] whose
definition lands in a later block stays literal.

[^1]: This definition arrives as its own block.

## Tight nested list

1. First level
   - Second level
     - Third level with a very long line that has to wrap inside the reveal without breaking the per-character stagger
   - Back to second
2. Second item

\`\`\`plaintext
packages/
  markdown-parser/
  streamdown/
\`\`\`
`;

export const samples = {
  code: { content: codeSample, label: 'Long code' },
  gfmEdge: { content: gfmEdgeSample, label: 'GFM edge cases' },
  inline: { content: inlineSample, label: 'Inline torture' },
  latex: { content: latexSample, label: 'LaTeX' },
  markdown: { content: markdownSample, label: 'Markdown' },
  mathEdge: { content: mathEdgeSample, label: 'Math edge cases' },
  stress: { content: stressSample, label: 'Stress test' },
} as const;

export type SampleKey = keyof typeof samples;

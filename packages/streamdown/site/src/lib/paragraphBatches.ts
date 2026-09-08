// Each batch stays below every smoothing preset's large-append bypass.
const paragraph = 'Paragraph 01 arrives as a complete block.\n\n';
const content = Array.from({ length: 20 }, (_, i) =>
  paragraph.replace('01', String(i + 1).padStart(2, '0')),
).join('');

const highTpsContent = `# Mixed markdown at two thousand characters per second

When an LLM streams at a few thousand characters per second, the renderer is no longer dealing with a polite trickle of tokens. Whole sentences land in a single animation frame, fences open and close before the smoother has drained the previous block, and the tail parse has to stay cheap even as the open paragraph grows past a thousand characters. This sample is built to look like that kind of answer: long prose, mixed inline marks, and heavier nodes that force the block lexer to reseal and reopen while the input rate stays at two thousand characters per second.

The point is not to flood the page with noise. A realistic high-throughput stream still has structure — headings that split the document, paragraphs that wrap for twenty lines, lists that nest, tables that arrive cell by cell, and code fences whose language tag is visible long before the closing backticks. If the animation only looks correct on twenty copies of "Paragraph 01 arrives as a complete block", it has not been tested against the document shape users actually see.

## Why the open paragraph is the expensive part

Every reveal commit re-parses the trailing block, so cost grows with the tail's length. A short "hello world" paragraph hides that; a six-hundred-character paragraph does not. Keep reading this block as it fills: **bold**, *italic*, ~~strike~~, \`inline code\`, a [link](https://ui.lobehub.com), and mixed punctuation all sit inside the same paragraph node. The smoother has to pace characters through that node without tearing the marks apart, and without treating a mid-word backtick as the start of a fence. That is the actual hot path at high TPS: not twenty identical stubs, but one text node that stays open long enough for the commit interval to widen.

A second long paragraph immediately follows so the lexer cannot treat the first one as a one-off. Streaming UIs fail at the boundary between two large text nodes more often than they fail inside a single node: the previous paragraph is sealed, its animation timeline is frozen, and the new paragraph has to start a fresh stagger while the input queue is still running at two thousand characters per second. If the seal is late, characters from this paragraph leak into the previous block's fade. If the seal is early, the last sentence of the previous paragraph pops in as a completed block instead of finishing its per-character reveal. This sentence exists so the second node is still long after that boundary has been crossed.

## A component that actually streams

The fence below is long enough that it stays open across many 20-character chunks. Code skips per-character animation and reveals as a block, then prose resumes the fade.

\`\`\`tsx
import { memo, useMemo, useState } from 'react';
import { Streamdown } from '@lobehub/streamdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface AssistantTurnProps {
  source: string;
  streaming: boolean;
  smoothing?: 'realtime' | 'balanced' | 'silky';
}

export const AssistantTurn = memo(function AssistantTurn({
  source,
  streaming,
  smoothing = 'balanced',
}: AssistantTurnProps) {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);
  const [copied, setCopied] = useState(false);

  if (!streaming) {
    return (
      <Streamdown
        content={source}
        granularity="char"
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        smoothing={smoothing}
      />
    );
  }

  return (
    <div data-streaming={copied ? 'copied' : 'live'}>
      <Streamdown
        content={source}
        granularity="char"
        latexGuard
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        smoothing={smoothing}
        onCopy={() => setCopied(true)}
      />
    </div>
  );
});
\`\`\`

After the fence the per-character fade has to restart on a long prose node, not on a one-line caption. That transition is where a naive implementation either freezes the last code line's opacity or dumps the next paragraph in a single paint. The following paragraph is intentionally long so the restart is visible: the queue still holds hundreds of characters, the smoother is still pacing at a few dozen commits per second, and this sentence has to land one glyph at a time even though the model already finished the fence two hundred milliseconds ago. Inline marks keep arriving too — \`useMemo\`, **latexGuard**, and a trailing [docs link](https://ui.lobehub.com/components/markdown) — so the restarted node is not a plain string either.

## Lists, tasks, and a table in the same stream

High TPS is not only paragraphs. The nodes below arrive in the same 20-character chunks, which means list markers, table pipes, and quote prefixes are often split across batch boundaries.

1. Ordered items stream as one list block until a blank line seals them
2. Nested content has to indent without breaking the parent list
   - Nested bullets with \`inline code\` and **emphasis**
   - A second nested bullet that wraps onto another line because the clause is long enough to force a break in a typical chat column, and it still has to keep the stagger continuous
3. Back to the top level with a trailing clause so the last item is not a stub

- [x] Seal completed blocks so they never re-parse
- [ ] Keep the open tail cheap as it grows past a thousand characters
- [x] Resume character animation after a fence
- [ ] Hold LaTeX until the closing delimiter arrives

> Streaming UIs should feel like typing, not like a slideshow. A blockquote is still a block: it has to fade as a unit once sealed, while any text that follows starts a new timeline. This quote is long on purpose so it cannot be mistaken for a one-line callout, and so the high-TPS case actually opens a quote node instead of skipping past it.

| Node | Why it is here | Risk at 2000 chars/s |
| --- | --- | --- |
| Long paragraph | Tail parse cost grows with length | Stutter, dropped stagger |
| Code fence | Open fence spans many chunks | Flash of raw backticks |
| Nested list | Indent + mixed inlines | Broken list or nested parse |
| Table | Pipes arrive before the row is complete | Column collapse |
| Quote | Separate block after prose | Animation reset at the boundary |

## A second fence, then JSON, math, and a diagram

Python so the highlighter switches language while the stream is still hot:

\`\`\`python
from dataclasses import dataclass

@dataclass
class RevealCommit:
    text: str
    delay_ms: int
    sealed: bool

def pace(source: str, chunk_size: int = 20, delay_ms: int = 10) -> list[RevealCommit]:
    commits: list[RevealCommit] = []
    offset = 0
    while offset < len(source):
        offset = min(len(source), offset + chunk_size)
        commits.append(
            RevealCommit(
                text=source[:offset],
                delay_ms=delay_ms,
                sealed=offset >= len(source),
            )
        )
    return commits
\`\`\`

Configuration often arrives as a tight JSON fence. It is a different highlighter, a different block, and another chance to flash raw source if the closer is late:

\`\`\`json
{
  "smoothing": "balanced",
  "granularity": "char",
  "latexGuard": true,
  "chunkSize": 20,
  "delayMs": 10,
  "plugins": ["remark-gfm", "remark-math", "rehype-katex"]
}
\`\`\`

Inline math like $E = mc^2$ sits in a sentence, and display math has to stay guarded until the closing \`$$\` lands:

$$
\\hat{f}(\\xi) = \\int_{-\\infty}^{\\infty} f(x)\\, e^{-2\\pi i x \\xi} \\, dx
$$

The Fourier pair is here so a formula node sits between fences and diagrams, not as its own isolated sample:

$$
f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi) e^{2\\pi i \\xi x} \\, d\\xi
$$

\`\`\`mermaid
flowchart LR
  A[Token stream] --> B{Block boundary?}
  B -- no --> C[Append to tail]
  B -- yes --> D[Seal previous]
  D --> E[Memoize]
  C --> F[Reveal queue]
  E --> F
  F --> G[Per-char CSS stagger]
\`\`\`

## Closing: two more long text nodes

The last two paragraphs exist so the demo does not end on a diagram. Ending on a heavy node hides whether the smoother can return to long-form prose after a fence, a table, and math. This paragraph is a single text node that should stay open for a long time: it talks about commit interval widening as the tail grows, about not flushing the whole remainder when a large append is actually just a fast model, and about keeping the character fade continuous even though React only commits a few times per frame. The input rate for this case is twenty characters every ten milliseconds, which is two thousand characters per second — well above what the display can animate, which is exactly the pressure a real high-TPS model puts on the queue.

Final paragraph, still long, still one node. If you can read this sentence appearing one character at a time after the mermaid block has already painted, the mixed-document path is doing its job. The previous samples used twenty identical short paragraphs; those never opened a fence, never wrapped a six-hundred-character text node, and never asked the lexer to reseal a table. This one does all three, then keeps the tail in prose until the stream ends, which is the shape of an actual assistant answer rather than a synthetic paragraph pump. Inline leftovers at the very end: \`chunkSize=20\`, **2000 chars/s**, and a last [reference](https://github.com/lobehub/lobe-ui) so the final node is still a mixed text node rather than a plain string.
`;

export const paragraphBatchCases = {
  paragraph: {
    chunkSize: paragraph.length,
    content,
    delayMs: 500,
    label: 'Complete paragraphs',
  },
  paragraphBurst: {
    chunkSize: paragraph.length * 2,
    content,
    delayMs: 500,
    label: 'Two paragraphs per batch',
  },
  highTps: {
    chunkSize: 20,
    content: highTpsContent,
    delayMs: 10,
    label: 'High TPS mixed markdown (2000 chars/s)',
  },
};

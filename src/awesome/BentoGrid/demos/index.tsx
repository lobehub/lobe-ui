import { Hotkey, Markdown, Snippet } from '@lobehub/ui';
import { BentoCard, BentoGrid } from '@lobehub/ui/awesome';

export default () => (
  <BentoGrid>
    <BentoCard
      colSpan={2}
      hint="streaming · math"
      href="/components/markdown"
      rowSpan={2}
      title="Markdown"
    >
      <Markdown fontSize={13} variant={'chat'}>
        {'#### Streaming Markdown\n\n- Tables, task lists, footnotes\n- KaTeX math and Mermaid'}
      </Markdown>
    </BentoCard>
    <BentoCard hint="key bindings" href="/components/hotkey" title="Hotkey">
      <Hotkey keys={'mod+k'} variant={'outlined'} />
    </BentoCard>
    <BentoCard hint="one-line copy" href="/components/snippet" title="Snippet">
      <Snippet language={'bash'}>pnpm add @lobehub/ui</Snippet>
    </BentoCard>
    <BentoCard colSpan={2} hint="span two columns" title="Wide tile">
      Any live content
    </BentoCard>
  </BentoGrid>
);

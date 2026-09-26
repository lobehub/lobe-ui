import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarkdownProvider } from '../components/MarkdownProvider';
import MarkdownRender from './MarkdownRender';
import StreamdownRender from './StreamdownRender';

const content = `**Markdown text** and <em>safe HTML</em>

<iframe srcdoc="<p>embedded document</p>"></iframe>
<object data="https://example.com/file"></object>
<embed src="https://example.com/file">
<base href="https://example.com/">`;

describe.each([
  ['standard', MarkdownRender],
  ['streaming', StreamdownRender],
] as const)('%s Markdown rendering', (_, Renderer) => {
  it('keeps formatting while removing unsafe raw HTML', async () => {
    const { container } = render(
      <MarkdownProvider allowHtml enableLatex={false}>
        <Renderer>{content}</Renderer>
      </MarkdownProvider>,
    );

    expect(await screen.findByText('safe HTML')).toHaveProperty('tagName', 'EM');
    expect(container.querySelector('strong')?.textContent).toBe('Markdown text');
    expect(document.querySelector('iframe, object, embed, base')).toBeNull();
  });

  it('preserves mathematical expressions when raw HTML is enabled', async () => {
    const { container } = render(
      <MarkdownProvider allowHtml enableLatex>
        <Renderer>{'$a^2$'}</Renderer>
      </MarkdownProvider>,
    );

    expect(container.querySelector('.katex')).not.toBeNull();
  });
});

import { render, screen } from '@testing-library/react';
import type { ComponentProps, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MarkdownProvider } from '../components/MarkdownProvider';
import MarkdownRender from './MarkdownRender';
import { clearParseCache } from './parseCache';
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

describe('MarkdownRender parse cache', () => {
  /** Remark plugin that counts how many times the pipeline actually runs. */
  const parseSpy = vi.fn();
  const countingPlugin = () => () => {
    parseSpy();
  };
  const remarkPlugins = [countingPlugin];

  beforeEach(() => {
    clearParseCache();
    parseSpy.mockClear();
  });

  const mount = (
    markdown: string,
    providerProps: Partial<ComponentProps<typeof MarkdownProvider>> = {},
    options: ComponentProps<typeof MarkdownRender> = {},
  ) =>
    render(
      <MarkdownProvider enableLatex={false} remarkPlugins={remarkPlugins} {...providerProps}>
        <MarkdownRender {...options}>{markdown}</MarkdownRender>
      </MarkdownProvider>,
    );

  it('reuses the parsed tree when the same content is mounted again', () => {
    mount('**cached** content').unmount();
    expect(parseSpy).toHaveBeenCalledTimes(1);

    const { container } = mount('**cached** content');
    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(container.querySelector('strong')?.textContent).toBe('cached');
  });

  it('parses again when the content changes', () => {
    mount('first').unmount();
    mount('second').unmount();
    expect(parseSpy).toHaveBeenCalledTimes(2);
  });

  it('parses again when the plugin configuration changes', () => {
    mount('$a^2$', { enableLatex: false }).unmount();
    const { container } = mount('$a^2$', { enableLatex: true });

    expect(parseSpy).toHaveBeenCalledTimes(2);
    expect(container.querySelector('.katex')).not.toBeNull();
  });

  it('keys plugin options structurally rather than by array reference', () => {
    const withOptions = (value: string) => [[countingPlugin, { value }]];

    mount('options', { remarkPlugins: withOptions('a') as any }).unmount();
    mount('options', { remarkPlugins: withOptions('a') as any }).unmount();
    expect(parseSpy).toHaveBeenCalledTimes(1);

    mount('options', { remarkPlugins: withOptions('b') as any }).unmount();
    expect(parseSpy).toHaveBeenCalledTimes(2);
  });

  it('applies the current instance components on a cache hit', () => {
    mount('**styled**').unmount();

    const Strong = ({ children }: { children?: ReactNode }) => (
      <span data-testid="custom-strong">{children}</span>
    );
    const { getByTestId } = mount('**styled**', { components: { strong: Strong } });

    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(getByTestId('custom-strong').textContent).toBe('styled');
  });

  it('bypasses the cache when post-processing options are set', () => {
    const options = { disallowedElements: ['strong'] };
    mount('**hidden** text', {}, options).unmount();
    const { container } = mount('**hidden** text', {}, options);

    expect(parseSpy).toHaveBeenCalledTimes(2);
    expect(container.querySelector('strong')).toBeNull();
  });

  it('keeps unsafe URLs stripped on a cache hit', () => {
    mount('[link](javascript:alert(1))').unmount();
    const { container } = mount('[link](javascript:alert(1))');

    expect(parseSpy).toHaveBeenCalledTimes(1);
    expect(container.querySelector('a')?.getAttribute('href') ?? '').toBe('');
  });
});

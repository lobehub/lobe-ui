import { render, screen } from '@testing-library/react';

import CodeBlock from './CodeBlock';

vi.mock('@lobehub/ui/Highlighter', () => ({
  default: ({ children, language }: { children: string; language: string }) => (
    <pre data-language={language} data-testid="docs-code-block">
      {children}
    </pre>
  ),
}));

it('highlights fenced MDX code with the language from className', () => {
  render(
    <CodeBlock>
      <code className="language-tsx">{`import { Auth0 } from '@lobehub/ui/icons';`}</code>
    </CodeBlock>,
  );

  const block = screen.getByTestId('docs-code-block');
  expect(block.getAttribute('data-language')).toBe('tsx');
  expect(block.textContent).toContain("import { Auth0 } from '@lobehub/ui/icons';");
});

it('falls back to plaintext when no language class is present', () => {
  render(
    <CodeBlock>
      <code>plain text</code>
    </CodeBlock>,
  );

  expect(screen.getByTestId('docs-code-block').getAttribute('data-language')).toBe('plaintext');
});

it('returns null for empty code', () => {
  const { container } = render(
    <CodeBlock>
      <code className="language-ts" />
    </CodeBlock>,
  );

  expect(container.childElementCount).toBe(0);
});

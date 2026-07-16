import { render } from '@testing-library/react';

import { Highlight } from './highlight';

const marks = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('mark')).map((node) => node.textContent);

describe('Highlight', () => {
  it('highlights an exact match', () => {
    const { container } = render(<Highlight query="button" text="a button component" />);
    expect(marks(container)).toEqual(['button']);
  });

  it('highlights the query as a prefix of a longer word', () => {
    const { container } = render(<Highlight query="button" text="buttons and links" />);
    expect(marks(container)).toEqual(['button']);
  });

  it('highlights the whole word when the word is a prefix of the query', () => {
    const { container } = render(<Highlight query="buttons" text="a button component" />);
    expect(marks(container)).toEqual(['button']);
  });

  it('highlights multiple terms', () => {
    const { container } = render(<Highlight query="button link" text="a button and a link" />);
    expect(marks(container)).toEqual(['button', 'link']);
  });

  it('matches case-insensitively', () => {
    const { container } = render(<Highlight query="Button" text="a BUTTON component" />);
    expect(marks(container)).toEqual(['BUTTON']);
  });

  it('renders plain text when there is no match', () => {
    const { container } = render(<Highlight query="xyz" text="a button component" />);
    expect(marks(container)).toEqual([]);
    expect(container.textContent).toBe('a button component');
  });

  it('renders plain text for an empty query', () => {
    const { container } = render(<Highlight query="" text="a button component" />);
    expect(marks(container)).toEqual([]);
    expect(container.textContent).toBe('a button component');
  });

  it('renders plain text for a whitespace-only query', () => {
    const { container } = render(<Highlight query="   " text="a button component" />);
    expect(marks(container)).toEqual([]);
  });

  it('does not throw on regex-special characters in the query', () => {
    expect(() => render(<Highlight query="c++" text="learning c++ today" />)).not.toThrow();
  });

  it('highlights a term containing regex-special characters', () => {
    const { container } = render(<Highlight query="c++" text="learning c++ today" />);
    expect(marks(container)).toEqual(['c++']);
  });

  it('highlights a word before trailing punctuation when the query is a prefix of it', () => {
    const { container } = render(<Highlight query="components" text="a component, and a button" />);
    expect(marks(container)).toEqual(['component']);
    expect(container.textContent).toBe('a component, and a button');
  });

  it('highlights a prefix query against a punctuated word', () => {
    const { container } = render(<Highlight query="button" text="Buttons, and links" />);
    expect(marks(container)).toEqual(['Button']);
    expect(container.textContent).toBe('Buttons, and links');
  });

  it('picks the longest matching term when multiple terms match the same token', () => {
    const { container } = render(<Highlight query="but button" text="a button component" />);
    expect(marks(container)).toEqual(['button']);
  });

  it('does not use dangerouslySetInnerHTML', () => {
    const source = Highlight.toString();
    expect(source).not.toContain('dangerouslySetInnerHTML');
  });
});

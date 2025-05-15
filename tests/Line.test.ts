import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { Line } from '../src/Highlighter/SyntaxHighlighter/Line';

describe('Line', () => {
  it('should render empty line when no content provided', () => {
    const { container } = render(React.createElement(Line));
    expect(container.querySelector('.line')).toBeTruthy();
    expect(container.querySelector('.line')?.textContent).toBe(' ');
  });

  it('should parse and render shiki-style HTML content', () => {
    const content = '<span class="line"><span style="color: #000">test</span></span>';
    const { container } = render(React.createElement(Line, { children: content }));

    expect(container.querySelector('.line')).toBeTruthy();
    expect(container.innerHTML).toContain('<span style="color: #000">test</span>');
  });

  it('should handle fallback case when no span.line is found', () => {
    const content = 'test\nline';
    const { container } = render(React.createElement(Line, { children: content }));

    expect(container.querySelector('.line')).toBeTruthy();
    expect(container.innerHTML).toContain('<span>test</span>');
    expect(container.innerHTML).toContain('<span>line</span>');
  });

  it('should not update contents if new lines are same as previous', () => {
    const content = '<span class="line"><span>test</span></span>';
    const { container, rerender } = render(React.createElement(Line, { children: content }));

    const firstRender = container.innerHTML;
    rerender(React.createElement(Line, { children: content }));

    expect(container.innerHTML).toBe(firstRender);
  });

  it('should update contents if new lines are different', () => {
    const content1 = '<span class="line"><span>test1</span></span>';
    const content2 = '<span class="line"><span>test2</span></span>';

    const { container, rerender } = render(React.createElement(Line, { children: content1 }));
    const firstRender = container.innerHTML;

    rerender(React.createElement(Line, { children: content2 }));
    expect(container.innerHTML).not.toBe(firstRender);
    expect(container.innerHTML).toContain('test2');
  });

  it('should update contents if number of lines changes', () => {
    const content1 = '<span class="line"><span>test</span></span>';
    const content2 = '<span class="line"><span>test</span><span>test2</span></span>';

    const { container, rerender } = render(React.createElement(Line, { children: content1 }));
    const firstRender = container.innerHTML;

    rerender(React.createElement(Line, { children: content2 }));
    expect(container.innerHTML).not.toBe(firstRender);
    expect(container.innerHTML).toContain('test2');
  });
});

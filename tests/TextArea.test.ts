import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { TextArea } from '../src/Input/TextArea';

describe('TextArea', () => {
  it('should render correctly with default props', () => {
    const { container } = render(
      React.createElement(TextArea, { 'data-testid': 'textarea' } as any),
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <textarea
        class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-outlined acss-0"
        data-testid="textarea"
        style="resize: none;"
      />
    `);
  });

  it('should render with resize enabled', () => {
    const { container } = render(
      React.createElement(TextArea, { 'data-testid': 'textarea', 'resize': true } as any),
    );
    const style = window.getComputedStyle(container.firstChild as HTMLElement);
    // When resize is true, the style.resize should not be 'none'
    expect(style.resize).not.toBe('none');
  });

  it('should render with resize disabled', () => {
    const { container } = render(
      React.createElement(TextArea, { 'data-testid': 'textarea', 'resize': false } as any),
    );
    const style = window.getComputedStyle(container.firstChild as HTMLElement);
    expect(style.resize).toBe('none');
  });

  it('should render with custom className', () => {
    const { container } = render(
      React.createElement(TextArea, {
        'className': 'custom-class',
        'data-testid': 'textarea',
      } as any),
    );
    expect((container.firstChild as HTMLElement).className).toMatch(/custom-class/);
  });

  it('should render with custom style', () => {
    const { container } = render(
      React.createElement(TextArea, {
        'data-testid': 'textarea',
        'style': { color: 'red' },
      } as any),
    );
    const style = window.getComputedStyle(container.firstChild as HTMLElement);
    // computed color might be rgb, so check for substring
    expect(style.color.replaceAll(' ', '')).toMatch(/red|rgb\(255,0,0\)/i);
  });

  it('should render with shadow', () => {
    const { container } = render(
      React.createElement(TextArea, { 'data-testid': 'textarea', 'shadow': true } as any),
    );
    expect(container.firstChild).toMatchInlineSnapshot(`
      <textarea
        class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-outlined acss-0"
        data-testid="textarea"
        style="resize: none;"
      />
    `);
  });

  it('should render with different variants', () => {
    const variants = ['filled', 'outlined', 'borderless', 'underlined'] as const;
    const snapshots: string[] = [];
    for (const variant of variants) {
      const { container } = render(
        React.createElement(TextArea, { 'data-testid': 'textarea', variant } as any),
      );
      // Collect the rough snapshot for each variant for inline snapshot assertion
      snapshots.push((container.firstChild as HTMLElement).outerHTML);
    }
    // All variants for inline snapshot
    expect(snapshots).toMatchInlineSnapshot([
      `<textarea data-testid="textarea" style="resize: none;" class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-filled acss-waauh5"></textarea>`,
      `<textarea data-testid="textarea" style="resize: none;" class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-outlined acss-0"></textarea>`,
      `<textarea data-testid="textarea" style="resize: none;" class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-borderless acss-v7c7v6"></textarea>`,
      `<textarea data-testid="textarea" style="resize: none;" class="ant-input css-dev-only-do-not-override-1v5z42l ant-input-underlined acss-0"></textarea>`,
    ]);
  });

  it('should merge custom style with resize style', () => {
    const { container } = render(
      React.createElement(TextArea, {
        'data-testid': 'textarea',
        'resize': false,
        'style': { color: 'blue' },
      } as any),
    );
    const style = window.getComputedStyle(container.firstChild as HTMLElement);
    expect(style.resize).toBe('none');
    // computed color might be rgb, so check for substring
    expect(style.color.replaceAll(' ', '')).toMatch(/blue|rgb\(0,0,255\)/i);
  });
});

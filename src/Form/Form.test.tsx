import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { stubMatchMedia } from '@/base-ui/FormKit/test-utils';

import Form from '.';

stubMatchMedia();

const rootOf = (container: HTMLElement) => container.querySelector('form') as HTMLFormElement;

describe('Form spacing options', () => {
  it('keeps the default spacing when no option is set', () => {
    const { container } = render(
      <Form>
        <Form.Item label="Name" name="name">
          <input />
        </Form.Item>
      </Form>,
    );
    const root = rootOf(container);
    expect(root.style.gap).toBe('');
    expect(root.style.getPropertyValue('--lobe-form-item-padding-block')).toBe('');
  });

  it('itemPadding sets the Form.Item block padding', () => {
    const { container } = render(<Form itemPadding={8} />);
    expect(rootOf(container).style.getPropertyValue('--lobe-form-item-padding-block')).toBe('8px');
    const { container: c2 } = render(<Form itemPadding="0.5rem" />);
    expect(rootOf(c2).style.getPropertyValue('--lobe-form-item-padding-block')).toBe('0.5rem');
  });

  it('compact is a preset; explicit gap / itemPadding win', () => {
    const { container } = render(<Form compact />);
    const root = rootOf(container);
    expect(root.style.gap).toBe('12px');
    expect(root.style.getPropertyValue('--lobe-form-item-padding-block')).toBe('10px');

    const { container: c2 } = render(<Form compact gap={20} itemPadding={4} />);
    expect(rootOf(c2).style.gap).toBe('20px');
    expect(rootOf(c2).style.getPropertyValue('--lobe-form-item-padding-block')).toBe('4px');
  });
});

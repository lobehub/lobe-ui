import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { stubMatchMedia } from '@/base-ui/FormKit/test-utils';

import Form from '..';

stubMatchMedia();

const rootOf = (container: HTMLElement) => container.querySelector('form') as HTMLFormElement;
const VAR = '--lobe-form-item-padding-block';

describe('base-ui Form spacing options', () => {
  it('keeps the default spacing when no option is set', () => {
    const { container } = render(
      <Form>
        <Form.Field label={'Name'} name={'name'}>
          <input />
        </Form.Field>
      </Form>,
    );
    expect(rootOf(container).style.gap).toBe('');
    expect(rootOf(container).style.getPropertyValue(VAR)).toBe('');
  });

  it('itemPadding sets the Form.Field block padding', () => {
    const { container } = render(<Form itemPadding={8} />);
    expect(rootOf(container).style.getPropertyValue(VAR)).toBe('8px');
    const { container: c2 } = render(<Form itemPadding={'0.5rem'} />);
    expect(rootOf(c2).style.getPropertyValue(VAR)).toBe('0.5rem');
  });

  it('compact is a preset; explicit gap / itemPadding win', () => {
    const { container } = render(<Form compact />);
    expect(rootOf(container).style.gap).toBe('12px');
    expect(rootOf(container).style.getPropertyValue(VAR)).toBe('10px');
    const { container: c2 } = render(<Form compact gap={20} itemPadding={4} />);
    expect(rootOf(c2).style.gap).toBe('20px');
    expect(rootOf(c2).style.getPropertyValue(VAR)).toBe('4px');
  });
});

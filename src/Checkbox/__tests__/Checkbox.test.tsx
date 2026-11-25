import { cleanup, render } from '@testing-library/react';

import Checkbox from '../Checkbox';
import { checkboxClasses } from '../stable';

afterEach(() => {
  cleanup();
});

const control = (container: HTMLElement) =>
  container.querySelector<HTMLElement>(`.${checkboxClasses('control')}`);

describe('Checkbox first-line alignment', () => {
  it('wraps the box in a control that sits beside the label text', () => {
    const { container } = render(<Checkbox>Agree to the terms</Checkbox>);

    const wrapper = control(container);
    expect(wrapper).not.toBeNull();
    expect(wrapper!.querySelector(`.${checkboxClasses('checkbox')}`)).not.toBeNull();
    expect(wrapper!.nextElementSibling?.classList.contains(checkboxClasses('text'))).toBe(true);
  });

  it('gives the control the label text font so its line box matches the first line', () => {
    const { container } = render(
      <Checkbox textProps={{ fontSize: 20, lineHeight: 1.8 }}>Large label</Checkbox>,
    );

    const { style } = control(container)!;
    expect(style.fontSize).toBe('20px');
    expect(style.lineHeight).toBe('1.8');
  });

  it('prefers the text style override for the control font', () => {
    const { container } = render(
      <Checkbox
        styles={{ text: { fontSize: 12, lineHeight: '18px' } }}
        textProps={{ fontSize: 20 }}
      >
        Small label
      </Checkbox>,
    );

    const { style } = control(container)!;
    expect(style.fontSize).toBe('12px');
    expect(style.lineHeight).toBe('18px');
  });

  it('renders the bare box without a control when there is no label', () => {
    const { container } = render(<Checkbox />);

    expect(control(container)).toBeNull();
  });
});

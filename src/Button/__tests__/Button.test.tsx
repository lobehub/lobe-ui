import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { type ReactNode, useState } from 'react';

import ConfigProvider from '@/ConfigProvider';
import { cssVar } from '@/styles/stylex/cssVar.stylex';

import Button from '../Button';
import { buttonPaddingInline, buttonStyles } from '../index';
import type { ButtonProps } from '../type';

const renderButton = (children: ReactNode) =>
  render(<ConfigProvider motion={motion}>{children}</ConfigProvider>);

describe('Button', () => {
  test('exports buttonStyles as StyleX class strings', () => {
    expect(typeof buttonStyles.base).toBe('string');
    expect(buttonStyles.base).toMatch(/(^|\s)lb\w+/);
  });

  test('provides a positioning context for absolutely positioned content', () => {
    renderButton(
      <Button>
        Continue
        <span style={{ position: 'absolute' }}>Provider icon</span>
      </Button>,
    );

    const button = screen.getByRole('button', { name: /continue/i });

    expect(getComputedStyle(button).position).toBe('relative');
  });

  test('preserves native submission and submitter data when the first click starts loading', () => {
    const handleClick = vi.fn();
    const handleSubmit = vi.fn();

    const TestForm = () => {
      const [loading, setLoading] = useState(false);

      return (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const submitter = (event.nativeEvent as SubmitEvent).submitter;
            handleSubmit(submitter, new FormData(event.currentTarget, submitter).get('consent'));
          }}
        >
          <Button
            htmlType={'submit'}
            loading={loading}
            name={'consent'}
            value={'accept'}
            onClick={() => {
              handleClick();
              setLoading(true);
            }}
          >
            Accept
          </Button>
        </form>
      );
    };

    renderButton(<TestForm />);

    const button = screen.getByRole('button', { name: 'Accept' }) as HTMLButtonElement;

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(button, 'accept');
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test('preserves a loading anchor address while preventing its activation', () => {
    const handleClick = vi.fn();

    renderButton(
      <Button loading href={'/docs'} onClick={handleClick}>
        Open docs
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Open docs' });

    expect(link.getAttribute('href')).toBe('/docs');
    expect(link.getAttribute('aria-busy')).toBe('true');
    expect(link.getAttribute('aria-disabled')).toBe('true');
    expect(fireEvent.click(link)).toBe(false);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('retains native disabled semantics for explicitly disabled buttons', () => {
    const handleSubmit = vi.fn();

    renderButton(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <Button disabled htmlType={'submit'}>
          Submit
        </Button>
      </form>,
    );

    const button = screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement;

    fireEvent.click(button);

    expect(button.disabled).toBe(true);
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test('drops both the fill and the border for every ghost variant', () => {
    const transparent = new Set(['transparent', 'rgba(0, 0, 0, 0)']);
    const variants: ButtonProps[] = [
      {},
      { type: 'primary' },
      { danger: true },
      { type: 'dashed' },
      { danger: true, type: 'primary' },
    ];

    for (const variant of variants) {
      cleanup();
      renderButton(
        <Button ghost {...variant}>
          Delete
        </Button>,
      );

      const style = getComputedStyle(screen.getByRole('button', { name: 'Delete' }));

      expect(transparent.has(style.backgroundColor)).toBe(true);
      expect(transparent.has(style.borderColor)).toBe(true);
    }
  });

  test('leaves text and link buttons on their own variant when ghost is set', () => {
    renderButton(
      <Button ghost type={'link'}>
        Docs
      </Button>,
    );

    expect(getComputedStyle(screen.getByRole('button', { name: 'Docs' })).paddingInline).toBe(
      '0px',
    );
  });

  test.each(['small', 'middle', 'large'] as const)(
    'outdent on a text button cancels %s padding-inline',
    (size) => {
      renderButton(
        <Button outdent size={size} type={'text'}>
          Attach
        </Button>,
      );

      const style = getComputedStyle(screen.getByRole('button', { name: 'Attach' }));

      expect(style.getPropertyValue('--button-padding-inline').trim()).toBe(
        `${buttonPaddingInline[size]}px`,
      );
      expect(style.marginInlineStart.replaceAll(' ', '')).toBe(
        'calc(var(--button-padding-inline)*-1)',
      );
    },
  );

  test('outdent="end" cancels padding on the end edge', () => {
    renderButton(
      <Button outdent={'end'} type={'text'}>
        Next
      </Button>,
    );

    const style = getComputedStyle(screen.getByRole('button', { name: 'Next' }));

    expect(style.marginInlineEnd.replaceAll(' ', '')).toBe('calc(var(--button-padding-inline)*-1)');
    expect(style.marginInlineStart.replaceAll(' ', '')).not.toContain('--button-padding-inline');
  });
  test('solid primary button shows its active fill while its popup is open', () => {
    renderButton(
      <Button data-popup-open type={'primary'}>
        Open
      </Button>,
    );

    const style = getComputedStyle(screen.getByRole('button', { name: 'Open' }));

    expect(style.backgroundColor).toBe(cssVar.colorPrimaryActive);
  });

  // jsdom drops color-mix() declarations, so the danger fills are checked in the browser;
  // here only the variant wiring is asserted.
  test('danger buttons take the tinted danger styles', () => {
    renderButton(
      <>
        <Button danger type={'primary'}>
          Solid
        </Button>
        <Button danger>Outlined</Button>
        <Button danger type={'fill'}>
          Fill
        </Button>
        <Button danger type={'text'}>
          Text
        </Button>
        <Button danger ghost>
          Ghost
        </Button>
      </>,
    );

    const classOf = (name: string) => screen.getByRole('button', { name }).className;
    const firstClass = (key: keyof typeof buttonStyles) => buttonStyles[key].split(' ')[0];

    expect(classOf('Solid')).toContain(firstClass('dangerSolid'));
    expect(classOf('Outlined')).toContain(firstClass('dangerOutlined'));
    expect(classOf('Fill')).toContain(firstClass('dangerFill'));
    expect(classOf('Text')).toContain(firstClass('dangerText'));
    expect(classOf('Ghost')).toContain(firstClass('ghostDanger'));
  });
});

{
  const text: ButtonProps<'text'> = { outdent: true, type: 'text' };
  void text;
  // @ts-expect-error outdent is only on type="text"
  const primary: ButtonProps<'primary'> = { outdent: true, type: 'primary' };
  void primary;
}

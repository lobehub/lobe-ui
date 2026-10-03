import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { z } from 'zod';

import { MotionProvider } from '@/MotionProvider';

import { useFormInstance } from './context';
import FormField from './Field';
import Form from './Form';
import SubmitFooter from './SubmitFooter';
import { stubMatchMedia } from './test-utils';
import type { FormInstance, UseFormOptions } from './type';
import { useForm } from './useForm';

stubMatchMedia();

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

type Values = { email: string; name: string };

let form!: FormInstance<Values>;
const Host = ({
  children,
  options,
  render: renderBody,
}: {
  children?: ReactNode;
  options?: UseFormOptions<Values>;
  render?: (f: FormInstance<Values>) => ReactNode;
}) => {
  form = useForm<Values>({ initialValues: { email: '', name: 'Ada' }, ...options });
  return renderBody ? renderBody(form) : <>{children}</>;
};

describe('<Form>', () => {
  it('renders items groups with bound fields', () => {
    render(
      <Host
        render={(f) => (
          <Form
            form={f}
            items={[
              {
                children: [{ children: <input />, label: 'Name', name: 'name' }],
                key: 'profile',
                title: 'Profile',
              },
            ]}
          />
        )}
      />,
    );
    expect(screen.getByText('Profile')).toBeTruthy();
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Ada');
  });

  it('renders an item without name as an unbound layout row', () => {
    const onChange = vi.fn();
    render(
      <Host
        render={(f) => (
          <Form
            form={f}
            itemsType="flat"
            items={[
              { children: <input defaultValue="free" onChange={onChange} />, label: 'Free' },
              { children: <input />, label: 'Name', name: 'name' },
            ]}
          />
        )}
      />,
    );
    expect(screen.getByText('Free')).toBeTruthy();
    const free = screen.getByDisplayValue('free') as HTMLInputElement;
    fireEvent.change(free, { target: { value: 'next' } });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(form.getValues()).toEqual({ email: '', name: 'Ada' });
  });

  it('sizes the control to itemMinWidth unless an item opts out with minWidth: undefined', () => {
    render(
      <Host
        render={(f) => (
          <Form
            form={f}
            itemMinWidth={300}
            itemsType="flat"
            layout="horizontal"
            items={[
              { children: <input />, label: 'Name', name: 'name' },
              { children: <input />, label: 'Email', minWidth: undefined, name: 'email' },
            ]}
          />
        )}
      />,
    );
    expect(screen.getByLabelText('Name').parentElement!.style.width).toBe('300px');
    expect(screen.getByLabelText('Email').parentElement!.style.width).toBe('');
  });

  it('links an unnamed field label to the child id', () => {
    render(
      <Host
        render={(f) => (
          <Form
            form={f}
            items={[{ children: <input id="free" />, label: 'Free' }]}
            itemsType="flat"
          />
        )}
      />,
    );
    expect(screen.getByLabelText('Free').id).toBe('free');
  });

  it('submits from a button outside the form through the native id', async () => {
    const onSubmit = vi.fn();
    render(
      <Host
        options={{ onSubmit }}
        render={(f) => (
          <>
            <Form aria-busy autoComplete="off" form={f} id="outside">
              <FormField label="Name" name="name">
                <input />
              </FormField>
            </Form>
            <button form="outside" type="submit">
              go
            </button>
          </>
        )}
      />,
    );
    const el = document.querySelector('form#outside')!;
    expect(el.getAttribute('autocomplete')).toBe('off');
    expect(el.getAttribute('aria-busy')).toBe('true');
    fireEvent.click(screen.getByText('go'));
    await act(() => wait());
    expect(onSubmit).toHaveBeenCalledWith({ email: '', name: 'Ada' });
  });

  it('renders flat items, skips hidden ones, then children after items', () => {
    render(
      <Host
        render={(f) => (
          <Form
            form={f}
            itemsType="flat"
            items={[
              { children: <input />, label: 'Name', name: 'name' },
              { children: <input />, hidden: true, label: 'Email', name: 'email' },
            ]}
          >
            <div data-testid="tail">tail</div>
          </Form>
        )}
      />,
    );
    expect(screen.queryByLabelText('Email')).toBeNull();
    const name = screen.getByLabelText('Name');
    const tail = screen.getByTestId('tail');
    expect(name.compareDocumentPosition(tail) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('submits valid values to onSubmit', async () => {
    const onSubmit = vi.fn();
    render(
      <Host
        options={{ onSubmit }}
        render={(f) => (
          <Form form={f}>
            <FormField label="Name" name="name">
              <input />
            </FormField>
            <button type="submit">go</button>
          </Form>
        )}
      />,
    );
    fireEvent.click(screen.getByText('go'));
    await act(() => wait());
    expect(onSubmit).toHaveBeenCalledWith({ email: '', name: 'Ada' });
  });

  it('blocks an invalid submit and focuses the first invalid field', async () => {
    const onSubmit = vi.fn();
    const schema = z.object({ email: z.string().email('bad email'), name: z.string() });
    render(
      <Host
        options={{ onSubmit, schema }}
        render={(f) => (
          <Form form={f}>
            <FormField label="Name" name="name">
              <input />
            </FormField>
            <FormField label="Email" name="email">
              <input />
            </FormField>
            <button type="submit">go</button>
          </Form>
        )}
      />,
    );
    fireEvent.click(screen.getByText('go'));
    await act(() => wait(10));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText('bad email')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByLabelText('Email'));
  });

  it('form.submit() also calls onSubmit', async () => {
    const onSubmit = vi.fn();
    render(<Host options={{ onSubmit }} render={(f) => <Form form={f} />} />);
    await act(async () => {
      await form.submit();
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('useFormInstance returns the form inside <Form>', () => {
    let seen: unknown;
    const Probe = () => {
      seen = useFormInstance();
      return null;
    };
    render(
      <Host
        render={(f) => (
          <Form form={f}>
            <Probe />
          </Form>
        )}
      />,
    );
    expect(seen).toBe(form);
  });
});

describe('<Form.SubmitFooter>', () => {
  it('shows unsaved state only when dirty and resets on Reset', async () => {
    render(
      <MotionProvider motion={motion}>
        <Host
          render={(f) => (
            <Form form={f}>
              <FormField label="Name" name="name">
                <input />
              </FormField>
              <SubmitFooter />
            </Form>
          )}
        />
      </MotionProvider>,
    );
    expect(screen.queryByText('Unsaved changes')).toBeNull();
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Grace' } });
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
    fireEvent.click(screen.getByText('Reset'));
    await act(() => wait());
    expect((screen.getByLabelText('Name') as HTMLInputElement).value).toBe('Ada');
    expect(screen.queryByText('Unsaved changes')).toBeNull();
  });
});

import { act, fireEvent, render, screen } from '@testing-library/react';
import { motion } from 'motion/react';
import { Profiler } from 'react';

import { MotionProvider } from '@/MotionProvider';

import FormField from './Field';
import Form from './Form';
import FormList from './List';
import SubmitFooter from './SubmitFooter';
import { stubMatchMedia } from './test-utils';
import type { FormInstance } from './type';
import { useForm } from './useForm';
import { useWatch } from './useWatch';

stubMatchMedia();

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const FIELDS = Array.from({ length: 20 }, (_, i) => `f${i}`);
const counts: Record<string, number> = {};

const Probe = ({
  ref,
  ...props
}: { 'data-name': string } & Record<string, any> & {
    ref?: React.RefObject<HTMLInputElement | null>;
  }) => {
  counts[props['data-name']] = (counts[props['data-name']] ?? 0) + 1;
  return <input ref={ref} {...props} />;
};
Probe.displayName = 'Probe';

let form!: FormInstance<Record<string, any>>;
let hostRenders = 0;
let watcherRenders = 0;
let footerCommits = 0;

const Watcher = () => {
  watcherRenders += 1;
  useWatch(form, 'f7');
  return null;
};

const Host = () => {
  hostRenders += 1;
  form = useForm<Record<string, any>>({
    initialValues: { ...Object.fromEntries(FIELDS.map((name) => [name, 'v'])), list: ['a', 'b'] },
  });
  return (
    <MotionProvider motion={motion}>
      <Form form={form}>
        {FIELDS.map((name) => (
          <FormField key={name} label={name} name={name} required={name === 'f3'}>
            <Probe data-name={name} />
          </FormField>
        ))}
        <Watcher />
        <FormList name="list">
          {({ fields, add }) => (
            <>
              {fields.map((field) => (
                <FormField bare key={field.key} name={field.name}>
                  <Probe aria-label={field.name} data-name={field.name} />
                </FormField>
              ))}
              <button type="button" onClick={() => add('c')}>
                add
              </button>
            </>
          )}
        </FormList>
        <Profiler id="footer" onRender={() => (footerCommits += 1)}>
          <SubmitFooter />
        </Profiler>
      </Form>
    </MotionProvider>
  );
};

const snapshot = () => ({ ...counts });
const changedSince = (before: Record<string, number>) =>
  Object.keys(counts)
    .filter((name) => counts[name] !== before[name])
    .sort();

beforeEach(() => {
  for (const key of Object.keys(counts)) delete counts[key];
  hostRenders = 0;
  watcherRenders = 0;
  footerCommits = 0;
  render(<Host />);
});

describe('render granularity', () => {
  it('typing in one field re-renders only that field and its watchers', () => {
    const before = snapshot();
    const host = hostRenders;
    const watcher = watcherRenders;
    fireEvent.change(screen.getByLabelText('f7'), { target: { value: 'typed' } });
    expect(changedSince(before)).toEqual(['f7']);
    expect(hostRenders).toBe(host);
    expect(watcherRenders).toBe(watcher + 1);
  });

  it('a value change elsewhere does not re-render a watcher of another path', () => {
    const watcher = watcherRenders;
    fireEvent.change(screen.getByLabelText('f2'), { target: { value: 'typed' } });
    expect(watcherRenders).toBe(watcher);
  });

  it('a validation result re-renders only the validated field', async () => {
    const before = snapshot();
    act(() => form.setValue('f3', ''));
    fireEvent.blur(screen.getByLabelText(/f3/));
    await act(() => wait());
    expect(screen.getByText('This field is required')).toBeTruthy();
    expect(changedSince(before)).toEqual(['f3']);
  });

  it('dirty state re-renders the footer, not the fields', () => {
    const before = snapshot();
    const commits = footerCommits;
    fireEvent.change(screen.getByLabelText('f0'), { target: { value: 'typed' } });
    expect(screen.getByText('Unsaved changes')).toBeTruthy();
    expect(footerCommits).toBeGreaterThan(commits);
    expect(changedSince(before)).toEqual(['f0']);
  });

  it('setValues re-renders only fields whose value actually changed', () => {
    const before = snapshot();
    act(() => form.setValues({ f0: 'next', f1: 'v' }));
    expect(changedSince(before)).toEqual(['f0']);
  });

  it('adding a list row does not re-render fields outside the list', () => {
    const before = snapshot();
    const host = hostRenders;
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByLabelText('list.2')).toBeTruthy();
    expect(changedSince(before).filter((name) => !name.startsWith('list.'))).toEqual([]);
    expect(hostRenders).toBe(host);
  });
});

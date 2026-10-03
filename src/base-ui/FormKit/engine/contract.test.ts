import { createTanstackEngine } from './tanstack';
import type { CreateEngine, FormEngine } from './types';

const engines: [string, CreateEngine][] = [['tanstack', createTanstackEngine]];

const wait = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

const required = (value: unknown) => (value ? undefined : 'required');

describe.each(engines)('FormEngine contract: %s', (_name, create) => {
  let engine: FormEngine;
  const make = (values: Record<string, unknown>) => {
    engine = create(values);
    return engine;
  };

  afterEach(() => engine?.destroy());

  describe('values', () => {
    it('reads and writes nested dot paths including array indexes', () => {
      const e = make({ agent: { model: 'a' }, items: [{ key: 'x' }] });
      e.setValue('agent.model', 'b', 'api');
      e.setValue('items.0.key', 'y', 'api');
      expect(e.getValue('agent.model')).toBe('b');
      expect(e.getValue('items.0.key')).toBe('y');
      expect(e.getValues()).toEqual({ agent: { model: 'b' }, items: [{ key: 'y' }] });
    });

    it('marks touched and dirty only for user changes', () => {
      const e = make({ a: '', b: '' });
      e.registerField('a', {});
      e.registerField('b', {});
      e.setValue('a', 'from code', 'api');
      expect(e.isTouched('a')).toBe(false);
      expect(e.getStatus().dirty).toBe(false);
      e.setValue('b', 'typed', 'user');
      expect(e.isTouched('b')).toBe(true);
      expect(e.getStatus().dirty).toBe(true);
    });

    it('reports every change with its source', () => {
      const e = make({ a: '' });
      const changes: unknown[] = [];
      e.onValueChange((change) => changes.push(change));
      e.setValue('a', '1', 'user');
      e.setValue('a', '2', 'api');
      expect(changes).toEqual([
        { path: 'a', source: 'user' },
        { path: 'a', source: 'api' },
      ]);
    });

    it('reset restores values and clears dirty and touched', () => {
      const e = make({ a: 'init' });
      e.registerField('a', {});
      e.setValue('a', 'typed', 'user');
      e.reset();
      expect(e.getValue('a')).toBe('init');
      expect(e.getStatus().dirty).toBe(false);
      expect(e.isTouched('a')).toBe(false);
      e.reset({ a: 'next' });
      expect(e.getValue('a')).toBe('next');
      expect(e.getStatus().dirty).toBe(false);
    });
  });

  describe('subscriptions', () => {
    it('returns the same field snapshot object until that field changes', () => {
      const e = make({ a: '', b: '' });
      e.registerField('a', {});
      e.registerField('b', {});
      const before = e.getField('a');
      e.setValue('b', 'x', 'user');
      expect(e.getField('a')).toBe(before);
      e.setValue('a', 'y', 'user');
      expect(e.getField('a')).not.toBe(before);
      expect(e.getField('a').value).toBe('y');
    });

    it('notifies subscribers and stops after unsubscribe', () => {
      const e = make({ a: '' });
      const listener = vi.fn();
      const off = e.subscribe(listener);
      e.setValue('a', '1', 'user');
      const calls = listener.mock.calls.length;
      expect(calls).toBeGreaterThan(0);
      off();
      e.setValue('a', '2', 'user');
      expect(listener.mock.calls.length).toBe(calls);
    });
  });

  describe('field validation', () => {
    it('auto mode: no error while typing before the first blur, error after blur', async () => {
      const e = make({ a: 'x' });
      e.registerField('a', { validate: required });
      e.setValue('a', '', 'user');
      await wait();
      expect(e.getField('a').error).toBeUndefined();
      e.blurField('a');
      await wait();
      expect(e.getField('a').error).toBe('required');
    });

    it('auto mode: once in error, every change re-validates', async () => {
      const e = make({ a: '' });
      e.registerField('a', { validate: required });
      e.blurField('a');
      await wait();
      expect(e.getField('a').error).toBe('required');
      e.setValue('a', 'ok', 'user');
      await wait();
      expect(e.getField('a').error).toBeUndefined();
    });

    it('change mode validates on every change', async () => {
      const e = make({ a: 'x' });
      e.registerField('a', { validate: required, validateOn: 'change' });
      e.setValue('a', '', 'user');
      await wait();
      expect(e.getField('a').error).toBe('required');
    });

    it('async validation keeps only the latest result', async () => {
      const e = make({ a: '' });
      const validate = async (value: unknown) => {
        await wait(value === 'slow' ? 60 : 5);
        return value === 'slow' ? 'stale error' : undefined;
      };
      e.registerField('a', { validate, validateOn: 'change' });
      e.setValue('a', 'slow', 'user');
      e.setValue('a', 'fast', 'user');
      await wait(100);
      expect(e.getValue('a')).toBe('fast');
      expect(e.getField('a').error).toBeUndefined();
      expect(e.getField('a').validating).toBe(false);
    });

    it('debounces async validation', async () => {
      const e = make({ a: '' });
      const validate = vi.fn(async (_value: unknown) => undefined);
      e.registerField('a', { debounceMs: 30, validate, validateOn: 'change' });
      e.setValue('a', '1', 'user');
      e.setValue('a', '12', 'user');
      e.setValue('a', '123', 'user');
      await wait(80);
      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate.mock.calls[0][0]).toBe('123');
    });

    it('re-validates a touched field when one of its deps changes', async () => {
      const e = make({ confirm: 'abc', password: 'abc' });
      const match = (value: unknown, values: Record<string, unknown>) =>
        value === values.password ? undefined : 'mismatch';
      e.registerField('password', {});
      e.registerField('confirm', { deps: ['password'], validate: match });
      e.blurField('confirm');
      await wait();
      expect(e.getField('confirm').error).toBeUndefined();
      e.setValue('password', 'abcd', 'user');
      await wait();
      expect(e.getField('confirm').error).toBe('mismatch');
    });

    it('stops validating a field after it is unregistered', async () => {
      const e = make({ a: '' });
      const validate = vi.fn(required);
      const off = e.registerField('a', { validate, validateOn: 'change' });
      off();
      e.setValue('a', '', 'user');
      await e.validate();
      expect(validate).not.toHaveBeenCalled();
    });
  });

  describe('errors', () => {
    it('setErrors shows server errors that clear on the next user change', async () => {
      const e = make({ email: 'a@b.c' });
      e.registerField('email', {});
      e.setErrors({ email: 'taken' });
      expect(e.getField('email').error).toBe('taken');
      e.setValue('email', 'x@y.z', 'user');
      await wait();
      expect(e.getField('email').error).toBeUndefined();
    });

    it('form validator errors map back to fields by path', async () => {
      const e = make({ a: '', nested: { b: '' } });
      e.registerField('a', {});
      e.registerField('nested.b', {});
      e.setFormValidator((values) =>
        values.a ? undefined : { 'a': 'a needed', 'nested.b': 'b needed' },
      );
      const result = await e.validate();
      expect(result).toEqual({
        errors: { 'a': 'a needed', 'nested.b': 'b needed' },
        valid: false,
      });
      expect(e.getField('nested.b').error).toBe('b needed');
    });

    it('validate() runs every registered field validator', async () => {
      const e = make({ a: '', b: 'ok' });
      e.registerField('a', { validate: required });
      e.registerField('b', { validate: required });
      expect(await e.validate()).toEqual({ errors: { a: 'required' }, valid: false });
      expect(await e.validate(['b'])).toEqual({ errors: {}, valid: true });
    });
  });

  describe('arrays', () => {
    it('pushes, removes and moves items', () => {
      const e = make({ list: ['a', 'b'] });
      e.pushItem('list', 'c');
      expect(e.getValue('list')).toEqual(['a', 'b', 'c']);
      e.moveItem('list', 0, 2);
      expect(e.getValue('list')).toEqual(['b', 'c', 'a']);
      e.removeItem('list', 1);
      expect(e.getValue('list')).toEqual(['b', 'a']);
    });

    it('drops errors recorded under a list when its items shift', async () => {
      const e = make({ list: ['', 'x'] });
      e.registerField('list.0', { validate: required });
      e.blurField('list.0');
      await wait();
      expect(e.getField('list.0').error).toBe('required');
      e.removeItem('list', 0);
      expect(e.getField('list.0').error).toBeUndefined();
    });
  });

  describe('submit', () => {
    it.each(['form', 'field'] as const)(
      'revalidates edits made during async %s validation before submitting',
      async (validationType) => {
        const e = make({ a: 'valid' });
        const { promise, resolve } = Promise.withResolvers<void>();
        const validate = vi.fn(async (value: unknown) => {
          await promise;
          return required(value);
        });
        if (validationType === 'form') {
          e.registerField('a', {});
          e.setFormValidator(async (values) => {
            const error = await validate(values.a);
            return error ? { a: error } : undefined;
          });
        } else {
          e.registerField('a', { validate: (value) => validate(value) });
        }
        const onSubmit = vi.fn();

        const submission = e.submit(onSubmit);
        expect(validate).toHaveBeenCalledWith('valid');
        e.setValue('a', '', 'user');
        resolve();

        expect(await submission).toEqual({ errors: { a: 'required' }, valid: false });
        expect(validate).toHaveBeenLastCalledWith('');
        expect(onSubmit).not.toHaveBeenCalled();
        expect(e.getStatus()).toMatchObject({ dirty: true, submitCount: 1, submitting: false });
      },
    );

    it('submits the latest values after an edit passes revalidation', async () => {
      const e = make({ a: 'first' });
      const { promise, resolve } = Promise.withResolvers<void>();
      const validate = vi.fn(async (values: Record<string, unknown>) => {
        await promise;
        return values.a ? undefined : { a: 'required' };
      });
      e.setFormValidator(validate);
      const onSubmit = vi.fn();

      const submission = e.submit(onSubmit);
      e.setValue('a', 'latest', 'user');
      resolve();

      expect(await submission).toEqual({ errors: {}, valid: true });
      expect(validate).toHaveBeenCalledTimes(2);
      expect(validate).toHaveBeenLastCalledWith({ a: 'latest' });
      expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ a: 'latest' });
      expect(e.getStatus()).toMatchObject({ dirty: false, submitCount: 1, submitting: false });
    });

    it('does not call onSubmit when invalid and counts the attempt', async () => {
      const e = make({ a: '' });
      e.registerField('a', { validate: required });
      const onSubmit = vi.fn();
      const result = await e.submit(onSubmit);
      expect(result.valid).toBe(false);
      expect(onSubmit).not.toHaveBeenCalled();
      expect(e.getStatus().submitCount).toBe(1);
      expect(e.getField('a').error).toBe('required');
    });

    it('calls onSubmit with values, reports submitting, then clears dirty', async () => {
      const e = make({ a: '' });
      e.registerField('a', { validate: required });
      e.setValue('a', 'ok', 'user');
      let seenSubmitting = false;
      const onSubmit = vi.fn(async () => {
        seenSubmitting = e.getStatus().submitting;
        await wait(5);
      });
      const result = await e.submit(onSubmit);
      expect(result.valid).toBe(true);
      expect(onSubmit).toHaveBeenCalledWith({ a: 'ok' });
      expect(seenSubmitting).toBe(true);
      expect(e.getStatus().submitting).toBe(false);
      expect(e.getStatus().dirty).toBe(false);
    });

    it('drops server errors so the user can resubmit', async () => {
      const e = make({ a: 'x' });
      e.registerField('a', {});
      e.setErrors({ a: 'taken' });
      const onSubmit = vi.fn();
      expect((await e.submit(onSubmit)).valid).toBe(true);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it('runs onSubmit once for concurrent submits', async () => {
      const e = make({ a: 'x' });
      e.registerField('a', { validate: async () => undefined });
      const onSubmit = vi.fn(() => wait(5));
      await Promise.all([e.submit(onSubmit), e.submit(onSubmit)]);
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('lifecycle', () => {
    it('registers no global listeners, so an undestroyed engine can be collected', () => {
      const spy = vi.spyOn(window, 'addEventListener');
      create({ a: '' });
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });

  describe('touched and dirty', () => {
    it('counts a path touched when an ancestor or descendant was edited', () => {
      const e = make({ items: [{ k: 'a' }], provider: { x: 1 } });
      e.setValue('items.0.k', 'typed', 'user');
      e.setValue('provider', { x: 2 }, 'user');
      expect(e.isTouched('items')).toBe(true);
      expect(e.isTouched('provider.x')).toBe(true);
      expect(e.isTouched('item')).toBe(false);
    });

    it('is no longer dirty once the user reverts to the baseline', () => {
      const e = make({ a: 'x' });
      e.setValue('a', 'y', 'user');
      expect(e.getStatus().dirty).toBe(true);
      e.setValue('a', 'x', 'user');
      expect(e.getStatus().dirty).toBe(false);
    });

    it('code changes move the baseline that reset and resetField return to', () => {
      const e = make({});
      e.setValue('a', 'server', 'api');
      expect(e.getStatus().dirty).toBe(false);
      e.setValue('a', 'typed', 'user');
      e.resetField('a');
      expect(e.getValue('a')).toBe('server');
      e.setValue('a', 'typed', 'user');
      e.reset();
      expect(e.getValue('a')).toBe('server');
    });

    it('a successful submit becomes the baseline for reset and resetField', async () => {
      const e = make({ a: 'x', b: 'x' });
      e.setValue('a', 'saved', 'user');
      e.setValue('b', 'saved', 'user');
      await e.submit();
      e.setValue('a', 'later', 'user');
      e.setValue('b', 'later', 'user');
      e.resetField('a');
      expect(e.getValue('a')).toBe('saved');
      e.reset();
      expect(e.getValue('b')).toBe('saved');
    });

    it('resetField clears the field error, touched and dirty', async () => {
      const e = make({ a: 'x' });
      e.registerField('a', { validate: required });
      e.setValue('a', '', 'user');
      e.blurField('a');
      await wait();
      expect(e.getField('a').error).toBe('required');
      e.resetField('a');
      await wait();
      expect(e.getField('a')).toMatchObject({ error: undefined, touched: false, value: 'x' });
      expect(e.getStatus().dirty).toBe(false);
    });
  });
});

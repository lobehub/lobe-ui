import { describe, expect, it } from 'vitest';

import {
  getActiveScopeId,
  getLastFocusedItem,
  registerScope,
  setActiveScope,
  setLastFocusedItem,
} from '../store';

describe('focus scope store', () => {
  it('ignores activation of unknown scopes', () => {
    setActiveScope('nope');
    expect(getActiveScopeId()).toBeNull();
  });

  it('refcounts registrations of the same id', () => {
    const off1 = registerScope('a');
    const off2 = registerScope('a');
    setActiveScope('a');
    off1();
    expect(getActiveScopeId()).toBe('a');
    off2();
    expect(getActiveScopeId()).toBeNull();
  });

  it('clears last-focused memory when the scope unregisters', () => {
    const off = registerScope('b');
    setLastFocusedItem('b', 'row-2');
    expect(getLastFocusedItem('b')).toBe('row-2');
    off();
    expect(getLastFocusedItem('b')).toBeNull();
  });

  it('activates the scope containing a pointerdown target', () => {
    const off = registerScope('c');
    const el = document.createElement('div');
    el.dataset.focusScope = 'c';
    const inner = document.createElement('button');
    el.append(inner);
    document.body.append(el);
    inner.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(getActiveScopeId()).toBe('c');
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    expect(getActiveScopeId()).toBe('c');
    off();
    el.remove();
  });
});

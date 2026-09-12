import { useEffect } from 'react';

import { hasModifier, hasSize, isItemVisible, isTextInputTarget } from './domUtils';
import { getActiveScopeId, getLastFocusedItem, setActiveScope } from './store';
import { focusScopeItem } from './useScopeArrowNav';

export interface UseScopeSwitcherOptions {
  enabled?: boolean;
  vimKeys?: boolean;
}

const getOrderedScopes = () => {
  const seen = new Set<string>();
  const out: HTMLElement[] = [];
  for (const el of document.querySelectorAll<HTMLElement>('[data-focus-scope]')) {
    const id = el.dataset.focusScope;
    if (!id || seen.has(id) || !isItemVisible(el) || !hasSize(el)) continue;
    seen.add(id);
    out.push(el);
  }
  return out;
};

const focusInto = (scope: HTMLElement) => {
  const id = scope.dataset.focusScope!;
  setActiveScope(id);
  const lastId = getLastFocusedItem(id);
  const last =
    lastId &&
    [...scope.querySelectorAll<HTMLElement>('[data-scope-item]')].find(
      (el) => el.dataset.id === lastId && isItemVisible(el),
    );
  const target =
    last ||
    [...scope.querySelectorAll<HTMLElement>('[data-scope-item]')].find(isItemVisible) ||
    scope;
  focusScopeItem(id, target);
};

export const useScopeSwitcher = ({ enabled = true, vimKeys = false }: UseScopeSwitcherOptions = {}) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || hasModifier(event) || isTextInputTarget(event.target)) return;
      const direction =
        event.key === 'ArrowRight' || (vimKeys && event.key === 'l')
          ? 1
          : event.key === 'ArrowLeft' || (vimKeys && event.key === 'h')
            ? -1
            : 0;
      if (!direction) return;

      const scopes = getOrderedScopes();
      if (scopes.length === 0) return;
      const activeId = getActiveScopeId();
      const index = scopes.findIndex((el) => el.dataset.focusScope === activeId);
      const next = index === -1 ? (direction === 1 ? scopes[0] : scopes.at(-1)!) : scopes[index + direction];
      if (!next) return;
      event.preventDefault();
      focusInto(next);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, vimKeys]);
};

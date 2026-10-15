import { useSyncExternalStore } from 'react';

interface FocusScopeState {
  activeScopeId: string | null;
  knownScopes: Map<string, number>;
  lastFocusedItem: Map<string, string>;
}

let state: FocusScopeState = {
  activeScopeId: null,
  knownScopes: new Map(),
  lastFocusedItem: new Map(),
};

const listeners = new Set<() => void>();

const setState = (patch: Partial<FocusScopeState>) => {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getActiveScopeId = () => state.activeScopeId;

export const setActiveScope = (id: string | null) => {
  if (id !== null && !state.knownScopes.has(id)) return;
  if (state.activeScopeId === id) return;
  setState({ activeScopeId: id });
};

export const getLastFocusedItem = (scopeId: string) => state.lastFocusedItem.get(scopeId) ?? null;

export const setLastFocusedItem = (scopeId: string, itemId: string | null) => {
  if ((state.lastFocusedItem.get(scopeId) ?? null) === itemId) return;
  const next = new Map(state.lastFocusedItem);
  if (itemId === null) next.delete(scopeId);
  else next.set(scopeId, itemId);
  setState({ lastFocusedItem: next });
};

const findScopeId = (event: Event) => {
  const target = event.target instanceof Element ? event.target : null;
  return target?.closest<HTMLElement>('[data-focus-scope]')?.dataset.focusScope ?? null;
};

const onGlobalInteract = (event: Event) => {
  const id = findScopeId(event);
  if (id !== null) setActiveScope(id);
};

let listening = false;

const ensureDocumentListeners = () => {
  if (listening || typeof document === 'undefined') return;
  listening = true;
  document.addEventListener('pointerdown', onGlobalInteract, true);
  document.addEventListener('focusin', onGlobalInteract, true);
};

export const registerScope = (id: string) => {
  ensureDocumentListeners();
  const next = new Map(state.knownScopes);
  next.set(id, (next.get(id) ?? 0) + 1);
  setState({ knownScopes: next });

  return () => {
    const count = state.knownScopes.get(id) ?? 0;
    const scopes = new Map(state.knownScopes);
    if (count > 1) {
      scopes.set(id, count - 1);
      setState({ knownScopes: scopes });
      return;
    }
    scopes.delete(id);
    const lastFocused = new Map(state.lastFocusedItem);
    lastFocused.delete(id);
    setState({
      activeScopeId: state.activeScopeId === id ? null : state.activeScopeId,
      knownScopes: scopes,
      lastFocusedItem: lastFocused,
    });
  };
};

export const useActiveScopeId = () => useSyncExternalStore(subscribe, getActiveScopeId, () => null);

export const useFocusScopeActive = (id: string) =>
  useSyncExternalStore(
    subscribe,
    () => state.activeScopeId === id,
    () => false,
  );

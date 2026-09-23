'use client';

import { createContext, use } from 'react';

import type { ConsoleShellState } from './type';

export const ConsoleShellContext = createContext<ConsoleShellState | null>(null);

export function useConsoleShell(): ConsoleShellState {
  const value = use(ConsoleShellContext);
  if (!value) throw new Error('useConsoleShell must be used within ConsoleShell');
  return value;
}

export function useConsoleShellState(): ConsoleShellState | null {
  return use(ConsoleShellContext);
}

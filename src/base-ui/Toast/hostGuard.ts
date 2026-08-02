const hostOrder: string[] = [];
const listeners = new Set<() => void>();

const emit = (): void => {
  for (const listener of listeners) listener();
};

export const registerToastHost = (id: string): (() => void) => {
  hostOrder.push(id);
  emit();
  return () => {
    const index = hostOrder.indexOf(id);
    if (index !== -1) hostOrder.splice(index, 1);
    emit();
  };
};

export const isActiveToastHost = (id: string): boolean => hostOrder[0] === id;

export const subscribeToastHost = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const __resetToastHostRegistryForTests = (): void => {
  hostOrder.length = 0;
};

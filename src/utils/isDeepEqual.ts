// Structural equality for prop/config-shaped values: primitives, plain
// records, and arrays. Functions and class instances are compared by
// reference (caller is expected to memoise callbacks via useCallback).
// Lifted out of StreamdownRender so the same definition powers
// `useStableValue` at the Markdown boundary — keep them in sync if you
// extend the rules here.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isDeepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;

  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isDeepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (!isRecord(a) || !isRecord(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!isDeepEqual(a[key], b[key])) return false;
  }

  return true;
};

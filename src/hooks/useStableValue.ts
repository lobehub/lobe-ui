import { useRef } from 'react';

import { isDeepEqual } from '@/utils/isDeepEqual';

/**
 * Return the previous reference when the incoming value is structurally
 * identical to it, so callers don't have to wrap every prop-shaped object
 * in `useMemo` to keep downstream React reference checks happy.
 *
 * Motivation: when a structural prop like `componentProps={{ html: {
 * theme: 'dark' } }}` is passed inline, React's normal ref equality
 * forces every consumer downstream to re-run effects, recompute memos,
 * and — most importantly — remount any children whose deps include
 * sub-properties of that object (`components` for react-markdown is the
 * classic case). For Markdown rendering a streaming HTML preview that
 * blew the iframe up 50× per second.
 *
 * Comparison is structural for plain objects and arrays. Functions and
 * class instances are compared by reference — callers passing inline
 * callbacks still need `useCallback` to keep those stable. Don't use this
 * for state values you intend to compare with `===`.
 */
export const useStableValue = <T>(value: T): T => {
  const prevRef = useRef<T>(value);
  if (!isDeepEqual(prevRef.current, value)) {
    prevRef.current = value;
  }
  return prevRef.current;
};

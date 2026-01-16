'use client';

import type { Trigger } from '@/types';

/**
 * Parses trigger prop to determine hover and click behavior
 */
export function parseTrigger(trigger: Trigger): {
  openOnClick: boolean;
  openOnHover: boolean;
} {
  const triggers = Array.isArray(trigger) ? trigger : [trigger];
  const normalizedTriggers = new Set(
    triggers.flatMap((item) => (item === 'both' ? ['hover', 'click'] : [item])),
  );
  return {
    openOnClick: normalizedTriggers.has('click'),
    openOnHover: normalizedTriggers.has('hover'),
  };
}

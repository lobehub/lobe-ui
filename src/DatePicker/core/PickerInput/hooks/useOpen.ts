import type { OpenConfig } from '../../interface';
import useDelayState from './useDelayState';

/**
 * Control the open state.
 * Will not close if activeElement is on the popup.
 */
export default function useOpen(
  open?: boolean,
  defaultOpen?: boolean,
  disabledList: (boolean | undefined)[] = [],
  onOpenChange?: (open: boolean) => void,
): [open: boolean, setOpen: (open: boolean, config?: OpenConfig) => void] {
  const mergedOpen = disabledList.every((disabled) => disabled) ? false : open;

  // Delay for handle the open state, in case fast shift from `open` -> `close` -> `open`
  // const [rafOpen, setRafOpen] = useLockState(open, defaultOpen || false, onOpenChange);
  const [rafOpen, setRafOpen] = useDelayState(mergedOpen, defaultOpen || false, onOpenChange);

  function setOpen(next: boolean, config: OpenConfig = {}) {
    if (!config.inherit || rafOpen) {
      setRafOpen(next, config.force);
    }
  }

  return [rafOpen, setOpen];
}

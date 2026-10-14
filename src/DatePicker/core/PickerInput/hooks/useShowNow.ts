import type { InternalMode, PanelMode } from '../../interface';

export default function useShowNow(
  picker: InternalMode,
  mode: PanelMode,
  showNow?: boolean,
  showToday?: boolean,
  rangePicker?: boolean,
) {
  if (mode !== 'date' && mode !== 'time') {
    return false;
  }

  if (showNow !== undefined) {
    return showNow;
  }

  // Compatible with old version `showToday`
  if (showToday !== undefined) {
    return showToday;
  }

  return !rangePicker && (picker === 'date' || picker === 'time');
}

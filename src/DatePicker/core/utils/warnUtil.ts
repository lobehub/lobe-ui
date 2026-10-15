import type { DisabledTimes, PickerMode } from '../interface';
import { warning } from '../utils/common';

export interface WarningProps extends DisabledTimes {
  picker?: PickerMode;
}

export function legacyPropsWarning(props: WarningProps) {
  const { picker, disabledHours, disabledMinutes, disabledSeconds } = props;

  if (picker === 'time' && (disabledHours || disabledMinutes || disabledSeconds)) {
    warning(
      false,
      `'disabledHours', 'disabledMinutes', 'disabledSeconds' will be removed in the next major version, please use 'disabledTime' instead.`,
    );
  }
}

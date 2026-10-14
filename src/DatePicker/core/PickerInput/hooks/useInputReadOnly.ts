import type { FormatType } from '../../interface';

export default function useInputReadOnly<DateType = any>(
  formatList: FormatType<DateType>[],
  inputReadOnly?: boolean,
  multiple?: boolean,
) {
  if (typeof formatList[0] === 'function' || multiple) {
    return true;
  }

  return inputReadOnly;
}

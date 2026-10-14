import * as React from 'react';

import type { NullableDateType } from '../../interface';
import { fillIndex } from '../../utils/miscUtil';
import type useInvalidate from './useInvalidate';

/**
 * Used to control each fields invalidate status
 */
export default function useFieldsInvalidate<
  DateType extends object,
  ValueType extends NullableDateType<DateType>[],
>(
  calendarValue: ValueType,
  isInvalidateDate: ReturnType<typeof useInvalidate<DateType>>,
  allowEmpty: boolean[] = [],
) {
  const [fieldsInvalidates, setFieldsInvalidates] = React.useState<[boolean, boolean]>([
    false,
    false,
  ]);

  const onSelectorInvalid = (invalid: boolean, index?: number) => {
    setFieldsInvalidates((ori) => fillIndex(ori, index!, invalid));
  };

  /**
   * For the Selector Input to mark as `aria-disabled`
   */
  const submitInvalidates = React.useMemo(() => {
    return fieldsInvalidates.map((invalid, index) => {
      // If typing invalidate
      if (invalid) {
        return true;
      }

      const current = calendarValue[index];

      // Not check if all empty
      if (!current) {
        return false;
      }

      // Not allow empty
      if (!allowEmpty[index] && !current) {
        return true;
      }

      // Invalidate
      if (current && isInvalidateDate(current, { activeIndex: index })) {
        return true;
      }

      return false;
    }) as [boolean, boolean];
  }, [calendarValue, fieldsInvalidates, isInvalidateDate, allowEmpty]);

  return [submitInvalidates, onSelectorInvalid] as const;
}

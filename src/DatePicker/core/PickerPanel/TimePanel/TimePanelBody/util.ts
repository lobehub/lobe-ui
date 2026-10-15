import type { GenerateConfig } from '../../../generate';
import type { Unit } from './TimeColumn';

export function findValidateTime<DateType>(
  date: DateType,
  getHourUnits: () => Unit<number>[],
  getMinuteUnits: (hour: number) => Unit<number>[],
  getSecondUnits: (hour: number, minute: number) => Unit<number>[],
  getMillisecondUnits: (hour: number, minute: number, second: number) => Unit<number>[],
  generateConfig: GenerateConfig<DateType>,
) {
  let nextDate = date;

  function alignValidate(
    getUnitValue: 'getHour' | 'getMinute' | 'getSecond' | 'getMillisecond',
    setUnitValue: 'setHour' | 'setMinute' | 'setSecond' | 'setMillisecond',
    units: Unit<number>[],
  ) {
    let nextValue = generateConfig[getUnitValue](nextDate);
    const nextUnit = units.find((unit) => unit.value === nextValue);

    if (!nextUnit || nextUnit.disabled) {
      // Find most closest unit
      const validateUnits = units.filter((unit) => !unit.disabled);
      const reverseEnabledUnits = [...validateUnits].reverse();
      const validateUnit =
        reverseEnabledUnits.find((unit) => unit.value <= nextValue) || validateUnits[0];

      if (validateUnit) {
        nextValue = validateUnit.value;
        nextDate = generateConfig[setUnitValue](nextDate, nextValue);
      }
    }

    return nextValue;
  }

  // Find validate hour
  const nextHour = alignValidate('getHour', 'setHour', getHourUnits());

  // Find validate minute
  const nextMinute = alignValidate('getMinute', 'setMinute', getMinuteUnits(nextHour));

  // Find validate second
  const nextSecond = alignValidate('getSecond', 'setSecond', getSecondUnits(nextHour, nextMinute));

  // Find validate millisecond
  alignValidate(
    'getMillisecond',
    'setMillisecond',
    getMillisecondUnits(nextHour, nextMinute, nextSecond),
  );

  return nextDate;
}

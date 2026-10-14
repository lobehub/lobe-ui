import type { Dayjs } from 'dayjs';

import dayjsGenerateConfig from './core/generate/dayjs';

/**
 * The dayjs adapter rc-picker reads and writes values through — the same one antd uses.
 * Importing it extends dayjs with customParseFormat / advancedFormat / weekday /
 * localeData / weekOfYear / weekYear.
 */
const generateConfig = dayjsGenerateConfig;

export type { Dayjs };

export default generateConfig;

import dayjsGenerateConfig from '@rc-component/picker/generate/dayjs';
import type { Dayjs } from 'dayjs';

/**
 * The dayjs adapter rc-picker reads and writes values through — the same one antd uses.
 * Importing it extends dayjs with customParseFormat / advancedFormat / weekday /
 * localeData / weekOfYear / weekYear.
 */
const generateConfig = dayjsGenerateConfig;

export type { Dayjs };

export default generateConfig;

import * as React from 'react';

import type { GenerateConfig } from '../generate';
import type { FilledClassNames, FilledStyles } from '../hooks/useSemantic';
import type { Components, Locale } from '../interface';

export interface PickerContextProps<DateType = any> {
  /** Customize button component */
  button?: Components['button'];
  classNames: FilledClassNames;
  generateConfig: GenerateConfig<DateType>;
  input?: Components['input'];
  locale: Locale;
  prefixCls: string;
  styles: FilledStyles;
}

const PickerContext = React.createContext<PickerContextProps>(null!);

export default PickerContext;

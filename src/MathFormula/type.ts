import type { CSSProperties, HTMLAttributes, Ref } from 'react';

export type MathFormulaVariant = 'default' | 'a2ui';

export interface MathFormulaProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** A centred formula on its own line (KaTeX display mode) instead of inline text. @default false */
  block?: boolean;
  ref?: Ref<HTMLElement>;
  style?: CSSProperties;
  /** TeX source, e.g. `\\frac{1}{n} \\sum_{i=1}^{n} x_i`. */
  value: string;
  /**
   * `default`: lobe-ui Markdown math (body size, a block scrolls sideways when too wide).
   * `a2ui`: the CopilotKit Gen UI standard `Math` (16px base, KaTeX's own display spacing).
   * @default 'default'
   */
  variant?: MathFormulaVariant;
}

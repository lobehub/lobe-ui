import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

/** One cell: `true` draws a check, `false` a dash cross, `null` / `''` a muted dash; anything else is shown as is (numbers formatted). */
export type ComparisonTableValue = boolean | number | string | ReactNode | null | undefined;

export type ComparisonTableVariant = 'default' | 'a2ui';

export interface ComparisonTableRow {
  /** Row label, in the first column. */
  feature: ReactNode;
  /** One value per option, in `options` order. */
  values: ComparisonTableValue[];
}

export interface ComparisonTableClassNames {
  header?: string;
  root?: string;
  table?: string;
  title?: string;
}

export interface ComparisonTableStyles {
  header?: CSSProperties;
  root?: CSSProperties;
  table?: CSSProperties;
  title?: CSSProperties;
}

export interface ComparisonTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Class names of the parts. */
  classNames?: ComparisonTableClassNames;
  /** Header of the feature column; defaults to the `comparisonTable.feature` text ("Feature"). */
  featureLabel?: ReactNode;
  /** Index of the recommended option: its column is tinted, ruled on top and badged. */
  highlight?: number;
  /** Option names, one column each. */
  options: ReactNode[];
  /** Badge above the highlighted option; defaults to the `comparisonTable.recommended` text ("Recommended"). */
  recommendedLabel?: ReactNode;
  ref?: Ref<HTMLDivElement>;
  /** Feature rows. */
  rows: ComparisonTableRow[];
  /** Inline styles of the parts. */
  styles?: ComparisonTableStyles;
  /** Card title, above the table. */
  title?: ReactNode;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, filled `Tag` badge).
   * `a2ui`: the A2UI playground comparison table (14px card, compact type, pill badge, check chips).
   * @default 'default'
   */
  variant?: ComparisonTableVariant;
}

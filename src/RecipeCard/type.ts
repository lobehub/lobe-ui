import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';

export interface RecipeCardClassNames {
  cover?: string;
  header?: string;
  ingredients?: string;
  root?: string;
  steps?: string;
}

export interface RecipeCardStyles {
  cover?: CSSProperties;
  header?: CSSProperties;
  ingredients?: CSSProperties;
  root?: CSSProperties;
  steps?: CSSProperties;
}

export interface RecipeCardTexts {
  ingredients?: string;
  /** Servings chip; `{count}` is replaced. @default '{count} servings' */
  servings?: string;
  steps?: string;
}

export type RecipeCardVariant = 'default' | 'a2ui';

export interface RecipeCardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'defaultChecked'
> {
  /** Indexes of the ticked ingredients (controlled). */
  checked?: number[];
  classNames?: RecipeCardClassNames;
  /** Indexes ticked at first (uncontrolled). */
  defaultChecked?: number[];
  /** e.g. "Easy". */
  difficulty?: string;
  /** Cover image URL; the title sits on its faded lower edge. */
  image?: string;
  /** The checklist: each line can be ticked off. */
  ingredients: string[];
  /** Fires with the ticked indexes, in ascending order. */
  onCheckedChange?: (checked: number[]) => void;
  ref?: Ref<HTMLDivElement>;
  servings?: number;
  /** Numbered method steps. */
  steps: string[];
  styles?: RecipeCardStyles;
  /** Tinted chips after the time, servings and difficulty, e.g. "Vegetarian". */
  tags?: string[];
  /** Overrides the built-in `recipeCard.*` texts. */
  texts?: RecipeCardTexts;
  /** e.g. "25 min". */
  time?: string;
  title: ReactNode;
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, `Tag` chips, `Checkbox`).
   * `a2ui`: the A2UI playground recipe card (14px card, faded cover, hairline chips, tinted steps).
   * @default 'default'
   */
  variant?: RecipeCardVariant;
}

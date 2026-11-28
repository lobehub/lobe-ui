import type { ComponentProps, CSSProperties, Key, MouseEvent, ReactNode, Ref } from 'react';

import type { IconProps } from '@/Icon';

export interface ListClickInfo {
  domEvent: MouseEvent<HTMLElement>;
  item: ListItemType;
  key: Key;
}

export interface ListItemType {
  actions?: ReactNode;
  avatar?: ReactNode;
  /** Extra content under the label and description, such as a badge or a link. */
  children?: ReactNode;
  className?: string;
  danger?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  href?: string;
  icon?: IconProps['icon'];
  key: Key;
  label: ReactNode;
  /**
   * `variant="a2ui"`: text shown as this row's marker (for example a step number), replacing
   * the list's bullet or number.
   */
  marker?: ReactNode;
  /** `variant="a2ui"`: width of this row's marker column in pixels. */
  markerSize?: number;
  onClick?: (info: ListClickInfo) => void;
  showAction?: boolean;
  style?: CSSProperties;
  type?: undefined;
  /**
   * A fact shown on the right of the label, for a key and value row (`Price` … `$1,599`). The
   * default variant shows it as `extra` when `extra` is not set. In `variant="a2ui"` a pickable
   * row (with `onClick` or `href`) does not show it.
   */
  value?: ReactNode;
}

export interface ListDividerType {
  key?: Key;
  type: 'divider';
}

export type ListItem = ListItemType | ListDividerType;

/** `row` is the outer li (excluding dividers); `item` is its button or link. */
export type ListSemanticName =
  'actions' | 'description' | 'extra' | 'item' | 'label' | 'marker' | 'row' | 'value';

/** `variant="a2ui"` list marker. */
export type ListMarker = 'bullet' | 'number' | 'rich' | 'none';

export interface ListProps extends Omit<ComponentProps<'ul'>, 'onClick'> {
  activeKey?: Key | null;
  classNames?: Partial<Record<ListSemanticName, string>>;
  compact?: boolean;
  /**
   * `variant="a2ui"`: `solid` draws a line down the left of the rows, for steps or a history.
   * @default 'none'
   */
  connector?: 'none' | 'solid';
  defaultActiveKey?: Key;
  /**
   * `variant="a2ui"`: `horizontal` lays the rows out in a row that scrolls sideways.
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Share one hover layer across the rows, so the highlight glides from row to row
   * instead of switching on and off on each one.
   * @default false
   */
  glide?: boolean;
  /** Rows. A string is a row with only a label (its index is the key). */
  items: (ListItem | string)[];
  /**
   * `variant="a2ui"`: `bullet` and `number` draw native list markers, `rich` and `none` draw
   * none (rows show their own `icon` or `marker`).
   * @default 'bullet'
   */
  marker?: ListMarker;
  /** `variant="a2ui"`: width of the marker column in pixels, for icons and `marker` texts. */
  maxMarkerSize?: number;
  onActiveChange?: (key: Key) => void;
  /** Called when a row is clicked. In `variant="a2ui"` it makes the rows pickable buttons. */
  onClick?: (info: ListClickInfo) => void;
  ref?: Ref<HTMLUListElement>;
  selectable?: boolean;
  /** `variant="a2ui"` with `marker="number"`: the first number. @default 1 */
  start?: number;
  styles?: Partial<Record<ListSemanticName, CSSProperties>>;
  /**
   * `borderless`, `filled` and `outlined` are the menu-like rows. `a2ui` is the A2UI playground
   * (CopilotKit standard) list: bullet, numbered or plain rows with an icon or marker, a label, a
   * value on the right, a description and children, optionally joined by a connector line.
   * @default 'borderless'
   */
  variant?: 'borderless' | 'filled' | 'outlined' | 'a2ui';
}

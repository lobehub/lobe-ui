import { type Switch } from '@base-ui/react/switch';
import { type HTMLMotionProps, type TargetAndTransition, type Transition } from 'motion/react';
import {
  type ComponentProps,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';

export type SwitchSize = 'default' | 'small';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
) => void;

export type SwitchClickEventHandler = SwitchChangeEventHandler;

export interface SwitchClassNames {
  content?: string;
  root?: string;
  thumb?: string;
}

export interface SwitchStyles {
  content?: CSSProperties;
  root?: CSSProperties;
  thumb?: CSSProperties;
}

export interface SwitchContextType {
  isChecked: boolean;
  isPressed: boolean;
  setIsChecked: (checked: boolean) => void;
  setIsPressed: (pressed: boolean) => void;
}

export type SwitchRootProps = Omit<ComponentProps<typeof Switch.Root>, 'render'> &
  HTMLMotionProps<'button'> & {
    size?: SwitchSize;
  };

export type SwitchThumbProps = Omit<ComponentProps<typeof Switch.Thumb>, 'render'> &
  HTMLMotionProps<'span'> & {
    pressedAnimation?: TargetAndTransition | boolean;
    size?: SwitchSize;
    transition?: Transition;
  };

export type SwitchIconPosition = 'left' | 'right' | 'thumb';

export type SwitchIconProps = HTMLMotionProps<'span'> & {
  position: SwitchIconPosition;
  transition?: Transition;
};

export interface SwitchProps {
  /**
   * Whether to set focus automatically when mounted
   */
  autoFocus?: boolean;
  /**
   * Whether the switch is checked
   */
  checked?: boolean;
  /**
   * Icon to show when checked (left position)
   */
  checkedChildren?: ReactNode;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom class names for each part
   */
  classNames?: SwitchClassNames;
  /**
   * Initial checked state (uncontrolled)
   */
  defaultChecked?: boolean;
  /**
   * Alias for `defaultChecked`
   */
  defaultValue?: boolean;
  /**
   * Whether the switch is disabled
   */
  disabled?: boolean;
  /**
   * Element id
   */
  id?: string;
  /**
   * Show loading indicator
   */
  loading?: boolean;
  /**
   * Name attribute for form submission
   */
  name?: string;
  /**
   * Callback when the switch state changes
   */
  onChange?: SwitchChangeEventHandler;
  /**
   * Callback when clicking the switch
   */
  onClick?: SwitchClickEventHandler;
  /**
   * Reference to the root element
   */
  ref?: Ref<HTMLButtonElement>;
  /**
   * Additional class name for root element
   */
  rootClassName?: string;
  /**
   * Size of the switch
   * @default 'default'
   */
  size?: SwitchSize;
  /**
   * Custom inline style
   */
  style?: CSSProperties;
  /**
   * Custom styles for each part
   */
  styles?: SwitchStyles;
  /**
   * Tab index for keyboard navigation
   */
  tabIndex?: number;
  /**
   * Native title attribute
   */
  title?: string;
  /**
   * Icon to show when unchecked (right position)
   */
  unCheckedChildren?: ReactNode;
  /**
   * Alias for `checked`
   */
  value?: boolean;
}

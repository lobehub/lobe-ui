import type { Switch } from '@base-ui/react/switch';
import type { HTMLMotionProps, TargetAndTransition, Transition } from 'motion/react';
import type {
  CSSProperties,
  ComponentProps,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  Ref,
} from 'react';

export type LobeSwitchSize = 'default' | 'small';

export type LobeSwitchChangeEventHandler = (
  checked: boolean,
  event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>,
) => void;

export type LobeSwitchClickEventHandler = LobeSwitchChangeEventHandler;

export interface LobeSwitchClassNames {
  content?: string;
  root?: string;
  thumb?: string;
}

export interface LobeSwitchStyles {
  content?: CSSProperties;
  root?: CSSProperties;
  thumb?: CSSProperties;
}

export interface LobeSwitchContextType {
  isChecked: boolean;
  isPressed: boolean;
  setIsChecked: (checked: boolean) => void;
  setIsPressed: (pressed: boolean) => void;
}

export type LobeSwitchRootProps = Omit<ComponentProps<typeof Switch.Root>, 'render'> &
  HTMLMotionProps<'button'> & {
    size?: LobeSwitchSize;
  };

export type LobeSwitchThumbProps = Omit<ComponentProps<typeof Switch.Thumb>, 'render'> &
  HTMLMotionProps<'span'> & {
    pressedAnimation?: TargetAndTransition | boolean;
    size?: LobeSwitchSize;
    transition?: Transition;
  };

export type LobeSwitchIconPosition = 'left' | 'right' | 'thumb';

export type LobeSwitchIconProps = HTMLMotionProps<'span'> & {
  position: LobeSwitchIconPosition;
  transition?: Transition;
};

export interface LobeSwitchProps {
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
  classNames?: LobeSwitchClassNames;
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
  onChange?: LobeSwitchChangeEventHandler;
  /**
   * Callback when clicking the switch
   */
  onClick?: LobeSwitchClickEventHandler;
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
  size?: LobeSwitchSize;
  /**
   * Custom inline style
   */
  style?: CSSProperties;
  /**
   * Custom styles for each part
   */
  styles?: LobeSwitchStyles;
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

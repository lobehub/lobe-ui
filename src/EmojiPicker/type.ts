import type { CSSProperties, ReactNode } from 'react';

import type { AvatarProps } from '@/Avatar';
import type { FlexboxProps } from '@/Flex/type';
import type { PopoverProps } from '@/Popover';

export interface AvatarUploaderProps {
  compressSize?: number;
  onChange: (avatar: string) => void;
  onUpload?: (file: File) => void;
  shape?: 'circle' | 'square';
  texts?: {
    draggerDesc?: string;
    fileTypeError?: string;
    uploadBtn?: string;
  };
}

export interface EmojiPickerCustomEmoji {
  emojis: [
    {
      id: string;
      keywords?: string[];
      name: string;
      skins: {
        src: string;
      }[];
    },
  ];
  id: string;
  name: string;
}

/** Sets the avatar and closes the picker, unless `keepOpen` is set. */
export type EmojiPickerAvatarChange = (avatar: string, options?: { keepOpen?: boolean }) => void;

export interface EmojiPickerCustomTab {
  label: ReactNode;
  /**
   * Where the tab sits among the built-in tabs. A `start` tab comes before them and is the one
   * the picker opens on.
   * @default 'end'
   */
  placement?: 'start' | 'end';
  /** Tab content. Receives the change handler and the current avatar value. */
  render: (handleAvatarChange: EmojiPickerAvatarChange, avatar: string) => ReactNode;
  /**
   * Draw a value this tab produced in the trigger, for values that are not an emoji or image.
   * Return `undefined` for any other value. A value it recognizes also opens the picker on this
   * tab.
   */
  renderValue?: (avatar: string, size: number) => ReactNode;
  value: string;
}

export interface EmojiPickerProps extends Omit<AvatarProps, 'onChange' | 'avatar'> {
  allowDelete?: boolean;
  /**
   * Show the emoji tab. Ignored when there is no upload or custom tab to show instead. When one
   * tab is left, the tab bar is hidden.
   * @default true
   */
  allowEmoji?: boolean;
  allowModelAvatar?: boolean;
  allowUpload?:
    | boolean
    | {
        enableEmoji?: boolean;
      };
  compressSize?: number;
  contentProps?: Omit<FlexboxProps, 'className' | 'ref' | 'style'>;
  customEmojis?: EmojiPickerCustomEmoji[];
  customRender?: (avatar: string) => ReactNode;
  customTabs?: EmojiPickerCustomTab[];
  defaultAvatar?: string;
  defaultOpen?: boolean;
  loading?: boolean;
  locale?: string;
  onChange?: (emoji: string) => void;
  onDelete?: () => void;
  onOpenChange?: (open: boolean) => void;
  onUpload?: AvatarUploaderProps['onUpload'];
  open?: boolean;
  popupClassName?: string;
  popupProps?: Omit<
    PopoverProps,
    'onOpenChange' | 'defaultOpen' | 'content' | 'open' | 'trigger' | 'children'
  >;
  popupStyle?: CSSProperties;
  size?: number;
  texts?: AvatarUploaderProps['texts'] & {
    delete?: string;
    emoji?: string;
    upload?: string;
  };
  value?: string;
}

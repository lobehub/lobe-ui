import { PopoverProps } from 'antd';
import { CSSProperties, ReactNode } from 'react';

import type { AvatarProps } from '@/Avatar/type';

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

export interface EmojiPickerCustomTab {
  label: ReactNode;
  render: (handleAvatarChange: (avatar: string) => void) => ReactNode;
  value: string;
}

export interface EmojiPickerProps extends Omit<AvatarProps, 'onChange' | 'avatar'> {
  allowDelete?: boolean;
  allowUpload?: boolean;
  compressSize?: number;
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
    'onOpenChange' | 'defaultOpen' | 'content' | 'open' | 'rootClassName' | 'trigger'
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

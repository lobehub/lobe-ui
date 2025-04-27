import { CSSProperties, ReactNode } from 'react';

import type { AvatarProps } from '@/Avatar/type';
import type { AvatarUploaderProps } from '@/EmojiPicker/AvatarUploader';

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
  customTabs?: EmojiPickerCustomTab[];
  defaultAvatar?: string;
  loading?: boolean;
  locale?: string;
  onChange?: (emoji: string) => void;
  onDelete?: () => void;
  onUpload?: AvatarUploaderProps['onUpload'];
  popupClassName?: string;
  popupStyle?: CSSProperties;
  size?: number;
  texts?: AvatarUploaderProps['texts'] & {
    delete?: string;
    emoji?: string;
    upload?: string;
  };
  value?: string;
}

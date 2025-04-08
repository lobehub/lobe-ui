'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover } from 'antd';
import { SmileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { CSSProperties, ReactNode, memo, useRef, useState } from 'react';
import { Flexbox } from 'react-layout-kit';
import useSWR from 'swr';
import useMergeState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import Avatar from '@/Avatar';
import type { AvatarProps } from '@/Avatar/Avatar';
import Icon from '@/Icon';
import Tabs, { TabsProps } from '@/Tabs';
import Tooltip from '@/Tooltip';

import AvatarUploader, { type AvatarUploaderProps } from './AvatarUploader';
import { useStyles } from './style';

const DEFAULT_AVATAR = '🤖';

export interface CustomEmoji {
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

export interface CustomTab {
  label: ReactNode;
  render: (handleAvatarChange: (avatar: string) => void) => ReactNode;
  value: string;
}

export interface EmojiPickerProps extends Omit<AvatarProps, 'onChange' | 'avatar'> {
  allowDelete?: boolean;
  allowUpload?: boolean;
  compressSize?: number;
  customEmojis?: CustomEmoji[];
  customTabs?: CustomTab[];
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

const EmojiPicker = memo<EmojiPickerProps>(
  ({
    value,
    defaultAvatar = DEFAULT_AVATAR,
    onChange,
    locale = 'en-US',
    allowUpload,
    allowDelete,
    texts,
    onDelete,
    compressSize = 256,
    customEmojis,
    className,
    loading,
    onUpload,
    customTabs = [],
    popupClassName,
    popupStyle,
    ...rest
  }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [tab, setTab] = useState<'emoji' | 'upload'>('emoji');
    const [open, setOpen] = useState(false);
    const { cx, styles, theme } = useStyles();

    const { data: i18n } = useSWR(
      locale,
      async () => await import(`@emoji-mart/data/i18n/${locale.split('-')[0]}.json`),
      { revalidateOnFocus: false, revalidateOnMount: false },
    );

    const [ava, setAva] = useMergeState(defaultAvatar, {
      defaultValue: defaultAvatar,
      onChange,
      value,
    });

    const handleAvatarChange = (emoji: string) => {
      setAva(emoji);
      setOpen(false);
    };

    const items: TabsProps['items'] = [
      {
        key: 'emoji',
        label: (
          <Tooltip title={texts?.emoji || 'Emoji'}>
            <Icon icon={SmileIcon} size={{ size: 20, strokeWidth: 2.5 }} />
          </Tooltip>
        ),
      },
      allowUpload && {
        key: 'upload',
        label: (
          <Tooltip title={texts?.upload || 'Upload'}>
            <Icon icon={UploadIcon} size={{ size: 20, strokeWidth: 2.5 }} />
          </Tooltip>
        ),
      },
      ...customTabs.map((tab) => ({ key: tab.value, label: tab.label })),
    ].filter(Boolean) as TabsProps['items'];

    const showTabs = items && items.length > 1;

    const content = (
      <Flexbox
        className={cx(styles.picker, popupClassName)}
        ref={ref}
        style={{ minWidth: 310, paddingTop: showTabs ? 4 : 0, ...popupStyle }}
      >
        {showTabs && (
          <Flexbox align={'center'} horizontal justify={'space-between'} paddingInline={10}>
            <Tabs activeKey={tab} compact items={items} onChange={(key) => setTab(key as any)} />
            {allowDelete && (
              <ActionIcon
                icon={TrashIcon}
                onClick={() => {
                  handleAvatarChange(defaultAvatar);
                  onDelete?.();
                }}
                size={20}
                title={texts?.delete || 'Delete'}
              />
            )}
          </Flexbox>
        )}
        {tab === 'emoji' && (
          <Picker
            custom={customEmojis}
            data={data}
            i18n={i18n}
            icons={'outline'}
            locale={locale.split('-')[0]}
            navPosition={showTabs ? 'bottom' : 'top'}
            onEmojiSelect={(e: any) => handleAvatarChange(e.src || e.native)}
            previewPosition={'none'}
            skinTonePosition={'none'}
            theme={theme.isDarkMode ? 'dark' : 'light'}
          />
        )}
        {tab === 'upload' && (
          <AvatarUploader
            compressSize={compressSize}
            onChange={handleAvatarChange}
            onUpload={onUpload}
            texts={texts}
          />
        )}
        {customTabs.map(
          (item) =>
            tab === item.value && (
              <Flexbox key={item.value} padding={10}>
                {item.render(handleAvatarChange)}
              </Flexbox>
            ),
        )}
      </Flexbox>
    );

    return (
      <Popover
        arrow={false}
        content={content}
        destroyTooltipOnHide={true}
        onOpenChange={(v) => {
          if (loading) return;
          setOpen(v);
        }}
        open={open}
        placement={'bottomRight'}
        rootClassName={styles.popover}
        trigger={['click']}
      >
        <Avatar avatar={ava} className={cx(styles.root, className)} loading={loading} {...rest} />
      </Popover>
    );
  },
);

EmojiPicker.displayName = 'EmojiPicker';

export default EmojiPicker;

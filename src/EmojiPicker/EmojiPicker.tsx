'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { cx, useTheme } from 'antd-style';
import chroma from 'chroma-js';
import { SmileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import useMergeState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import Avatar from '@/Avatar';
import { Flexbox } from '@/Flex';
import Icon from '@/Icon';
import Popover from '@/Popover';
import Tabs, { TabsProps } from '@/Tabs';
import Tooltip from '@/Tooltip';
import emojiPickerMessages from '@/i18n/resources/en/emojiPicker';
import { useTranslation } from '@/i18n/useTranslation';

import AvatarUploader from './AvatarUploader';
import { styles } from './style';
import type { EmojiPickerProps } from './type';

const DEFAULT_AVATAR = '🤖';

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
    customRender,
    open,
    defaultOpen = false,
    onOpenChange,
    popupProps,
    shape,
    contentProps,
    ...rest
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslation(emojiPickerMessages);
    const [visible, setVisible] = useMergeState(defaultOpen, {
      defaultValue: defaultOpen,
      onChange: onOpenChange,
      value: open,
    });
    const [tab, setTab] = useState<'emoji' | 'upload'>('emoji');

    const theme = useTheme();
    const pickerCssVariables = useMemo<Record<string, string>>(
      () => ({
        '--emoji-picker-rgb-accent': chroma(theme.colorPrimary).rgb().join(', '),
        '--emoji-picker-rgb-background': chroma(theme.colorBgElevated).rgb().join(', '),
      }),
      [theme.colorPrimary, theme.colorBgElevated],
    );

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
      setVisible(false);
    };

    const emojiText = texts?.emoji ?? t('emojiPicker.emoji');
    const uploadText = texts?.upload ?? t('emojiPicker.upload');
    const deleteText = texts?.delete ?? t('emojiPicker.delete');

    const hideEmojiTab = typeof allowUpload === 'object' && allowUpload?.enableEmoji === false;

    const items: TabsProps['items'] = [
      !hideEmojiTab && {
        key: 'emoji',
        label: (
          <Tooltip title={emojiText}>
            <Icon icon={SmileIcon} size={{ size: 20, strokeWidth: 2.5 }} />
          </Tooltip>
        ),
      },
      allowUpload && {
        key: 'upload',
        label: (
          <Tooltip title={uploadText}>
            <Icon icon={UploadIcon} size={{ size: 20, strokeWidth: 2.5 }} />
          </Tooltip>
        ),
      },
      ...customTabs.map((tab) => ({ key: tab.value, label: tab.label })),
    ].filter(Boolean) as TabsProps['items'];

    const showTabs = allowDelete || (items && items.length > 1);

    const content = (
      <Flexbox
        className={cx(styles.picker, popupClassName)}
        ref={ref}
        style={{
          minWidth: 310,
          paddingTop: showTabs ? 4 : 0,
          ...pickerCssVariables,
          ...popupStyle,
        }}
        {...contentProps}
      >
        {showTabs && (
          <Flexbox
            align={'center'}
            className={styles.tabs}
            horizontal
            justify={'space-between'}
            paddingInline={10}
          >
            <Tabs
              activeKey={tab}
              compact
              items={items}
              onChange={(key) => setTab(key as any)}
              size={'small'}
            />
            {allowDelete && (
              <ActionIcon
                icon={TrashIcon}
                onClick={() => {
                  handleAvatarChange(defaultAvatar);
                  onDelete?.();
                }}
                size={{
                  blockSize: 32,
                  size: 18,
                }}
                title={deleteText}
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
            shape={shape}
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
        className={cx(styles.popover)}
        classNames={{
          content: styles.popover,
        }}
        content={content}
        defaultOpen={defaultOpen}
        onOpenChange={(v) => {
          if (loading) return;
          setVisible(v);
        }}
        open={visible}
        placement={'bottom'}
        trigger={'click'}
        {...popupProps}
      >
        {customRender ? (
          customRender(ava)
        ) : (
          <Avatar
            avatar={ava}
            className={cx(styles.root, className)}
            loading={loading}
            shape={shape}
            {...rest}
          />
        )}
      </Popover>
    );
  },
);

EmojiPicker.displayName = 'EmojiPicker';

export default EmojiPicker;

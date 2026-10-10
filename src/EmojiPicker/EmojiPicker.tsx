'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { getLobeIconCDN } from '@lobehub/icons/es/features/getLobeIconCDN';
import { toc } from '@lobehub/icons/es/toc';
import * as stylex from '@stylexjs/stylex';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { SmileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import useMergeState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import Avatar from '@/Avatar';
import { Flexbox } from '@/Flex';
import emojiPickerMessages from '@/i18n/resources/en/emojiPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import Popover from '@/Popover';
import { styleProps } from '@/styles/stylex/props';
import { useTheme } from '@/styles/theme/scope';
import Tabs, { type TabsProps } from '@/Tabs';
import Tooltip from '@/Tooltip';

import AvatarUploader from './AvatarUploader';
import { styles } from './style';
import { type EmojiPickerProps } from './type';

const DEFAULT_AVATAR = '🤖';

const EmojiPicker = memo<EmojiPickerProps>(
  ({
    value,
    defaultAvatar = DEFAULT_AVATAR,
    onChange,
    locale = 'en-US',
    allowUpload,
    allowDelete,
    allowModelAvatar,
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
      async () =>
        await import(/* @vite-ignore */ `@emoji-mart/data/i18n/${locale.split('-')[0]}.json`),
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

    // Generate model avatars from @lobehub/icons when allowModelAvatar is enabled
    const mergedCustomEmojis = useMemo(() => {
      if (!allowModelAvatar) return customEmojis;

      const modelIcons = toc.filter((item) => item.group !== 'application');

      const modelEmojisCategory = {
        id: 'models',
        name: 'Models / Providers',
        emojis: modelIcons.map((item) => ({
          id: item.id.toLowerCase(),
          name: item.title,
          keywords: [item.title, item.id, item.fullTitle],
          skins: [{ src: getLobeIconCDN(item.id, { format: 'avatar', cdn: 'aliyun' }) }],
        })),
      };

      return customEmojis ? [modelEmojisCategory, ...customEmojis] : [modelEmojisCategory];
    }, [allowModelAvatar, customEmojis]);

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
        ref={ref}
        {...styleProps(styles.picker, clsx('lobe-emoji-picker', popupClassName), {
          minWidth: 310,
          paddingTop: showTabs ? 4 : 0,
          ...pickerCssVariables,
          ...popupStyle,
        })}
        {...contentProps}
      >
        {showTabs && (
          <Flexbox
            horizontal
            align={'center'}
            {...stylex.props(styles.tabs)}
            justify={'space-between'}
            paddingInline={10}
          >
            <Tabs
              activeKey={tab}
              items={items}
              variant={'square'}
              classNames={{
                indicator: 'lobe-emoji-picker-tabs-indicator',
                list: 'lobe-emoji-picker-tabs-list',
                root: 'lobe-emoji-picker-tabs-root',
                tab: 'lobe-emoji-picker-tab',
              }}
              onChange={(key) => setTab(key as any)}
            />
            {allowDelete && (
              <ActionIcon
                icon={TrashIcon}
                title={deleteText}
                size={{
                  blockSize: 32,
                  size: 18,
                }}
                onClick={() => {
                  handleAvatarChange(defaultAvatar);
                  onDelete?.();
                }}
              />
            )}
          </Flexbox>
        )}
        {tab === 'emoji' && (
          <Picker
            custom={mergedCustomEmojis}
            data={data}
            i18n={i18n}
            icons={'outline'}
            locale={locale.split('-')[0]}
            navPosition={showTabs ? 'bottom' : 'top'}
            previewPosition={'none'}
            skinTonePosition={'none'}
            theme={theme.isDarkMode ? 'dark' : 'light'}
            onEmojiSelect={(e: any) => handleAvatarChange(e.src || e.native)}
          />
        )}
        {tab === 'upload' && (
          <AvatarUploader
            compressSize={compressSize}
            shape={shape}
            texts={texts}
            onChange={handleAvatarChange}
            onUpload={onUpload}
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
        className="lobe-emoji-picker-popover"
        content={content}
        defaultOpen={defaultOpen}
        open={visible}
        placement={'bottom'}
        trigger={'click'}
        classNames={{
          content: 'lobe-emoji-picker-popover',
          root: 'lobe-emoji-picker-positioner',
        }}
        onOpenChange={(v) => {
          if (loading) return;
          setVisible(v);
        }}
        {...popupProps}
      >
        {customRender ? (
          customRender(ava)
        ) : (
          <Avatar
            avatar={ava}
            className={clsx('lobe-emoji-picker-avatar', className)}
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

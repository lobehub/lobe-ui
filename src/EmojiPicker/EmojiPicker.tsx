'use client';

import Picker from '@emoji-mart/react';
import { getLobeIconCDN } from '@lobehub/icons/es/features/getLobeIconCDN';
import { toc } from '@lobehub/icons/es/toc';
import chroma from 'chroma-js';
import clsx from 'clsx';
import { SmileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { memo, useMemo, useRef, useState } from 'react';

import ActionIcon from '@/ActionIcon';
import Avatar from '@/Avatar';
import { Flexbox } from '@/Flex';
import { useControlledState } from '@/hooks/useControlledState';
import emojiPickerMessages from '@/i18n/resources/en/emojiPicker';
import { useTranslation } from '@/i18n/useTranslation';
import Icon from '@/Icon';
import Popover from '@/Popover';
import { styleProps } from '@/styles/stylex/props';
import { useTheme } from '@/styles/theme/scope';
import Tabs, { type TabsProps } from '@/Tabs';
import Tooltip from '@/Tooltip';

import AvatarUploader from './AvatarUploader';
import { loadEmojiData } from './loadEmojiData';
import { emojiPickerClasses } from './stable';
import { styles } from './style';
import {
  type EmojiPickerAvatarChange,
  type EmojiPickerCustomTab,
  type EmojiPickerProps,
} from './type';
import { useEmojiMartI18n } from './useEmojiMartI18n';

const DEFAULT_AVATAR = '🤖';
const AVATAR_SIZE = 40;

const EmojiPicker = memo<EmojiPickerProps>(
  ({
    value,
    defaultAvatar = DEFAULT_AVATAR,
    onChange,
    locale = 'en-US',
    allowUpload,
    allowDelete,
    allowEmoji = true,
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
    const [visible, setVisible] = useControlledState(defaultOpen, {
      defaultValue: defaultOpen,
      onChange: onOpenChange,
      value: open,
    });
    const theme = useTheme();
    const pickerCssVariables = useMemo<Record<string, string>>(
      () => ({
        '--emoji-picker-rgb-accent': chroma(theme.colorPrimary).rgb().join(', '),
        '--emoji-picker-rgb-background': chroma(theme.colorBgElevated).rgb().join(', '),
      }),
      [theme.colorPrimary, theme.colorBgElevated],
    );

    const i18n = useEmojiMartI18n(locale);

    const [ava, setAva] = useControlledState(defaultAvatar, {
      defaultValue: defaultAvatar,
      onChange,
      value,
    });

    const [tab, setTab] = useState<string>(
      () =>
        customTabs.find((item) => item.renderValue?.(ava, AVATAR_SIZE))?.value ??
        customTabs.find((item) => item.placement === 'start')?.value ??
        'emoji',
    );
    const customAvatar = customTabs
      .map((item) => item.renderValue?.(ava, rest.size ?? AVATAR_SIZE))
      .find(Boolean);

    const handleAvatarChange: EmojiPickerAvatarChange = (emoji, options) => {
      setAva(emoji);
      if (!options?.keepOpen) setVisible(false);
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

    // The emoji grid stays as a fallback when hiding it would leave the picker with nothing.
    const hasOtherTab = !!allowUpload || customTabs.length > 0;
    const hideEmojiTab =
      hasOtherTab &&
      (!allowEmoji || (typeof allowUpload === 'object' && allowUpload?.enableEmoji === false));

    const toTabItem = (item: EmojiPickerCustomTab) => ({ key: item.value, label: item.label });
    const items: TabsProps['items'] = [
      ...customTabs.filter((item) => item.placement === 'start').map(toTabItem),
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
      ...customTabs.filter((item) => item.placement !== 'start').map(toTabItem),
    ].filter(Boolean) as TabsProps['items'];

    const tabCount = items?.length ?? 0;
    const showTabList = tabCount > 1;
    const showTabs = allowDelete || showTabList;
    const activeTab = items?.some((item) => item.key === tab) ? tab : items?.[0]?.key;

    const content = (
      <Flexbox
        ref={ref}
        {...styleProps(
          [styles.picker, showTabs && styles.pickerWithTabs],
          clsx('lobe-emoji-picker', popupClassName),
          {
            ...pickerCssVariables,
            ...popupStyle,
          },
        )}
        {...contentProps}
      >
        {showTabs && (
          <Flexbox
            horizontal
            align={'center'}
            {...styleProps(styles.tabs, emojiPickerClasses('tabs'))}
            justify={showTabList ? 'space-between' : 'flex-end'}
            paddingInline={10}
          >
            {showTabList && (
              <Tabs
                activeKey={activeTab}
                items={items}
                variant={'square'}
                classNames={{
                  indicator: 'lobe-emoji-picker-tabs-indicator',
                  list: 'lobe-emoji-picker-tabs-list',
                  root: 'lobe-emoji-picker-tabs-root',
                  tab: 'lobe-emoji-picker-tab',
                }}
                onChange={(key) => setTab(key)}
              />
            )}
            {allowDelete && (
              <ActionIcon
                className={emojiPickerClasses('delete')}
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
        {activeTab === 'emoji' && (
          <Picker
            custom={mergedCustomEmojis}
            data={loadEmojiData}
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
        {activeTab === 'upload' && (
          <AvatarUploader
            compressSize={compressSize}
            shape={shape}
            texts={texts}
            onChange={(avatar) => handleAvatarChange(avatar)}
            onUpload={onUpload}
          />
        )}
        {customTabs.map(
          (item) =>
            activeTab === item.value && (
              <Flexbox className={emojiPickerClasses('custom-tab')} key={item.value} padding={10}>
                {item.render(handleAvatarChange, ava)}
              </Flexbox>
            ),
        )}
      </Flexbox>
    );

    return (
      <Popover
        className={clsx('lobe-emoji-picker-popover', emojiPickerClasses('popup'))}
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
            avatar={customAvatar ?? ava}
            background={customAvatar ? 'transparent' : undefined}
            className={clsx('lobe-emoji-picker-avatar', emojiPickerClasses('trigger'), className)}
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

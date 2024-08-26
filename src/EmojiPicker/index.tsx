'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover } from 'antd';
import { Loader2Icon, SmileIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { memo, useEffect, useRef, useState } from 'react';
import { Center, CenterProps, Flexbox } from 'react-layout-kit';
import useSWR from 'swr';
import useMergeState from 'use-merge-value';

import ActionIcon from '@/ActionIcon';
import Avatar from '@/Avatar';
import Icon from '@/Icon';
import TabsNav from '@/TabsNav';
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

export interface EmojiPickerProps extends Omit<CenterProps, 'onChange'> {
  allowDelete?: boolean;
  allowUpload?: boolean;
  backgroundColor?: string;
  compressSize?: number;
  customEmojis?: CustomEmoji[];
  defaultAvatar?: string;
  loading?: boolean;
  locale?: string;
  onChange?: (emoji: string) => void;
  onDelete?: () => void;
  onUpload?: AvatarUploaderProps['onUpload'];
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
    backgroundColor = 'rgba(0,0,0,0)',
    onChange,
    locale = 'en-US',
    allowUpload,
    allowDelete,
    texts,
    onDelete,
    compressSize = 256,
    customEmojis,
    loading,
    size = 44,
    onClick,
    onUpload,
    className,
    ...rest
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(false);
    const [tab, setTab] = useState<'emoji' | 'upload'>('emoji');
    const [open, setOpen] = useState(false);
    const { cx, styles, theme } = useStyles();

    const { data: i18n } = useSWR(
      locale,
      async () => await import(`@emoji-mart/data/i18n/${locale.split('-')[0]}.json`),
      { revalidateOnFocus: false },
    );

    const [ava, setAva] = useMergeState(defaultAvatar, {
      defaultValue: defaultAvatar,
      onChange,
      value,
    });

    const handleClickOutside = (e: any) => {
      if (!ref.current) return;
      if (open && !active && e.target !== ref.current) {
        setOpen(false);
      }
    };

    const handleAvatarChange = (emoji: string) => {
      setAva(emoji);
      setOpen(false);
    };

    useEffect(() => {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }, [active, open]);

    return (
      <Popover
        arrow={false}
        content={
          <Flexbox
            className={styles.picker}
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
            ref={ref}
            style={allowUpload ? { paddingTop: 4 } : {}}
          >
            {allowUpload && (
              <Flexbox align={'center'} horizontal justify={'space-between'} paddingInline={10}>
                <TabsNav
                  activeKey={tab}
                  items={[
                    {
                      key: 'emoji',
                      label: (
                        <Tooltip title={texts?.emoji || 'Emoji'}>
                          <Icon icon={SmileIcon} size={{ fontSize: 20, strokeWidth: 2.5 }} />
                        </Tooltip>
                      ),
                    },
                    {
                      key: 'upload',
                      label: (
                        <Tooltip title={texts?.upload || 'Upload'}>
                          <Icon icon={UploadIcon} size={{ fontSize: 20, strokeWidth: 2.5 }} />
                        </Tooltip>
                      ),
                    },
                  ]}
                  onChange={(key) => setTab(key as any)}
                  variant={'compact'}
                />
                {allowDelete && (
                  <ActionIcon
                    icon={TrashIcon}
                    onClick={() => {
                      handleAvatarChange(defaultAvatar);
                      onDelete?.();
                    }}
                    size={{ fontSize: 20, strokeWidth: 2.5 }}
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
                navPosition={allowUpload ? 'bottom' : 'top'}
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
          </Flexbox>
        }
        destroyTooltipOnHide={true}
        open={open}
        placement={'bottom'}
        rootClassName={styles.popover}
        trigger={['click']}
      >
        <Center
          className={cx(styles.avatar, className)}
          flex={'none'}
          height={size}
          onClick={(e) => {
            if (loading) return;
            setOpen(!open);
            onClick?.(e);
          }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          width={size}
          {...rest}
        >
          {loading && (
            <Center className={styles.loading} height={'100%'} width={'100%'}>
              <Icon icon={Loader2Icon} size={{ fontSize: size / 2 }} spin />
            </Center>
          )}
          <Avatar avatar={ava} background={backgroundColor} size={size} />
        </Center>
      </Popover>
    );
  },
);

export default EmojiPicker;

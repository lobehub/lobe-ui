import data from '@emoji-mart/data';
import DEFAULT_I18N from '@emoji-mart/data/i18n/en.json';
import { Avatar } from '@lobehub/ui';
import { Popover } from 'antd';
import { Suspense, lazy, memo } from 'react';
import useSWR from 'swr';
import useMergeState from 'use-merge-value';

import { useStyles } from './style';

const Picker = lazy(() => import('@emoji-mart/react'));

const DEFAULT_EMOJI = '🤖';
const DEFAULT_LOCALE = 'en-US';
const DEFAULT_BACKGROUND_COLOR = 'rgba(0,0,0,0)';

const formatLocale = (locale: string) => locale.split('-')[0];

export interface EmojiPickerProps {
  backgroundColor?: string;
  defaultAvatar?: string;
  locale?: string;
  onChange?: (emoji: string) => void;
  value?: string;
}

const EmojiPicker = memo<EmojiPickerProps>(
  ({
    value,
    defaultAvatar = DEFAULT_EMOJI,
    backgroundColor = DEFAULT_BACKGROUND_COLOR,
    onChange,
    locale = DEFAULT_LOCALE,
  }) => {
    const [emojiLocale, setEmojiLocale] = useMergeState(locale, {
      defaultValue: locale,
    });
    const [ava, setAva] = useMergeState('🤖', {
      defaultValue: defaultAvatar,
      onChange,
      value,
    });
    const { data: i18n } = useSWR(
      emojiLocale === DEFAULT_LOCALE ? null : emojiLocale,
      async () => await import(`@emoji-mart/data/i18n/${formatLocale(emojiLocale)}.json`),
      {
        onError: () => setEmojiLocale(DEFAULT_LOCALE),
        onErrorRetry: () => setEmojiLocale(DEFAULT_LOCALE),
      },
    );
    const { styles } = useStyles();

    return (
      <Popover
        content={
          <div className={styles.picker}>
            <Suspense fallback={null}>
              <Picker
                data={data}
                i18n={i18n || DEFAULT_I18N}
                locale={formatLocale(emojiLocale) || DEFAULT_LOCALE}
                onEmojiSelect={(e: any) => setAva(e.native)}
                skinTonePosition={'none'}
                theme={'auto'}
              />
            </Suspense>
          </div>
        }
        placement={'left'}
        rootClassName={styles.popover}
        trigger={'click'}
      >
        <div className={styles.avatar} style={{ width: 'fit-content' }}>
          <Avatar avatar={ava} background={backgroundColor} size={44} />
        </div>
      </Popover>
    );
  },
);

export default EmojiPicker;

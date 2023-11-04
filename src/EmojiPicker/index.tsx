import data from '@emoji-mart/data';
import defaultI18n from '@emoji-mart/data/i18n/en.json';
import Picker from '@emoji-mart/react';
import { Avatar } from '@lobehub/ui';
import { Popover } from 'antd';
import { memo, useEffect, useState } from 'react';
import useMergeState from 'use-merge-value';

import { useStyles } from './style';

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
    defaultAvatar = '🤖',
    backgroundColor = 'rgba(0,0,0,0)',
    onChange,
    locale = 'en-US',
  }) => {
    const { styles } = useStyles();
    const [i18n, setI18n] = useState(defaultI18n);

    const [ava, setAva] = useMergeState('🤖', {
      defaultValue: defaultAvatar,
      onChange,
      value,
    });

    const getI18n = async (localeName: string) => {
      const i18n = await import(`@emoji-mart/data/i18n/${localeName}.json`);
      setI18n(i18n);
    };

    useEffect(() => {
      if (locale === 'en-US') return;
      const localeName = locale.split('-')[0];
      getI18n(localeName);
    }, [locale]);

    return (
      <Popover
        content={
          <div className={styles.picker}>
            <Picker
              data={data}
              i18n={i18n}
              locale={locale.split('-')[0]}
              onEmojiSelect={(e: any) => setAva(e.native)}
              skinTonePosition={'none'}
              theme={'auto'}
            />
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

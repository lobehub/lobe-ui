'use client';

import { Select, type SelectProps } from 'antd';
import { memo, useMemo } from 'react';
import { bundledLanguagesInfo } from 'shiki';

import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';

import { useStyles } from './style';

export const LangSelect = memo<Omit<SelectProps, 'options'>>(({ ...rest }) => {
  const { styles } = useStyles();

  const options = useMemo(
    () => [
      {
        aliases: ['text', 'txt'],
        label: (
          <Flexbox align={'center'} gap={4} horizontal>
            <MaterialFileTypeIcon
              fallbackUnknownType={false}
              filename={`*.txt`}
              size={18}
              type={'file'}
              variant={'raw'}
            />
            <Text ellipsis fontSize={13}>
              Plaintext
            </Text>
          </Flexbox>
        ),
        value: 'plaintext',
      },
      ...bundledLanguagesInfo.map((item) => ({
        aliases: item.aliases,
        label: (
          <Flexbox align={'center'} gap={4} horizontal>
            <MaterialFileTypeIcon
              fallbackUnknownType={false}
              filename={`*.${item?.aliases?.[0] || item.id}`}
              size={18}
              type={'file'}
              variant={'raw'}
            />
            <Text ellipsis fontSize={13}>
              {item.name}
            </Text>
          </Flexbox>
        ),
        title: (item.aliases || [item.id])
          .filter(Boolean)
          .map((item) => `*.${item}`)
          .join(','),
        value: item.id,
      })),
    ],
    [],
  );

  return (
    <Select
      className={styles.select}
      options={options}
      showSearch
      size={'small'}
      suffixIcon={false}
      variant={'borderless'}
      {...rest}
    />
  );
});

export default LangSelect;

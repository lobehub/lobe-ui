'use client';

import { Select, type SelectProps } from 'antd';
import { memo, useEffect, useState } from 'react';

import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

export const LangSelect = memo<Omit<SelectProps, 'options'>>(({ ...rest }) => {
  const [options, setOptions] = useState<SelectProps['options']>([
    {
      label: (
        <Flexbox horizontal align={'center'} gap={4}>
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
  ]);

  useEffect(() => {
    import('shiki/langs').then(({ bundledLanguagesInfo }) => {
      setOptions([
        {
          label: (
            <Flexbox horizontal align={'center'} gap={4}>
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
          label: (
            <Flexbox horizontal align={'center'} gap={4}>
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
      ]);
    });
  }, []);

  return (
    <Select
      showSearch
      className={'languageTitle'}
      options={options}
      size={'small'}
      suffixIcon={false}
      variant={'borderless'}
      style={{
        maxWidth: 240,
        width: '100%',
      }}
      onClick={stopPropagation}
      {...rest}
    />
  );
});

export default LangSelect;

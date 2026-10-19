'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo, useMemo } from 'react';
import { bundledLanguagesInfo } from 'shiki';

import { Flexbox } from '@/Flex';
import MaterialFileTypeIcon from '@/MaterialFileTypeIcon';
import Select, { type SelectProps } from '@/Select';
import Text from '@/Text';
import { stopPropagation } from '@/utils/dom';

import { highlighterClasses } from './stable';
import { styles } from './style';

export const LangSelect = memo<Omit<SelectProps<string>, 'options'>>(({ style, ...rest }) => {
  const options = useMemo(
    () => [
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
        title: 'Plaintext,plaintext,*.text,*.txt',
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
        title: [item.name, item.id, ...(item.aliases || []).map((alias) => `*.${alias}`)].join(','),
        value: item.id,
      })),
    ],
    [],
  );

  return (
    <div {...stylex.props(styles.langSelect)} onClick={stopPropagation}>
      <Select
        showSearch
        virtual
        className={clsx('language-title', highlighterClasses('title'))}
        options={options}
        size={'small'}
        style={{ width: '100%', ...style }}
        suffixIcon={null}
        variant={'borderless'}
        {...rest}
      />
    </div>
  );
});

export default LangSelect;

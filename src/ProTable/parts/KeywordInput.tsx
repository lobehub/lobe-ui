'use client';

import Input from '@/Input/Input';

import type { ProTableOptionConfig } from '../type';

interface KeywordInputProps {
  config: NonNullable<ProTableOptionConfig['search']>;
  onSearch: (value: string | undefined) => void;
  placeholder: string;
}

const KeywordInput = ({ config, onSearch, placeholder }: KeywordInputProps) => (
  <Input
    allowClear
    placeholder={(typeof config === 'object' && config.placeholder) || placeholder}
    style={{ width: 200 }}
    onClear={() => onSearch(undefined)}
    onPressEnter={(event) => {
      const value = (event.target as HTMLInputElement).value;
      if (typeof config === 'object' && config.onSearch?.(value) === false) return;
      onSearch(value);
    }}
  />
);

export default KeywordInput;

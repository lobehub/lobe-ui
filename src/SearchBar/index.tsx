import { SearchOutlined } from '@ant-design/icons';
import { Input, InputProps } from 'antd';
import { memo } from 'react';

export type SearchBarProps = InputProps;

const SearchBar = memo(({ value, onChange, style, placeholder, ...props }: SearchBarProps) => (
  <Input
    prefix={<SearchOutlined />}
    allowClear
    value={value}
    placeholder={placeholder ?? 'Search'}
    style={{ ...style, borderColor: 'transparent' }}
    onChange={onChange}
    {...props}
  />
));

export default SearchBar;

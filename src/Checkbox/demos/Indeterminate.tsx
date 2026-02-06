import { Checkbox, CheckboxGroup } from '@lobehub/ui';
import { Divider } from 'antd';
import { useState } from 'react';

import { Center } from '@/Flex';

const plainOptions = ['Apple', 'Pear', 'Orange'];
const defaultCheckedList = ['Apple', 'Orange'];

export default () => {
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange = (checked: boolean) => {
    setCheckedList(checked ? plainOptions : []);
  };

  return (
    <Center gap={24}>
      <Checkbox checked={checkAll} indeterminate={indeterminate} onChange={onCheckAllChange}>
        Check all
      </Checkbox>
      <Divider />
      <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
    </Center>
  );
};

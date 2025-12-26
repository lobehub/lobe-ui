import { type ReactNode, RefAttributes } from 'react';

import CheckboxParent from './Checkbox';
import CheckboxGroup from './CheckboxGroup';
import { type CheckboxProps } from './type';

interface ICheckbox {
  (props: CheckboxProps & RefAttributes<HTMLDivElement>): ReactNode;
  Group: typeof CheckboxGroup;
}

const Checkbox = CheckboxParent as unknown as ICheckbox;
Checkbox.Group = CheckboxGroup;

export default Checkbox;
export { default as CheckboxGroup } from './CheckboxGroup';
export type * from './type';

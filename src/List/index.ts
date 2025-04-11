import type { ReactNode, RefAttributes } from 'react';

import ListParent from './List';
import ListItem from './ListItem';
import type { ListProps } from './type';

interface IList {
  (props: ListProps & RefAttributes<HTMLDivElement>): ReactNode;
  Item: typeof ListItem;
}

const List = ListParent as unknown as IList;

List.Item = ListItem;

export default List;
export { default as ListItem } from './ListItem';
export type * from './type';

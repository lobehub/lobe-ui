import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { type CSSProperties, type HTMLAttributes, useState } from 'react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

const columns: TableColumnsType<DataType> = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'address', title: 'Address' },
];

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

// `components.body.row` replaces every body `tr`; rc-table passes the row key as `data-row-key`.
const Row = (props: RowProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props['data-row-key'],
  });

  const style: CSSProperties = {
    ...props.style,
    cursor: 'move',
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return <tr {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const initialData: DataType[] = [
  {
    address: Array.from({ length: 32 }, () => 'Long text').join(' '),
    age: 32,
    key: '1',
    name: 'John Brown',
  },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sidney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
];

export default () => {
  const [dataSource, setDataSource] = useState(initialData);

  const sensors = useSensors(
    // A 1px threshold keeps plain clicks on the row working.
    useSensor(PointerSensor, { activationConstraint: { distance: 1 } }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setDataSource((prev) => {
      const activeIndex = prev.findIndex((item) => item.key === active.id);
      const overIndex = prev.findIndex((item) => item.key === over.id);
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} sensors={sensors} onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((item) => item.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table<DataType>
          columns={columns}
          components={{ body: { row: Row } }}
          dataSource={dataSource}
          rowKey="key"
        />
      </SortableContext>
    </DndContext>
  );
};

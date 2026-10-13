import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionIcon, Table, type TableColumnsType } from '@lobehub/ui/base-ui';
import { GripVertical } from 'lucide-react';
import {
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  use,
  useMemo,
  useState,
} from 'react';

interface DataType {
  address: string;
  age: number;
  key: string;
  name: string;
}

type SortableState = ReturnType<typeof useSortable>;

interface RowContextValue {
  listeners?: SortableState['listeners'];
  setActivatorNodeRef?: SortableState['setActivatorNodeRef'];
}

// The row owns the sortable; the handle cell reads its activator from context.
const RowContext = createContext<RowContextValue>({});

const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = use(RowContext);
  return (
    <ActionIcon
      icon={GripVertical}
      ref={setActivatorNodeRef}
      size="small"
      style={{ cursor: 'move', touchAction: 'none' }}
      title="Drag to reorder"
      {...listeners}
    />
  );
};

const columns: TableColumnsType<DataType> = [
  { align: 'center', key: 'sort', render: () => <DragHandle />, width: 80 },
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'address', title: 'Address' },
];

const initialData: DataType[] = [
  { address: 'Long text Long', age: 32, key: '1', name: 'John Brown' },
  { address: 'London No. 1 Lake Park', age: 42, key: '2', name: 'Jim Green' },
  { address: 'Sidney No. 1 Lake Park', age: 32, key: '3', name: 'Joe Black' },
];

interface RowProps extends HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}

const Row = (props: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextValue>(
    () => ({ listeners, setActivatorNodeRef }),
    [listeners, setActivatorNodeRef],
  );

  return (
    <RowContext value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext>
  );
};

export default () => {
  const [dataSource, setDataSource] = useState(initialData);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setDataSource((prev) => {
      const activeIndex = prev.findIndex((record) => record.key === active.id);
      const overIndex = prev.findIndex((record) => record.key === over.id);
      return arrayMove(prev, activeIndex, overIndex);
    });
  };

  return (
    <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((record) => record.key)}
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

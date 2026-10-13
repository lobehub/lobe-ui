import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import {
  Table,
  type TableCellAttributes,
  type TableColumnType,
  type TableHeaderCellAttributes,
} from '@lobehub/ui/base-ui';
import { cssVar } from 'antd-style';
import {
  createContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  use,
  useState,
} from 'react';

interface DataType {
  address: string;
  age: number;
  email: string;
  gender: string;
  key: string;
  name: string;
}

interface CellProps extends HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface DragIndexState {
  active: UniqueIdentifier;
  direction?: 'left' | 'right';
  over: UniqueIdentifier | undefined;
}

const DragIndexContext = createContext<DragIndexState>({ active: -1, over: -1 });

const dragActiveStyle = ({ active, over, direction }: DragIndexState, id: string) => {
  if (active === id) return { backgroundColor: cssVar.colorFillSecondary, opacity: 0.5 };
  if (over === id && active !== over) {
    const border = `1px dashed ${cssVar.colorPrimary}`;
    return direction === 'right' ? { borderInlineEnd: border } : { borderInlineStart: border };
  }
  return {};
};

const TableBodyCell = (props: CellProps) => {
  const dragState = use(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

// `components.header.cell` receives what `onHeaderCell` returns, here the sortable `id`.
const TableHeaderCell = (props: CellProps) => {
  const dragState = use(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: props.id });
  const style: CSSProperties = {
    ...props.style,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', userSelect: 'none', zIndex: 9999 } : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

const dataSource: DataType[] = [
  {
    address: 'London No. 1 Lake Park',
    age: 32,
    email: 'John Brown@example.com',
    gender: 'male',
    key: '1',
    name: 'John Brown',
  },
  {
    address: 'London No. 1 Lake Park',
    age: 42,
    email: 'jimGreen@example.com',
    gender: 'female',
    key: '2',
    name: 'Jim Green',
  },
  {
    address: 'Sidney No. 1 Lake Park',
    age: 32,
    email: 'JoeBlack@example.com',
    gender: 'female',
    key: '3',
    name: 'Joe Black',
  },
  {
    address: 'Sidney No. 1 Lake Park',
    age: 20,
    email: 'george@example.com',
    gender: 'male',
    key: '4',
    name: 'George Hcc',
  },
];

const baseColumns: TableColumnType<DataType>[] = [
  { dataIndex: 'name', title: 'Name' },
  { dataIndex: 'gender', title: 'Gender' },
  { dataIndex: 'age', title: 'Age' },
  { dataIndex: 'email', title: 'Email' },
  { dataIndex: 'address', title: 'Address' },
];

export default () => {
  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: -1, over: -1 });

  const [columns, setColumns] = useState(() =>
    baseColumns.map((column, i) => ({
      ...column,
      key: `${i}`,
      // Extra attributes reach the custom cells as props.
      onCell: () => ({ id: `${i}` }) as TableCellAttributes,
      onHeaderCell: () => ({ id: `${i}` }) as TableHeaderCellAttributes,
    })),
  );

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 1 } }));

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      setColumns((prev) => {
        const activeIndex = prev.findIndex((column) => column.key === active.id);
        const overIndex = prev.findIndex((column) => column.key === over.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = columns.findIndex((column) => column.key === active.id);
    const overIndex = columns.findIndex((column) => column.key === over?.id);
    setDragIndex({
      active: active.id,
      direction: overIndex > activeIndex ? 'right' : 'left',
      over: over?.id,
    });
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      sensors={sensors}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext
        items={columns.map((column) => column.key)}
        strategy={horizontalListSortingStrategy}
      >
        <DragIndexContext value={dragIndex}>
          <Table<DataType>
            columns={columns}
            dataSource={dataSource}
            rowKey="key"
            components={{
              body: { cell: TableBodyCell },
              header: { cell: TableHeaderCell },
            }}
          />
        </DragIndexContext>
      </SortableContext>
      <DragOverlay>
        <table>
          <thead>
            <tr>
              <th
                style={{
                  background: cssVar.colorFillSecondary,
                  borderRadius: cssVar.borderRadius,
                  padding: 16,
                }}
              >
                {columns.find((column) => column.key === dragIndex.active)?.title as ReactNode}
              </th>
            </tr>
          </thead>
        </table>
      </DragOverlay>
    </DndContext>
  );
};

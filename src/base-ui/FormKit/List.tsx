'use client';

import { memo, type ReactNode, useCallback, useRef } from 'react';

import { useFormKitContext } from './context';
import { getInternals } from './instance';
import { useStoreSelector } from './useStoreSelector';

export interface FormListField {
  index: number;
  key: string;
  name: string;
}

export interface FormListRenderProps {
  add: (item?: unknown) => void;
  fields: FormListField[];
  move: (from: number, to: number) => void;
  remove: (index: number) => void;
}

export interface FormListProps {
  children: (props: FormListRenderProps) => ReactNode;
  name: string;
}

let rowSeed = 0;
const nextRowKey = () => `row-${(rowSeed += 1)}`;

const FormList = memo<FormListProps>(({ children, name }) => {
  const { form } = useFormKitContext();
  const { engine } = getInternals(form);
  const length = useStoreSelector(engine, (e) => {
    const value = e.getValue(name);
    return Array.isArray(value) ? value.length : 0;
  });

  const keysRef = useRef<string[]>([]);
  const keys = keysRef.current;
  if (keys.length > length) keys.length = length;
  while (keys.length < length) keys.push(nextRowKey());

  const add = useCallback(
    (item?: unknown) => {
      keysRef.current.push(nextRowKey());
      engine.pushItem(name, item);
    },
    [engine, name],
  );
  const remove = useCallback(
    (index: number) => {
      keysRef.current.splice(index, 1);
      engine.removeItem(name, index);
    },
    [engine, name],
  );
  const move = useCallback(
    (from: number, to: number) => {
      const [moved] = keysRef.current.splice(from, 1);
      keysRef.current.splice(to, 0, moved);
      engine.moveItem(name, from, to);
    },
    [engine, name],
  );

  const fields = keys.map((key, index) => ({ index, key, name: `${name}.${index}` }));

  return <>{children({ add, fields, move, remove })}</>;
});

FormList.displayName = 'FormList';

export default FormList;

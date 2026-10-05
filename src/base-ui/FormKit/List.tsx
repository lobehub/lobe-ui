'use client';

import { PlusIcon, XIcon } from 'lucide-react';
import { cloneElement, memo, type ReactElement, type ReactNode, useCallback, useRef } from 'react';

import ActionIcon from '@/base-ui/ActionIcon';
import formMessages from '@/i18n/resources/en/form';
import { useTranslation } from '@/i18n/useTranslation';

import { useFormKitContext } from './context';
import FormField from './Field';
import { getInternals } from './instance';
import type { FieldValidate } from './schema';
import { listStyles } from './style';
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

export interface FormListColumn {
  children: ReactElement;
  flex?: number;
  name: string;
  required?: boolean | string;
  title?: ReactNode;
  validate?: FieldValidate;
}

export interface FormListProps {
  addText?: ReactNode;
  children?: (props: FormListRenderProps) => ReactNode;
  columns?: FormListColumn[];
  emptyText?: ReactNode;
  name: string;
  newItem?: unknown;
}

let rowSeed = 0;
const nextRowKey = () => `row-${(rowSeed += 1)}`;

const createItem = (newItem: unknown) =>
  typeof newItem === 'function'
    ? newItem()
    : newItem && typeof newItem === 'object'
      ? structuredClone(newItem)
      : (newItem ?? {});

const labelFor = (column: FormListColumn, index: number) =>
  (column.children as ReactElement<{ 'aria-label'?: string }>).props['aria-label'] ??
  (typeof column.title === 'string' ? `${column.title} ${index + 1}` : undefined);

const FormList = memo<FormListProps>(({ addText, children, columns, emptyText, name, newItem }) => {
  const { form } = useFormKitContext();
  const { engine } = getInternals(form);
  const { t } = useTranslation(formMessages);
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

  if (children || !columns) return <>{children?.({ add, fields, move, remove })}</>;

  const gridTemplateColumns = `${columns.map((c) => `minmax(0, ${c.flex ?? 1}fr)`).join(' ')} 36px`;
  const addButton = (
    <button className={listStyles.add} type="button" onClick={() => add(createItem(newItem))}>
      <PlusIcon size={14} />
      {addText ?? t('form.list.add')}
    </button>
  );

  return (
    <div className={listStyles.table}>
      <div className={listStyles.head} style={{ gridTemplateColumns }}>
        {columns.map((column) => (
          <div className={listStyles.title} key={column.name}>
            {column.title}
          </div>
        ))}
      </div>
      {fields.length === 0 ? (
        <div className={listStyles.empty}>
          <span>{emptyText ?? t('form.list.empty')}</span>
          {addButton}
        </div>
      ) : (
        <>
          {fields.map((field) => (
            <div className={listStyles.row} key={field.key} style={{ gridTemplateColumns }}>
              {columns.map((column) => (
                <div className={listStyles.cell} key={column.name}>
                  <FormField
                    bare
                    name={`${field.name}.${column.name}`}
                    required={column.required}
                    validate={column.validate}
                  >
                    {cloneElement(column.children as ReactElement<any>, {
                      'aria-label': labelFor(column, field.index),
                    })}
                  </FormField>
                </div>
              ))}
              <ActionIcon
                aria-label={t('form.list.remove')}
                icon={XIcon}
                size={'small'}
                title={t('form.list.remove')}
                onClick={() => remove(field.index)}
              />
            </div>
          ))}
          <div className={listStyles.foot}>{addButton}</div>
        </>
      )}
    </div>
  );
});

FormList.displayName = 'FormList';

export default FormList;

import type { JSXAttribute, Node, ObjectExpression, ObjectProperty } from '@babel/types';

import { namedImports, walk } from '../../ast';
import type { Rule } from '../../report';

const ANCHOR = 'table-and-protable';

const EXPANDABLE_PROPS = [
  'childrenColumnName',
  'expandIcon',
  'expandIconColumnIndex',
  'expandedRowRender',
  'indentSize',
];

const REMOVED_PROPS: Record<string, string> = {
  bordered: '`bordered` is gone; use `variant="outlined"`',
  emptyText: '`emptyText` is gone; use `locale.emptyText`',
  measureRowRender: '`measureRowRender` is gone; the table measures its columns itself',
  ...Object.fromEntries(
    EXPANDABLE_PROPS.map((name) => [name, `\`${name}\` moved to \`expandable.${name}\``]),
  ),
};

const LEGACY_SEMANTIC: Record<string, string> = {
  body: 'body.wrapper',
  cell: 'body.cell',
  header: 'header.cell',
  row: 'body.row',
  wrapper: 'section',
};

const NESTED_SEMANTIC_KEYS = new Set(['cell', 'row', 'table', 'wrapper']);

const keyName = (property: ObjectProperty) => {
  const { key } = property;
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'StringLiteral') return key.value;
};

const objectValue = (attribute: JSXAttribute): ObjectExpression | undefined => {
  const { value } = attribute;
  if (value?.type !== 'JSXExpressionContainer') return;
  return value.expression.type === 'ObjectExpression' ? value.expression : undefined;
};

const properties = (object: ObjectExpression) =>
  object.properties.filter(
    (property): property is ObjectProperty => property.type === 'ObjectProperty',
  );

const isNestedSemantic = (value: Node) =>
  value.type === 'ObjectExpression' &&
  properties(value).every((property) => NESTED_SEMANTIC_KEYS.has(keyName(property) ?? ''));

const isMedium = (attribute: JSXAttribute) =>
  attribute.value?.type === 'StringLiteral' && attribute.value.value === 'medium';

const localsOf = (ast: Parameters<Rule>[0]['ast'], source: string, name: string) =>
  new Set(
    namedImports(ast, (value) => value === source).flatMap(({ name: imported, specifier }) =>
      imported === name && specifier.type === 'ImportSpecifier' ? [specifier.local.name] : [],
    ),
  );

export const tableProps: Rule = ({ ast, report }) => {
  const tables = localsOf(ast, '@lobehub/ui', 'Table');
  const proTables = localsOf(ast, '@lobehub/ui/pro-table', 'ProTable');
  if (tables.size === 0 && proTables.size === 0) return;

  const flag = (node: Node, message: string) =>
    report(node, { anchor: ANCHOR, message: `${message}.`, rule: 'R11' });

  const checkObjectProp = (name: string, object: ObjectExpression) => {
    for (const property of properties(object)) {
      const key = keyName(property);
      if (!key) continue;
      if (name === 'classNames' || name === 'styles') {
        const legacy = LEGACY_SEMANTIC[key];
        const flat = (key === 'header' || key === 'body') && !isNestedSemantic(property.value);
        if (legacy && (flat || (key !== 'header' && key !== 'body'))) {
          flag(property, `\`${name}.${key}\` is now \`${name}.${legacy}\``);
        }
      } else if (name === 'pagination' && key === 'position') {
        flag(
          property,
          '`pagination.position` is now `pagination.placement` (`topStart` … `bottomEnd`)',
        );
      } else if (name === 'locale' && key === 'filterCheckall') {
        flag(property, '`locale.filterCheckall` is now `locale.filterCheckAll`');
      } else if (name === 'expandable' && key === 'expandedRowOffset') {
        flag(
          property,
          '`expandable.expandedRowOffset` is gone; place `Table.EXPAND_COLUMN` in `columns` and pin the columns before it with `fixed`',
        );
      } else if (
        name === 'components' &&
        key === 'body' &&
        (property.value.type === 'ArrowFunctionExpression' ||
          property.value.type === 'FunctionExpression')
      ) {
        flag(property, '`components.body` no longer takes a render function; use `virtual`');
      }
    }
  };

  walk(ast, (node) => {
    if (node.type !== 'JSXOpeningElement' || node.name.type !== 'JSXIdentifier') return;
    const isPro = proTables.has(node.name.name);
    if (!isPro && !tables.has(node.name.name)) return;
    for (const attribute of node.attributes) {
      if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') continue;
      const name = attribute.name.name;
      if (REMOVED_PROPS[name]) flag(attribute, REMOVED_PROPS[name]);
      else if (isPro && name === 'ghost')
        flag(attribute, '`ghost` is gone; ProTable has no card to clear');
      else if ((name === 'size' || (isPro && name === 'defaultSize')) && isMedium(attribute)) {
        flag(attribute, `\`${name}="medium"\` is now \`${name}="middle"\``);
      } else {
        const object = objectValue(attribute);
        if (object) checkObjectProp(name, object);
      }
    }
  });
};

import type { JSXAttribute, JSXOpeningElement } from '@babel/types';

import { namedImports, walk } from '../../ast';
import type { Rule } from '../../report';

const ANCHOR = 'datepicker';

const REMOVED_PROPS: Record<string, string> = {
  bordered: '`bordered` is gone; use `variant="borderless"` for `bordered={false}`',
  builtinPlacements:
    '`builtinPlacements` is gone; use `placement` (the popup flips vertically and shifts to stay on screen)',
  footer: '`footer` is gone; use `renderExtraFooter={() => footer}`',
  max: '`max` is gone; use `maxDate`',
  min: '`min` is gone; use `minDate`',
  onSelect: '`onSelect` is gone; use `onCalendarChange(date, dateString, info)`',
  popupAlign:
    '`popupAlign` is gone; use `placement` (the popup flips vertically and shifts to stay on screen)',
  transitionName:
    '`transitionName` is gone; the popup animates with Motion, style it through `classNames.popup.root`',
};

const literal = (attribute: JSXAttribute) =>
  attribute.value?.type === 'StringLiteral' ? attribute.value.value : undefined;

export const datePickerProps: Rule = ({ ast, report }) => {
  const locals = new Set(
    namedImports(ast, (source) => source === '@lobehub/ui').flatMap(({ name, specifier }) =>
      (name === 'DatePicker' || name === 'DateRangePicker') && specifier.type === 'ImportSpecifier'
        ? [specifier.local.name]
        : [],
    ),
  );
  if (locals.size === 0) return;

  const isPicker = ({ name }: JSXOpeningElement) =>
    name.type === 'JSXIdentifier'
      ? locals.has(name.name)
      : name.type === 'JSXMemberExpression' &&
        name.object.type === 'JSXIdentifier' &&
        locals.has(name.object.name);

  walk(ast, (node) => {
    if (node.type !== 'JSXOpeningElement' || !isPicker(node)) return;
    for (const attribute of node.attributes) {
      if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') continue;
      const name = attribute.name.name;
      const value = literal(attribute);
      if (REMOVED_PROPS[name]) {
        report(attribute, { anchor: ANCHOR, message: `${REMOVED_PROPS[name]}.`, rule: 'R12' });
      } else if (name === 'size' && value === 'middle') {
        report(attribute, {
          anchor: ANCHOR,
          message: '`size="middle"` is now `size="medium"`.',
          rule: 'R12',
        });
      } else if (name === 'mode' && (value === 'month' || value === 'year')) {
        report(attribute, {
          anchor: ANCHOR,
          level: 'info',
          message: `\`mode\` is now the controlled panel; to pick a ${value}, use \`picker="${value}"\`.`,
          rule: 'R12',
        });
      }
    }
  });
};

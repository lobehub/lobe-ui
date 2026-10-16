import { namedImports, walk } from '../../ast';
import type { Rule } from '../../report';
import changed from '../../transforms/v6/data/changed-components.json';

const names = new Set<string>(changed);

const HINTS: Record<string, string> = {
  Button:
    'Tests need MotionProvider with motion (or ConfigProvider motion={motion}); migrate type to variant and check icon props.',
  Drawer:
    'Tests need MotionProvider with motion. Move bodyStyle to styles.bodyContent and headerStyle / footerStyle to styles.header / styles.footer; onClose no longer receives an event; closed content unmounts.',
  InputNumber:
    'Use format (Intl.NumberFormatOptions) instead of formatter / parser; stringMode is unsupported; onChange receives number | null. In tests use getByRole("textbox"), not the first input (there is a hidden input).',
  InputPassword:
    'In 6.0.1 the visibility button labels are fixed English. If localized labels are required, use visibilityToggle={false} and an accessible custom suffix; check the installed version before removing a workaround.',
  Select:
    'Map options to { value, label }; labelInValue / fieldNames and dropdownRender / popupRender are unsupported; onDropdownVisibleChange becomes onOpenChange; use classNames.popup / classNames.trigger for styling.',
  Tag: 'Use variant instead of bordered. onClose + preventDefault() no longer keeps the tag; verify close behavior and use classNames.closeIcon / styles.closeIcon for overrides.',
  Segmented:
    'Semantic slots are supported: root (list alias), indicator, item, itemIcon, itemLabel. Use classNames / styles rather than .ant-segmented-* selectors.',
  DateRangePicker:
    'Semantic classNames / styles slots are supported: root, input (both inputs), prefix, suffix and popup.*; set styles.root width for a full-width range picker.',
  Switch:
    'Verify the accessible name: in 6.0.1 the convenience component does not forward aria-* attributes. Use a visible label linked by htmlFor / id and test getByRole("switch", { name }); check the installed version before removing a workaround.',
  Tooltip:
    'Use 6.0.1 or later for the React 19 element.ref warning fix. Recheck child refs before deleting a library patch or warning suppression.',
  Popover:
    'Use 6.0.1 or later for the React 19 element.ref warning fix. Recheck child refs before deleting a library patch or warning suppression.',
};

const PROPS: Record<string, Record<string, string>> = {
  Select: {
    dropdownRender:
      'No equivalent; compose the popup from Select atoms or redesign the custom popup.',
    popupRender: 'No equivalent; compose the popup from Select atoms or redesign the custom popup.',
    fieldNames: 'Map options to { value, label } before passing them.',
    labelInValue:
      'Keep primitive values and look up labels in options; adapt value and callbacks together.',
    onDropdownVisibleChange: 'Use onOpenChange(open, eventDetails).',
    dropdownMatchSelectWidth: 'Use popupMatchSelectWidth.',
    dropdownStyle: 'Use a class on classNames.popup; Select has no styles prop.',
  },
  InputNumber: {
    formatter: 'Use format: Intl.NumberFormatOptions; rewrite custom formatting manually.',
    parser: 'No parser prop; check number entry behavior and use format / locale where possible.',
    stringMode: 'Unsupported: value and onChange use number | null; check precision requirements.',
    decimalSeparator: 'Use locale / format: Intl.NumberFormatOptions.',
    bordered: 'Use variant="borderless" for false, variant="outlined" for true.',
  },
  Tag: { bordered: 'Use variant="borderless" for false, variant="outlined" for true.' },
  Drawer: {
    bodyStyle: 'Move to styles.bodyContent, preserving any existing styles object.',
    headerStyle: 'Move to styles.header, preserving any existing styles object.',
    footerStyle: 'Move to styles.footer, preserving any existing styles object.',
    maskStyle: 'Move to styles.backdrop, preserving any existing styles object.',
    contentWrapperStyle:
      'Move to styles.popup, preserving any existing styles object; verify panel sizing.',
    destroyOnClose:
      'Removed: content always unmounts on close; move state outside the drawer if it must survive.',
    destroyOnHidden:
      'Removed: content always unmounts on close; move state outside the drawer if it must survive.',
    forceRender:
      'Removed: content mounts only while open; move required effects outside the drawer.',
    getContainer:
      'Pass an HTMLElement, false or null; container callbacks are no longer supported.',
    onClose: 'The callback receives no event; move event-dependent logic to an explicit control.',
  },
};

export const changedComponents: Rule = ({ ast, options, report }) => {
  const imports = namedImports(ast, (s) => s === '@lobehub/ui');
  for (const { name, specifier } of imports) {
    if ((!names.has(name) && !HINTS[name]) || options.baseUiNames?.has(name)) continue;
    report(specifier, {
      anchor: 'components',
      level: 'info',
      message: `\`${name}\`: ${HINTS[name] ?? 'Now uses the base-ui implementation; check the component page\'s "Migrating from antd" section for changed props.'}`,
      rule: 'R5',
    });
  }

  const locals = new Map(
    imports.flatMap(({ name, specifier }) =>
      specifier.type === 'ImportSpecifier' ? [[specifier.local.name, name] as const] : [],
    ),
  );
  walk(ast, (node) => {
    if (node.type !== 'JSXOpeningElement' || node.name.type !== 'JSXIdentifier') return;
    const component = locals.get(node.name.name);
    if (!component || !PROPS[component]) return;
    for (const attribute of node.attributes) {
      if (attribute.type === 'JSXSpreadAttribute') {
        report(attribute, {
          anchor: 'components',
          level: 'info',
          message: `\`${component}\` spreads props that the codemod cannot inspect here. Check the spread source against the v6 component API.`,
          rule: 'R5',
        });
        continue;
      }
      if (attribute.name.type !== 'JSXIdentifier') continue;
      const name = attribute.name.name;
      const hint = PROPS[component][name];
      if (!hint) continue;
      if (component === 'Drawer' && (name === 'onClose' || name === 'getContainer')) {
        if (options.baseUiNames?.has(component)) continue;
        const callback =
          attribute.value?.type === 'JSXExpressionContainer'
            ? attribute.value.expression
            : undefined;
        if (
          name === 'onClose' &&
          (callback?.type === 'ArrowFunctionExpression' ||
            callback?.type === 'FunctionExpression') &&
          callback.params.length === 0
        )
          continue;
      }
      report(attribute, {
        anchor: 'components',
        level:
          component === 'Drawer' && (name === 'onClose' || name === 'getContainer')
            ? 'info'
            : 'error',
        message: `\`${component}.${name}\`: ${hint}`,
        rule: 'R5',
      });
    }
  });
};

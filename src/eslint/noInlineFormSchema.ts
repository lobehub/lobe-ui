import type { Rule } from 'eslint';

const SCHEMA_NAMESPACES = new Set(['z', 'v', 'yup']);

const rootIdentifier = (node: any): string | undefined => {
  let current = node;
  while (current) {
    if (current.type === 'Identifier') return current.name;
    if (current.type === 'CallExpression') current = current.callee;
    else if (current.type === 'MemberExpression') current = current.object;
    else return undefined;
  }
  return undefined;
};

const isInlineSchema = (node: any) =>
  node?.type === 'CallExpression' && SCHEMA_NAMESPACES.has(rootIdentifier(node) ?? '');

const MESSAGE =
  'Schemas built inline are recreated on every render. Define the schema at module scope (or in useMemo) and pass the reference.';

export const noInlineFormSchema: Rule.RuleModule = {
  create: (context) => ({
    'CallExpression[callee.name="useForm"] > ObjectExpression > Property': function (node: any) {
      if (node.key?.name === 'schema' && isInlineSchema(node.value))
        context.report({ message: MESSAGE, node: node.value });
    },
    'JSXAttribute': function(node: any) {
      if (node.name?.name !== 'validate') return;
      const expression = node.value?.expression;
      if (isInlineSchema(expression)) context.report({ message: MESSAGE, node: expression });
    },
  }),
  meta: {
    docs: { description: 'Disallow constructing form schemas inline in render' },
    schema: [],
    type: 'suggestion',
  },
};

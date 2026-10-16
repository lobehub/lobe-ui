import { walk } from '../../ast';
import type { Rule } from '../../report';

export const testMocks: Rule = ({ ast, report }) => {
  walk(ast, (node) => {
    if (node.type !== 'CallExpression' || node.callee.type !== 'MemberExpression') return;
    const { object, property } = node.callee;
    if (object.type !== 'Identifier' || !['vi', 'jest'].includes(object.name)) return;
    if (
      property.type !== 'Identifier' ||
      !['mock', 'doMock', 'unstable_mockModule'].includes(property.name)
    )
      return;
    const [source, factory] = node.arguments;
    const module = source?.type === 'ImportExpression' ? source.source : source;
    if (module?.type !== 'StringLiteral' || module.value !== '@lobehub/ui') return;

    let usesActual = false;
    if (
      factory &&
      (factory.type === 'ArrowFunctionExpression' || factory.type === 'FunctionExpression')
    ) {
      const importOriginal = factory.params[0];
      walk(factory, (child) => {
        if (child.type !== 'CallExpression') return;
        const callee = child.callee;
        if (
          callee.type === 'Identifier' &&
          importOriginal?.type === 'Identifier' &&
          callee.name === importOriginal.name
        )
          usesActual = true;
        if (
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          ['vi', 'jest'].includes(callee.object.name) &&
          callee.property.type === 'Identifier' &&
          ['importActual', 'requireActual'].includes(callee.property.name) &&
          child.arguments[0]?.type === 'StringLiteral' &&
          child.arguments[0].value === '@lobehub/ui'
        )
          usesActual = true;
      });
    }
    if (usesActual) return;
    report(node, {
      anchor: 'test-migration',
      level: 'info',
      message:
        'This @lobehub/ui mock may replace the whole package. Preserve real exports with importOriginal / vi.importActual / jest.requireActual and override only what the test needs; createStaticStyles and Text must remain available.',
      rule: 'R13',
    });
  });
};

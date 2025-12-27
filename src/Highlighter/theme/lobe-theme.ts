import { cssVar } from 'antd-style';

export default {
  displayName: 'Lobe Theme',
  name: 'lobe-theme',
  semanticHighlighting: true,
  tokenColors: [
    {
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'string',
      settings: {
        foreground: cssVar.colorSuccess,
      },
    },
    {
      scope: 'punctuation, constant.other.symbol',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'constant.character.escape, text.html constant.character.entity.named',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'constant.language.boolean',
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: 'constant.numeric',
      settings: {
        foreground: cssVar.volcano9,
      },
    },
    {
      scope:
        'variable, variable.parameter, support.variable, variable.language, support.constant, meta.definition.variable entity.name.function, meta.function-call.arguments',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'keyword.other',
      settings: {
        foreground: cssVar.volcano9,
      },
    },
    {
      scope: 'keyword, modifier, variable.language.this, support.type.object, constant.language',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'entity.name.function, support.function',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope: 'storage.type, storage.modifier, storage.control',
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: 'support.module, support.node',
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'support.type, constant.other.key',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'entity.name.type, entity.other.inherited-class, entity.other',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'comment',
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorTextQuaternary,
      },
    },
    {
      scope: 'comment punctuation.definition.comment, string.quoted.docstring',
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorTextQuaternary,
      },
    },
    {
      scope: 'punctuation',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'entity.name, entity.name.type.class, support.type, support.class, meta.use',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'variable.object.property, meta.field.declaration entity.name.function',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'meta.definition.method entity.name.function',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'meta.function entity.name.function',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope:
        'template.expression.begin, template.expression.end, punctuation.definition.template-expression.begin, punctuation.definition.template-expression.end',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'meta.embedded, source.groovy.embedded, meta.template.expression',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'entity.name.tag.yaml',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope:
        'meta.object-literal.key, meta.object-literal.key string, support.type.property-name.json',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'constant.language.json',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'entity.other.attribute-name.class',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'entity.other.attribute-name.id',
      settings: {
        foreground: cssVar.volcano9,
      },
    },
    {
      scope: 'source.css entity.name.tag',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'support.type.property-name.css',
      settings: {
        foreground: cssVar.colorTextSecondary,
      },
    },
    {
      scope: 'meta.tag, punctuation.definition.tag',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'entity.name.tag',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'entity.other.attribute-name',
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: 'punctuation.definition.entity.html',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'markup.heading',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'text.html.markdown meta.link.inline, meta.link.reference',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'text.html.markdown beginning.punctuation.definition.list',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'markup.italic',
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'markup.bold',
      settings: {
        fontStyle: 'bold',
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'markup.bold markup.italic, markup.italic markup.bold',
      settings: {
        fontStyle: 'italic bold',
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'markup.fenced_code.block.markdown punctuation.definition.markdown',
      settings: {
        foreground: cssVar.colorSuccess,
      },
    },
    {
      scope: 'markup.inline.raw.string.markdown',
      settings: {
        foreground: cssVar.colorSuccess,
      },
    },
    {
      scope: 'keyword.other.definition.ini',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'entity.name.section.group-title.ini',
      settings: {
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'source.cs meta.class.identifier storage.type',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'source.cs meta.method.identifier entity.name.function',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'source.cs meta.method-call meta.method, source.cs entity.name.function',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope: 'source.cs storage.type',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'source.cs meta.method.return-type',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'source.cs meta.preprocessor',
      settings: {
        foreground: cssVar.colorTextQuaternary,
      },
    },
    {
      scope: 'source.cs entity.name.type.namespace',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'meta.jsx.children, SXNested',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'support.class.component',
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: 'source.cpp meta.block variable.other',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'source.python meta.member.access.python',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'source.python meta.function-call.python, meta.function-call.arguments',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope: 'meta.block',
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: 'entity.name.function.call',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope: 'source.php support.other.namespace, source.php meta.use support.class',
      settings: {
        foreground: cssVar.colorText,
      },
    },
    {
      scope: 'constant.keyword',
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: 'entity.name.function',
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      settings: {
        background: '#212121',
        foreground: cssVar.colorText,
      },
    },
    {
      scope: ['constant.other.placeholder'],
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: ['markup.deleted'],
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: ['markup.inserted'],
      settings: {
        foreground: cssVar.colorSuccess,
      },
    },
    {
      scope: ['markup.underline'],
      settings: {
        fontStyle: 'underline',
      },
    },
    {
      scope: ['keyword.control'],
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: ['variable.parameter'],
      settings: {
        fontStyle: 'italic',
      },
    },
    {
      scope: ['variable.parameter.function.language.special.self.python'],
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorError,
      },
    },
    {
      scope: ['constant.character.format.placeholder.other.python'],
      settings: {
        foreground: cssVar.volcano9,
      },
    },
    {
      scope: ['markup.quote'],
      settings: {
        fontStyle: 'italic',
        foreground: cssVar.colorInfo,
      },
    },
    {
      scope: ['markup.fenced_code.block'],
      settings: {
        foreground: cssVar.colorFill,
      },
    },
    {
      scope: ['punctuation.definition.quote'],
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: ['meta.structure.dictionary.json support.type.property-name.json'],
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.colorWarning,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.volcano9,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.colorError,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.colorWarningBg,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.geekblue8,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.purple9,
      },
    },
    {
      scope: [
        'meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json',
      ],
      settings: {
        foreground: cssVar.colorSuccess,
      },
    },
  ],
  type: 'dark',
};

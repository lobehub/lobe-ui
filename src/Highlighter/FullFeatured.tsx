import { Select, type SelectProps } from 'antd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { languageMap } from '@/hooks/useHighlight';

import SyntaxHighlighter from './SyntaxHighlighter';
import { useStyles } from './style';
import { HighlighterProps } from './type';

const options: SelectProps['options'] = languageMap.map((item) => ({
  label: item,
  value: item.toLowerCase(),
}));

export const HighlighterFullFeatured = memo<HighlighterProps>(
  ({
    children,
    language,
    showLanguage,
    className,
    style,
    allowChangeLanguage = true,
    fileName,
    icon,
    bodyRender,
    actionsRender,
    copyable,
    type,
    defalutExpand = true,
    ...rest
  }) => {
    const [expand, setExpand] = useState(defalutExpand);
    const [lang, setLang] = useState(language);
    const { styles, cx } = useStyles(type);

    const size = { blockSize: 24, fontSize: 14, strokeWidth: 2 };

    const origianlActions = copyable && (
      <CopyButton content={children} placement="left" size={size} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize: size,
          content: children,
          language,
          originalNode: origianlActions,
        })
      : origianlActions;

    const originalBody = (
      <SyntaxHighlighter
        language={lang?.toLowerCase()}
        style={expand ? {} : { height: 0, overflow: 'hidden' }}
      >
        {children}
      </SyntaxHighlighter>
    );
    const body = bodyRender
      ? bodyRender({ content: children, language, originalNode: originalBody })
      : originalBody;

    return (
      <div
        className={cx(styles.container, className)}
        data-code-type="highlighter"
        style={style}
        {...rest}
      >
        <Flexbox align={'center'} className={styles.header} horizontal justify={'space-between'}>
          <ActionIcon
            icon={expand ? ChevronDown : ChevronRight}
            onClick={() => setExpand(!expand)}
            size={{ blockSize: 24, fontSize: 14, strokeWidth: 3 }}
          />
          {allowChangeLanguage && !fileName ? (
            showLanguage && (
              <Select
                className={styles.select}
                onSelect={setLang}
                options={options}
                size={'small'}
                suffixIcon={false}
                value={lang.toLowerCase()}
                variant={'borderless'}
              />
            )
          ) : (
            <Flexbox
              align={'center'}
              className={styles.select}
              gap={2}
              horizontal
              justify={'center'}
            >
              {icon}
              <span>{fileName || lang}</span>
            </Flexbox>
          )}
          <Flexbox align={'center'} flex={'none'} gap={4} horizontal>
            {actions}
          </Flexbox>
        </Flexbox>
        {body}
      </div>
    );
  },
);

export default HighlighterFullFeatured;

export { default as SyntaxHighlighter, type SyntaxHighlighterProps } from './SyntaxHighlighter';

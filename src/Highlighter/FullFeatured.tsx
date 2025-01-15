import { Select, type SelectProps } from 'antd';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ReactNode, memo, useState } from 'react';
import { Flexbox } from 'react-layout-kit';

import ActionIcon from '@/ActionIcon';
import CopyButton from '@/CopyButton';
import { languageMap } from '@/hooks/useHighlight';

import { useStyles } from './style';
import { HighlighterProps } from './type';

const options: SelectProps['options'] = languageMap.map((item) => ({
  label: item,
  value: item.toLowerCase(),
}));

interface HighlighterFullFeaturedProps extends Omit<HighlighterProps, 'children'> {
  children: ReactNode;
  content: string;
}

export const HighlighterFullFeatured = memo<HighlighterFullFeaturedProps>(
  ({
    children,
    content,
    language,
    showLanguage,
    className,
    style,
    allowChangeLanguage = false,
    fileName,
    icon,
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
      <CopyButton content={content} placement="left" size={size} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize: size,
          content,
          language,
          originalNode: origianlActions,
        })
      : origianlActions;

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
        {children}
      </div>
    );
  },
);

export default HighlighterFullFeatured;

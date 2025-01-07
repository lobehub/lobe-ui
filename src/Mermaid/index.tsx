import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import CopyButton from '@/CopyButton';
import Tag from '@/Tag';

import FullFeatured from './FullFeatured';
import { useStyles } from './style';
import { MermaidProps } from './type';
import { useMermaid } from './useMermaid';

const Mermaid = memo<MermaidProps>(
  ({
    children,
    copyButtonSize = 'site',
    fullFeatured,
    copyable = true,
    showLanguage = true,
    style,
    type = 'block',
    className,
    bodyRender,
    actionsRender,
    ...rest
  }) => {
    const { cx, styles } = useStyles(type);
    const tirmedChildren = children.trim();
    const MermaidRender = useMermaid(tirmedChildren);

    const originalActions = copyable && (
      <CopyButton content={children} placement="left" size={copyButtonSize} />
    );

    const actions = actionsRender
      ? actionsRender({
          actionIconSize: copyButtonSize,
          content: children,
          originalNode: originalActions,
        })
      : originalActions;

    const defaultBody = <MermaidRender />;

    const body = bodyRender
      ? bodyRender({ content: tirmedChildren, originalNode: defaultBody })
      : defaultBody;

    if (fullFeatured)
      return (
        <FullFeatured
          actionsRender={actionsRender}
          bodyRender={bodyRender}
          className={className}
          content={tirmedChildren}
          copyable={copyable}
          showLanguage={showLanguage}
          style={style}
          type={type}
          {...rest}
        >
          {body}
        </FullFeatured>
      );

    return (
      <div
        className={cx(styles.container, className)}
        data-code-type="mermaid"
        style={style}
        {...rest}
      >
        <Flexbox align={'center'} className={styles.button} flex={'none'} gap={4} horizontal>
          {actions}
        </Flexbox>
        {showLanguage && <Tag className={styles.lang}>mermaid</Tag>}
        <div className={styles.scroller}>{body}</div>
      </div>
    );
  },
);

export default Mermaid;

export { type MermaidProps } from './type';

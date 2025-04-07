'use client';

import { Typography } from 'antd';
import { Loader2, MessageSquare } from 'lucide-react';
import { CSSProperties, ReactNode, forwardRef } from 'react';
import { Flexbox, FlexboxProps } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';
import { getChatItemTime } from './time';

const { Title, Paragraph } = Typography;

export interface ListItemProps extends Omit<FlexboxProps, 'title'> {
  actions?: ReactNode;
  active?: boolean;
  addon?: ReactNode;
  avatar?: ReactNode;
  classNames?: {
    actions?: string;
    container?: string;
    content?: string;
    date?: string;
    desc?: string;
    pin?: string;
    title?: string;
  };
  date?: number;
  description?: ReactNode;
  key: string;
  loading?: boolean;
  onHoverChange?: (hover: boolean) => void;
  pin?: boolean;
  showAction?: boolean;
  styles?: {
    actions?: CSSProperties;
    container?: CSSProperties;
    content?: CSSProperties;
    date?: CSSProperties;
    desc?: CSSProperties;
    pin?: CSSProperties;
    title?: CSSProperties;
  };
  title: ReactNode;
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps>(
  (
    {
      active,
      avatar,
      loading,
      description,
      date,
      title,
      onHoverChange,
      actions,
      className,
      style,
      showAction,
      children,
      classNames,
      addon,
      pin,
      styles: customStyles,
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();

    const loadingNode = <Icon icon={Loader2} spin />;

    const pinNode = pin && (
      <div className={cx(styles.pin, classNames?.pin)} style={customStyles?.pin}>
        <div className={styles.triangle} />
      </div>
    );

    const actionsNode = actions && (
      <Flexbox
        className={cx(styles.actions, classNames?.actions)}
        gap={4}
        horizontal
        onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ display: showAction ? undefined : 'none', ...customStyles?.actions }}
      >
        {actions}
      </Flexbox>
    );

    const timeNode = date && (
      <div
        className={cx(styles.date, classNames?.date)}
        style={{ opacity: showAction ? 0 : undefined, ...customStyles?.date }}
      >
        {getChatItemTime(date)}
      </div>
    );

    return (
      <Flexbox
        align={'flex-start'}
        className={cx(styles.root, active && styles.active, className)}
        distribution={'space-between'}
        gap={8}
        horizontal
        onMouseEnter={() => {
          onHoverChange?.(true);
        }}
        onMouseLeave={() => {
          onHoverChange?.(false);
        }}
        padding={12}
        ref={ref}
        style={style}
        {...rest}
      >
        {pinNode}
        <Flexbox
          align={'flex-start'}
          className={classNames?.container}
          flex={1}
          gap={8}
          horizontal
          style={{ overflow: 'hidden', ...customStyles?.container }}
        >
          {avatar ?? <Icon icon={MessageSquare} style={{ marginTop: 4 }} />}
          <Flexbox
            className={cx(styles.content, classNames?.content)}
            gap={4}
            style={customStyles?.content}
          >
            <Title
              className={cx(styles.title, classNames?.title)}
              ellipsis={{ rows: 1 }}
              level={3}
              style={customStyles?.title}
            >
              {title}
            </Title>
            {description && (
              <Paragraph
                className={cx(styles.desc, classNames?.desc)}
                ellipsis={{ rows: 1 }}
                style={customStyles?.desc}
              >
                {description}
              </Paragraph>
            )}
            {addon}
          </Flexbox>
        </Flexbox>
        {loading ? (
          loadingNode
        ) : (
          <>
            {actionsNode}
            {timeNode}
          </>
        )}
        {children}
      </Flexbox>
    );
  },
);

ListItem.displayName = 'ListItem';

export default ListItem;

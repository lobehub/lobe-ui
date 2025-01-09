'use client';

import { Typography } from 'antd';
import { Loader2, MessageSquare } from 'lucide-react';
import { ReactNode, forwardRef } from 'react';
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
    time?: string;
  };
  date?: number;
  description?: ReactNode;
  loading?: boolean;
  onClick?: () => void;
  onHoverChange?: (hover: boolean) => void;
  pin?: boolean;
  showAction?: boolean;
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
      ...rest
    },
    ref,
  ) => {
    const { styles, cx } = useStyles();

    return (
      <Flexbox
        align={'flex-start'}
        className={cx(styles.container, active && styles.active, className)}
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
        {pin && (
          <div className={styles.pin}>
            <div className={styles.triangle} />
          </div>
        )}

        <Flexbox align={'flex-start'} flex={1} gap={8} horizontal style={{ overflow: 'hidden' }}>
          {avatar ?? <Icon icon={MessageSquare} style={{ marginTop: 4 }} />}
          <Flexbox className={styles.content} gap={4}>
            <Title className={styles.title} ellipsis={{ rows: 1 }} level={3}>
              {title}
            </Title>
            {description && (
              <Paragraph className={styles.desc} ellipsis={{ rows: 1 }}>
                {description}
              </Paragraph>
            )}
            {addon}
          </Flexbox>
        </Flexbox>

        {loading ? (
          <Icon icon={Loader2} spin />
        ) : (
          <>
            {showAction && (
              <Flexbox
                className={styles.actions}
                gap={4}
                horizontal
                onClick={(e: any) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{ display: showAction ? undefined : 'none' }}
              >
                {actions}
              </Flexbox>
            )}
            {date && (
              <div
                className={cx(styles.time, classNames?.time)}
                style={showAction ? { opacity: 0 } : {}}
              >
                {getChatItemTime(date)}
              </div>
            )}
          </>
        )}
        {children}
      </Flexbox>
    );
  },
);

export default ListItem;

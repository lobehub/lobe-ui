'use client';

import { Loader2, MessageSquare } from 'lucide-react';
import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';

import { useStyles } from './style';
import { getChatItemTime } from './time';

/**
 * 卡片列表项的属性
 */
export interface ListItemProps {
  /**
   * 渲染操作区域的 React 节点
   */
  actions?: ReactNode;
  /**
   * 是否处于激活状态
   */
  active: boolean;
  addon?: ReactNode;
  /**
   * 头像的 React 节点
   */
  avatar?: ReactNode;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 自定义样式类名对象
   * @property time - 时间的样式类名
   */
  classNames?: {
    time?: string;
  };
  /**
   * 日期时间戳
   */
  date?: number;
  /**
   * 描述信息
   */
  description?: ReactNode;
  /**
   * 是否处于加载状态
   */
  loading?: boolean;
  /**
   * 点击事件回调函数
   */
  onClick?: () => void;
  /**
   * 鼠标悬停状态变化事件回调函数
   * @param hover - 是否悬停
   */
  onHoverChange?: (hover: boolean) => void;

  pin?: boolean;
  /**
   * 是否显示操作区域
   */
  showAction?: boolean;
  /**
   * 自定义样式对象
   */
  style?: CSSProperties;
  /**
   * 标题
   */
  title: ReactNode;
}

const ListItem = forwardRef<HTMLDivElement, ListItemProps & HTMLAttributes<any>>(
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
            <div className={styles.triangle}></div>
          </div>
        )}
        {avatar ?? <Icon icon={MessageSquare} style={{ marginTop: 4 }} />}

        <Flexbox className={styles.content} gap={8}>
          <Flexbox distribution={'space-between'} horizontal>
            <div className={styles.title}>{title}</div>
          </Flexbox>
          {description && <div className={styles.desc}>{description}</div>}
          {addon}
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

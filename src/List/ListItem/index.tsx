import { LoadingOutlined, MessageOutlined } from '@ant-design/icons';
import { CSSProperties, HTMLAttributes, ReactNode, forwardRef, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';
import { getChatItemTime } from './time';

/**
 * 卡片列表项的属性
 */
export interface ListItemProps {
  /**
   * 是否处于激活状态
   */
  active: boolean;
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
  description?: string;
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
  /**
   * 渲染操作区域的 React 节点
   */
  renderActions?: ReactNode;
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
  title: string;
}

const ListItem = memo(
  forwardRef<HTMLElement, ListItemProps & HTMLAttributes<any>>(
    (
      {
        active,
        avatar,
        loading,
        description,
        date,
        title,
        onHoverChange,
        renderActions,
        className,
        style,
        showAction,
        classNames = {},
        ...props
      },
      reference,
    ) => {
      const { styles, cx } = useStyles();

      return (
        <Flexbox
          align={'flex-start'}
          className={cx(styles.container, active && styles.active, className)}
          distribution={'space-between'}
          gap={8}
          horizontal
          paddingBlock={8}
          paddingInline={'12px 8px'}
          ref={reference}
          style={style}
          {...props}
          onMouseEnter={() => {
            onHoverChange?.(true);
          }}
          onMouseLeave={() => {
            onHoverChange?.(false);
          }}
        >
          {avatar ?? <MessageOutlined style={{ marginTop: 4 }} />}

          <Flexbox className={styles.content}>
            <Flexbox distribution={'space-between'} horizontal>
              <div className={styles.title}>{title}</div>
            </Flexbox>
            {description && <div className={styles.desc}>{description}</div>}
            <div className={styles.textOverlay} />
          </Flexbox>

          {loading ? (
            <LoadingOutlined spin={true} />
          ) : showAction ? (
            <Flexbox
              gap={4}
              horizontal
              onClick={(e) => {
                e.stopPropagation();
              }}
              style={{ display: showAction ? undefined : 'none' }}
            >
              {renderActions}
            </Flexbox>
          ) : (
            date && <div className={cx(styles.time, classNames.time)}>{getChatItemTime(date)}</div>
          )}
        </Flexbox>
      );
    },
  ),
);

export default ListItem;

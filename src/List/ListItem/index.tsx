import { LoadingOutlined, MessageOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import { CSSProperties, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { Flexbox } from 'react-layout-kit';

import { convertAlphaToSolid } from '@/utils/colorUtils';
import { getChatItemTime } from './time';

const useStyles = createStyles(({ css, cx, token }) => {
  const textOverlay = css`
    --overlay-background: ${token.colorBgLayout};

    position: absolute;
    z-index: 10;
    top: 0;
    right: 0;

    width: 32px;
    height: 44px;

    background: linear-gradient(to right, transparent, var(--overlay-background));
  `;

  const overlayColor = convertAlphaToSolid(token.colorFillContent, token.colorBgLayout);

  const hoverOverlay = css`
    .${cx(textOverlay)} {
      --overlay-background: ${overlayColor};
    }
  `;

  return {
    container: css`
      cursor: pointer;
      color: ${token.colorTextTertiary};
      border-radius: 8px;

      &:hover {
        background: ${token.colorFillContent};
        ${hoverOverlay}
      }
    `,
    active: css`
      color: ${token.colorText};
      background: ${token.colorFillContent};

      ${hoverOverlay}
    `,

    content: css`
      position: relative;
      overflow: hidden;
      flex: 1;
    `,

    title: css`
      overflow: hidden;

      width: 100%;

      font-size: 0.9em;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    time: css`
      font-size: 12px;
      color: ${token.colorTextPlaceholder};
    `,
    desc: css`
      overflow: hidden;

      width: 100%;
      margin-top: 2px;

      font-size: 0.75em;
      text-overflow: ellipsis;
      white-space: nowrap;

      opacity: 0.5;
    `,
    textOverlay,
  };
});

/**
 * 卡片列表项的属性
 */
export interface ListItemProps {
  /**
   * 是否处于激活状态
   */
  active: boolean;
  /**
   * 是否处于加载状态
   */
  loading?: boolean;
  /**
   * 标题
   */
  title: string;
  /**
   * 描述信息
   */
  description?: string;
  /**
   * 日期时间戳
   */
  date?: number;
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
   * 头像的 React 节点
   */
  avatar?: ReactNode;
  /**
   * 自定义样式类名
   */
  className?: string;
  /**
   * 自定义样式对象
   */
  style?: CSSProperties;
  /**
   * 是否显示操作区域
   */
  showAction?: boolean;
  /**
   * 自定义样式类名对象
   * @property time - 时间的样式类名
   */
  classNames?: {
    time?: string;
  };
}

const ListItem = forwardRef<HTMLElement, ListItemProps & HTMLAttributes<any>>(
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
    ref,
  ) => {
    const { styles, cx } = useStyles();

    return (
      <Flexbox
        ref={ref}
        horizontal
        paddingBlock={8}
        gap={8}
        paddingInline={'12px 8px'}
        align={'flex-start'}
        distribution={'space-between'}
        className={cx(styles.container, active && styles.active, className)}
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
          <Flexbox horizontal distribution={'space-between'}>
            <div className={styles.title}>{title}</div>
          </Flexbox>
          {description && <div className={styles.desc}>{description}</div>}
          <div className={styles.textOverlay} />
        </Flexbox>

        {loading ? (
          <LoadingOutlined spin={true} />
        ) : showAction ? (
          <Flexbox
            horizontal
            gap={4}
            style={{ display: showAction ? undefined : 'none' }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {renderActions}
          </Flexbox>
        ) : (
          date && <div className={cx(styles.time, classNames.time)}>{getChatItemTime(date)}</div>
        )}
      </Flexbox>
    );
  },
);

export default ListItem;

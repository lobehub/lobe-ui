import { Collapse, type CollapseProps } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import Icon, { type IconProps } from '@/Icon';

export type FormVariant = 'default' | 'block' | 'ghost' | 'pure';
export type ItemsType = 'group' | 'flat';

export const useStyles = createStyles(({ css, cx, token, isDarkMode, responsive, prefixCls }) => {
  const pureStyle = css`
    background: transparent;
    border: none;
    border-radius: 0;

    .${prefixCls}-collapse-header {
      padding-block: 0 20px !important;
      padding-inline: 2px !important;
      background: transparent !important;
      border-radius: 0 !important;
    }

    .${prefixCls}-collapse-content {
      border-color: ${token.colorFillSecondary};
    }

    .${prefixCls}-collapse-content-box {
      padding-inline: 2px !important;
      background: transparent;
      border-radius: 0;
    }
  `;

  const blockStyle = css`
    background: ${token.colorFillQuaternary};
    border: none;
    border-radius: ${token.borderRadiusLG}px;

    .${prefixCls}-collapse-content {
      border: none !important;
    }
  `;
  const ghostStyle = css`
    background: transparent;
    border: 1px solid ${token.colorBorderSecondary};
    .${prefixCls}-collapse-header {
      background: transparent !important;
    }

    .${prefixCls}-collapse-content-box {
      background: transparent;
    }
  `;

  const defaultStyle = css`
    background: ${token.colorFillQuaternary};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
  `;

  return {
    blockStyle,
    defaultStyle,
    flatGroup: css`
      overflow: hidden;
      padding-inline: 16px;
    `,
    ghostStyle,
    group: cx(
      isDarkMode &&
        css`
          .${prefixCls}-collapse-content {
            background: transparent;
            border-color: ${token.colorBorderSecondary};
          }

          .${prefixCls}-collapse-header {
            background: ${token.colorFillTertiary};
          }
        `,
      css`
        overflow: hidden;
        flex: none;

        .${prefixCls}-collapse-item {
          border: none;
        }

        .${prefixCls}-collapse-header {
          align-items: center !important;
          border-radius: 0 !important;
        }

        .${prefixCls}-collapse-content-box {
          padding-block: 0 !important;
        }

        .${prefixCls}-form-item-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
      `,
    ),

    icon: css`
      transition: all 100ms ${token.motionEaseOut};
    `,
    mobileFlatGroup: css`
      border-radius: ${token.borderRadiusLG}px;
    `,
    mobileGroupBody: css`
      padding-block: 0;
      padding-inline: 16px;
      background: ${token.colorBgContainer};
    `,
    mobileGroupHeader: css`
      padding: 16px;
      background: ${token.colorBgLayout};
    `,
    pureStyle,
    pureTitle: css`
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
    `,
    title: css`
      align-items: center;
      font-size: 16px;
      font-weight: 600;

      .anticon {
        color: ${token.colorPrimary};
      }

      ${responsive.mobile} {
        font-size: 14px;
        font-weight: 400;
        opacity: 0.5;
      }
    `,
  };
});

export interface FormGroupProps extends CollapseProps {
  children: ReactNode;
  defaultActive?: boolean;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  itemsType?: ItemsType;
  title?: ReactNode;
  variant?: FormVariant;
}

const FormGroup = memo<FormGroupProps>(
  ({
    className,
    icon,
    title,
    children,
    extra,
    itemsType,
    variant = 'default',
    defaultActive = true,
    ...rest
  }) => {
    const { mobile } = useResponsive();
    const { cx, styles } = useStyles(variant);

    const variantStyle = cx(
      variant === 'default' && styles.defaultStyle,
      variant === 'block' && styles.blockStyle,
      variant === 'ghost' && styles.ghostStyle,
      variant === 'pure' && styles.pureStyle,
    );

    const titleContent = (
      <Flexbox
        className={cx(styles.title, variant === 'pure' && styles.pureTitle)}
        gap={8}
        horizontal
      >
        {icon && <Icon icon={icon} />}
        {title}
      </Flexbox>
    );

    if (itemsType === 'flat') {
      return mobile ? (
        <Flexbox className={cx(styles.mobileFlatGroup, styles.mobileGroupBody, className)}>
          {children}
        </Flexbox>
      ) : (
        <Flexbox className={cx(styles.flatGroup, variantStyle, className)}>{children}</Flexbox>
      );
    }

    if (mobile)
      return (
        <Flexbox className={className}>
          <Flexbox className={styles.mobileGroupHeader} horizontal justify={'space-between'}>
            {titleContent}
            {extra}
          </Flexbox>
          <div className={styles.mobileGroupBody}>{children}</div>
        </Flexbox>
      );

    return (
      <Collapse
        className={cx(styles.group, variantStyle, className)}
        defaultActiveKey={defaultActive ? [1] : undefined}
        expandIcon={({ isActive }) =>
          variant === 'pure' ? null : (
            <Icon
              className={styles.icon}
              icon={ChevronDown}
              size={{ fontSize: 16 }}
              style={isActive ? {} : { rotate: '-90deg' }}
            />
          )
        }
        items={[
          {
            children,
            extra,
            key: 1,
            label: titleContent,
          },
        ]}
        key={1}
        {...rest}
      />
    );
  },
);

export default FormGroup;

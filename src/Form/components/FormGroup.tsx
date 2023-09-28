import { Icon, type IconProps } from '@lobehub/ui';
import { Collapse, type CollapseProps } from 'antd';
import { useResponsive } from 'antd-style';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useStyles } from './style';

export interface FormGroupProps extends CollapseProps {
  children: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  title: string;
}

const FormGroup = memo<FormGroupProps>(({ className, icon, title, children, extra, ...props }) => {
  const { mobile } = useResponsive();
  const { cx, styles } = useStyles();

  const titleContent = (
    <div className={styles.title}>
      {icon && <Icon icon={icon} />}
      {title}
    </div>
  );

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
      className={cx(styles.group, className)}
      defaultActiveKey={[1]}
      expandIcon={({ isActive }) => (
        <Icon
          className={styles.icon}
          icon={ChevronDown}
          size={{ fontSize: 16 }}
          style={isActive ? {} : { rotate: '-90deg' }}
        />
      )}
      items={[
        {
          children,
          extra,
          key: 1,
          label: titleContent,
        },
      ]}
      key={1}
      {...props}
    />
  );
});

export default FormGroup;

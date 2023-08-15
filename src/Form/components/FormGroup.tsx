import { Icon, type IconProps } from '@lobehub/ui';
import { Collapse, type CollapseProps } from 'antd';
import { ChevronDown } from 'lucide-react';
import { type ReactNode, memo } from 'react';

import { useStyles } from './style';

export interface FormGroupProps extends CollapseProps {
  children: ReactNode;
  extra?: ReactNode;
  icon?: IconProps['icon'];
  title: string;
}

const FormGroup = memo<FormGroupProps>(({ className, icon, title, children, extra, ...props }) => {
  const { cx, styles } = useStyles();
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
          label: (
            <div className={styles.title}>
              {icon && <Icon icon={icon} />}
              {title}
            </div>
          ),
        },
      ]}
      key={1}
      {...props}
    />
  );
});

export default FormGroup;

import { Form as AntForm, FormProps as AntFormProps } from 'antd';
import { LucideIcon } from 'lucide-react';
import { type ReactNode, memo } from 'react';

import FormFooter from './components/FormFooter';
import FormGroup from './components/FormGroup';
import FormItem, { FormItemProps } from './components/FormItem';
import { useStyles } from './style';

export interface ItemGroup {
  children: FormItemProps[];
  icon?: LucideIcon;
  title: string;
}

export interface FormProps extends AntFormProps {
  children?: ReactNode;
  footer?: ReactNode;
  itemMinWidth?: FormItemProps['minWidth'];
  items?: ItemGroup[];
}

const Form = memo<FormProps>(({ className, itemMinWidth, footer, items, children, ...props }) => {
  const { cx, styles } = useStyles();
  return (
    <AntForm className={cx(styles.form, className)} colon={false} layout="horizontal" {...props}>
      {items?.map((group, groupIndex) => (
        <FormGroup icon={group?.icon} key={groupIndex} title={group.title}>
          {group.children.map((item, itemIndex) => {
            return (
              <FormItem
                divider={itemIndex !== 0}
                key={itemIndex}
                minWidth={itemMinWidth}
                {...item}
              />
            );
          })}
        </FormGroup>
      ))}
      {children}
      {footer && <FormFooter>{footer}</FormFooter>}
    </AntForm>
  );
});
export default Form;

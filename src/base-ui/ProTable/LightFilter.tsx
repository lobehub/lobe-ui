import FieldControl from './FieldControl';
import { styles } from './style';
import type { ProTableFormInstance } from './type';
import type { SearchFieldSchema } from './useSearchForm';

export interface LightFilterProps {
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  placeholder: { input: string; select: string };
  values: Record<string, any>;
}

/**
 * Pro `LightFilter` (`search.filterType: 'light'`): compact controls in the toolbar that query
 * as soon as a value changes (text inputs on Enter / clear).
 */
const LightFilter = ({ fields, form, placeholder, values }: LightFilterProps) => (
  <div className={styles.lightFilter} data-pro-table-light-filter="">
    {fields.map(({ column, name }) => {
      const isText =
        !column.valueEnum &&
        (!column.valueType ||
          ['text', 'textarea', 'password', 'code'].includes(column.valueType as string));
      const wrapped = isText
        ? {
            ...column,
            fieldProps: {
              ...column.fieldProps,
              onClear: () => form.submit(),
              onPressEnter: () => form.submit(),
            },
          }
        : column;
      return (
        <div className={styles.lightFilterItem} key={name}>
          <FieldControl
            light
            column={wrapped}
            form={form}
            placeholder={placeholder}
            value={values[name]}
            onChange={(value) => {
              form.setFieldValue(name, value);
              if (!isText) form.submit();
            }}
          />
        </div>
      );
    })}
  </div>
);

export default LightFilter;

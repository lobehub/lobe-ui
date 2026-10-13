import Form from '@/base-ui/FormKit';

import FieldControl from './FieldControl';
import { styles } from './style';
import type { ProTableFormInstance } from './type';
import { rulesToFieldProps, type SearchFieldSchema } from './useSearchForm';

export interface LightFilterProps {
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  placeholder: { input: string; select: string };
}

const TEXT_TYPES = new Set(['text', 'textarea', 'password', 'code']);

/**
 * Pro `LightFilter` (`search.filterType: 'light'`): the same base-ui Form instance rendered as
 * bare inline fields in the toolbar; select-like fields query on change, text fields on Enter / clear.
 */
const LightFilter = ({ fields, form, placeholder }: LightFilterProps) => (
  <Form
    className={styles.lightFilter}
    data-pro-table-light-filter=""
    form={form}
    layout="horizontal"
    variant="borderless"
  >
    {fields.map(({ column, name }) => {
      const isText =
        !column.valueEnum &&
        !column.renderFormItem &&
        (!column.valueType || TEXT_TYPES.has(column.valueType as string));
      const wrapped = isText
        ? {
            ...column,
            fieldProps: {
              ...column.fieldProps,
              onClear: () => void form.submit(),
            },
          }
        : column;
      const { required, validate } = rulesToFieldProps(
        column.formItemProps?.rules,
        column.formItemProps?.required,
      );
      return (
        <div className={styles.lightFilterItem} key={name}>
          <Form.Field
            bare
            name={name}
            required={required}
            validate={validate}
            render={({ value, onChange }) => (
              <FieldControl
                light
                column={wrapped}
                form={form}
                placeholder={placeholder}
                value={value}
                onChange={(next) => {
                  onChange(next);
                  if (!isText) void form.submit();
                }}
              />
            )}
          />
        </div>
      );
    })}
    {/* Text fields query on Enter through the native form submit. */}
    <button hidden type="submit" />
  </Form>
);

export default LightFilter;

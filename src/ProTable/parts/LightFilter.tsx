import Form from '@lobehub/ui/form';

import { rulesToFieldProps, type SearchFieldSchema } from '../hooks/useSearchForm';
import { styles } from '../style';
import type { ProTableFormInstance } from '../type';
import FieldControl from './FieldControl';

export interface LightFilterProps {
  fields: SearchFieldSchema[];
  form: ProTableFormInstance;
  ignoreRules?: boolean;
  placeholder: { input: string; select: string };
}

const TEXT_TYPES = new Set(['text', 'textarea', 'password', 'code']);

const LightFilter = ({ fields, form, ignoreRules, placeholder }: LightFilterProps) => (
  <Form
    className={styles.lightFilter}
    data-pro-table-light-filter=""
    form={form}
    variant="borderless"
    layout="horizontal"
    // The base-ui Form root stacks its children; the light filter is one wrapping row.
    style={{
      alignItems: 'center',
      display: 'flex',
      flex: '0 1 auto',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      minWidth: 0,
      width: 'auto',
    }}
  >
    {fields.map(({ column, name }) => {
      const isText =
        !column.valueEnum &&
        !column.request &&
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
      const { required, validate } = ignoreRules
        ? { required: undefined, validate: undefined }
        : rulesToFieldProps(column.formItemProps?.rules, column.formItemProps?.required);
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

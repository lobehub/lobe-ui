import {
  DayjsDatePicker as DatePicker,
  type DayjsDatePickerProps as DatePickerProps,
} from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

export default () => {
  const store = useCreateStore();
  const { range, ...control } = useControls(
    {
      allowClear: true,
      disabled: false,
      inputReadOnly: false,
      needConfirm: false,
      picker: {
        options: ['date', 'week', 'month', 'quarter', 'year', 'time'],
        value: 'date',
      },
      placeholder: '',
      placement: {
        options: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'],
        value: 'bottomLeft',
      },
      range: false,
      shadow: false,
      showNow: false,
      showTime: false,
      showWeek: false,
      size: {
        options: ['small', 'medium', 'large'],
        value: 'medium',
      },
      status: {
        options: ['', 'warning', 'error'],
        value: '',
      },
      variant: {
        options: ['outlined', 'filled', 'borderless', 'underlined'],
        value: 'outlined',
      },
    },
    { store },
  ) as any;

  const props = {
    ...control,
    placeholder: control.placeholder || undefined,
    status: control.status || undefined,
  } as DatePickerProps;

  return (
    <StoryBook levaStore={store}>
      {range ? (
        <DatePicker.RangePicker {...(props as any)} placeholder={undefined} />
      ) : (
        <DatePicker {...props} />
      )}
    </StoryBook>
  );
};

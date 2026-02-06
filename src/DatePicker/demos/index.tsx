import { DatePicker, type DatePickerProps } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
  console.log(date, dateString);
};
export default () => {
  const store = useCreateStore();
  const controls = useControls(
    {
      shadow: false,
      variant: {
        options: ['outlined', 'borderless', 'filled'],
        value: 'filled',
      },
    },
    { store },
  ) as DatePickerProps;

  return (
    <StoryBook gap={16} levaStore={store}>
      <DatePicker onChange={onChange} {...controls} />
      <DatePicker onChange={onChange} {...controls} picker="week" />
      <DatePicker onChange={onChange} {...controls} picker="month" />
      <DatePicker onChange={onChange} {...controls} picker="quarter" />
      <DatePicker onChange={onChange} {...controls} picker="year" />
    </StoryBook>
  );
};

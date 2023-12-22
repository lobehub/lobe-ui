import dayjs from 'dayjs';

export const getChatItemTime = (updateAt: number) => {
  const time = dayjs(updateAt);

  if (time.isSame(dayjs(), 'day')) return time.format('HH:mm');

  return time.format('MM-DD');
};

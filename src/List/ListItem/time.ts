import 'dayjs/locale/zh-cn';

import dayjs from 'dayjs';

dayjs.locale('zh-cn');

export const getChatItemTime = (updateAt: number) => {
  const time = dayjs(updateAt);
  const diff = dayjs().day() - time.day();

  if (time.isSame(dayjs(), 'day')) return time.format('HH:mm');

  if (diff === 1) return '昨天';

  return time.format('MM-DD');
};

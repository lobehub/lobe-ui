import { Markdown } from '@lobehub/ui';

const citations = [
  'https://www.weather.com.cn/weather/101210101.shtml',
  'https://tianqi.moji.com/weather/china/zhejiang/hangzhou',
  'https://weather.cma.cn/web/weather/58457.html',
  'https://tianqi.so.com/weather/101210101',
  'https://www.accuweather.com/zh/cn/hangzhou/106832/weather-forecast/106832',
  'https://www.hzqx.com',
  'https://www.hzqx.com/pc/hztq/',
];

const code = `杭州今天和未来几天的天气预报如下：

今天（2月18日）多云，气温在4-12℃之间[2][3]。白天多云，夜间转阴[7]。风力较大，上午为偏东风2-3级，傍晚增大到4级[7]。

未来几天天气概况：
- 2月19日（明天）：阴天，有小雨，气温11℃左右[3][7]
- 2月20日：阴天，小到中雨，气温7℃左右[3][7]
- 2月21日：多云，气温7℃左右[3]
- 2月22日：小雨，气温7℃左右[3]

总体来看，未来几天杭州天气较凉，以阴天和雨天为主，气温在7-11℃之间波动。建议市民适当增添衣物，注意保暖，外出时携带雨具[2][3][7]。
`;

export default () => {
  return <Markdown citations={citations}>{code}</Markdown>;
};

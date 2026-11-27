import type { WeatherCardProps } from '@lobehub/ui';

// Sample data from the A2UI playground `WeatherCard` (CopilotKit a2ui-playground, MIT).
export const weather: WeatherCardProps = {
  condition: 'Partly cloudy',
  daily: [
    { icon: 'cloud-sun', label: 'Today', max: 21, min: 12 },
    { icon: 'rain', label: 'Thu', max: 17, min: 11, precip: 70 },
    { icon: 'storm', label: 'Fri', max: 15, min: 10, precip: 85 },
    { icon: 'cloud', label: 'Sat', max: 19, min: 11 },
    { icon: 'sun', label: 'Sun', max: 24, min: 13 },
  ],
  feels: 17,
  high: 21,
  hourly: [
    { icon: 'cloud-sun', label: 'Now', temp: 18 },
    { icon: 'sun', label: '2 PM', temp: 20 },
    { icon: 'sun', label: '3 PM', temp: 21 },
    { icon: 'cloud-sun', label: '4 PM', temp: 20 },
    { icon: 'cloud', label: '5 PM', precip: 10, temp: 18 },
    { icon: 'fog', label: '6 PM', precip: 20, temp: 16 },
    { icon: 'drizzle', label: '7 PM', precip: 40, temp: 15 },
  ],
  humidity: 68,
  icon: 'cloud-sun',
  location: 'San Francisco, CA',
  low: 12,
  temp: 18,
  unit: 'C',
  wind: 19,
};

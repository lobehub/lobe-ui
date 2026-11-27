import { render, screen } from '@testing-library/react';

import { weatherKey } from './weather';
import WeatherCard from './WeatherCard';

const props = {
  condition: 'Partly cloudy',
  daily: [
    { icon: 'cloud-sun', label: 'Today', max: 21, min: 12 },
    { icon: 'rain', label: 'Thu', max: 17, min: 11, precip: 70 },
  ],
  feels: 17,
  high: 21,
  hourly: [
    { icon: 'cloud-sun', label: 'Now', temp: 18 },
    { icon: 'drizzle', label: '7 PM', precip: 40, temp: 15 },
  ],
  humidity: 68,
  location: 'San Francisco, CA',
  low: 12,
  temp: 18.4,
  wind: 19,
};

describe('WeatherCard', () => {
  test('renders the hero, details, hourly strip and daily rows', () => {
    const { container } = render(<WeatherCard {...props} />);
    expect(screen.getByText('San Francisco, CA')).toBeTruthy();
    expect(screen.getByText('18')).toBeTruthy();
    expect(screen.getByText('°C')).toBeTruthy();
    expect(screen.getByText('H 21° · L 12°')).toBeTruthy();
    expect(screen.getByText('Feels like')).toBeTruthy();
    expect(screen.getByText('68%')).toBeTruthy();
    expect(screen.getByText('19 km/h')).toBeTruthy();
    expect(container.querySelectorAll('.lobe-weather-card__hour')).toHaveLength(2);
    expect(container.querySelectorAll('.lobe-weather-card__day')).toHaveLength(2);
    expect(screen.getByText('70%')).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).dataset.condition).toBe('cloud-sun');
  });

  test('uses mph for Fahrenheit and guesses the icon from the condition', () => {
    const { container } = render(
      <WeatherCard condition="Light rain" temp={60} unit="F" wind={8} />,
    );
    expect(screen.getByText('8 mph')).toBeTruthy();
    expect((container.firstElementChild as HTMLElement).dataset.condition).toBe('rain');
    expect(weatherKey(undefined, 'Thunderstorms')).toBe('storm');
    expect(weatherKey('snow')).toBe('snow');
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const { container, rerender } = render(<WeatherCard {...props} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    expect(container.querySelector('.lobe-weather-card__glow')).toBeNull();
    const defaultClass = root.className;
    rerender(<WeatherCard {...props} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelector('.lobe-weather-card__glow')).not.toBeNull();
    expect(root.className).not.toBe(defaultClass);
  });
});

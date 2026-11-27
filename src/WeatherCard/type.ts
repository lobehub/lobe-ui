import type { CSSProperties, HTMLAttributes, Ref } from 'react';

/** Condition icon key. Free text (e.g. "Light rain") is mapped to the closest key. */
export type WeatherIconKey =
  'sun' | 'cloud-sun' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

export interface WeatherHour {
  /** Condition icon key or free text. */
  icon?: WeatherIconKey | (string & {});
  /** e.g. "Now", "2 PM". The first hour is highlighted. */
  label: string;
  /** Chance of precipitation in percent; shown when above 0. */
  precip?: number;
  temp: number;
}

export interface WeatherDay {
  icon?: WeatherIconKey | (string & {});
  /** e.g. "Today", "Thu". */
  label: string;
  max: number;
  min: number;
  /** Chance of precipitation in percent; shown when above 0. */
  precip?: number;
}

export interface WeatherCardClassNames {
  daily?: string;
  details?: string;
  hero?: string;
  hourly?: string;
  root?: string;
}

export interface WeatherCardStyles {
  daily?: CSSProperties;
  details?: CSSProperties;
  hero?: CSSProperties;
  hourly?: CSSProperties;
  root?: CSSProperties;
}

export interface WeatherCardTexts {
  feelsLike?: string;
  /** Prefix of the high temperature. @default 'H' */
  high?: string;
  humidity?: string;
  /** Prefix of the low temperature. @default 'L' */
  low?: string;
  wind?: string;
}

export type WeatherCardVariant = 'default' | 'a2ui';

export interface WeatherCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  classNames?: WeatherCardClassNames;
  /** Condition text, e.g. "Partly cloudy". Also picks the icon when `icon` is not set. */
  condition?: string;
  /** Daily forecast rows with a min-max range bar. */
  daily?: WeatherDay[];
  /** Feels-like temperature. */
  feels?: number;
  high?: number;
  /** Hourly forecast strip. */
  hourly?: WeatherHour[];
  /** Relative humidity in percent. */
  humidity?: number;
  /** Condition icon key; guessed from `condition` when not set. */
  icon?: WeatherIconKey | (string & {});
  location?: string;
  low?: number;
  ref?: Ref<HTMLDivElement>;
  styles?: WeatherCardStyles;
  /** Current temperature. */
  temp?: number;
  /** Overrides the built-in `weatherCard.*` texts. */
  texts?: WeatherCardTexts;
  /** Temperature unit; also sets the wind unit (km/h or mph). @default 'C' */
  unit?: 'C' | 'F';
  /**
   * `default`: a plain lobe-ui card (theme border and radius, body type, filled wells).
   * `a2ui`: the A2UI playground weather card (14px card, condition glow, hairline wells).
   * @default 'default'
   */
  variant?: WeatherCardVariant;
  /** Wind speed, in km/h for `C` and mph for `F`. */
  wind?: number;
}

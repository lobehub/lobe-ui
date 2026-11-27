import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  type LucideIcon,
  Sun,
} from 'lucide-react';

import type { WeatherIconKey } from './type';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/domain.tsx` (`weatherIcons`, `weatherKey`).

export const weatherIcons: Record<WeatherIconKey, LucideIcon> = {
  'cloud': Cloud,
  'cloud-sun': CloudSun,
  'drizzle': CloudDrizzle,
  'fog': CloudFog,
  'rain': CloudRain,
  'snow': CloudSnow,
  'storm': CloudLightning,
  'sun': Sun,
};

/** Icon key from an explicit `icon`, or guessed from free-text condition. */
export const weatherKey = (icon?: string, condition?: string): WeatherIconKey => {
  const k = (icon ?? '').toLowerCase().trim();
  if (k in weatherIcons) return k as WeatherIconKey;
  const t = `${k} ${condition ?? ''}`.toLowerCase();
  if (/thunder|storm|lightning/.test(t)) return 'storm';
  if (/snow|sleet|flurr/.test(t)) return 'snow';
  if (/drizzle|shower/.test(t)) return 'drizzle';
  if (/rain/.test(t)) return 'rain';
  if (/fog|mist|haze|smoke/.test(t)) return 'fog';
  if (/partly|mostly sunny|cloud-sun|few clouds/.test(t)) return 'cloud-sun';
  if (/cloud|overcast/.test(t)) return 'cloud';
  return 'sun';
};

export const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

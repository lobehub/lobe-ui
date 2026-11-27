import { ProfileCard, ReceiptCard, WeatherCard } from '@/index';
import { profileCardClasses } from '@/ProfileCard/stable';
import { receiptCardClasses } from '@/ReceiptCard/stable';
import { weatherCardClasses } from '@/WeatherCard/stable';

import type { StableFixture } from './stableClasses.fixtures';

/** The A2UI media and domain cards (ProfileCard, ReceiptCard, WeatherCard, ...). */
export const MEDIA_FIXTURES: Record<string, StableFixture> = {
  ProfileCard: {
    classes: profileCardClasses,
    render: ({ className }) => (
      <ProfileCard
        bio="Builds the sync layer."
        className={className}
        company="Northwind"
        email="maya@northwind.dev"
        location="Seattle, WA"
        name="Maya Chen"
        role="Staff Engineer"
        stats={[{ label: 'Projects', value: '24' }]}
        tags={['Rust']}
      />
    ),
  },
  ReceiptCard: {
    classes: receiptCardClasses,
    render: ({ className }) => (
      <ReceiptCard
        className={className}
        date="Oct 14, 2026"
        items={[{ name: 'Pen', note: 'Fine nib', price: 64 }]}
        merchant="Fieldnote"
        orderId="#1"
        payment="Visa ending 4242"
        status="Paid"
      />
    ),
  },
  WeatherCard: {
    classes: weatherCardClasses,
    render: ({ className }) => (
      <WeatherCard
        className={className}
        condition="Sunny"
        daily={[{ label: 'Today', max: 21, min: 12 }]}
        feels={17}
        high={21}
        hourly={[{ label: 'Now', temp: 18 }]}
        location="San Francisco"
        low={12}
        temp={18}
        variant="a2ui"
      />
    ),
  },
};

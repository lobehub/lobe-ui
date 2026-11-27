import { eventCardClasses } from '@/EventCard/stable';
import { imageGalleryClasses } from '@/ImageGallery/stable';
import { imageGridClasses } from '@/ImageGrid/stable';
import {
  EventCard,
  ImageGallery,
  ImageGrid,
  MathFormula,
  ProfileCard,
  ReceiptCard,
  RecipeCard,
  VideoEmbed,
  WeatherCard,
} from '@/index';
import { mathFormulaClasses } from '@/MathFormula/stable';
import { profileCardClasses } from '@/ProfileCard/stable';
import { receiptCardClasses } from '@/ReceiptCard/stable';
import { recipeCardClasses } from '@/RecipeCard/stable';
import { videoEmbedClasses } from '@/VideoEmbed/stable';
import { weatherCardClasses } from '@/WeatherCard/stable';

import type { StableFixture } from './stableClasses.fixtures';

/** The A2UI media and domain cards (ProfileCard, ReceiptCard, WeatherCard, ...). */
export const MEDIA_FIXTURES: Record<string, StableFixture> = {
  EventCard: {
    classes: eventCardClasses,
    render: ({ className }) => (
      <EventCard
        attendees={12}
        className={className}
        date="2026-11-14"
        description="Talks"
        host="Builders"
        image="https://example.com/cover.jpg"
        tags={['Free']}
        time="6:30 PM"
        title="Meetup"
        venue="The Foundry"
        onAction={() => {}}
      />
    ),
  },
  ImageGallery: {
    classes: imageGalleryClasses,
    render: ({ className }) => (
      <ImageGallery
        className={className}
        images={[{ caption: 'A', url: 'https://example.com/a.jpg' }]}
      />
    ),
  },
  ImageGrid: {
    classes: imageGridClasses,
    render: ({ className }) => (
      <ImageGrid
        className={className}
        images={[{ caption: 'A', url: 'https://example.com/a.jpg' }]}
      />
    ),
  },
  MathFormula: {
    classes: mathFormulaClasses,
    render: ({ className }) => <MathFormula className={className} value="x^2" />,
  },
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
  RecipeCard: {
    classes: recipeCardClasses,
    render: ({ className }) => (
      <RecipeCard
        className={className}
        image="https://example.com/cover.jpg"
        ingredients={['Pasta']}
        steps={['Cook']}
        tags={['Vegetarian']}
        time="25 min"
        title="Pesto"
      />
    ),
  },
  VideoEmbed: {
    classes: videoEmbedClasses,
    conditional: ['unsupported'],
    render: ({ className }) => (
      <VideoEmbed className={className} title="Clip" url="https://youtu.be/aircAruvnKk" />
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

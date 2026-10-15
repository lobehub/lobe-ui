'use client';

import { Check } from 'lucide-react';
import { use } from 'react';

import DropdownMenu from '@/DropdownMenu';
import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { styleProps } from '@/styles/stylex/props';

import { FrameContext, useVideoContext } from '../context';
import { styles } from '../style';
import { useFullscreen } from '../useFullscreen';
import { DEFAULT_PLAYBACK_RATES } from '../useKeyboard';
import { useVideo } from '../useVideo';

const RateMenu = () => {
  const { config, store } = useVideoContext();
  const frame = use(FrameContext);
  const fullscreen = useFullscreen(store);
  const { t } = useTranslation(videoMessages);
  const rate = useVideo((state) => state.rate);
  const rates = config.playbackRates ?? DEFAULT_PLAYBACK_RATES;

  return (
    <DropdownMenu
      portalProps={fullscreen && store.root ? { container: store.root } : undefined}
      items={rates.map((value) => ({
        extra: value === rate ? <Check size={14} /> : undefined,
        key: `${value}`,
        label: `${value}×`,
        onClick: () => store.setRate(value),
      }))}
      onOpenChange={(open) => frame?.hold(open)}
    >
      <button
        aria-label={t('video.speed')}
        title={`${t('video.speed')} (J / L)`}
        type="button"
        {...styleProps([styles.barButton, styles.rateButton, rate !== 1 && styles.barButtonActive])}
      >
        {rate}×
      </button>
    </DropdownMenu>
  );
};

RateMenu.displayName = 'VideoRateMenu';

export default RateMenu;

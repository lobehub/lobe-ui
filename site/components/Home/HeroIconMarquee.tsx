import {
  Claude,
  DeepSeek,
  Gemini,
  Grok,
  HuggingFace,
  Meta,
  Midjourney,
  Mistral,
  Ollama,
  OpenAI,
  OpenRouter,
  Qwen,
} from '@lobehub/icons';
import { Link } from 'react-router';

import { styles } from './heroIconMarqueeStyle';

const ICONS = [
  { icon: OpenAI, name: 'OpenAI' },
  { icon: Claude, name: 'Claude' },
  { icon: Gemini, name: 'Gemini' },
  { icon: DeepSeek, name: 'DeepSeek' },
  { icon: Mistral, name: 'Mistral' },
  { icon: Qwen, name: 'Qwen' },
  { icon: Meta, name: 'Meta' },
  { icon: Grok, name: 'Grok' },
  { icon: Ollama, name: 'Ollama' },
  { icon: HuggingFace, name: 'Hugging Face' },
  { icon: OpenRouter, name: 'OpenRouter' },
  { icon: Midjourney, name: 'Midjourney' },
] as const;

function Track({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className={styles.track}>
      {ICONS.map(({ icon: ProviderIcon, name }) => (
        <span className={styles.item} key={name}>
          <ProviderIcon size={18} />
          {name}
        </span>
      ))}
    </div>
  );
}

export default function HeroIconMarquee({ iconsPathname }: { iconsPathname?: string }) {
  return (
    <div className={styles.root}>
      <div className={styles.marquee}>
        <Track />
        <Track hidden />
      </div>
      <p className={styles.caption}>
        {iconsPathname ? (
          <Link to={iconsPathname}>300+ AI model &amp; provider icons built in</Link>
        ) : (
          <span>300+ AI model &amp; provider icons built in</span>
        )}
      </p>
    </div>
  );
}

import { Claude, DeepSeek, Gemini, Mistral, Ollama, OpenAI, Qwen } from '@lobehub/icons';
import { LogoMarquee } from '@lobehub/ui/awesome';

export default () => (
  <LogoMarquee
    caption="300+ AI model & provider icons built in"
    items={[
      { icon: OpenAI, label: 'OpenAI' },
      { icon: Claude, label: 'Claude' },
      { icon: Gemini, label: 'Gemini' },
      { icon: DeepSeek, label: 'DeepSeek' },
      { icon: Mistral, label: 'Mistral' },
      { icon: Qwen, label: 'Qwen' },
      { icon: Ollama, label: 'Ollama' },
    ]}
  />
);

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
import {
  AgentSkillCard,
  InstallBanner,
  LandingHero,
  LandingSection,
  LogoMarquee,
} from '@lobehub/ui/awesome';
import { GithubIcon } from '@lobehub/ui/icons/lucideExtra';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

import { BentoGallery } from './BentoGallery';
import { CodeShowcaseSection } from './CodeShowcase';
import { FeatureSection } from './FeatureSection';
import { renderLink } from './renderLink';

const SITE_URL = 'https://ui.lobehub.com';
const INSTALL_COMMAND = 'pnpm add @lobehub/ui';
const ICONS_PATHNAME = '/components/icons/auth0';

const MODEL_ICONS = [
  { icon: OpenAI, label: 'OpenAI' },
  { icon: Claude, label: 'Claude' },
  { icon: Gemini, label: 'Gemini' },
  { icon: DeepSeek, label: 'DeepSeek' },
  { icon: Mistral, label: 'Mistral' },
  { icon: Qwen, label: 'Qwen' },
  { icon: Meta, label: 'Meta' },
  { icon: Grok, label: 'Grok' },
  { icon: Ollama, label: 'Ollama' },
  { icon: HuggingFace, label: 'Hugging Face' },
  { icon: OpenRouter, label: 'OpenRouter' },
  { icon: Midjourney, label: 'Midjourney' },
];

export default function Home({
  description,
  getStartedPathname,
}: {
  description: string;
  getStartedPathname: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      <LandingHero
        accent="UI Kit"
        description={<span data-pagefind-meta="description">{description}</span>}
        renderLink={renderLink}
        title={<span data-pagefind-meta="title">LobeHub</span>}
        actions={[
          {
            href: getStartedPathname,
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Get Started',
            primary: true,
          },
          { href: 'https://github.com/lobehub/lobe-ui', icon: GithubIcon, label: 'GitHub' },
        ]}
        aside={
          <AgentSkillCard
            agent={{
              code: `Read ${SITE_URL}/skills.md and follow it to build UI with @lobehub/ui.`,
              description: 'Send this prompt to your agent to pick the right components',
            }}
            footer={
              <>
                <a href="/skills.md" rel="noreferrer" target="_blank">
                  skills.md
                </a>
                <a href="/llms.txt" rel="noreferrer" target="_blank">
                  llms.txt
                </a>
              </>
            }
            human={{
              code: 'npx skills add lobehub/lobe-ui',
              description: 'Install the Lobe UI skills into your project',
            }}
          />
        }
        badge={
          <a href="/skills.md" rel="noreferrer" target="_blank">
            New · Agent skills for every component →
          </a>
        }
        onNavigate={navigate}
      >
        <LogoMarquee
          caption={<Link to={ICONS_PATHNAME}>300+ AI model &amp; provider icons built in</Link>}
          items={MODEL_ICONS}
        />
      </LandingHero>

      <LandingSection
        description="90+ components — every tile below is a live render, not a screenshot."
        eyebrow="Components"
        eyebrowColor="blue"
        id="home-gallery"
        renderLink={renderLink}
        title="Built for AI interfaces"
        actions={[
          {
            href: '/sections/components',
            icon: ArrowRight,
            iconPlacement: 'end',
            label: 'Browse components',
          },
        ]}
        onNavigate={navigate}
      >
        <BentoGallery />
      </LandingSection>

      <LandingSection
        actions={[{ href: '/components/chat/chat-item', label: 'Chat components' }]}
        description="Switch tabs — each snippet on the left renders live on the right."
        eyebrow="Developer experience"
        eyebrowColor="green"
        id="home-showcase"
        renderLink={renderLink}
        title="Code you write, UI you get"
        onNavigate={navigate}
      >
        <CodeShowcaseSection />
      </LandingSection>

      <LandingSection
        actions={[{ href: '/components/theme-provider', label: 'Theming guide' }]}
        description="Design foundations that hold up beyond the demo."
        eyebrow="Foundations"
        eyebrowColor="orange"
        id="home-features"
        renderLink={renderLink}
        title="Everything an AIGC app needs"
        onNavigate={navigate}
      >
        <FeatureSection />
      </LandingSection>

      <InstallBanner
        command={INSTALL_COMMAND}
        title="Start building your AIGC app now"
        footnote={
          <>
            Open source · MIT license · <Link to={getStartedPathname}>Get Started →</Link>
          </>
        }
      />
    </>
  );
}

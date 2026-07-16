export interface ApiSourceOverride {
  [key: string]: unknown;
  atomId?: string;
  docUrl: string;
  pkg: `@lobehub/ui/${string}`;
  sourceUrl: string;
}

type LocalEntry = readonly [directory: string, source: string, atomId?: string];

const repositoryTree = 'https://github.com/lobehub/lobe-ui/tree/master/';

const localGroup = (
  scope: string,
  pkg: ApiSourceOverride['pkg'],
  entries: readonly LocalEntry[],
): Record<string, ApiSourceOverride> =>
  Object.fromEntries(
    entries.map(([directory, source, atomId]) => {
      const document = `src/${scope}/${directory}/index.mdx`;
      return [
        document,
        {
          ...(atomId ? { atomId } : {}),
          docUrl: `${repositoryTree}${document}`,
          pkg,
          sourceUrl: `${repositoryTree}src/${scope}/${directory}/${source}`,
        },
      ];
    }),
  );

const iconEntry = (
  name: string,
  sourceUrl = `${repositoryTree}src/icons/${name}/index.ts`,
): [string, ApiSourceOverride] => {
  const document = `src/icons/${name}/index.mdx`;
  return [
    document,
    {
      docUrl: `${repositoryTree}${document}`,
      pkg: '@lobehub/ui/icons',
      sourceUrl,
    },
  ];
};

export const apiOverrides: Readonly<Record<string, ApiSourceOverride>> = {
  ...localGroup('awesome', '@lobehub/ui/awesome', [
    ['AuroraBackground', 'AuroraBackground.tsx'],
    ['BottomGradientButton', 'BottomGradientButton.tsx'],
    ['Features', 'Features.tsx'],
    ['Giscus', 'Giscus.tsx'],
    ['GradientButton', 'GradientButton.tsx'],
    ['GridBackground', 'GridBackground.tsx'],
    ['Hero', 'Hero.tsx'],
    ['Spotlight', 'Spotlight.tsx'],
    ['SpotlightCard', 'SpotlightCard.tsx'],
    ['TypewriterEffect', 'TypewriterEffect.tsx'],
  ]),
  ...localGroup('base-ui', '@lobehub/ui/base-ui', [
    ['Button', 'Button.tsx'],
    ['ContextMenu', 'index.ts'],
    ['DropdownMenu', 'DropdownMenu.tsx'],
    ['FloatingPanel', 'FloatingPanel.tsx'],
    ['FloatingSheet', 'FloatingSheet.tsx'],
    ['Modal', 'Modal.tsx'],
    ['ScrollArea', 'ScrollArea.tsx'],
    ['Segmented', 'Segmented.tsx'],
    ['Select', 'Select.tsx'],
    ['Switch', 'Switch.tsx'],
    ['Tabs', 'Tabs.tsx'],
    ['Toast', 'imperative.tsx'],
  ]),
  ...localGroup('brand', '@lobehub/ui/brand', [
    ['BrandLoading', 'index.tsx'],
    ['LobeChat', 'index.tsx'],
    ['LobeChatText', 'index.tsx'],
    ['LobeHub', 'index.tsx'],
    ['LobeHubText', 'index.tsx'],
    ['Logo3d', 'index.tsx'],
    ['LogoFlat', 'index.tsx'],
    ['LogoMono', 'index.tsx'],
    ['LogoThree', 'index.tsx'],
  ]),
  ...localGroup('chat', '@lobehub/ui/chat', [
    ['BackBottom', 'BackBottom.tsx'],
    ['ChatHeader', 'ChatHeader.tsx'],
    ['ChatInputArea', 'ChatInputArea.tsx'],
    ['ChatItem', 'ChatItem.tsx'],
    ['ChatList', 'ChatList.tsx'],
    ['EditableMessage', 'EditableMessage.tsx'],
    ['EditableMessageList', 'EditableMessageList.tsx'],
    ['LoadingDots', 'LoadingDots.tsx'],
    ['MessageInput', 'MessageInput.tsx'],
    ['MessageModal', 'MessageModal.tsx'],
    ['TokenTag', 'TokenTag.tsx'],
  ]),
  'src/color/ColorScales/index.mdx': {
    atomId: 'colors, neutrals',
    docUrl: `${repositoryTree}src/color/ColorScales/index.mdx`,
    pkg: '@lobehub/ui/color',
    sourceUrl: `${repositoryTree}src/color/colors/index.ts`,
  },
  ...Object.fromEntries([
    iconEntry('Auth0'),
    iconEntry('Authelia'),
    iconEntry('Authentik'),
    iconEntry('Casdoor'),
    iconEntry('Clerk'),
    iconEntry(
      'Cloudflare',
      'https://github.com/lobehub/lobe-icons/tree/master/src/Cloudflare/index.ts',
    ),
    iconEntry('DingTalk'),
    iconEntry('Discord'),
    iconEntry('Github', 'https://github.com/lobehub/lobe-icons/tree/master/src/Github/index.ts'),
    iconEntry('GoogleChat'),
    iconEntry('IMessage'),
    iconEntry('Lark'),
    iconEntry('Line'),
    iconEntry('Logto'),
    iconEntry('MicrosoftEntra'),
    iconEntry('MicrosoftTeams'),
    iconEntry('NextAuth'),
    iconEntry('QQ'),
    iconEntry('Slack'),
    iconEntry('Telegram'),
    iconEntry('WeChat'),
    iconEntry('WhatsApp'),
    iconEntry('Zitadel'),
    iconEntry('lucideExtra'),
  ]),
  ...localGroup('mdx', '@lobehub/ui/mdx', [
    ['Callout', 'index.tsx'],
    ['Cards', 'index.tsx'],
    ['FileTree', 'index.tsx'],
    ['Mdx', 'index.tsx'],
    ['Steps', 'index.tsx'],
    ['Tabs', 'index.tsx'],
    ['mdxComponents', 'index.ts'],
  ]),
  ...localGroup('mobile', '@lobehub/ui/mobile', [
    ['ChatHeader', 'ChatHeader.tsx'],
    ['ChatInputArea', 'ChatInputArea.tsx'],
    ['SafeArea', 'SafeArea.tsx'],
    ['TabBar', 'TabBar.tsx'],
  ]),
  ...localGroup('storybook', '@lobehub/ui/storybook', [['StoryBook', 'index.tsx']]),
};

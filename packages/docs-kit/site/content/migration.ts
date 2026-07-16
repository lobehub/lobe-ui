import compatibility from '../../../../compatibility.json';
import type {
  ApiMigrationConfig,
  ApiTarget,
  DocumentMigrationConfig,
  MigrationConfig,
} from '../../../../scripts/migrate-dumi-docs';
import { apiOverrides } from './apiOverrides';
import { reviewedCategoryOrder } from './navigation';

const finalDocument = (source: string): string => source.replace(/\.md$/, '.mdx');

const legacyNavBySection: Readonly<Record<string, string>> = {
  'Awesome': 'Awesome',
  'Base UI': 'Components',
  'Brand': 'Brand',
  'Chat': 'Chat',
  'Color': 'Colors',
  'Components': 'Components',
  'Hooks & Providers': 'Hooks & Providers',
  'Icons': 'Components',
  'Mdx': 'Mdx',
  'Mobile': 'Mobile',
  'StoryBook': 'StoryBook',
};

const documents: Record<string, DocumentMigrationConfig> = {};

const mergeDocument = (document: string, config: DocumentMigrationConfig): void => {
  documents[document] = { ...documents[document], ...config };
};

for (const document of compatibility.documents) {
  const source = finalDocument(document.source);
  if (!source.startsWith('src/') || source === 'src/Button/index.mdx') continue;
  const nav = legacyNavBySection[document.section];
  if (nav) mergeDocument(source, { nav });
}

const descriptions: Readonly<Record<string, string>> = {
  'src/Accordion/index.mdx':
    'A vertically stacked set of interactive headings whose items reveal titled content with controlled or uncontrolled expansion.',
  'src/AutoComplete/index.mdx':
    'Provides a dropdown of suggestions as the user types, extending Ant Design AutoComplete with additional styling options.',
  'src/Block/index.mdx':
    'A flexible container that extends Flexbox with variants, shadows, and glass effects.',
  'src/Burger/index.mdx':
    'A responsive navigation control that opens a drawer of menu items from a hamburger button.',
  'src/CodeEditor/index.mdx':
    'Edits code with syntax highlighting for multiple programming languages.',
  'src/Collapse/index.mdx':
    'An expandable content container that extends Ant Design Collapse with additional styling, icons, and header descriptions.',
  'src/ColorSwatches/index.mdx':
    'Displays selectable color swatches with an optional picker for custom colors.',
  'src/ConfigProvider/index.mdx':
    'Configures library-wide CDN resource resolution and the motion runtime for descendant components.',
  'src/Freeze/index.mdx':
    'Prevents DOM updates in descendant content through React Suspense, primarily to keep exit animations visually stable.',
  'src/List/index.mdx':
    'Renders selectable list items with titles, descriptions, avatars, actions, pin and loading states, and active-key handling.',
  'src/Segmented/index.mdx':
    'A deprecated styled wrapper around Ant Design Segmented with filled, outlined, or borderless variants and optional shadow, glass, and padding controls.',
  'src/awesome/BottomGradientButton/index.mdx':
    'A round filled button with a subtle gold bottom-edge gradient that appears on hover.',
  'src/brand/LobeChatText/index.mdx':
    'Renders the LobeChat wordmark as a current-color SVG with configurable size.',
  'src/brand/LobeHubText/index.mdx':
    'Renders the LobeHub wordmark as a current-color SVG with configurable size.',
  'src/brand/LogoFlat/index.mdx': 'Renders the full-color LobeHub logo mark from @lobehub/icons.',
  'src/brand/LogoMono/index.mdx': 'Renders the monochrome LobeHub logo mark from @lobehub/icons.',
  'src/icons/Cloudflare/index.mdx':
    'Re-exports the Cloudflare icon and avatar variants from @lobehub/icons.',
  'src/icons/Github/index.mdx':
    'Re-exports the GitHub icon and avatar variants from @lobehub/icons.',
  'src/icons/lucideExtra/index.mdx':
    'Exports the extended Lucide-compatible icon set for brands, pointer actions, agents, providers, and tree controls.',
  'src/mobile/ChatHeader/index.mdx':
    'Provides a mobile chat header with optional safe-area padding, back navigation, and left, center, and right content slots.',
  'src/mobile/SafeArea/index.mdx': 'Adds top or bottom spacing for mobile safe-area insets.',
  'src/mobile/TabBar/index.mdx':
    'Renders a controlled or uncontrolled mobile tab bar with active-state render functions and optional bottom safe-area padding.',
};

const compoundIconNames = [
  'Auth0',
  'Authelia',
  'Authentik',
  'Casdoor',
  'Clerk',
  'DingTalk',
  'Discord',
  'GoogleChat',
  'IMessage',
  'Lark',
  'Line',
  'Logto',
  'MicrosoftEntra',
  'MicrosoftTeams',
  'NextAuth',
  'QQ',
  'Slack',
  'Telegram',
  'WeChat',
  'WhatsApp',
  'Zitadel',
] as const;

for (const name of compoundIconNames) {
  mergeDocument(`src/icons/${name}/index.mdx`, {
    description: `Provides the ${name} monochrome icon and avatar variant, together with title and primary-color metadata.`,
  });
}
for (const [document, description] of Object.entries(descriptions)) {
  mergeDocument(document, { description });
}

const omissionReasons: Readonly<Record<string, string>> = {
  'src/EditorSlashMenu/index.mdx':
    'The legacy page intentionally has no API section; preserve that reviewed scope during the mechanical migration.',
  'src/base-ui/FloatingPanel/index.mdx':
    'The frozen page documents behavior through demos and notes and has no legacy API section; preserve that reviewed omission during migration.',
  'src/base-ui/FloatingSheet/index.mdx':
    'The frozen page documents behavior through demos and has no legacy API section; preserve that reviewed omission during migration.',
  'src/base-ui/Switch/index.mdx':
    'The frozen page documents behavior through demos and has no legacy API section; preserve that reviewed omission during migration.',
  'src/brand/LobeChatText/index.mdx':
    'Example-only visual brand asset page has no legacy API section; preserve the omission.',
  'src/brand/LobeHubText/index.mdx':
    'Example-only visual brand asset page has no legacy API section; preserve the omission.',
  'src/brand/LogoFlat/index.mdx':
    'Example-only visual brand asset page has no legacy API section; preserve the omission.',
  'src/brand/LogoMono/index.mdx':
    'Example-only visual brand asset page has no legacy API section; preserve the omission.',
  'src/color/ColorScales/index.mdx':
    'Visual token catalog documents exported scales through examples and intentionally has no legacy API section.',
  'src/color/CssVar/index.mdx':
    'Visual token catalog documents exported scales through examples and intentionally has no legacy API section.',
  'src/icons/lucideExtra/index.mdx':
    'The exported icon catalog has no single component props surface; preserve its reviewed API omission.',
};

const omittedIconNames = [...compoundIconNames, 'Cloudflare', 'Github'] as const;
for (const name of omittedIconNames) {
  mergeDocument(`src/icons/${name}/index.mdx`, {
    deliberateApiOmission: {
      reason:
        'Compound icon and avatar page is visual example documentation with no legacy API section; preserve the reviewed omission.',
    },
  });
}
for (const [document, reason] of Object.entries(omissionReasons)) {
  mergeDocument(document, { deliberateApiOmission: { reason } });
}

for (const [document, apiHeader] of Object.entries(apiOverrides)) {
  mergeDocument(document, {
    apiHeader,
    reviewedApiHeaderOverride: true,
    ...(document.startsWith('src/base-ui/') ? { subType: 'base-ui' } : {}),
  });
}

const atomIds: Readonly<Record<string, string>> = {
  'src/mdx/Callout/index.mdx': 'Callout',
  'src/mdx/Cards/index.mdx': 'Cards, Card',
  'src/mdx/FileTree/index.mdx': 'File, FileTree, Folder',
  'src/mdx/Mdx/index.mdx': 'Mdx',
  'src/mdx/Steps/index.mdx': 'Steps',
  'src/mdx/Tabs/index.mdx': 'Tabs, Tab',
  'src/mdx/mdxComponents/index.mdx': 'mdxComponents',
};
for (const [document, atomId] of Object.entries(atomIds)) mergeDocument(document, { atomId });

mergeDocument('src/ActionIcon/index.mdx', {
  categoryOrder: reviewedCategoryOrder.General,
});
mergeDocument('src/Checkbox/index.mdx', {
  categoryOrder: reviewedCategoryOrder.General,
});
for (const document of ['src/color/ColorScales/index.mdx', 'src/color/CssVar/index.mdx']) {
  mergeDocument(document, { category: 'General' });
}
mergeDocument('docs/index.mdx', {
  hero: {
    description: 'Lobe UI is an open-source UI component library for building AIGC web apps',
    title: 'LobeHub UI Kit',
  },
});

const headedApiDocuments = [
  'src/ActionIcon/index.mdx',
  'src/ActionIconGroup/index.mdx',
  'src/Alert/index.mdx',
  'src/Avatar/index.mdx',
  'src/Checkbox/index.mdx',
  'src/CodeDiff/index.mdx',
  'src/ConfigProvider/index.mdx',
  'src/CopyButton/index.mdx',
  'src/DownloadButton/index.mdx',
  'src/Drawer/index.mdx',
  'src/Dropdown/index.mdx',
  'src/Empty/index.mdx',
  'src/FluentEmoji/index.mdx',
  'src/Form/index.mdx',
  'src/FormModal/index.mdx',
  'src/Grid/index.mdx',
  'src/GroupAvatar/index.mdx',
  'src/Highlighter/index.mdx',
  'src/Hotkey/index.mdx',
  'src/HotkeyInput/index.mdx',
  'src/Icon/index.mdx',
  'src/Image/index.mdx',
  'src/ImageSelect/index.mdx',
  'src/Input/index.mdx',
  'src/Layout/index.mdx',
  'src/Modal/index.mdx',
  'src/MotionProvider/index.mdx',
  'src/ScrollArea/index.mdx',
  'src/Select/index.mdx',
  'src/Skeleton/index.mdx',
  'src/Tag/index.mdx',
  'src/Text/index.mdx',
  'src/ThemeProvider/index.mdx',
  'src/awesome/Features/index.mdx',
  'src/awesome/GridBackground/index.mdx',
  'src/base-ui/Modal/index.mdx',
  'src/base-ui/Popover/index.mdx',
  'src/base-ui/ScrollArea/index.mdx',
  'src/base-ui/Segmented/index.mdx',
  'src/base-ui/Select/index.mdx',
  'src/base-ui/Tabs/index.mdx',
  'src/base-ui/Tooltip/index.mdx',
  'src/chat/ChatHeader/index.mdx',
  'src/chat/ChatInputArea/index.mdx',
  'src/chat/ChatList/index.mdx',
] as const;

const unheadedApiDocuments = [
  'src/AutoComplete/index.mdx',
  'src/Block/index.mdx',
  'src/Burger/index.mdx',
  'src/CodeEditor/index.mdx',
  'src/Collapse/index.mdx',
  'src/ColorSwatches/index.mdx',
  'src/DatePicker/index.mdx',
  'src/DraggablePanel/index.mdx',
  'src/DraggableSideNav/index.mdx',
  'src/EditableText/index.mdx',
  'src/EmojiPicker/index.mdx',
  'src/FileTypeIcon/index.mdx',
  'src/FontLoader/index.mdx',
  'src/Footer/index.mdx',
  'src/Freeze/index.mdx',
  'src/GuideCard/index.mdx',
  'src/Header/index.mdx',
  'src/HtmlPreview/index.mdx',
  'src/Markdown/index.mdx',
  'src/MaskShadow/index.mdx',
  'src/MaterialFileTypeIcon/index.mdx',
  'src/Menu/index.mdx',
  'src/Mermaid/index.mdx',
  'src/NeuralNetworkLoading/index.mdx',
  'src/ScrollShadow/index.mdx',
  'src/SearchBar/index.mdx',
  'src/SideNav/index.mdx',
  'src/SliderWithInput/index.mdx',
  'src/Snippet/index.mdx',
  'src/SortableList/index.mdx',
  'src/ThemeSwitch/index.mdx',
  'src/Toc/index.mdx',
  'src/Video/index.mdx',
  'src/awesome/AuroraBackground/index.mdx',
  'src/awesome/Giscus/index.mdx',
  'src/awesome/GradientButton/index.mdx',
  'src/awesome/Hero/index.mdx',
  'src/awesome/Spotlight/index.mdx',
  'src/awesome/SpotlightCard/index.mdx',
  'src/awesome/TypewriterEffect/index.mdx',
  'src/base-ui/Button/index.mdx',
  'src/brand/BrandLoading/index.mdx',
  'src/brand/LobeChat/index.mdx',
  'src/brand/LobeHub/index.mdx',
  'src/brand/Logo3d/index.mdx',
  'src/brand/LogoThree/index.mdx',
  'src/chat/BackBottom/index.mdx',
  'src/chat/ChatItem/index.mdx',
  'src/chat/EditableMessage/index.mdx',
  'src/chat/EditableMessageList/index.mdx',
  'src/chat/MessageInput/index.mdx',
  'src/chat/MessageModal/index.mdx',
  'src/mdx/Callout/index.mdx',
  'src/mdx/Mdx/index.mdx',
  'src/mdx/Steps/index.mdx',
] as const;

const publicPackageFrom = (document: string): string | undefined =>
  /^src\/(?:awesome|base-ui|brand|chat|mdx|mobile|storybook)\//.test(document) ? '..' : undefined;

const componentName = (document: string): string => document.split('/').at(-2) as string;

const targetFor = (document: string, name = componentName(document)): ApiTarget => {
  const from = publicPackageFrom(document);
  return { ...(from ? { from } : {}), name };
};

const emptyPreservedApiBodySha = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const apiBodyShas: Readonly<Partial<Record<string, string>>> = {
  'src/Accordion/index.mdx': 'c03e853e09aa5f01938194ff76999206685ae967285f9ea3033016f075f97e76',
  'src/ActionIcon/index.mdx': 'cb2b6e132f959a3e832f51adedf493a4439ceb3ac8971cfec7215449c3b4dfbe',
  'src/ActionIconGroup/index.mdx':
    '3f470af28bb636aec3f1f6b3a813f3230441f03e10f516dd7c6b5e13445cca98',
  'src/Alert/index.mdx': '207c855c2dce5635e445eb52d44ad5b6d533320e0e81ec4146cf6e48c19bfc38',
  'src/AutoComplete/index.mdx': '2446f1cc3379a5cabee5255a7e701629491868b6b96c14555720734d0c71d664',
  'src/Avatar/index.mdx': '42bc9579ba6f5477725ecf90ccac8a0ee64b31421422256fe21cb12fdc02d447',
  'src/Block/index.mdx': '37c270c6737b29902032a0de99e3951bf319ea17d76ffd5a1838771b0a37f5a3',
  'src/Burger/index.mdx': emptyPreservedApiBodySha,
  'src/Checkbox/index.mdx': '043481af6196bb450e2db811ca1674002dda132ecaab62146b2be6eec60e3b11',
  'src/CodeDiff/index.mdx': 'a706506c999155fb3f16d88d6bcc521c9ef48d9fd243f71d6810712956e53bdc',
  'src/CodeEditor/index.mdx': '8144a17b37a368ba74c7f32dc2cc3d41c538752d8f09cd835e8717f036f7f349',
  'src/Collapse/index.mdx': '0184587cd1a29f28e881a5850094481adad95955f4b17f08378f45acde062c70',
  'src/ColorSwatches/index.mdx': '567074ec081aa57b4637e3ef72f300031b46ec90878d82ed3e94d2d64a58ed86',
  'src/ConfigProvider/index.mdx':
    'b11543288f5950c2c0186ae89425bcf4a634b02e04bc422466b36c4b24ac2236',
  'src/CopyButton/index.mdx': 'dc7115ed89b9749c7f129cabb62a188ff4849bcbc40a6673321553a018f13aca',
  'src/DatePicker/index.mdx': 'd6e5b368d4c37be82862a640ac58970deec4b3bb549b614932dade8338d92ac9',
  'src/DownloadButton/index.mdx':
    'e77394d4c454a9912832b63ba99c5ea2b0ec5496e0d536f60b6a3a75c8e5e508',
  'src/DraggablePanel/index.mdx': emptyPreservedApiBodySha,
  'src/DraggableSideNav/index.mdx': emptyPreservedApiBodySha,
  'src/Drawer/index.mdx': '0e301a8c84a4e31b60066d13feaf3280a59d2d8d311e694408f5b654fd15aefb',
  'src/Dropdown/index.mdx': '541145d1990b4681364276e6cf6a48d613c400b549a3f923e801f3b5f2ef26c3',
  'src/DropdownMenu/index.mdx': '272f980bd25014fee18ed40c1d4f3a49a8b0b9c230b146d0f28fb1d69b388c27',
  'src/EditableText/index.mdx': emptyPreservedApiBodySha,
  'src/EmojiPicker/index.mdx': '60d65133fc3e94af571fcce0f5a4947063edb0dac8b3755b1bc4de52ed2f0061',
  'src/Empty/index.mdx': '579732d89e630d9c70661653c4c10b5f1e3cdf0eecd8ec151a5860937ecce387',
  'src/FileTypeIcon/index.mdx': emptyPreservedApiBodySha,
  'src/Flex/index.mdx': 'c0963a582216650021e370c3c5987ac9b2f8f66334f99a21624e0fb9e63f621e',
  'src/FluentEmoji/index.mdx': '2233263f118079796cb67f9137b54182d471885727a463922c2ec230ded67cf2',
  'src/FontLoader/index.mdx': emptyPreservedApiBodySha,
  'src/Footer/index.mdx': '3644fea8888c17db5213d67f825319a647cbd9fef99ba58bd5fd0d551fa4dc55',
  'src/Form/index.mdx': 'f924987bcb7d4d3bdc34f8422a7558604e16c9e77c831056cb52e3066083c366',
  'src/FormModal/index.mdx': 'cb1beae3269387fb3c284793934427c232addf34af27544468ecb903864422b5',
  'src/Freeze/index.mdx': '04ba9fa256fd361bca6a0de4b9a6713bead6125b5c37c7808c50380c8264516d',
  'src/Grid/index.mdx': '1f41d96a7f8e75ec493b64adb3b900c838c97050c536244287d7fa50fc1ff73a',
  'src/GroupAvatar/index.mdx': 'e676c55d8896244471cffb263e01a27874a6ac3ad90f2f42c11ad8c730f487fd',
  'src/GuideCard/index.mdx': '3644fea8888c17db5213d67f825319a647cbd9fef99ba58bd5fd0d551fa4dc55',
  'src/Header/index.mdx': '3644fea8888c17db5213d67f825319a647cbd9fef99ba58bd5fd0d551fa4dc55',
  'src/Highlighter/index.mdx': 'dff9dae7d78e0d107cea3128c3a30cecb1bcb53d667ea4a3022b22c28cf2ce4b',
  'src/Hotkey/index.mdx': '6c24c8588eb5fbdae6b3aa70b4f13987c62e78dfde22c2c861cfd669a3686de6',
  'src/HotkeyInput/index.mdx': 'fee816ae126740ac952fd0067c9020e326e51afee0474178e5c23a8b96e11538',
  'src/HtmlPreview/index.mdx': emptyPreservedApiBodySha,
  'src/Icon/index.mdx': '1765423b17ca76a736bc41c97a75932fba634d4187577e990b8cbf3c13873c1d',
  'src/Image/index.mdx': '8818088bc09241e17d2db346854d752ac4c100bc1f0955000b04612f2b2cf314',
  'src/ImageSelect/index.mdx': 'bf4ce36289b07584db9e9e05152babc22d61f6ea4010954d4cdfb2e88e4013b4',
  'src/Input/index.mdx': 'c61908b891573db9f8d369444d9984008a16d653d6d3c164076f8bb9bd2717cd',
  'src/Layout/index.mdx': '50c8111069c920569774dfb7b1839cf310858b8b26dda43749ac40eac6a11ceb',
  'src/Markdown/index.mdx': emptyPreservedApiBodySha,
  'src/MaskShadow/index.mdx': emptyPreservedApiBodySha,
  'src/MaterialFileTypeIcon/index.mdx': emptyPreservedApiBodySha,
  'src/Menu/index.mdx': '02161b97939ee7b5b8396ebd7a5fbbf93e0b04d5530f8a09fbea0fd64c8533f6',
  'src/Mermaid/index.mdx': emptyPreservedApiBodySha,
  'src/Modal/index.mdx': 'f7b78735af9a13a77d148ee28dad141ceccad3dc42862c997e89b6c9b111e3bc',
  'src/MotionProvider/index.mdx':
    '8ade5914ddea05a79a2f19e132737d29a0e79ff7ebb7152b1aaa858d0cafb795',
  'src/NeuralNetworkLoading/index.mdx': emptyPreservedApiBodySha,
  'src/ScrollArea/index.mdx': '22a22ed5a3f3dbbefa0c353543d8bdfd82b6dcbc2c9bfd2ba21d57b9fda82fe9',
  'src/ScrollShadow/index.mdx': emptyPreservedApiBodySha,
  'src/SearchBar/index.mdx': emptyPreservedApiBodySha,
  'src/Select/index.mdx': '6d04bcbc54918cf4ee348001935b400faf4ca7776dc0a2bff9b19ccb4204fc8a',
  'src/SideNav/index.mdx': emptyPreservedApiBodySha,
  'src/Skeleton/index.mdx': '4d2f0d11ce8563c56dbee8e6e408db77e20f493625e2f34a81baf4a62ca0af33',
  'src/SliderWithInput/index.mdx': emptyPreservedApiBodySha,
  'src/Snippet/index.mdx': emptyPreservedApiBodySha,
  'src/SortableList/index.mdx': '8860ed7817fbec5488f02135f5032de428ed44089f919c8b8031c72dc2ad60cb',
  'src/Tabs/index.mdx': '058afdae61acea53cecea41f2bb32eee2270616dcc84afcd19076b05b11f0fb1',
  'src/Tag/index.mdx': '5d320821cbd0c4d0bd5a575c358fb21e59b40a2a81703e5300151a5ec82c748d',
  'src/Text/index.mdx': 'ed263523cfcabf4e6dc815ac1ba44107868755c66d298dc09c63139ebc23e01e',
  'src/ThemeProvider/index.mdx': '5f905ed041385fba6da75dc1883dc70324c436428c575a3216b47fd1514abba7',
  'src/ThemeSwitch/index.mdx': emptyPreservedApiBodySha,
  'src/Toc/index.mdx': 'a4db68449f4d04d0590f180a06078ec30e0bde155e6a4433df9d10475fdb0b56',
  'src/Video/index.mdx': emptyPreservedApiBodySha,
  'src/awesome/AuroraBackground/index.mdx':
    'fe38dd4335bac72dd3e45b8aa96a5d7789d73015a4677ef5bbca796b584945b2',
  'src/awesome/Features/index.mdx':
    '0af8d08c0c2b09f07c869fe49f8f9242b655496bf5e1cc032c2f578ea7e48dba',
  'src/awesome/Giscus/index.mdx':
    'd4f4f244b5754de8b3e9ffbea274557c622cbd9f18a412585970a74ed084b0ed',
  'src/awesome/GradientButton/index.mdx':
    'bc7596fb0527352844a45fafd5521654605b965db05b3a7d6fdc97ace222840c',
  'src/awesome/GridBackground/index.mdx':
    '587fe4e242ca9c805ec99829e2c3f87f6aeff3823a0e0b39eb825e29548c754d',
  'src/awesome/Hero/index.mdx': 'f06bf95a69e80a66a2c0fa944347fe49a22f44f5266fda1570e2da552fd11bd4',
  'src/awesome/Spotlight/index.mdx':
    '1bf37ea610c6931df9ab6d54bb1d43da5387547163d6af68d8f0ad53ef710d48',
  'src/awesome/SpotlightCard/index.mdx':
    '283a16f5186e8b6e56bfaf64715c019a2be39fc16ea92dfbde5414680d24aa6f',
  'src/awesome/TypewriterEffect/index.mdx': emptyPreservedApiBodySha,
  'src/base-ui/Button/index.mdx':
    'ccc99c3ffefa0d230d031950c8551288d8e24e609cdd33495f36437f33c0befd',
  'src/base-ui/DropdownMenu/index.mdx':
    '272f980bd25014fee18ed40c1d4f3a49a8b0b9c230b146d0f28fb1d69b388c27',
  'src/base-ui/Modal/index.mdx': '448b99ba860d5b6b9f331d827425c2d4ec3832547e4707b05693516c99074abc',
  'src/base-ui/Popover/index.mdx':
    '4e337aa2a9e578cc1f30f2b589fd90c5e144143bf57ec488d5cd1283ec00a548',
  'src/base-ui/ScrollArea/index.mdx':
    '22a22ed5a3f3dbbefa0c353543d8bdfd82b6dcbc2c9bfd2ba21d57b9fda82fe9',
  'src/base-ui/Segmented/index.mdx':
    'f604c1fa39c9aab80e6aa50d456a683ec53aab8ac97937de42ea7ea29ac08f01',
  'src/base-ui/Select/index.mdx':
    '825cccfd8a453a7b319606868ff7b5159801723cb1b8766b9f1032337a1a1f05',
  'src/base-ui/Tabs/index.mdx': '884ca2c185f3bb9e1ac97701fd650290b850aeb4d226dfab870d207f1e7b3573',
  'src/base-ui/Tooltip/index.mdx':
    '6dac6922d19f3617726fb7ad96bdcec34edc29cb799b7838b49a406387a22f46',
  'src/brand/BrandLoading/index.mdx': emptyPreservedApiBodySha,
  'src/brand/LobeChat/index.mdx': emptyPreservedApiBodySha,
  'src/brand/LobeHub/index.mdx': emptyPreservedApiBodySha,
  'src/brand/Logo3d/index.mdx': 'bc0a41dea0de06c7126565e2166daf0e66b1375dcb3d2c346601ca310a882344',
  'src/brand/LogoThree/index.mdx':
    'dc85a5537b57a346e561ef5f2e800dea433822e1d22f69ff1cc3df75293f09c3',
  'src/chat/BackBottom/index.mdx': emptyPreservedApiBodySha,
  'src/chat/ChatHeader/index.mdx':
    '0d81b2f3a1e6d8e4dc30390c850cdd564526483aeda1e9541b128ad3f600affb',
  'src/chat/ChatInputArea/index.mdx':
    'b6ddcc86639cb9a15bf8e32fbfcdc5eccb5a23636a0d497cbbbdd34aa842e1be',
  'src/chat/ChatItem/index.mdx': emptyPreservedApiBodySha,
  'src/chat/ChatList/index.mdx': 'edf80c3b8144f95ec803a1875d3c18372625c304f58c3e6f0e503ea1cdaa01e0',
  'src/chat/EditableMessage/index.mdx': emptyPreservedApiBodySha,
  'src/chat/EditableMessageList/index.mdx':
    'c2a422eb28d5902e06bb072132232e1cd975f0d276a3a8f202adff484c19426a',
  'src/chat/MessageInput/index.mdx': emptyPreservedApiBodySha,
  'src/chat/MessageModal/index.mdx': emptyPreservedApiBodySha,
  'src/mdx/Callout/index.mdx': 'daf5ccad9700135c82e536ebfc707b1cc3f2e2991744321f482fa13caca41250',
  'src/mdx/Cards/index.mdx': 'a115b30d3ce949e9694e806946baaf08a5528cd5e5c92297536b87380c6d5a68',
  'src/mdx/FileTree/index.mdx': '710c9a49d64ce77611b22c25c090fc0094c2350ee6e7aefa485917638a108118',
  'src/mdx/Mdx/index.mdx': '0dbfa41779d4992a492d3dd81c5333e569592db8447c8b1d4a2af2fe2e3af0ce',
  'src/mdx/Steps/index.mdx': 'c1014317709c8c4eb5809a2d82868574c496afcd9e32207dc5d5c4a2b399c809',
  'src/mdx/Tabs/index.mdx': 'c3378eb68ab4a06c29778a206a42f740dc308210ed3deebcf66b1b16d820a35e',
};

const replaceTables = (
  document: string,
  config: Omit<ApiMigrationConfig, 'bodySha' | 'disposition'>,
): void => {
  mergeDocument(document, {
    api: {
      bodySha: apiBodyShas[document] ?? 'pending',
      disposition: 'replace-tables',
      ...config,
    },
  });
};

for (const document of headedApiDocuments) {
  const name = componentName(document);
  replaceTables(document, {
    tableSelectors: [{ headingPath: [name] }],
    targets: [targetFor(document)],
  });
}
for (const document of unheadedApiDocuments) {
  replaceTables(document, {
    tableSelectors: [{ unheadedOccurrence: 0 }],
    targets: [targetFor(document)],
  });
}

const explicitReplaceTablePlans: Readonly<
  Record<string, Pick<ApiMigrationConfig, 'tableSelectors' | 'targets'>>
> = {
  'src/Accordion/index.mdx': {
    tableSelectors: [{ headingPath: ['Accordion Props'] }],
    targets: [{ name: 'Accordion' }],
  },
  'src/DropdownMenu/index.mdx': {
    tableSelectors: [{ headingPath: ['DropdownMenuV2'] }],
    targets: [{ name: 'DropdownMenu' }],
  },
  'src/Flex/index.mdx': {
    tableSelectors: [{ headingPath: ['Flexbox'] }],
    targets: [{ name: 'Flexbox' }],
  },
  'src/Tabs/index.mdx': {
    tableSelectors: [{ headingPath: ['Tabs'], occurrence: 0 }],
    targets: [{ name: 'Tabs' }],
  },
  'src/base-ui/DropdownMenu/index.mdx': {
    tableSelectors: [{ headingPath: ['DropdownMenuV2'] }],
    targets: [{ from: '..', name: 'DropdownMenu' }],
  },
  'src/mdx/Cards/index.mdx': {
    tableSelectors: [{ headingPath: ['Cards'] }, { headingPath: ['Card'] }],
    targets: [
      { from: '..', name: 'Cards' },
      { from: '..', name: 'Card' },
    ],
  },
  'src/mdx/FileTree/index.mdx': {
    tableSelectors: [
      { headingPath: ['File'] },
      { headingPath: ['FileTree'] },
      { headingPath: ['Folder'] },
    ],
    targets: [
      { from: '..', name: 'File' },
      { from: '..', name: 'FileTree' },
      { from: '..', name: 'Folder' },
    ],
  },
  'src/mdx/Tabs/index.mdx': {
    tableSelectors: [{ headingPath: ['Tabs'] }, { headingPath: ['Tab'] }],
    targets: [
      { from: '..', name: 'Tabs' },
      { from: '..', name: 'Tab' },
    ],
  },
};
for (const [document, plan] of Object.entries(explicitReplaceTablePlans)) {
  replaceTables(document, plan);
}

const emptyApiBodySha = '01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b';
const replaceAllDocuments = [
  'src/List/index.mdx',
  'src/Segmented/index.mdx',
  'src/awesome/BottomGradientButton/index.mdx',
  'src/chat/LoadingDots/index.mdx',
  'src/chat/TokenTag/index.mdx',
  'src/mobile/ChatHeader/index.mdx',
  'src/mobile/ChatInputArea/index.mdx',
  'src/mobile/SafeArea/index.mdx',
  'src/mobile/TabBar/index.mdx',
  'src/storybook/StoryBook/index.mdx',
] as const;
for (const document of replaceAllDocuments) {
  mergeDocument(document, {
    api: {
      bodySha: emptyApiBodySha,
      disposition: 'replace-all',
      reason:
        'The frozen API section is empty; replace it with the reviewed generated public component contract.',
      targets: [targetFor(document)],
    },
  });
}

const preserveAllPlans: Readonly<Record<string, ApiMigrationConfig>> = {
  'src/ContextMenu/index.mdx': {
    bodySha: '4c07a03a3303ba3e485c150aeb3e8f965b6c241b98484ea3e5f33286d3fe0900',
    disposition: 'preserve-all',
    reason:
      'The section documents imperative functions and option types that the component props extractor cannot represent without changing semantics.',
  },
  'src/base-ui/ContextMenu/index.mdx': {
    bodySha: '4c07a03a3303ba3e485c150aeb3e8f965b6c241b98484ea3e5f33286d3fe0900',
    disposition: 'preserve-all',
    reason:
      'The section documents imperative functions and option types that the component props extractor cannot represent without changing semantics.',
  },
  'src/base-ui/Toast/index.mdx': {
    bodySha: 'd61f71268e519a56462f4e494809f5bcd93e22b7169d2babc338f11a93475ca0',
    disposition: 'preserve-all',
    reason:
      'The section documents the imperative toast API and its supporting types, not one callable component props surface.',
    targets: [{ from: '..', name: 'ToastHost' }],
  },
  'src/i18n/index.mdx': {
    bodySha: '13698e6dfd913b313da5b79235bd3dc6c87ee9ade59e07ec335435c204575987',
    disposition: 'preserve-all',
    reason:
      'The section combines provider, hook, resource types, and translation keys that must remain as one authored reference.',
    targets: [{ name: 'I18nProvider' }],
  },
  'src/mdx/mdxComponents/index.mdx': {
    bodySha: '6a6006ae7105bc659474b13e8768dbc6f39d41be4bf553d94d9c4eab788ca412',
    disposition: 'preserve-all',
    reason:
      'mdxComponents is a non-callable component map; preserve the authored component inventory rather than generating a props table.',
  },
};
for (const [document, api] of Object.entries(preserveAllPlans)) mergeDocument(document, { api });

const migration = {
  acknowledgedStandaloneOnly: ['docs-demo-docs'],
  documents,
  frozenInventory: {
    apiSourceOverrides: 79,
    componentApiDecisions: 158,
    demoReferences: 514,
    documents: 160,
    initiallyMissingDescriptions: 43,
    isolatedDemos: 35,
    legacyManualApiSections: 67,
  },
} satisfies MigrationConfig;

export { migration };

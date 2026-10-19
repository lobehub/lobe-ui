import { Smile } from 'lucide-react';

import {
  AgentSkillCard,
  AuroraBackground,
  BentoCard,
  BentoGrid,
  BottomGradientButton,
  CodeShowcase,
  FeatureGrid,
  Features,
  FluidGradient,
  Giscus,
  GradientButton,
  Grainient,
  GridBackground,
  GridShowcase,
  Hero,
  InstallBanner,
  LandingHero,
  LandingSection,
  LogoMarquee,
  Spotlight,
  SpotlightCard,
  TypewriterEffect,
} from '@/awesome';
import { awesomeAgentSkillCardClasses } from '@/awesome/AgentSkillCard/stable';
import { awesomeAuroraBackgroundClasses } from '@/awesome/AuroraBackground/stable';
import { awesomeBentoCardClasses, awesomeBentoGridClasses } from '@/awesome/BentoGrid/stable';
import { awesomeBottomGradientButtonClasses } from '@/awesome/BottomGradientButton/stable';
import { awesomeCodeShowcaseClasses } from '@/awesome/CodeShowcase/stable';
import { awesomeFeatureGridClasses } from '@/awesome/FeatureGrid/stable';
import { awesomeFeaturesClasses } from '@/awesome/Features/stable';
import { awesomeFluidGradientClasses } from '@/awesome/FluidGradient/stable';
import { awesomeGiscusClasses } from '@/awesome/Giscus/stable';
import { awesomeGradientButtonClasses } from '@/awesome/GradientButton/stable';
import { awesomeGrainientClasses } from '@/awesome/Grainient/stable';
import {
  awesomeGridBackgroundClasses,
  awesomeGridShowcaseClasses,
} from '@/awesome/GridBackground/stable';
import { awesomeHeroClasses } from '@/awesome/Hero/stable';
import { awesomeInstallBannerClasses } from '@/awesome/InstallBanner/stable';
import { awesomeLandingHeroClasses } from '@/awesome/LandingHero/stable';
import { awesomeLandingSectionClasses } from '@/awesome/LandingSection/stable';
import { awesomeLogoMarqueeClasses } from '@/awesome/LogoMarquee/stable';
import { awesomeSpotlightClasses } from '@/awesome/Spotlight/stable';
import { awesomeSpotlightCardClasses } from '@/awesome/SpotlightCard/stable';
import { awesomeTypewriterEffectClasses } from '@/awesome/TypewriterEffect/stable';
import { BrandLoading, LobeChat, LobeChatText, LobeHub, LobeHubText, Logo3d } from '@/brand';
import { brandBrandLoadingClasses } from '@/brand/BrandLoading/stable';
import { brandLobeChatClasses } from '@/brand/LobeChat/stable';
import { brandLobeChatTextClasses } from '@/brand/LobeChatText/stable';
import { brandLobeHubClasses } from '@/brand/LobeHub/stable';
import { brandLobeHubTextClasses } from '@/brand/LobeHubText/stable';
import { brandLogo3dClasses } from '@/brand/Logo3d/stable';
import {
  BackBottom,
  ChatActionsBar,
  ChatHeader,
  ChatHeaderTitle,
  ChatInputActionBar,
  ChatInputArea,
  ChatItem,
  ChatList,
  ChatSendButton,
  EditableMessage,
  EditableMessageList,
  LoadingDots,
  MessageInput,
  MessageModal,
  TokenTag,
} from '@/chat';
import { chatBackBottomClasses } from '@/chat/BackBottom/stable';
import { chatChatHeaderClasses } from '@/chat/ChatHeader/stable';
import {
  chatChatInputActionBarClasses,
  chatChatInputAreaClasses,
  chatChatSendButtonClasses,
} from '@/chat/ChatInputArea/stable';
import { chatChatItemClasses } from '@/chat/ChatItem/stable';
import { chatChatActionsBarClasses, chatChatListClasses } from '@/chat/ChatList/stable';
import { chatEditableMessageClasses } from '@/chat/EditableMessage/stable';
import { chatEditableMessageListClasses } from '@/chat/EditableMessageList/stable';
import { chatLoadingDotsClasses } from '@/chat/LoadingDots/stable';
import { chatMessageInputClasses } from '@/chat/MessageInput/stable';
import { chatMessageModalClasses } from '@/chat/MessageModal/stable';
import { chatTokenTagClasses } from '@/chat/TokenTag/stable';
import { blue, ColorScales, CssVar } from '@/color';
import { colorScalesClasses } from '@/color/ColorScales/stable';
import { cssVarClasses } from '@/color/CssVar/stable';
import {
  AuthLayout,
  AuthLayoutAside,
  AuthLocaleSwitch,
  AuthThemeSwitch,
  Breadcrumb,
  ChartGrid,
  ConsoleBrand,
  ConsoleFooterSkeleton,
  ConsoleNav,
  ConsoleNavSkeleton,
  ConsoleShell,
  FilterOption,
  FilterRow,
  FilterSidebar,
  FilterStrip,
  LabelWithKey,
  LoadingAnnouncer,
  MetricStrip,
  PageHeader,
  PageHeaderSkeleton,
  PageLoading,
  PageTabs,
  PageToolbar,
  PanelSurface,
  RouteProgress,
  Section,
  StatCard,
  StatCardSkeleton,
  Surface,
  TableIconAction,
  TableIconActions,
  TableSkeleton,
  TitleWithTips,
} from '@/dashboard';
import { dashboardAuthLayoutClasses } from '@/dashboard/AuthLayout/stable';
import {
  dashboardAuthLocaleSwitchClasses,
  dashboardAuthThemeSwitchClasses,
} from '@/dashboard/AuthTools/stable';
import { dashboardBreadcrumbClasses } from '@/dashboard/Breadcrumb/stable';
import { dashboardChartGridClasses } from '@/dashboard/ChartGrid/stable';
import {
  dashboardConsoleFooterSkeletonClasses,
  dashboardConsoleNavClasses,
  dashboardConsoleNavSkeletonClasses,
} from '@/dashboard/ConsoleNav/stable';
import {
  dashboardConsoleBrandClasses,
  dashboardConsoleShellClasses,
} from '@/dashboard/ConsoleShell/stable';
import {
  dashboardFilterOptionClasses,
  dashboardFilterRowClasses,
  dashboardFilterSidebarClasses,
} from '@/dashboard/FilterSidebar/stable';
import { dashboardFilterStripClasses } from '@/dashboard/FilterStrip/stable';
import { dashboardLabelWithKeyClasses } from '@/dashboard/LabelWithKey/stable';
import { dashboardMetricStripClasses } from '@/dashboard/MetricStrip/stable';
import { dashboardPageHeaderClasses } from '@/dashboard/PageHeader/stable';
import {
  dashboardLoadingAnnouncerClasses,
  dashboardPageHeaderSkeletonClasses,
  dashboardPageLoadingClasses,
  dashboardStatCardSkeletonClasses,
  dashboardTableSkeletonClasses,
} from '@/dashboard/PageSkeleton/stable';
import { dashboardPageTabsClasses } from '@/dashboard/PageTabs/stable';
import { dashboardPageToolbarClasses } from '@/dashboard/PageToolbar/stable';
import { dashboardPanelSurfaceClasses } from '@/dashboard/PanelSurface/stable';
import { dashboardRouteProgressClasses } from '@/dashboard/RouteProgress/stable';
import { dashboardSectionClasses } from '@/dashboard/Section/stable';
import { dashboardStatCardClasses } from '@/dashboard/StatCard/stable';
import { dashboardSurfaceClasses } from '@/dashboard/Surface/stable';
import {
  dashboardTableIconActionClasses,
  dashboardTableIconActionsClasses,
} from '@/dashboard/TableIconActions/stable';
import { dashboardTitleWithTipsClasses } from '@/dashboard/TitleWithTips/stable';
import {
  Callout,
  Card,
  Cards,
  File,
  FileTree,
  Folder,
  Image,
  Link,
  Mdx,
  Pre,
  PreSingleLine,
  Steps,
  Tab,
  Tabs,
  Video,
} from '@/mdx';
import { mdxCalloutClasses } from '@/mdx/Callout/stable';
import { mdxCardsClasses } from '@/mdx/Cards/stable';
import { mdxFileTreeClasses } from '@/mdx/FileTree/stable';
import { mdxMdxClasses } from '@/mdx/Mdx/stable';
import {
  mdxImageClasses,
  mdxLinkClasses,
  mdxPreClasses,
  mdxPreSingleLineClasses,
  mdxVideoClasses,
} from '@/mdx/mdxComponents/stable';
import { mdxStepsClasses } from '@/mdx/Steps/stable';
import { mdxTabsClasses } from '@/mdx/Tabs/stable';
import {
  ChatHeader as MobileChatHeader,
  ChatHeaderTitle as MobileChatHeaderTitle,
  ChatInputArea as MobileChatInputArea,
  ChatSendButton as MobileChatSendButton,
  SafeArea,
  TabBar,
} from '@/mobile';
import { mobileChatHeaderClasses } from '@/mobile/ChatHeader/stable';
import {
  mobileChatInputAreaClasses,
  mobileChatSendButtonClasses,
} from '@/mobile/ChatInputArea/stable';
import { mobileSafeAreaClasses } from '@/mobile/SafeArea/stable';
import { mobileTabBarClasses } from '@/mobile/TabBar/stable';

import type { StableFixture } from './stableClasses.fixtures';

const AVATAR = { avatar: '😎', title: 'Bot' };

const METRIC = {
  action: 'Menu',
  chart: 'Chart',
  delta: '+1',
  hint: 'Hint',
  label: 'Users',
  mark: Smile,
  value: '42',
  valueTone: 'warning' as const,
};

const NAV_GROUPS = [
  {
    icon: Smile,
    items: [{ badge: 1, href: '/a', icon: Smile, label: 'Alpha' }],
    key: 'g',
    label: 'Group',
    groups: [{ items: [{ href: '/b', label: 'Beta' }], key: 'n', label: 'Nested' }],
  },
];

export const SUBPATH_FIXTURES: Record<string, StableFixture> = {
  'awesome/AgentSkillCard': {
    classes: awesomeAgentSkillCardClasses,
    render: ({ className }) => (
      <AgentSkillCard
        agent={{ code: 'npx skills add', description: 'Desc' }}
        agents={[{ avatar: '🤖', title: 'Agent' }]}
        className={className}
        footer="Footer"
        human={{ code: 'npm i' }}
      />
    ),
  },
  'awesome/AuroraBackground': {
    classes: awesomeAuroraBackgroundClasses,
    render: ({ className }) => <AuroraBackground className={className}>Hi</AuroraBackground>,
  },
  'awesome/BentoCard': {
    classes: awesomeBentoCardClasses,
    render: ({ className }) => (
      <BentoCard className={className} hint="Hint" title="Title">
        Body
      </BentoCard>
    ),
  },
  'awesome/BentoGrid': {
    classes: awesomeBentoGridClasses,
    render: ({ className }) => <BentoGrid className={className} />,
  },
  'awesome/BottomGradientButton': {
    classes: awesomeBottomGradientButtonClasses,
    render: ({ className }) => (
      <BottomGradientButton className={className}>Go</BottomGradientButton>
    ),
  },
  'awesome/CodeShowcase': {
    classes: awesomeCodeShowcaseClasses,
    render: ({ className }) => (
      <CodeShowcase
        className={className}
        items={[
          { code: 'a', key: 'a', label: 'A', preview: 'A' },
          { code: 'b', key: 'b', label: 'B', preview: 'B' },
        ]}
      />
    ),
  },
  'awesome/FeatureGrid': {
    classes: awesomeFeatureGridClasses,
    render: ({ className }) => (
      <FeatureGrid
        className={className}
        items={[{ description: 'Desc', icon: Smile, title: 'Title' }]}
      />
    ),
  },
  'awesome/Features': {
    classes: awesomeFeaturesClasses,
    render: ({ className }) => (
      <Features
        className={className}
        items={[{ description: 'Desc', icon: Smile, link: '/a', title: 'Title' }]}
      />
    ),
  },
  'awesome/FluidGradient': {
    classes: awesomeFluidGradientClasses,
    render: ({ className }) => <FluidGradient className={className} />,
  },
  'awesome/Giscus': {
    classes: awesomeGiscusClasses,
    render: ({ className }) => (
      <Giscus
        category="General"
        categoryId="c"
        className={className}
        mapping="title"
        repo="lobehub/lobe-ui"
        repoId="r"
      />
    ),
  },
  'awesome/GradientButton': {
    classes: awesomeGradientButtonClasses,
    render: ({ className }) => <GradientButton className={className}>Go</GradientButton>,
  },
  'awesome/Grainient': {
    classes: awesomeGrainientClasses,
    conditional: ['canvas'],
    render: ({ className }) => <Grainient className={className} />,
  },
  'awesome/GridBackground': {
    classes: awesomeGridBackgroundClasses,
    render: ({ className }) => (
      <GridBackground animation flip showBackground className={className} />
    ),
  },
  'awesome/GridShowcase': {
    classes: awesomeGridShowcaseClasses,
    render: ({ className }) => <GridShowcase className={className}>Content</GridShowcase>,
  },
  'awesome/Hero': {
    blockQuery: true,
    classes: awesomeHeroClasses,
    render: ({ className }) => (
      <Hero
        actions={[{ link: '/a', text: 'Go', type: 'primary' }]}
        className={className}
        description="Desc"
        title="Title"
      />
    ),
  },
  'awesome/InstallBanner': {
    classes: awesomeInstallBannerClasses,
    render: ({ className }) => (
      <InstallBanner className={className} command="npm i" footnote="Note" title="Install" />
    ),
  },
  'awesome/LandingHero': {
    classes: awesomeLandingHeroClasses,
    render: ({ className }) => (
      <LandingHero
        accent="Accent"
        actions={[{ href: '/a', label: 'Go' }]}
        aside="Aside"
        badge="Badge"
        className={className}
        description="Desc"
        title="Title"
      >
        Extra
      </LandingHero>
    ),
  },
  'awesome/LandingSection': {
    classes: awesomeLandingSectionClasses,
    render: ({ className }) => (
      <LandingSection
        className={className}
        description="Desc"
        extra="Extra"
        eyebrow="Eyebrow"
        title="Title"
      >
        Body
      </LandingSection>
    ),
  },
  'awesome/LogoMarquee': {
    classes: awesomeLogoMarqueeClasses,
    render: ({ className }) => (
      <LogoMarquee
        caption="Caption"
        className={className}
        items={[{ icon: '⭐', label: 'Star' }]}
      />
    ),
  },
  'awesome/Spotlight': {
    classes: awesomeSpotlightClasses,
    render: ({ className }) => <Spotlight className={className} />,
  },
  'awesome/SpotlightCard': {
    classes: awesomeSpotlightCardClasses,
    render: ({ className }) => (
      <SpotlightCard
        className={className}
        items={[{ title: 'A' }]}
        renderItem={(item: { title: string }) => <span>{item.title}</span>}
      />
    ),
  },
  'awesome/TypewriterEffect': {
    classes: awesomeTypewriterEffectClasses,
    conditional: ['char'],
    render: ({ className }) => <TypewriterEffect className={className} sentences={['Hello']} />,
  },
  'brand/BrandLoading': {
    classes: brandBrandLoadingClasses,
    render: ({ className }) => <BrandLoading className={className} text={LobeHubText} />,
  },
  'brand/LobeChat': {
    classes: brandLobeChatClasses,
    render: ({ className }) => <LobeChat className={className} extra="UI" type="combine" />,
  },
  'brand/LobeChatText': {
    classes: brandLobeChatTextClasses,
    render: ({ className }) => <LobeChatText className={className} />,
  },
  'brand/LobeHub': {
    classes: brandLobeHubClasses,
    render: ({ className }) => <LobeHub className={className} extra="UI" type="combine" />,
  },
  'brand/LobeHubText': {
    classes: brandLobeHubTextClasses,
    render: ({ className }) => <LobeHubText className={className} />,
  },
  'brand/Logo3d': {
    classes: brandLogo3dClasses,
    render: ({ className }) => <Logo3d className={className} />,
  },
  'chat/BackBottom': {
    classes: chatBackBottomClasses,
    render: ({ className }) => <BackBottom className={className} target={{ current: null }} />,
  },
  'chat/ChatActionsBar': {
    classes: chatChatActionsBarClasses,
    render: ({ className }) => <ChatActionsBar className={className} />,
  },
  'chat/ChatHeader': {
    classes: chatChatHeaderClasses,
    render: ({ className }) => (
      <ChatHeader
        showBackButton
        className={className}
        left={<ChatHeaderTitle desc="Desc" tag="Tag" title="Title" />}
        right="Right"
      >
        Center
      </ChatHeader>
    ),
  },
  'chat/ChatInputActionBar': {
    classes: chatChatInputActionBarClasses,
    render: ({ className }) => (
      <ChatInputActionBar className={className} leftAddons="Left" rightAddons="Right" />
    ),
  },
  'chat/ChatInputArea': {
    classes: chatChatInputAreaClasses,
    render: ({ className }) => <ChatInputArea expand className={className} />,
  },
  'chat/ChatItem': {
    classes: chatChatItemClasses,
    conditional: ['avatar-group', 'loading', 'error', 'spacing'],
    render: ({ className }) => (
      <ChatItem
        actions="Actions"
        avatar={AVATAR}
        className={className}
        message="Hello"
        messageExtra="Extra"
        time={Date.now()}
      />
    ),
  },
  'chat/ChatList': {
    classes: chatChatListClasses,
    render: ({ className }) => (
      <ChatList
        enableHistoryCount
        className={className}
        historyCount={2}
        data={[
          { content: 'A', createAt: 1, id: 'a', meta: AVATAR, role: 'user', updateAt: 1 },
          { content: 'B', createAt: 2, id: 'b', meta: AVATAR, role: 'assistant', updateAt: 2 },
          { content: 'C', createAt: 3, id: 'c', meta: AVATAR, role: 'user', updateAt: 3 },
        ]}
      />
    ),
  },
  'chat/ChatSendButton': {
    classes: chatChatSendButtonClasses,
    conditional: ['stop'],
    render: ({ className }) => (
      <ChatSendButton className={className} leftAddons="Left" rightAddons="Right" />
    ),
  },
  'chat/EditableMessage': {
    classes: chatEditableMessageClasses,
    render: ({ className }) => <EditableMessage className={className} value="Hello" />,
  },
  'chat/EditableMessageList': {
    classes: chatEditableMessageListClasses,
    render: ({ className }) => (
      <EditableMessageList className={className} dataSources={[{ content: 'A', role: 'user' }]} />
    ),
  },
  'chat/LoadingDots': {
    classes: chatLoadingDotsClasses,
    conditional: ['orbit'],
    render: ({ className }) => <LoadingDots className={className} />,
  },
  'chat/MessageInput': {
    classes: chatMessageInputClasses,
    render: ({ className }) => <MessageInput className={className} defaultValue="Hello" />,
  },
  'chat/MessageModal': {
    classes: chatMessageModalClasses,
    portal: true,
    render: ({ className }) => <MessageModal editing open className={className} value="Hello" />,
  },
  'chat/TokenTag': {
    classes: chatTokenTagClasses,
    render: ({ className }) => <TokenTag className={className} maxValue={100} value={50} />,
  },
  'color/ColorScales': {
    classes: colorScalesClasses,
    render: ({ className }) => (
      <ColorScales className={className} midHighLight={9} name="blue" scale={blue} />
    ),
  },
  'color/CssVar': {
    classes: cssVarClasses,
    render: ({ className }) => (
      <CssVar className={className} midHighLight={9} name="blue" scale={blue} />
    ),
  },
  'dashboard/AuthLayout': {
    classes: dashboardAuthLayoutClasses,
    conditional: ['backdrop', 'skeleton'],
    render: ({ className }) => (
      <AuthLayout
        alert="Alert"
        aside={<AuthLayoutAside background="Art" kicker="Kicker" line="Line" />}
        brand="Brand"
        className={className}
        description="Desc"
        footer="Footer"
        logo="Logo"
        title="Title"
        tools="Tools"
      >
        Form
      </AuthLayout>
    ),
  },
  'dashboard/AuthLocaleSwitch': {
    classes: dashboardAuthLocaleSwitchClasses,
    render: ({ className }) => (
      <AuthLocaleSwitch
        className={className}
        options={[{ label: 'English', value: 'en' }]}
        value="en"
      />
    ),
  },
  'dashboard/AuthThemeSwitch': {
    classes: dashboardAuthThemeSwitchClasses,
    render: ({ className }) => <AuthThemeSwitch className={className} />,
  },
  'dashboard/Breadcrumb': {
    classes: dashboardBreadcrumbClasses,
    render: ({ className }) => (
      <Breadcrumb
        className={className}
        items={[{ label: 'Home' }, { href: '/a', label: 'A' }, { label: 'B' }]}
      />
    ),
  },
  'dashboard/ChartGrid': {
    classNameTarget: 'grid',
    classes: dashboardChartGridClasses,
    render: ({ className }) => <ChartGrid className={className}>Chart</ChartGrid>,
  },
  'dashboard/ConsoleBrand': {
    classes: dashboardConsoleBrandClasses,
    render: ({ className }) => <ConsoleBrand className={className} logo="Logo" title="Lobe" />,
  },
  'dashboard/ConsoleFooterSkeleton': {
    classes: dashboardConsoleFooterSkeletonClasses,
    render: ({ className }) => <ConsoleFooterSkeleton className={className} />,
  },
  'dashboard/ConsoleNav': {
    classes: dashboardConsoleNavClasses,
    conditional: ['rail-link'],
    render: ({ className }) => (
      <ConsoleNav
        className={className}
        groups={NAV_GROUPS}
        items={[{ href: '/', label: 'Home' }]}
        pathname="/a"
      />
    ),
  },
  'dashboard/ConsoleNavSkeleton': {
    classes: dashboardConsoleNavSkeletonClasses,
    render: ({ className }) => <ConsoleNavSkeleton className={className} />,
  },
  'dashboard/ConsoleShell': {
    classes: dashboardConsoleShellClasses,
    conditional: ['brand-close'],
    render: ({ className }) => (
      <ConsoleShell
        brand="Brand"
        breadcrumb="Crumbs"
        className={className}
        footer="Footer"
        navigation="Nav"
        tools="Tools"
      >
        Body
      </ConsoleShell>
    ),
  },
  'dashboard/FilterOption': {
    classes: dashboardFilterOptionClasses,
    render: ({ className }) => (
      <FilterOption
        className={className}
        count={3}
        name="All"
        selected={false}
        onClick={() => {}}
      />
    ),
  },
  'dashboard/FilterRow': {
    classes: dashboardFilterRowClasses,
    render: ({ className }) => <FilterRow className={className} count={3} name="All" />,
  },
  'dashboard/FilterSidebar': {
    classes: dashboardFilterSidebarClasses,
    conditional: ['toggle', 'drawer-panel'],
    render: ({ className }) => (
      <FilterSidebar
        body={() => 'Body'}
        className={className}
        head={() => 'Head'}
        label="Filters"
        summary="Summary"
      >
        Content
      </FilterSidebar>
    ),
  },
  'dashboard/FilterStrip': {
    classes: dashboardFilterStripClasses,
    render: ({ className }) => (
      <FilterStrip
        className={className}
        items={[{ count: 1, key: 'a', label: 'A' }]}
        label="Filter"
        value="a"
        onChange={() => {}}
      />
    ),
  },
  'dashboard/LabelWithKey': {
    classes: dashboardLabelWithKeyClasses,
    render: ({ className }) => <LabelWithKey className={className} tag="key" title="Label" />,
  },
  'dashboard/LoadingAnnouncer': {
    classes: dashboardLoadingAnnouncerClasses,
    render: ({ className }) => <LoadingAnnouncer className={className} label="Loading" />,
  },
  'dashboard/MetricStrip': {
    classes: dashboardMetricStripClasses,
    conditional: ['card', 'skeleton'],
    render: ({ className }) => <MetricStrip className={className} items={[METRIC]} />,
  },
  'dashboard/PageHeader': {
    classes: dashboardPageHeaderClasses,
    render: ({ className }) => (
      <PageHeader action="Action" className={className} description="Desc" title="Title" />
    ),
  },
  'dashboard/PageHeaderSkeleton': {
    classes: dashboardPageHeaderSkeletonClasses,
    render: ({ className }) => <PageHeaderSkeleton className={className} />,
  },
  'dashboard/PageLoading': {
    classes: dashboardPageLoadingClasses,
    render: ({ className }) => <PageLoading className={className} />,
  },
  'dashboard/PageTabs': {
    classes: dashboardPageTabsClasses,
    render: ({ className }) => (
      <PageTabs
        className={className}
        label="Tabs"
        tabs={[{ content: 'Panel', count: 2, label: 'A', value: 'a' }]}
        value="a"
        onChange={() => {}}
      />
    ),
  },
  'dashboard/PageToolbar': {
    classes: dashboardPageToolbarClasses,
    render: ({ className }) => (
      <PageToolbar actions="Actions" className={className}>
        Filters
      </PageToolbar>
    ),
  },
  'dashboard/PanelSurface': {
    classes: dashboardPanelSurfaceClasses,
    conditional: ['loading'],
    render: ({ className }) => (
      <PanelSurface className={className} title="Title">
        Body
      </PanelSurface>
    ),
  },
  'dashboard/RouteProgress': {
    classes: dashboardRouteProgressClasses,
    render: ({ className }) => <RouteProgress loading className={className} />,
  },
  'dashboard/Section': {
    classes: dashboardSectionClasses,
    conditional: ['body'],
    render: ({ className }) => (
      <Section
        className={className}
        desc="Desc"
        extra="Extra"
        more="More"
        moreLink="/more"
        title="Title"
      >
        Body
      </Section>
    ),
  },
  'dashboard/StatCard': {
    classes: dashboardStatCardClasses,
    conditional: ['skeleton'],
    render: ({ className }) => <StatCard className={className} {...METRIC} />,
  },
  'dashboard/StatCardSkeleton': {
    classes: dashboardStatCardSkeletonClasses,
    render: ({ className }) => <StatCardSkeleton className={className} />,
  },
  'dashboard/Surface': {
    classes: dashboardSurfaceClasses,
    conditional: ['loading'],
    render: ({ className }) => (
      <Surface
        chart="Chart"
        className={className}
        description="Desc"
        extra="Extra"
        href="/a"
        title="Title"
      >
        Body
      </Surface>
    ),
  },
  'dashboard/TableIconAction': {
    classes: dashboardTableIconActionClasses,
    render: ({ className }) => <TableIconAction className={className} icon={Smile} label="Do" />,
  },
  'dashboard/TableIconActions': {
    classes: dashboardTableIconActionsClasses,
    render: ({ className }) => <TableIconActions className={className}>A</TableIconActions>,
  },
  'dashboard/TableSkeleton': {
    classes: dashboardTableSkeletonClasses,
    render: ({ className }) => <TableSkeleton className={className} leading="avatar" />,
  },
  'dashboard/TitleWithTips': {
    classes: dashboardTitleWithTipsClasses,
    render: ({ className }) => <TitleWithTips className={className} tips="Tips" title="Title" />,
  },
  'mdx/Callout': {
    classes: mdxCalloutClasses,
    render: ({ className }) => <Callout className={className}>Note</Callout>,
  },
  'mdx/Cards': {
    classes: mdxCardsClasses,
    conditional: ['icon'],
    render: ({ className }) => (
      <Cards className={className}>
        <Card desc="Desc" href="/a" image="/a.png" tag="New" title="Title" />
      </Cards>
    ),
  },
  'mdx/FileTree': {
    classes: mdxFileTreeClasses,
    render: ({ className }) => (
      <FileTree className={className}>
        <Folder defaultOpen name="src">
          <File name="index.ts" />
        </Folder>
      </FileTree>
    ),
  },
  'mdx/Image': {
    classes: mdxImageClasses,
    render: ({ className }) => <Image className={className} src="/a.png" />,
  },
  'mdx/Link': {
    classes: mdxLinkClasses,
    render: ({ className }) => (
      <Link className={className} href="/a">
        Link
      </Link>
    ),
  },
  'mdx/Mdx': {
    blockQuery: true,
    classes: mdxMdxClasses,
    render: ({ className }) => <Mdx className={className}>{'# Hello'}</Mdx>,
  },
  'mdx/Pre': {
    classes: mdxPreClasses,
    render: ({ className }) => (
      <Pre className={className} language="ts">
        const a = 1;
      </Pre>
    ),
  },
  'mdx/PreSingleLine': {
    classes: mdxPreSingleLineClasses,
    render: ({ className }) => <PreSingleLine className={className}>npm i</PreSingleLine>,
  },
  'mdx/Steps': {
    classes: mdxStepsClasses,
    render: ({ className }) => <Steps className={className}>Step</Steps>,
  },
  'mdx/Tabs': {
    classes: mdxTabsClasses,
    render: ({ className }) => (
      <Tabs className={className} items={['A', 'B']}>
        <Tab>A</Tab>
        <Tab>B</Tab>
      </Tabs>
    ),
  },
  'mdx/Video': {
    classes: mdxVideoClasses,
    render: ({ className }) => <Video className={className} src="/a.mp4" />,
  },
  'mobile/ChatHeader': {
    classes: mobileChatHeaderClasses,
    render: ({ className }) => (
      <MobileChatHeader
        showBackButton
        center={<MobileChatHeaderTitle desc="Desc" tag="Tag" title="Title" />}
        className={className}
        left="Left"
        right="Right"
      />
    ),
  },
  'mobile/ChatInputArea': {
    classes: mobileChatInputAreaClasses,
    conditional: ['expand-toggle'],
    render: ({ className }) => (
      <MobileChatInputArea
        expand
        bottomAddons="Bottom"
        className={className}
        textAreaLeftAddons="Left"
        topAddons="Top"
      />
    ),
  },
  'mobile/ChatSendButton': {
    classes: mobileChatSendButtonClasses,
    render: ({ className }) => <MobileChatSendButton className={className} />,
  },
  'mobile/SafeArea': {
    classes: mobileSafeAreaClasses,
    render: ({ className }) => <SafeArea className={className} position="top" />,
  },
  'mobile/TabBar': {
    classes: mobileTabBarClasses,
    render: ({ className }) => (
      <TabBar className={className} items={[{ icon: '⭐', key: 'a', title: 'A' }]} />
    ),
  },
};

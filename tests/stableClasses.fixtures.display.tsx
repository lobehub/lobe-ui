import { Smile } from 'lucide-react';

import { aClasses } from '@/A/stable';
import { accordionClasses } from '@/Accordion/stable';
import { alertClasses } from '@/Alert/stable';
import { anchorClasses } from '@/Anchor/stable';
import { avatarClasses, avatarGroupClasses } from '@/Avatar/stable';
import { badgeClasses } from '@/Badge/stable';
import { blockClasses } from '@/Block/stable';
import { breadcrumbClasses } from '@/Breadcrumb/stable';
import { carouselClasses } from '@/Carousel/stable';
import { collapsibleClasses } from '@/Collapsible/stable';
import { descriptionsClasses } from '@/Descriptions/stable';
import { dividerClasses } from '@/Divider/stable';
import { draggableSideNavClasses } from '@/DraggableSideNav/stable';
import { emptyClasses } from '@/Empty/stable';
import { fileTypeIconClasses } from '@/FileTypeIcon/stable';
import { centerClasses, flexClasses } from '@/Flex/stable';
import { fluentEmojiClasses } from '@/FluentEmoji/stable';
import { gridClasses } from '@/Grid/stable';
import { groupAvatarClasses } from '@/GroupAvatar/stable';
import { guideCardClasses } from '@/GuideCard/stable';
import { headerClasses } from '@/Header/stable';
import { iconClasses } from '@/Icon/stable';
import { imageClasses } from '@/Image/stable';
import {
  A,
  Accordion,
  Alert,
  Anchor,
  Avatar,
  AvatarGroup,
  Badge,
  Block,
  Breadcrumb,
  Carousel,
  Center,
  Collapsible,
  Descriptions,
  Divider,
  DraggableSideNav,
  Empty,
  FileTypeIcon,
  Flexbox,
  FluentEmoji,
  Grid,
  GroupAvatar,
  GuideCard,
  Header,
  Icon,
  Image,
  Layout,
  List,
  MaskShadow,
  MaterialFileTypeIcon,
  Pagination,
  Progress,
  ProgressiveBlur,
  QRCode,
  Result,
  ScrollArea,
  ScrollShadow,
  SideNav,
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  SortableList,
  Spin,
  Statistic,
  Steps,
  Tabs,
  Tag,
  Text,
  Video,
} from '@/index';
import { layoutClasses } from '@/Layout/stable';
import { listClasses } from '@/List/stable';
import { maskShadowClasses } from '@/MaskShadow/stable';
import { materialFileTypeIconClasses } from '@/MaterialFileTypeIcon/stable';
import { paginationClasses } from '@/Pagination/stable';
import { progressClasses } from '@/Progress/stable';
import { progressiveBlurClasses } from '@/ProgressiveBlur/stable';
import { qrCodeClasses } from '@/QRCode/stable';
import { resultClasses } from '@/Result/stable';
import { scrollAreaClasses } from '@/ScrollArea/stable';
import { scrollShadowClasses } from '@/ScrollShadow/stable';
import { sideNavClasses } from '@/SideNav/stable';
import { skeletonAvatarClasses, skeletonClasses, skeletonTextClasses } from '@/Skeleton/stable';
import { sortableListClasses } from '@/SortableList/stable';
import { spinClasses } from '@/Spin/stable';
import { statisticClasses } from '@/Statistic/stable';
import { stepsClasses } from '@/Steps/stable';
import { tabsClasses } from '@/Tabs/stable';
import { tagClasses } from '@/Tag/stable';
import { textClasses } from '@/Text/stable';
import { videoClasses } from '@/Video/stable';

import type { StableFixture } from './stableClasses.fixtures';

const IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACw=';

export const DISPLAY_FIXTURES: Record<string, StableFixture> = {
  A: {
    classes: aClasses,
    render: ({ className }) => (
      <A className={className} href="#a">
        Link
      </A>
    ),
  },
  Accordion: {
    classes: accordionClasses,
    conditional: ['action'],
    render: ({ className }) => (
      <Accordion
        className={className}
        defaultValue={['a']}
        items={[{ children: 'Body', key: 'a', title: 'Title' }]}
      />
    ),
  },
  Alert: {
    classes: alertClasses,
    conditional: [
      'action',
      'close',
      'container',
      'extra',
      'extra-header',
      'extra-indicator',
      'extra-content',
    ],
    render: ({ className }) => (
      <Alert className={className} description="Description" title="Title" />
    ),
  },
  Anchor: {
    classes: anchorClasses,
    conditional: ['marker'],
    render: ({ className }) => (
      <Anchor className={className} items={[{ href: '#one', key: 'one', title: 'One' }]} />
    ),
  },
  Avatar: {
    classes: avatarClasses,
    conditional: ['loading', 'img'],
    render: ({ className }) => <Avatar avatar="AB" className={className} />,
  },
  AvatarGroup: {
    classes: avatarGroupClasses,
    render: ({ className }) => (
      <AvatarGroup
        className={className}
        max={1}
        items={[
          { avatar: 'A', key: 'a' },
          { avatar: 'B', key: 'b' },
        ]}
      />
    ),
  },
  Badge: {
    classes: badgeClasses,
    conditional: ['dot', 'text'],
    render: ({ className }) => (
      <Badge className={className} count={5}>
        <span>Inbox</span>
      </Badge>
    ),
  },
  Block: {
    classes: blockClasses,
    render: ({ className }) => <Block className={className}>Block</Block>,
  },
  Breadcrumb: {
    classes: breadcrumbClasses,
    render: ({ className }) => (
      <Breadcrumb
        className={className}
        items={[{ href: '#home', title: 'Home' }, { title: 'Page' }]}
      />
    ),
  },
  Carousel: {
    classes: carouselClasses,
    conditional: ['prev', 'next'],
    render: ({ className }) => (
      <Carousel className={className}>
        <div>One</div>
        <div>Two</div>
      </Carousel>
    ),
  },
  Center: {
    classes: centerClasses,
    render: ({ className }) => <Center className={className}>Center</Center>,
  },
  Collapsible: {
    classNameTarget: 'panel',
    classes: collapsibleClasses,
    render: ({ className }) => (
      <Collapsible open className={className}>
        Body
      </Collapsible>
    ),
  },
  Descriptions: {
    classes: descriptionsClasses,
    render: ({ className }) => (
      <Descriptions
        className={className}
        extra="Extra"
        items={[{ children: 'Value', label: 'Label' }]}
        title="Title"
      />
    ),
  },
  Divider: {
    classes: dividerClasses,
    render: ({ className }) => <Divider className={className}>Text</Divider>,
  },
  DraggableSideNav: {
    classNameTarget: 'container',
    classes: draggableSideNavClasses,
    conditional: ['toggle', 'handle', 'handle-icon', 'resize-handle'],
    render: ({ className }) => (
      <DraggableSideNav
        body={() => 'Body'}
        className={className}
        footer={() => 'Footer'}
        header={() => 'Header'}
      />
    ),
  },
  Empty: {
    classes: emptyClasses,
    render: ({ className }) => (
      <Empty
        action={<button type="button">Retry</button>}
        className={className}
        description="Description"
        icon={Smile}
        title="Title"
      />
    ),
  },
  FileTypeIcon: {
    classes: fileTypeIconClasses,
    conditional: ['icon', 'shape'],
    render: ({ className }) => <FileTypeIcon className={className} filetype="pdf" />,
  },
  Flexbox: {
    classes: flexClasses,
    render: ({ className }) => <Flexbox className={className}>Flex</Flexbox>,
  },
  FluentEmoji: {
    classes: fluentEmojiClasses,
    render: ({ className }) => <FluentEmoji className={className} emoji="😀" type="raw" />,
  },
  Grid: {
    classes: gridClasses,
    render: ({ className }) => (
      <Grid className={className}>
        <div>One</div>
      </Grid>
    ),
  },
  GroupAvatar: {
    classes: groupAvatarClasses,
    render: ({ className }) => <GroupAvatar avatars={['A', 'B']} className={className} />,
  },
  GuideCard: {
    classes: guideCardClasses,
    render: ({ className }) => (
      <GuideCard closable className={className} cover={IMG} desc="Desc" title="Title" />
    ),
  },
  Header: {
    classes: headerClasses,
    render: ({ className }) => (
      <Header actions="Actions" className={className} logo="Logo" nav="Nav" />
    ),
  },
  Icon: {
    classes: iconClasses,
    render: ({ className }) => <Icon className={className} icon={Smile} />,
  },
  Image: {
    classes: imageClasses,
    conditional: ['actions'],
    render: ({ className }) => <Image alt="" className={className} src={IMG} />,
  },
  Layout: {
    classes: layoutClasses,
    conditional: ['sidebar', 'sidebar-inner', 'toc'],
    render: ({ className }) => (
      <Layout className={className} footer="Footer" header="Header">
        Content
      </Layout>
    ),
  },
  List: {
    classes: listClasses,
    render: ({ className }) => (
      <List
        className={className}
        items={[
          {
            actions: 'Actions',
            description: 'Description',
            extra: 'Extra',
            key: 'a',
            label: 'Label',
          },
          { type: 'divider' },
        ]}
      />
    ),
  },
  MaskShadow: {
    classes: maskShadowClasses,
    render: ({ className }) => <MaskShadow className={className}>Body</MaskShadow>,
  },
  MaterialFileTypeIcon: {
    classes: materialFileTypeIconClasses,
    render: ({ className }) => (
      <MaterialFileTypeIcon className={className} filename="index.ts" type="file" variant="file" />
    ),
  },
  Pagination: {
    classes: paginationClasses,
    conditional: ['simple-pager', 'go'],
    render: ({ className }) => (
      <Pagination
        showQuickJumper
        showSizeChanger
        className={className}
        showTotal={(total) => `${total} items`}
        total={500}
      />
    ),
  },
  Progress: {
    classes: progressClasses,
    conditional: ['segment', 'rest'],
    render: ({ className }) => <Progress className={className} label="Label" percent={40} />,
  },
  ProgressiveBlur: {
    classes: progressiveBlurClasses,
    render: ({ className }) => (
      <ProgressiveBlur className={className}>
        <div>Body</div>
      </ProgressiveBlur>
    ),
  },
  QRCode: {
    classes: qrCodeClasses,
    conditional: ['title', 'refresh'],
    render: ({ className }) => (
      <QRCode className={className} icon={<span>Q</span>} status="loading" value="lobe" />
    ),
  },
  Result: {
    classes: resultClasses,
    render: ({ className }) => (
      <Result className={className} extra="Extra" subTitle="Sub" title="Title" />
    ),
  },
  ScrollArea: {
    classes: scrollAreaClasses,
    conditional: ['scrollbar', 'thumb', 'corner'],
    render: ({ className }) => (
      <ScrollArea corner className={className}>
        Body
      </ScrollArea>
    ),
  },
  ScrollShadow: {
    classes: scrollShadowClasses,
    render: ({ className }) => <ScrollShadow className={className}>Body</ScrollShadow>,
  },
  SideNav: {
    classes: sideNavClasses,
    render: ({ className }) => (
      <SideNav avatar="A" bottomActions="Bottom" className={className} topActions="Top" />
    ),
  },
  Skeleton: {
    classes: skeletonClasses,
    render: ({ className }) => <Skeleton className={className} />,
  },
  SkeletonAvatar: {
    classes: skeletonAvatarClasses,
    render: ({ className }) => <SkeletonAvatar className={className} />,
  },
  SkeletonText: {
    classes: skeletonTextClasses,
    render: ({ className }) => <SkeletonText className={className} rows={2} />,
  },
  SortableList: {
    classes: sortableListClasses,
    render: ({ className }) => (
      <SortableList
        className={className}
        items={[{ id: 'a' }]}
        renderItem={(item) => (
          <SortableList.Item id={item.id}>
            <SortableList.DragHandle />
            {item.id}
          </SortableList.Item>
        )}
        onChange={() => {}}
      />
    ),
  },
  Spin: {
    classes: spinClasses,
    render: ({ className }) => (
      <Spin className={className} tip="Loading">
        <div>Body</div>
      </Spin>
    ),
  },
  Statistic: {
    classes: statisticClasses,
    conditional: ['skeleton'],
    render: ({ className }) => (
      <Statistic className={className} prefix="$" suffix="k" title="Title" value={12} />
    ),
  },
  Steps: {
    classes: stepsClasses,
    render: ({ className }) => (
      <Steps
        className={className}
        current={0}
        items={[{ description: 'Desc', title: 'One' }, { title: 'Two' }]}
      />
    ),
  },
  Tabs: {
    classes: tabsClasses,
    render: ({ className }) => (
      <Tabs className={className} items={[{ children: 'Body', key: 'a', label: 'A' }]} />
    ),
  },
  Tag: {
    classes: tagClasses,
    render: ({ className }) => (
      <Tag closable className={className}>
        Tag
      </Tag>
    ),
  },
  Text: {
    classes: textClasses,
    render: ({ className }) => <Text className={className}>Text</Text>,
  },
  Video: {
    classes: videoClasses,
    conditional: [
      'caption',
      'center-play',
      'frame-number',
      'segment',
      'marker',
      'load-error',
      'section-list',
      'section',
    ],
    render: ({ className }) => <Video className={className} src="clip.mp4" />,
  },
};

import { Copy, Menu as MenuIcon } from 'lucide-react';
import type { ReactElement } from 'react';

import { actionIconClasses } from '@/ActionIcon/stable';
import { actionIconGroupClasses } from '@/ActionIconGroup/stable';
import { autoCompleteClasses } from '@/AutoComplete/stable';
import { burgerClasses } from '@/Burger/stable';
import { buttonClasses, splitButtonClasses } from '@/Button/stable';
import { checkboxClasses, checkboxGroupClasses } from '@/Checkbox/stable';
import { colorPickerClasses } from '@/ColorPicker/stable';
import { colorSwatchesClasses } from '@/ColorSwatches/stable';
import { copyButtonClasses } from '@/CopyButton/stable';
import { datePickerClasses, dateRangePickerClasses } from '@/DatePicker/stable';
import { downloadButtonClasses } from '@/DownloadButton/stable';
import { draggablePanelClasses } from '@/DraggablePanel/stable';
import { editableTextClasses } from '@/EditableText/stable';
import { hotkeyClasses } from '@/Hotkey/stable';
import { hotkeyInputClasses } from '@/HotkeyInput/stable';
import { imageSelectClasses } from '@/ImageSelect/stable';
import {
  ActionIcon,
  ActionIconGroup,
  AutoComplete,
  Burger,
  Button,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  ColorSwatches,
  CopyButton,
  DatePicker,
  DateRangePicker,
  DayjsDatePicker,
  DayjsDateRangePicker,
  DownloadButton,
  DraggablePanel,
  EditableText,
  Hotkey,
  HotkeyInput,
  ImageSelect,
  Input,
  InputNumber,
  InputOTP,
  InputPassword,
  Popover,
  Radio,
  RadioGroup,
  Rate,
  SearchBar,
  Segmented,
  Select,
  Slider,
  SliderWithInput,
  SplitButton,
  Switch,
  TextArea,
  ToggleGroup,
  Tree,
  Upload,
  UploadDragger,
} from '@/index';
import {
  inputClasses,
  inputNumberClasses,
  inputOTPClasses,
  inputPasswordClasses,
  textAreaClasses,
} from '@/Input/stable';
import { popoverClasses } from '@/Popover/stable';
import { radioClasses, radioGroupClasses } from '@/Radio/stable';
import { rateClasses } from '@/Rate/stable';
import { searchBarClasses } from '@/SearchBar/stable';
import { segmentedClasses } from '@/Segmented/stable';
import { selectClasses } from '@/Select/stable';
import { sliderClasses, sliderWithInputClasses } from '@/Slider/stable';
import { switchClasses } from '@/Switch/stable';
import { toggleGroupClasses } from '@/ToggleGroup/stable';
import { treeClasses } from '@/Tree/stable';
import { uploadClasses, uploadDraggerClasses } from '@/Upload/stable';
import type { AnyStableClasses } from '@/utils/bem';

import { DISPLAY_FIXTURES } from './stableClasses.fixtures.display';

export interface StableFixture {
  classes: AnyStableClasses;
  classNameTarget?: string;
  conditional?: readonly string[];
  portal?: boolean;
  render: (props: { className?: string }) => ReactElement;
}

export const FIXTURES: Record<string, StableFixture> = {
  ...DISPLAY_FIXTURES,
  Checkbox: {
    classes: checkboxClasses,
    render: ({ className }) => (
      <Checkbox defaultChecked className={className}>
        Label
      </Checkbox>
    ),
  },
  CheckboxGroup: {
    classes: checkboxGroupClasses,
    render: ({ className }) => <CheckboxGroup className={className} options={['a', 'b']} />,
  },
  ColorPicker: {
    classes: colorPickerClasses,
    conditional: [
      'text',
      'caret',
      'popup',
      'panel',
      'controls',
      'eye-dropper',
      'sliders',
      'compare',
    ],
    render: ({ className }) => <ColorPicker className={className} defaultValue="#ff0000" />,
  },
  ColorSwatches: {
    classes: colorSwatchesClasses,
    render: ({ className }) => (
      <ColorSwatches
        enableColorPicker
        className={className}
        colors={[{ color: '#f00', title: 'Red' }]}
        defaultValue="#f00"
      />
    ),
  },
  DatePicker: {
    classes: datePickerClasses,
    conditional: ['prefix', 'container', 'header', 'body', 'content', 'item', 'footer', 'popup'],
    render: ({ className }) => <DatePicker className={className} />,
  },
  DateRangePicker: {
    classes: dateRangePickerClasses,
    conditional: ['prefix', 'container', 'header', 'body', 'content', 'item', 'footer', 'popup'],
    render: ({ className }) => <DateRangePicker className={className} />,
  },
  DayjsDatePicker: {
    classes: datePickerClasses,
    conditional: ['prefix', 'container', 'header', 'body', 'content', 'item', 'footer', 'popup'],
    render: ({ className }) => <DayjsDatePicker className={className} />,
  },
  DayjsDateRangePicker: {
    classes: dateRangePickerClasses,
    conditional: ['prefix', 'container', 'header', 'body', 'content', 'item', 'footer', 'popup'],
    render: ({ className }) => <DayjsDateRangePicker className={className} />,
  },
  ImageSelect: {
    classes: imageSelectClasses,
    render: ({ className }) => (
      <ImageSelect className={className} options={[{ img: 'data:,', label: 'A', value: 'a' }]} />
    ),
  },
  Radio: {
    classes: radioClasses,
    conditional: ['indicator'],
    render: ({ className }) => (
      <Radio className={className} value="a">
        Label
      </Radio>
    ),
  },
  RadioGroup: {
    classes: radioGroupClasses,
    render: ({ className }) => <RadioGroup className={className} options={['a', 'b']} />,
  },
  Rate: {
    classes: rateClasses,
    render: ({ className }) => <Rate className={className} defaultValue={2.5} />,
  },
  Segmented: {
    classes: segmentedClasses,
    render: ({ className }) => (
      <Segmented
        className={className}
        options={[
          { icon: <span />, label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ]}
      />
    ),
  },
  Select: {
    classes: selectClasses,
    conditional: [
      'prefix',
      'search',
      'clear',
      'group',
      'group-label',
      'empty',
      'scroll-up-arrow',
      'scroll-down-arrow',
      'arrow',
      'item-indicator',
    ],
    render: ({ className }) => (
      <Select open className={className} options={[{ label: 'A', value: 'a' }]} />
    ),
  },
  Slider: {
    classes: sliderClasses,
    render: ({ className }) => <Slider className={className} defaultValue={20} />,
  },
  SliderWithInput: {
    classes: sliderWithInputClasses,
    render: ({ className }) => <SliderWithInput className={className} defaultValue={20} />,
  },
  ToggleGroup: {
    classes: toggleGroupClasses,
    render: ({ className }) => (
      <ToggleGroup className={className} options={[{ icon: <span />, label: 'A', value: 'a' }]} />
    ),
  },
  Tree: {
    classes: treeClasses,
    conditional: ['guide', 'checkbox', 'icon', 'panel'],
    render: ({ className }) => <Tree className={className} treeData={[{ key: 'a', title: 'A' }]} />,
  },
  Upload: {
    classes: uploadClasses,
    conditional: ['icon', 'title', 'description'],
    render: ({ className }) => <Upload className={className}>Upload</Upload>,
  },
  UploadDragger: {
    classes: uploadDraggerClasses,
    render: ({ className }) => <UploadDragger className={className} />,
  },
  AutoComplete: {
    classes: autoCompleteClasses,
    conditional: ['empty'],
    portal: false,
    render: ({ className }) => (
      <AutoComplete
        allowClear
        defaultOpen
        className={className}
        defaultValue="a"
        options={[{ value: 'apple' }]}
        prefix="P"
        suffix="S"
      />
    ),
  },
  EditableText: {
    classes: editableTextClasses,
    conditional: ['input'],
    render: ({ className }) => <EditableText className={className} value="Text" />,
  },
  Hotkey: {
    classes: hotkeyClasses,
    render: ({ className }) => <Hotkey className={className} keys="mod+k" />,
  },
  HotkeyInput: {
    classes: hotkeyInputClasses,
    conditional: ['placeholder', 'error'],
    render: ({ className }) => (
      <HotkeyInput allowClear allowReset className={className} resetValue="mod+j" value="mod+k" />
    ),
  },
  Input: {
    classes: inputClasses,
    render: ({ className }) => (
      <Input allowClear className={className} defaultValue="a" prefix="P" suffix="S" />
    ),
  },
  InputNumber: {
    classes: inputNumberClasses,
    render: ({ className }) => <InputNumber className={className} prefix="P" suffix="S" />,
  },
  InputOTP: {
    classes: inputOTPClasses,
    render: ({ className }) => <InputOTP className={className} length={4} />,
  },
  InputPassword: {
    classes: inputPasswordClasses,
    render: ({ className }) => <InputPassword className={className} />,
  },
  SearchBar: {
    classes: searchBarClasses,
    render: ({ className }) => <SearchBar enableShortKey className={className} />,
  },
  TextArea: {
    classes: textAreaClasses,
    render: ({ className }) => (
      <TextArea allowClear showCount className={className} defaultValue="a" />
    ),
  },
  ActionIcon: {
    classes: actionIconClasses,
    render: ({ className }) => <ActionIcon className={className} icon={Copy} />,
  },
  ActionIconGroup: {
    classes: actionIconGroupClasses,
    render: ({ className }) => (
      <ActionIconGroup
        className={className}
        items={[{ icon: Copy, key: 'copy', label: 'Copy' }]}
        menu={[{ key: 'more', label: 'More' }]}
      />
    ),
  },
  Burger: {
    classes: burgerClasses,
    conditional: ['header', 'footer'],
    render: ({ className }) => (
      <Burger
        className={className}
        items={[{ icon: MenuIcon, key: 'a', label: 'A' }]}
        opened={false}
        onOpenChange={() => {}}
      />
    ),
  },
  Button: {
    classes: buttonClasses,
    render: ({ className }) => (
      <Button className={className} icon={Copy}>
        Button
      </Button>
    ),
  },
  CopyButton: {
    classes: copyButtonClasses,
    render: ({ className }) => <CopyButton className={className} content="text" />,
  },
  DownloadButton: {
    classes: downloadButtonClasses,
    render: ({ className }) => (
      <DownloadButton blobUrl="data:text/plain,a" className={className} fileName="a.txt" />
    ),
  },
  SplitButton: {
    classes: splitButtonClasses,
    render: ({ className }) => (
      <SplitButton className={className}>
        <SplitButton.Main>Main</SplitButton.Main>
        <SplitButton.Menu items={[{ key: 'a', label: 'A' }]} />
      </SplitButton>
    ),
  },
  DraggablePanel: {
    classes: draggablePanelClasses,
    conditional: ['container', 'header', 'body', 'footer'],
    render: ({ className }) => (
      <DraggablePanel className={className} placement="left">
        Panel
      </DraggablePanel>
    ),
  },
  Popover: {
    classes: popoverClasses,
    conditional: ['arrow', 'backdrop'],
    portal: true,
    render: ({ className }) => (
      <Popover open className={className} content="Content">
        <button type="button">Trigger</button>
      </Popover>
    ),
  },
  Switch: {
    classes: switchClasses,
    render: ({ className }) => (
      <Switch checkedChildren="On" className={className} unCheckedChildren="Off" />
    ),
  },
};

export const EXEMPT: Record<string, string> = {
  'AccordionHeader': 'atom of Accordion',
  'AccordionItem': 'atom of Accordion',
  'AccordionPanel': 'atom of Accordion',
  'AccordionRoot': 'atom of Accordion',
  'AccordionTrigger': 'atom of Accordion',
  'ConfigProvider': 'no DOM',
  'I18nProvider': 'no DOM',
  'PreviewGroup': 'no DOM',
  'ContextMenuHost': 'no DOM',
  'DraggablePanelBody': 'atom of DraggablePanel',
  'DraggablePanelContainer': 'atom of DraggablePanel',
  'DraggablePanelContent': 'atom of DraggablePanel',
  'DraggablePanelFooter': 'atom of DraggablePanel',
  'DraggablePanelHandle': 'atom of DraggablePanel',
  'DraggablePanelHeader': 'atom of DraggablePanel',
  'DraggablePanelRoot': 'atom of DraggablePanel',
  'DraggablePanelToggle': 'atom of DraggablePanel',
  'DrawerBackdrop': 'atom of Drawer',
  'DrawerClose': 'atom of Drawer',
  'DrawerContent': 'atom of Drawer',
  'DrawerDescription': 'atom of Drawer',
  'DrawerFooter': 'atom of Drawer',
  'DrawerHeader': 'atom of Drawer',
  'DrawerPopup': 'atom of Drawer',
  'DrawerPortal': 'atom of Drawer',
  'DrawerRoot': 'atom of Drawer',
  'DrawerTitle': 'atom of Drawer',
  'DrawerTrigger': 'atom of Drawer',
  'DropdownMenuCheckboxItemIndicator': 'atom of DropdownMenu',
  'DropdownMenuCheckboxItemPrimitive': 'atom of DropdownMenu',
  'DropdownMenuFooter': 'atom of DropdownMenu',
  'DropdownMenuGroup': 'atom of DropdownMenu',
  'DropdownMenuGroupLabel': 'atom of DropdownMenu',
  'DropdownMenuHeader': 'atom of DropdownMenu',
  'DropdownMenuItem': 'atom of DropdownMenu',
  'DropdownMenuItemContent': 'atom of DropdownMenu',
  'DropdownMenuItemDesc': 'atom of DropdownMenu',
  'DropdownMenuItemExtra': 'atom of DropdownMenu',
  'DropdownMenuItemIcon': 'atom of DropdownMenu',
  'DropdownMenuItemLabel': 'atom of DropdownMenu',
  'DropdownMenuItemLabelGroup': 'atom of DropdownMenu',
  'DropdownMenuPopup': 'atom of DropdownMenu',
  'DropdownMenuPortal': 'atom of DropdownMenu',
  'DropdownMenuPositioner': 'atom of DropdownMenu',
  'DropdownMenuRoot': 'atom of DropdownMenu',
  'DropdownMenuScrollViewport': 'atom of DropdownMenu',
  'DropdownMenuSeparator': 'atom of DropdownMenu',
  'DropdownMenuSubmenuArrow': 'atom of DropdownMenu',
  'DropdownMenuSubmenuRoot': 'atom of DropdownMenu',
  'DropdownMenuSubmenuTrigger': 'atom of DropdownMenu',
  'DropdownMenuSwitchItem': 'atom of DropdownMenu',
  'DropdownMenuTrigger': 'atom of DropdownMenu',
  'ErrorBoundary': 'no DOM',
  'FlexBasic': 'atom of Flexbox',
  'FocusScope': 'no DOM',
  'FontLoader': 'no DOM',
  'Freeze': 'no DOM',
  'IconProvider': 'no DOM',
  'KeyMapEnum': 'not a component',
  'LayoutFooter': 'atom of Layout',
  'LayoutHeader': 'atom of Layout',
  'LayoutMain': 'atom of Layout',
  'LayoutSidebar': 'atom of Layout',
  'LayoutSidebarInner': 'atom of Layout',
  'LayoutToc': 'atom of Layout',
  'LobeThemeScript': 'no DOM',
  'LobeUIProvider': 'no DOM',
  'ModalBackdrop': 'atom of Modal',
  'ModalClose': 'atom of Modal',
  'ModalContent': 'atom of Modal',
  'ModalContext': 'no DOM',
  'ModalDescription': 'atom of Modal',
  'ModalFooter': 'atom of Modal',
  'ModalHeader': 'atom of Modal',
  'ModalHost': 'no DOM',
  'ModalPopup': 'atom of Modal',
  'ModalPortal': 'atom of Modal',
  'ModalRoot': 'atom of Modal',
  'ModalTitle': 'atom of Modal',
  'ModalTrigger': 'atom of Modal',
  'ModalViewport': 'atom of Modal',
  'MotionComponent': 're-export of motion',
  'MotionProvider': 'no DOM',
  'PopoverArrow': 'atom of Popover',
  'PopoverArrowIcon': 'atom of Popover',
  'PopoverBackdrop': 'atom of Popover',
  'PopoverGroup': 'no DOM',
  'PopoverPopup': 'atom of Popover',
  'PopoverPortal': 'atom of Popover',
  'PopoverPositioner': 'atom of Popover',
  'PopoverProvider': 'no DOM',
  'PopoverRoot': 'atom of Popover',
  'PopoverTriggerElement': 'atom of Popover',
  'PopoverViewport': 'atom of Popover',
  'ScrollAreaContent': 'atom of ScrollArea',
  'ScrollAreaCorner': 'atom of ScrollArea',
  'ScrollAreaRoot': 'atom of ScrollArea',
  'ScrollAreaScrollbar': 'atom of ScrollArea',
  'ScrollAreaThumb': 'atom of ScrollArea',
  'ScrollAreaViewport': 'atom of ScrollArea',
  'SegmentedIndicator': 'atom of Segmented',
  'SegmentedItem': 'atom of Segmented',
  'SegmentedItemIcon': 'atom of Segmented',
  'SegmentedItemLabel': 'atom of Segmented',
  'SegmentedRoot': 'atom of Segmented',
  'SelectArrow': 'atom of Select',
  'SelectBackdrop': 'atom of Select',
  'SelectGroup': 'atom of Select',
  'SelectGroupLabel': 'atom of Select',
  'SelectIcon': 'atom of Select',
  'SelectItem': 'atom of Select',
  'SelectItemIndicator': 'atom of Select',
  'SelectItemText': 'atom of Select',
  'SelectList': 'atom of Select',
  'SelectPopup': 'atom of Select',
  'SelectPortal': 'atom of Select',
  'SelectPositioner': 'atom of Select',
  'SelectRoot': 'atom of Select',
  'SelectScrollDownArrow': 'atom of Select',
  'SelectScrollUpArrow': 'atom of Select',
  'SelectSeparator': 'atom of Select',
  'SelectTrigger': 'atom of Select',
  'SelectValue': 'atom of Select',
  'ShikiLobeTheme': 'not a component',
  'SwitchIcon': 'atom of Switch',
  'SwitchRoot': 'atom of Switch',
  'SwitchThumb': 'atom of Switch',
  'TableBody': 'atom of Table',
  'TableCell': 'atom of Table',
  'TableColGroup': 'atom of Table',
  'TableContainer': 'atom of Table',
  'TableElement': 'atom of Table',
  'TableExpandedRow': 'atom of Table',
  'TableFooter': 'atom of Table',
  'TableHeader': 'atom of Table',
  'TableHeaderCell': 'atom of Table',
  'TableRoot': 'atom of Table',
  'TableRow': 'atom of Table',
  'TableScroll': 'atom of Table',
  'TableSummaryFoot': 'atom of Table',
  'TableTitle': 'atom of Table',
  'TabsIndicator': 'atom of Tabs',
  'TabsList': 'atom of Tabs',
  'TabsPanel': 'atom of Tabs',
  'TabsRoot': 'atom of Tabs',
  'TabsTab': 'atom of Tabs',
  'ToastHost': 'no DOM',
  'ToggleGroupItem': 'atom of ToggleGroup',
  'ToggleGroupItemIcon': 'atom of ToggleGroup',
  'ToggleGroupItemLabel': 'atom of ToggleGroup',
  'ToggleGroupRoot': 'atom of ToggleGroup',
  'TooltipGroup': 'no DOM',
  'chat/ChatErrorType': 'not a component',
  'chat/ChatHeaderTitle': 'atom of chat/ChatHeader',
  'chat/ChatInputAreaInner': 'atom of chat/ChatInputArea',
  'chat/LanguageModel': 'not a component',
  'dashboard/AuthLayoutAside': 'atom of dashboard/AuthLayout',
  'dashboard/SurfaceLinkProvider': 'no DOM',
  'mdx/Card': 'atom of mdx/Cards',
  'mdx/File': 'atom of mdx/FileTree',
  'mdx/Folder': 'atom of mdx/FileTree',
  'mdx/Tab': 'atom of mdx/Tabs',
  'mobile/ChatHeaderTitle': 'atom of mobile/ChatHeader',
};

export const PENDING: readonly string[] = [
  'CodeDiff',
  'CodeEditor',
  'ContextMenuTrigger',
  'Drawer',
  'DropdownMenu',
  'EditorSlashMenu',
  'EmojiPicker',
  'FloatingPanel',
  'FloatingSheet',
  'Form',
  'FormDivider',
  'FormField',
  'FormFlatGroup',
  'FormFooter',
  'FormGroup',
  'FormSubmitFooter',
  'FormTitle',
  'Highlighter',
  'HtmlPreview',
  'HtmlPreviewIframe',
  'Markdown',
  'Mermaid',
  'Modal',
  'PatchDiff',
  'SearchResultCards',
  'Snippet',
  'SyntaxHighlighter',
  'SyntaxMermaid',
  'Table',
  'ThemeScope',
  'Tooltip',
  'Typography',
  'awesome/AgentSkillCard',
  'awesome/AuroraBackground',
  'awesome/BentoCard',
  'awesome/BentoGrid',
  'awesome/BottomGradientButton',
  'awesome/CodeShowcase',
  'awesome/FeatureGrid',
  'awesome/Features',
  'awesome/FluidGradient',
  'awesome/Giscus',
  'awesome/GradientButton',
  'awesome/Grainient',
  'awesome/GridBackground',
  'awesome/GridShowcase',
  'awesome/Hero',
  'awesome/InstallBanner',
  'awesome/LandingHero',
  'awesome/LandingSection',
  'awesome/LogoMarquee',
  'awesome/Spotlight',
  'awesome/SpotlightCard',
  'awesome/TypewriterEffect',
  'brand/BrandLoading',
  'brand/LobeChat',
  'brand/LobeChatText',
  'brand/LobeHub',
  'brand/LobeHubText',
  'brand/Logo3d',
  'brand/LogoFlat',
  'brand/LogoMono',
  'chat/BackBottom',
  'chat/ChatActionsBar',
  'chat/ChatHeader',
  'chat/ChatInputActionBar',
  'chat/ChatInputArea',
  'chat/ChatItem',
  'chat/ChatList',
  'chat/ChatSendButton',
  'chat/EditableMessage',
  'chat/EditableMessageList',
  'chat/LoadingDots',
  'chat/MessageInput',
  'chat/MessageModal',
  'chat/TokenTag',
  'color/ColorScales',
  'color/CssVar',
  'dashboard/AuthLayout',
  'dashboard/AuthLocaleSwitch',
  'dashboard/AuthThemeSwitch',
  'dashboard/Breadcrumb',
  'dashboard/ChartGrid',
  'dashboard/ConsoleBrand',
  'dashboard/ConsoleFooterSkeleton',
  'dashboard/ConsoleNav',
  'dashboard/ConsoleNavSkeleton',
  'dashboard/ConsoleShell',
  'dashboard/FilterOption',
  'dashboard/FilterRow',
  'dashboard/FilterSidebar',
  'dashboard/FilterStrip',
  'dashboard/LabelWithKey',
  'dashboard/LoadingAnnouncer',
  'dashboard/MetricStrip',
  'dashboard/PageHeader',
  'dashboard/PageHeaderSkeleton',
  'dashboard/PageLoading',
  'dashboard/PageTabs',
  'dashboard/PageToolbar',
  'dashboard/PanelSurface',
  'dashboard/RouteProgress',
  'dashboard/Section',
  'dashboard/StatCard',
  'dashboard/StatCardSkeleton',
  'dashboard/Surface',
  'dashboard/TableIconAction',
  'dashboard/TableIconActions',
  'dashboard/TableSkeleton',
  'dashboard/TitleWithTips',
  'form/Form',
  'form/FormField',
  'form/FormList',
  'form/FormSubmitFooter',
  'mdx/Callout',
  'mdx/Cards',
  'mdx/CodeBlock',
  'mdx/FileTree',
  'mdx/Image',
  'mdx/Link',
  'mdx/Mdx',
  'mdx/Pre',
  'mdx/PreSingleLine',
  'mdx/Steps',
  'mdx/Tabs',
  'mdx/Video',
  'mobile/ChatHeader',
  'mobile/ChatInputArea',
  'mobile/ChatSendButton',
  'mobile/SafeArea',
  'mobile/TabBar',
  'pro-table/ProTable',
];

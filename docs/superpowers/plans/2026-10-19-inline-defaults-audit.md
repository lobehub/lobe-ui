# Inline style defaults audit

First pass, generated 2026-10-19 from `rg -n "style=\{\{" src` (demos, tests, storybook, icons excluded).
Kind is a heuristic: `default?` = only literal values (likely a component default → move to StyleX), `prop/dynamic` = references a variable or spread (likely stays inline), `multi-line, review` = the object spans lines. Each batch confirms its rows before changing code.

The heuristic misses defaults applied while destructuring props (`height = '1em'` in Skeleton): those rows show as `prop/dynamic` but the default must still move. For each component, check whether an inline value can come from a destructuring default rather than from the caller.

## Task 4 (5 sites, 0 `default?`)

| Site                                       | Kind         | Code                                                                                  |
| ------------------------------------------ | ------------ | ------------------------------------------------------------------------------------- |
| `src/DraggablePanel/DraggablePanel.tsx:90` | prop/dynamic | `style={{ ...customStyles?.content, ...style }}`                                      |
| `src/DraggablePanel/atoms.tsx:398`         | prop/dynamic | `style={{ opacity: expand ? undefined : showHandleWhenCollapsed ? 1 : 0, ...style }}` |
| `src/DraggablePanel/atoms.tsx:419`         | prop/dynamic | `style={{ '--seam-bend': bend } as CSSProperties}`                                    |
| `src/Switch/Switch.tsx:105`                | prop/dynamic | `style={{ color: cssVar.colorPrimary }}`                                              |
| `src/Switch/Switch.tsx:63`                 | prop/dynamic | `style={{ ...style, ...customStyles?.root }}`                                         |

## Task 6 (12 sites, 4 `default?`)

| Site                                    | Kind               | Code                                                                          |
| --------------------------------------- | ------------------ | ----------------------------------------------------------------------------- |
| `src/ActionIcon/ActionIcon.tsx:123`     | multi-line, review | `style={{`                                                                    |
| `src/ActionIcon/ActionIcon.tsx:98`      | prop/dynamic       | `style={{ pointerEvents: 'none', ...slotStyles?.icon }}`                      |
| `src/Burger/Burger.tsx:80`              | prop/dynamic       | `<div {...stylex.props(styles.fullHeader)} style={{ height: headerHeight }}>` |
| `src/EditableText/ControlInput.tsx:102` | multi-line, review | `style={{`                                                                    |
| `src/EditableText/ControlInput.tsx:65`  | multi-line, review | `style={{`                                                                    |
| `src/EditableText/EditableText.tsx:114` | multi-line, review | `style={{`                                                                    |
| `src/EditableText/EditableText.tsx:74`  | multi-line, review | `style={{`                                                                    |
| `src/HotkeyInput/HotkeyInput.tsx:234`   | multi-line, review | `style={{`                                                                    |
| `src/HotkeyInput/HotkeyInput.tsx:254`   | default?           | `<div style={{ pointerEvents: 'none' }}>`                                     |
| `src/HotkeyInput/HotkeyInput.tsx:272`   | default?           | `style={{ pointerEvents: 'none' }}`                                           |
| `src/Input/ClearButton.tsx:31`          | default?           | `<Icon icon={X} size={10} style={{ strokeWidth: 3 }} />`                      |
| `src/SearchBar/SearchBar.tsx:64`        | default?           | `style={{ marginRight: 4 }}`                                                  |

## Task 7 (41 sites, 8 `default?`)

| Site                                                                    | Kind               | Code                                                                                           |
| ----------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| `src/Checkbox/Checkbox.tsx:58`                                          | prop/dynamic       | `style={{ transform: `scale(${shape === 'square' ? 0.75 : 0.66})` }}`                          |
| `src/Checkbox/Checkbox.tsx:64`                                          | prop/dynamic       | `style={{ transform: `scale(${shape === 'square' ? 0.75 : 0.66})` }}`                          |
| `src/Checkbox/CheckboxGroup.tsx:21`                                     | multi-line, review | `style={{`                                                                                     |
| `src/ColorPicker/ColorPanel.tsx:127`                                    | prop/dynamic       | `<div {...stylex.props(styles.compare)} style={{ height: alpha ? 30 : 28 }}>`                  |
| `src/ColorPicker/ColorPanel.tsx:133`                                    | prop/dynamic       | `style={{ background: original }}`                                                             |
| `src/ColorPicker/ColorPanel.tsx:136`                                    | prop/dynamic       | `<span {...stylex.props(styles.compareHalf)} style={{ background: hex }} />`                   |
| `src/ColorPicker/SaturationArea.tsx:47`                                 | multi-line, review | `style={{`                                                                                     |
| `src/ColorPicker/SaturationArea.tsx:79`                                 | prop/dynamic       | `style={{ background: color, left: `${saturation * 100}%`, top: `${(1 - value) * 100}%` }}`    |
| `src/ColorPicker/Swatch.tsx:16`                                         | prop/dynamic       | `<span {...stylex.props(swatchStyles.fill)} style={{ background: color \|\| 'transparent' }} ` |
| `src/ColorPicker/Swatches.tsx:68`                                       | prop/dynamic       | `style={{ color }}`                                                                            |
| `src/ColorPicker/Swatches.tsx:71`                                       | prop/dynamic       | `<span {...stylex.props(swatchStyles.fill)} style={{ background: color }} />`                  |
| `src/ColorSwatches/ColorSwatches.tsx:107`                               | multi-line, review | `style={{`                                                                                     |
| `src/ColorSwatches/ColorSwatches.tsx:118`                               | multi-line, review | `style={{`                                                                                     |
| `src/ColorSwatches/ColorSwatches.tsx:76`                                | multi-line, review | `style={{`                                                                                     |
| `src/ColorSwatches/CustomPicker.tsx:38`                                 | default?           | `<span style={{ display: 'inline-flex' }}>`                                                    |
| `src/ColorSwatches/CustomPicker.tsx:44`                                 | prop/dynamic       | `style={{ background: current, borderRadius }}`                                                |
| `src/ColorSwatches/CustomPicker.tsx:65`                                 | prop/dynamic       | `style={{ background: value, borderRadius }}`                                                  |
| `src/ColorSwatches/CustomPicker.tsx:83`                                 | default?           | `<span style={{ display: 'inline-flex' }}>`                                                    |
| `src/ColorSwatches/CustomPicker.tsx:89`                                 | prop/dynamic       | `style={{ borderRadius }}`                                                                     |
| `src/DatePicker/PurePanel.tsx:47`                                       | prop/dynamic       | `style={{ minWidth: popupSize.width, paddingBottom: popupSize.height, position: 'relative' `   |
| `src/DatePicker/PurePanel.tsx:54`                                       | prop/dynamic       | `style={{ ...style, margin: 0 }}`                                                              |
| `src/DatePicker/SinglePicker.tsx:19`                                    | default?           | `const defaultRemoveIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;`            |
| `src/DatePicker/core/PickerInput/Popup/index.tsx:240`                   | multi-line, review | `style={{`                                                                                     |
| `src/DatePicker/core/PickerInput/Popup/index.tsx:263`                   | prop/dynamic       | `<div className={`${prefixCls}-range-arrow`} ref={arrowRef} style={{ left: arrowOffset }} /`   |
| `src/DatePicker/core/PickerInput/RangePicker.tsx:806`                   | prop/dynamic       | `style={{ ...mergedStyles.root, ...filledProps.style }}`                                       |
| `src/DatePicker/core/PickerInput/SinglePicker.tsx:717`                  | prop/dynamic       | `style={{ ...mergedStyles.root, ...filledProps.style }}`                                       |
| `src/DatePicker/core/PickerPanel/DatePanel/index.tsx:104`               | default?           | `<span style={{ width: 0, height: 0, position: 'absolute', overflow: 'hidden', opacity: 0 }`   |
| `src/DatePicker/core/PickerPanel/TimePanel/TimeClock/ClockDial.tsx:108` | multi-line, review | `style={{`                                                                                     |
| `src/DatePicker/core/PickerPanel/TimePanel/TimeClock/ClockDial.tsx:117` | prop/dynamic       | `style={{ left: knob.x, top: knob.y }}`                                                        |
| `src/DatePicker/core/PickerPanel/TimePanel/TimeClock/ClockDial.tsx:134` | prop/dynamic       | `style={{ left: position.x, top: position.y }}`                                                |
| `src/DatePicker/core/PickerPanel/TimePanel/TimeClock/ClockDial.tsx:70`  | default?           | `style={{ height: DIAL_SIZE, width: DIAL_SIZE }}`                                              |
| `src/DatePicker/core/PickerPopup.tsx:126`                               | prop/dynamic       | `style={{ minWidth: 'var(--anchor-width)', ...popupStyle }}`                                   |
| `src/DatePicker/core/PickerPopup.tsx:141`                               | default?           | `style={{ transformOrigin: 'var(--transform-origin)' }}`                                       |
| `src/DatePicker/usePickerShared.tsx:98`                                 | default?           | `const defaultClearIcon = <Icon icon={X} size={10} style={{ strokeWidth: 3 }} />;`             |
| `src/Radio/Radio.tsx:48`                                                | prop/dynamic       | `style={{ height: Math.round(size * 0.375), width: Math.round(size * 0.375) }}`                |
| `src/Radio/RadioGroup.tsx:21`                                           | multi-line, review | `style={{`                                                                                     |
| `src/Select/parts.tsx:51`                                               | multi-line, review | `style={{`                                                                                     |
| `src/Slider/SliderWithInput.tsx:56`                                     | prop/dynamic       | `style={{ flex: 1, ...sliderStyle }}`                                                          |
| `src/Slider/SliderWithInput.tsx:75`                                     | multi-line, review | `style={{`                                                                                     |
| `src/ToggleGroup/ToggleGroup.tsx:88`                                    | prop/dynamic       | `style={{ ...style, ...customStyles?.root }}`                                                  |
| `src/Upload/Upload.tsx:141`                                             | default?           | `style={{ display: 'none' }}`                                                                  |

## Task 8 (54 sites, 12 `default?`)

| Site                                                   | Kind               | Code                                                                                         |
| ------------------------------------------------------ | ------------------ | -------------------------------------------------------------------------------------------- |
| `src/Accordion/Accordion.tsx:43`                       | prop/dynamic       | `style={{ gap, ...style, ...customStyles?.root }}`                                           |
| `src/Avatar/Avatar.tsx:119`                            | multi-line, review | `style={{`                                                                                   |
| `src/Avatar/AvatarGroup/index.tsx:53`                  | multi-line, review | `style={{`                                                                                   |
| `src/Avatar/AvatarGroup/index.tsx:70`                  | multi-line, review | `style={{`                                                                                   |
| `src/Avatar/AvatarGroup/index.tsx:91`                  | multi-line, review | `style={{`                                                                                   |
| `src/Carousel/Carousel.tsx:130`                        | prop/dynamic       | `style={{ transform: `translateX(-${current * 100}%)` }}`                                    |
| `src/Carousel/Carousel.tsx:159`                        | default?           | `style={{ insetInlineStart: 8 }}`                                                            |
| `src/Carousel/Carousel.tsx:168`                        | default?           | `style={{ insetInlineEnd: 8 }}`                                                              |
| `src/Descriptions/Descriptions.tsx:47`                 | prop/dynamic       | `style={{ gridTemplateColumns: `repeat(${columnCount}, auto minmax(0, 1fr))` }}`             |
| `src/DraggableSideNav/DraggableSideNav.tsx:527`        | multi-line, review | `style={{`                                                                                   |
| `src/Empty/Empty.tsx:107`                              | prop/dynamic       | `style={{ maxWidth: isPage ? '52ch' : '34ch' }}`                                             |
| `src/Empty/Empty.tsx:119`                              | prop/dynamic       | `style={{ alignItems: alignValue, ...rootStyle }}`                                           |
| `src/Empty/Empty.tsx:143`                              | prop/dynamic       | `style={{ alignItems: alignValue, textAlign: isCenter ? 'center' : undefined, ...rootStyle ` |
| `src/Empty/Empty.tsx:92`                               | multi-line, review | `style={{`                                                                                   |
| `src/FileTypeIcon/FileTypeIcon.tsx:85`                 | multi-line, review | `style={{`                                                                                   |
| `src/FluentEmoji/FluentEmoji.tsx:52`                   | prop/dynamic       | `style={{ flex: 'none', ...style }}`                                                         |
| `src/Grid/Grid.tsx:38`                                 | multi-line, review | `style={{`                                                                                   |
| `src/Header/Header.tsx:43`                             | prop/dynamic       | `<Flexbox className={actionsClassName} style={{ flex: 0, ...navStyle }}>`                    |
| `src/Header/Header.tsx:50`                             | prop/dynamic       | `style={{ flex: 1, overflow: 'hidden', ...logoStyle }}`                                      |
| `src/Header/Header.tsx:54`                             | prop/dynamic       | `<Flexbox className={actionsClassName} style={{ flex: 0, ...actionsStyle }}>`                |
| `src/Header/Header.tsx:63`                             | prop/dynamic       | `style={{ flex: 0, ...logoStyle }}`                                                          |
| `src/Header/Header.tsx:69`                             | prop/dynamic       | `style={{ flex: 1, marginLeft: 48, overflow: 'hidden', ...navStyle }}`                       |
| `src/Image/Image.tsx:187`                              | prop/dynamic       | `style={{ maxHeight, maxWidth, minHeight, minWidth }}`                                       |
| `src/Image/Image.tsx:220`                              | multi-line, review | `style={{`                                                                                   |
| `src/Image/viewer/ActualSizeIcon.tsx:47`               | prop/dynamic       | `style={{ transformOrigin: origin }}`                                                        |
| `src/Image/viewer/ImageViewer.tsx:323`                 | multi-line, review | `style={{`                                                                                   |
| `src/Image/viewer/Toolbar.tsx:216`                     | default?           | `style={{ borderRadius: 999 }}`                                                              |
| `src/Image/viewer/Toolbar.tsx:226`                     | default?           | `style={{ borderRadius: 999 }}`                                                              |
| `src/Image/viewer/Toolbar.tsx:234`                     | default?           | `style={{ borderRadius: 999 }}`                                                              |
| `src/Image/viewer/Toolbar.tsx:242`                     | default?           | `style={{ borderRadius: 999 }}`                                                              |
| `src/Image/viewer/Toolbar.tsx:255`                     | default?           | `style={{ borderRadius: 999 }}`                                                              |
| `src/Layout/Layout.tsx:43`                             | prop/dynamic       | `{!mobile && !sidebar && <nav style={{ width: tocWidth }} />}`                               |
| `src/Layout/components/LayoutHeader.tsx:15`            | multi-line, review | `style={{`                                                                                   |
| `src/Layout/components/LayoutSidebar.tsx:15`           | multi-line, review | `style={{`                                                                                   |
| `src/MaskShadow/MaskShadow.tsx:24`                     | multi-line, review | `style={{`                                                                                   |
| `src/MaterialFileTypeIcon/MaterialFileTypeIcon.tsx:59` | prop/dynamic       | `style={{ position: 'relative', ...style }}`                                                 |
| `src/MaterialFileTypeIcon/MaterialFileTypeIcon.tsx:68` | prop/dynamic       | `style={{ position: 'absolute', top: size / 3 }}`                                            |
| `src/Pagination/Pagination.tsx:323`                    | multi-line, review | `style={{`                                                                                   |
| `src/Progress/Progress.tsx:124`                        | default?           | `style={{ transition: 'stroke-dashoffset 0.3s' }}`                                           |
| `src/Progress/Progress.tsx:63`                         | prop/dynamic       | `if (status === 'success') return <Icon icon={Check} size={14} style={{ color: barColor }} ` |
| `src/Progress/Progress.tsx:64`                         | prop/dynamic       | `if (status === 'exception') return <Icon icon={X} size={14} style={{ color: barColor }} />` |
| `src/QRCode/QRCode.tsx:71`                             | prop/dynamic       | `style={{ height: size * ICON_RATIO, width: size * ICON_RATIO }}`                            |
| `src/QRCode/QRCode.tsx:78`                             | default?           | `<Spin style={{ color: '#666' }} />`                                                         |
| `src/QRCode/QRCode.tsx:87`                             | default?           | `style={{ background: '#080808', color: '#fff' }}`                                           |
| `src/ScrollShadow/ScrollShadow.tsx:141`                | multi-line, review | `style={{`                                                                                   |
| `src/Skeleton/Skeleton.tsx:20`                         | prop/dynamic       | `style={{ borderRadius: radius, height, width, ...style }}`                                  |
| `src/Skeleton/SkeletonText.tsx:41`                     | prop/dynamic       | `style={{ marginBlock: halfLeading }}`                                                       |
| `src/SortableList/components/DragHandle.tsx:19`        | prop/dynamic       | `style={{ cursor: grab ? 'grab' : 'grabbing', ...style }}`                                   |
| `src/SortableList/components/SortableItem.tsx:72`      | multi-line, review | `style={{`                                                                                   |
| `src/Spin/NetworkGlyph.tsx:38`                         | default?           | `<span {...stylex.props(styles.network)} style={{ height: px, width: px }}>`                 |
| `src/Spin/NetworkGlyph.tsx:53`                         | prop/dynamic       | `style={{ animationDelay: `${index * 0.2}s`, left: x, top: y }}`                             |
| `src/Spin/NetworkGlyph.tsx:60`                         | prop/dynamic       | `style={{ animationDelay: `${index * 0.6}s` }}`                                              |
| `src/Video/Video.tsx:31`                               | prop/dynamic       | `style={{ ...customStyles?.root, ...style }}`                                                |
| `src/Video/parts/HoverPreview.tsx:79`                  | default?           | `style={{ display: 'none' }}`                                                                |

## Task 9 (22 sites, 3 `default?`)

| Site                                      | Kind               | Code                                                                                    |
| ----------------------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `src/ContextMenu/ContextMenuHost.tsx:81`  | prop/dynamic       | `style={{ ...noAnimationStyles, zIndex }}`                                              |
| `src/ContextMenu/renderItems.tsx:141`     | default?           | `style={{ display: 'inline-flex', marginInlineStart: 16 }}`                             |
| `src/Drawer/atoms.tsx:167`                | prop/dynamic       | `style={{ ...layerStyle, ...style, transition: 'none' }}`                               |
| `src/Drawer/atoms.tsx:183`                | prop/dynamic       | `style={{ ...layerStyle, ...style }}`                                                   |
| `src/Drawer/atoms.tsx:272`                | prop/dynamic       | `style={{ transition: 'none', ...panelStyle }}`                                         |
| `src/Drawer/atoms.tsx:298`                | prop/dynamic       | `style={{ ...pushVars, ...panelStyle }}`                                                |
| `src/DropdownMenu/atoms.tsx:482`          | default?           | `style={{ display: 'inline-flex', marginInlineStart: 16 }}`                             |
| `src/EmojiPicker/AvatarUploader.tsx:102`  | default?           | `style={{ flex: 'none' }}`                                                              |
| `src/EmojiPicker/AvatarUploader.tsx:105`  | prop/dynamic       | `<Button style={{ flex: 1, fontWeight: 500 }} type={'primary'} onClick={handleUpload}>` |
| `src/EmojiPicker/AvatarUploader.tsx:73`   | prop/dynamic       | `<Flexbox padding={10} style={{ position: 'relative' }} width={'100%'}>`                |
| `src/EmojiPicker/AvatarUploader.tsx:89`   | prop/dynamic       | `<Center gap={8} style={{ position: 'relative' }} width={'100%'}>`                      |
| `src/EmojiPicker/AvatarUploader.tsx:99`   | prop/dynamic       | `<Flexbox horizontal gap={8} style={{ position: 'relative' }} width={'100%'}>`          |
| `src/FloatingPanel/FloatingPanel.tsx:337` | multi-line, review | `style={{`                                                                              |
| `src/Modal/Modal.tsx:265`                 | multi-line, review | `style={{`                                                                              |
| `src/Modal/Modal.tsx:307`                 | multi-line, review | `style={{`                                                                              |
| `src/Modal/Modal.tsx:314`                 | multi-line, review | `style={{`                                                                              |
| `src/Modal/atoms.tsx:159`                 | prop/dynamic       | `style={{ ...layerStyle, ...style, transition: 'none' }}`                               |
| `src/Modal/atoms.tsx:175`                 | prop/dynamic       | `style={{ ...layerStyle, ...style }}`                                                   |
| `src/Modal/atoms.tsx:213`                 | prop/dynamic       | `style={{ ...popupZIndexStyle, ...popupStyle }}`                                        |
| `src/Modal/atoms.tsx:221`                 | prop/dynamic       | `style={{ maxWidth: width ?? undefined, transition: 'none', ...style }}`                |
| `src/Modal/atoms.tsx:240`                 | prop/dynamic       | `style={{ ...popupZIndexStyle, ...popupStyle }}`                                        |
| `src/Modal/imperative.tsx:78`             | prop/dynamic       | `{content && <div style={{ padding: '12px 16px' }}>{content}</div>}`                    |

## Task 10 (53 sites, 16 `default?`)

| Site                                                          | Kind               | Code                                                                                         |
| ------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `src/Form/components/FormSubmitFooter.tsx:62`                 | default?           | `style={{ marginLeft: 8 }}`                                                                  |
| `src/Form/components/FormSubmitFooter.tsx:65`                 | multi-line, review | `style={{`                                                                                   |
| `src/FormKit/List.tsx:121`                                    | prop/dynamic       | `<div {...stylex.props(listStyles.head)} style={{ gridTemplateColumns }}>`                   |
| `src/FormKit/List.tsx:136`                                    | prop/dynamic       | `<div {...stylex.props(listStyles.row)} key={field.key} style={{ gridTemplateColumns }}>`    |
| `src/Highlighter/Highlighter.tsx:92`                          | multi-line, review | `style={{`                                                                                   |
| `src/Highlighter/LangSelect.tsx:56`                           | prop/dynamic       | `<div style={{ maxWidth: 240, width: '100%' }} onClick={stopPropagation}>`                   |
| `src/Highlighter/LangSelect.tsx:63`                           | prop/dynamic       | `style={{ width: '100%', ...style }}`                                                        |
| `src/Highlighter/SyntaxHighlighter/StreamRenderer.tsx:134`    | default?           | `<code style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'pre' }}>`             |
| `src/Highlighter/SyntaxHighlighter/StreamRenderer.tsx:72`     | prop/dynamic       | `<span style={{ whiteSpace: 'pre' }}>{'\u00A0'}</span>`                                      |
| `src/HtmlPreview/HtmlPreview.tsx:258`                         | prop/dynamic       | `style={{ height: '100%', ...customStyles?.content }}`                                       |
| `src/HtmlPreview/HtmlPreview.tsx:303`                         | prop/dynamic       | `style={{ height: defaultHeight ?? DEFAULT_HEIGHT }}`                                        |
| `src/Markdown/components/Footnotes.tsx:58`                    | default?           | `style={{ overflow: 'hidden', position: 'relative' }}`                                       |
| `src/Markdown/components/Footnotes.tsx:61`                    | prop/dynamic       | `<Block paddingInline={'0.66em'} style={{ borderRadius: 0 }} variant={'filled'}>`            |
| `src/Markdown/components/Footnotes.tsx:66`                    | prop/dynamic       | `<Text as="span" style={{ paddingInline: '0.66em' }} type={'secondary'}>`                    |
| `src/Markdown/components/SearchResultCards/index.tsx:31`      | prop/dynamic       | `style={{ minHeight: 80, overflowX: 'scroll', paddingInlineEnd: 24, width: '100%', ...style` |
| `src/Markdown/streamProfiler/StreamdownProfilerPanel.tsx:274` | default?           | `style={{ display: 'block', height: 'auto', width: '100%' }}`                                |
| `src/Mermaid/SyntaxMermaid/MermaidFallback.tsx:27`            | default?           | `style={{ margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}`  |
| `src/Mermaid/SyntaxMermaid/MermaidSvg.tsx:68`                 | prop/dynamic       | `<div className={className} ref={ref} style={{ position: 'relative', ...style }}>`           |
| `src/Mermaid/SyntaxMermaid/MermaidSvg.tsx:72`                 | default?           | `style={{ cursor: 'zoom-in' }}`                                                              |
| `src/Mermaid/SyntaxMermaid/StaticMermaid.tsx:58`              | prop/dynamic       | `<div style={{ padding: 16 }}>Loading...</div>`                                              |
| `src/Mermaid/SyntaxMermaid/StreamMermaid.tsx:58`              | prop/dynamic       | `<div style={{ padding: 16 }}>Rendering...</div>`                                            |
| `src/ProTable/parts/ColumnSetting.tsx:108`                    | default?           | `<span style={{ flex: 1 }} />`                                                               |
| `src/ProTable/parts/FieldControl.tsx:107`                     | default?           | `style={{ width: '100%' }}`                                                                  |
| `src/ProTable/parts/FieldControl.tsx:136`                     | default?           | `style={{ width: '100%' }}`                                                                  |
| `src/ProTable/parts/FieldControl.tsx:151`                     | default?           | `style={{ width: '100%' }}`                                                                  |
| `src/ProTable/parts/FieldControl.tsx:80`                      | default?           | `style={{ width: '100%' }}`                                                                  |
| `src/ProTable/parts/KeywordInput.tsx:17`                      | default?           | `style={{ width: 200 }}`                                                                     |
| `src/ProTable/parts/LightFilter.tsx:25`                       | multi-line, review | `style={{`                                                                                   |
| `src/ProTable/parts/SearchForm.tsx:207`                       | multi-line, review | `style={{`                                                                                   |
| `src/ProTable/parts/renderValue.tsx:111`                      | default?           | `style={{ minWidth: 100 }}`                                                                  |
| `src/ProTable/parts/renderValue.tsx:35`                       | prop/dynamic       | `style={{ background: color ?? STATUS_COLOR[status ?? 'Default'] }}`                         |
| `src/Table/atoms/cells.tsx:168`                               | default?           | `style={{ insetInlineStart: 0, overflow: 'hidden', position: 'sticky' }}`                    |
| `src/Table/render/Body.tsx:130`                               | multi-line, review | `style={{`                                                                                   |
| `src/Table/render/Body.tsx:176`                               | default?           | `style={{ borderBottom: 0, borderTop: 0, height: 0, paddingBottom: 0, paddingTop: 0 }}`      |
| `src/Table/render/Body.tsx:178`                               | prop/dynamic       | `<div style={{ fontWeight: 'bold', height: 0, overflow: 'hidden' }}>{children}</div>`        |
| `src/Table/render/Body.tsx:187`                               | default?           | `<tr aria-hidden="true" className={`${prefixCls}-measure-row`} style={{ height: 0 }}>`       |
| `src/Table/render/BodyCell.tsx:58`                            | prop/dynamic       | `style={{ paddingLeft: `${expand.indentSize * depth}px` }}`                                  |
| `src/Table/render/FixedFrost.tsx:166`                         | prop/dynamic       | `<div {...stylex.props(styles.frostStart)} style={{ width: rail.start }} />`                 |
| `src/Table/render/FixedFrost.tsx:168`                         | prop/dynamic       | `{rail.end > 0 && <div {...stylex.props(styles.frostEnd)} style={{ width: rail.end }} />}`   |
| `src/Table/render/FixedHolder.tsx:64`                         | prop/dynamic       | `<div className={className} ref={setRef} style={{ overflow: 'hidden', ...stickyStyle }}>`    |
| `src/Table/render/FixedHolder.tsx:67`                         | prop/dynamic       | `style={{ minWidth: '100%', tableLayout, width: scrollX === true ? 'auto' : scrollX }}`      |
| `src/Table/render/Header.tsx:202`                             | prop/dynamic       | `style={{ ...semanticStyles.header.cell, ...attrStyle }}`                                    |
| `src/Table/render/Header.tsx:257`                             | prop/dynamic       | `style={{ ...rowProps?.style, ...semanticStyles.header.row }}`                               |
| `src/Table/render/LoadingSkeleton.tsx:74`                     | prop/dynamic       | `<div key={rowIndex} {...stylex.props(styles.skeletonRow)} style={{ gridTemplateColumns }}>` |
| `src/Table/render/StickyScrollBar.tsx:117`                    | prop/dynamic       | `style={{ bottom: offsetScroll, width: clientWidth }}`                                       |
| `src/Table/render/StickyScrollBar.tsx:120`                    | prop/dynamic       | `style={{ transform: `translate3d(${barLeft}px, 0, 0)`, width: `${barWidth}px` }}`           |
| `src/Table/render/TableView.tsx:125`                          | prop/dynamic       | `style={{ ...scrollXStyle, ...scrollYStyle }}`                                               |
| `src/Table/render/TableView.tsx:130`                          | prop/dynamic       | `style={{ ...scrollTableStyle, tableLayout }}`                                               |
| `src/Table/render/TableView.tsx:195`                          | prop/dynamic       | `style={{ ...scrollXStyle, ...scrollYStyle, ...semanticStyles.content }}`                    |
| `src/Table/render/TableView.tsx:200`                          | prop/dynamic       | `style={{ ...scrollTableStyle, tableLayout }}`                                               |
| `src/Table/render/VirtualBody.tsx:100`                        | prop/dynamic       | `<div style={{ position: 'relative', top: offset }}>`                                        |
| `src/Table/render/VirtualBody.tsx:88`                         | prop/dynamic       | `style={{ maxHeight, overflow: 'auto' }}`                                                    |
| `src/Table/render/VirtualBody.tsx:93`                         | prop/dynamic       | `style={{ height: virtual.totalSize, minWidth: '100%', position: 'relative', width }}`       |

## Task 11 (73 sites, 31 `default?`)

| Site                                                           | Kind               | Code                                                                                       |
| -------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| `src/awesome/AuroraBackground/AuroraBackground.tsx:24`         | prop/dynamic       | `style={{ zIndex: 1, ...customStyles?.content }}`                                          |
| `src/awesome/BottomGradientButton/BottomGradientButton.tsx:19` | multi-line, review | `style={{`                                                                                 |
| `src/awesome/Features/Features.tsx:18`                         | prop/dynamic       | `style={{ maxWidth, ...style }}`                                                           |
| `src/awesome/GradientButton/GradientButton.tsx:47`             | multi-line, review | `style={{`                                                                                 |
| `src/awesome/GridBackground/GridBackground.tsx:109`            | default?           | `style={{ zIndex: 2 }}`                                                                    |
| `src/awesome/GridBackground/GridBackground.tsx:115`            | multi-line, review | `style={{`                                                                                 |
| `src/awesome/GridBackground/GridBackground.tsx:73`             | prop/dynamic       | `return <Grid style={{ '--duration': `${animationDuration}s` } as any} {...gridProps} />;` |
| `src/awesome/GridBackground/GridShowcase.tsx:17`               | prop/dynamic       | `<Flexbox style={{ position: 'relative', ...style }} {...rest}>`                           |
| `src/awesome/GridBackground/GridShowcase.tsx:24`               | prop/dynamic       | `<Flexbox align={'center'} {...innerProps} style={{ zIndex: 4, ...innerProps?.style }}>`   |
| `src/awesome/GridBackground/GridShowcase.tsx:35`               | default?           | `style={{ zIndex: 0 }}`                                                                    |
| `src/awesome/GridBackground/components/Grid.tsx:71`            | default?           | `style={{ width: '100%' }}`                                                                |
| `src/awesome/Hero/Hero.tsx:71`                                 | default?           | `<Flexbox align={'center'} style={{ fontSize: 16, zIndex: 1 }}>`                           |
| `src/awesome/InstallBanner/InstallBanner.tsx:20`               | default?           | `<Snippet language={'bash'} prefix={prefix} style={{ borderRadius: 999 }}>`                |
| `src/awesome/TypewriterEffect/TypewriterEffect.tsx:252`        | default?           | `style={{ display: 'inline-block' }}`                                                      |
| `src/awesome/TypewriterEffect/TypewriterEffect.tsx:281`        | multi-line, review | `style={{`                                                                                 |
| `src/brand/LobeChat/index.tsx:49`                              | prop/dynamic       | `<LogoText size={size} style={{ marginLeft: Math.round(size / 4) }} />`                    |
| `src/brand/LobeChat/index.tsx:78`                              | prop/dynamic       | `<Divider size={extraSize} style={{ color: cssVar.colorFill }} />`                         |
| `src/brand/LobeChat/index.tsx:79`                              | prop/dynamic       | `<div {...stylex.props(styles.extraTitle)} style={{ fontSize: extraSize }}>`               |
| `src/brand/LobeChatText/index.tsx:14`                          | prop/dynamic       | `style={{ flex: 'none', lineHeight: 1, ...style }}`                                        |
| `src/brand/LobeHub/index.tsx:50`                               | prop/dynamic       | `<LogoText size={size} style={{ marginLeft: Math.round(size / 4) }} />`                    |
| `src/brand/LobeHub/index.tsx:79`                               | prop/dynamic       | `<Divider size={extraSize} style={{ color: cssVar.colorFill }} />`                         |
| `src/brand/LobeHub/index.tsx:80`                               | prop/dynamic       | `<div {...stylex.props(styles.extraTitle)} style={{ fontSize: extraSize }}>`               |
| `src/brand/LobeHubText/index.tsx:14`                           | prop/dynamic       | `style={{ flex: 'none', lineHeight: 1, ...style }}`                                        |
| `src/brand/components/Divider.tsx:13`                          | prop/dynamic       | `style={{ flex: 'none', lineHeight: 1, ...style }}`                                        |
| `src/chat/ChatHeader/ChatHeader.tsx:52`                        | prop/dynamic       | `style={{ marginRight: gaps?.left ? -gaps.left / 2 : -6 }}`                                |
| `src/chat/ChatInputArea/ChatInputArea.tsx:29`                  | prop/dynamic       | `<section {...stylex.props(styles.container)} style={{ minHeight: heights?.minHeight }}>`  |
| `src/chat/ChatInputArea/ChatInputArea.tsx:35`                  | multi-line, review | `style={{`                                                                                 |
| `src/chat/ChatInputArea/ChatInputArea.tsx:72`                  | prop/dynamic       | `style={{ zIndex: 10, ...style }}`                                                         |
| `src/chat/ChatInputArea/components/ChatSendButton.tsx:39`      | prop/dynamic       | `style={{ color: cssVar.colorTextDescription, fontSize: 12, marginRight: 12 }}`            |
| `src/chat/ChatItem/ChatItem.tsx:131`                           | multi-line, review | `style={{`                                                                                 |
| `src/chat/ChatItem/components/Avatar.tsx:42`                   | prop/dynamic       | `<div {...stylex.props(styles.avatarContainer)} style={{ ...cssVariables, ...style }}>`    |
| `src/chat/ChatItem/components/BorderSpacing.tsx:10`            | prop/dynamic       | `return <div style={{ flex: 'none', width: borderSpacing }} />;`                           |
| `src/chat/ChatList/components/HistoryDivider.tsx:17`           | default?           | `<div style={{ padding: '0 20px' }}>`                                                      |
| `src/chat/ChatList/components/HistoryDivider.tsx:18`           | default?           | `<Divider style={{ marginBlock: 16 }}>`                                                    |
| `src/chat/EditableMessage/EditableMessage.tsx:62`              | multi-line, review | `style={{`                                                                                 |
| `src/chat/EditableMessage/EditableMessage.tsx:86`              | multi-line, review | `style={{`                                                                                 |
| `src/chat/EditableMessageList/EditableMessageList.tsx:50`      | default?           | `style={{ width: 120 }}`                                                                   |
| `src/chat/LoadingDots/LoadingDots.tsx:32`                      | default?           | `<div {...stylex.props(styles.dot, styles.pulseDot)} style={{ animationDelay: '0s' }} />`  |
| `src/chat/LoadingDots/LoadingDots.tsx:39`                      | default?           | `<div {...stylex.props(styles.dot, styles.waveDot)} style={{ animationDelay: '0s' }} />`   |
| `src/chat/LoadingDots/LoadingDots.tsx:42`                      | default?           | `style={{ animationDelay: '0.12s' }}`                                                      |
| `src/chat/LoadingDots/LoadingDots.tsx:46`                      | default?           | `style={{ animationDelay: '0.24s' }}`                                                      |
| `src/chat/LoadingDots/LoadingDots.tsx:55`                      | default?           | `<div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '0s' }} />`              |
| `src/chat/LoadingDots/LoadingDots.tsx:56`                      | default?           | `<div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '-0.4s' }} />`           |
| `src/chat/LoadingDots/LoadingDots.tsx:57`                      | default?           | `<div {...stylex.props(styles.orbitDot)} style={{ animationDelay: '-0.8s' }} />`           |
| `src/chat/LoadingDots/LoadingDots.tsx:65`                      | default?           | `<div {...stylex.props(styles.dot, styles.typingDot)} style={{ animationDelay: '0s' }} />` |
| `src/chat/LoadingDots/LoadingDots.tsx:68`                      | default?           | `style={{ animationDelay: '0.15s' }}`                                                      |
| `src/chat/LoadingDots/LoadingDots.tsx:72`                      | default?           | `style={{ animationDelay: '0.3s' }}`                                                       |
| `src/chat/LoadingDots/LoadingDots.tsx:83`                      | default?           | `style={{ animationDelay: '0s' }}`                                                         |
| `src/chat/LoadingDots/LoadingDots.tsx:87`                      | default?           | `style={{ animationDelay: '0.15s' }}`                                                      |
| `src/chat/LoadingDots/LoadingDots.tsx:91`                      | default?           | `style={{ animationDelay: '0.3s' }}`                                                       |
| `src/chat/MessageInput/MessageInput.tsx:65`                    | prop/dynamic       | `<Flexbox gap={16} style={{ flex: 1, width: '100%', ...style }} {...rest}>`                |
| `src/chat/MessageInput/MessageInput.tsx:71`                    | prop/dynamic       | `style={{ ...textAreaStyle, ...customStyles?.editor }}`                                    |
| `src/color/ColorScales/ScaleRow.tsx:62`                        | prop/dynamic       | `style={{ backgroundColor: color }}`                                                       |
| `src/color/ColorScales/index.tsx:31`                           | default?           | `<div style={{ padding: '8px 16px 32px 0' }}>`                                             |
| `src/color/ColorScales/index.tsx:55`                           | multi-line, review | `style={{`                                                                                 |
| `src/color/CssVar/ScaleRow.tsx:46`                             | prop/dynamic       | `style={{ backgroundColor: color }}`                                                       |
| `src/color/CssVar/VarRow.tsx:39`                               | prop/dynamic       | `style={{ backgroundColor: (cssVar as any)[`${name}${color}`] as any }}`                   |
| `src/color/CssVar/index.tsx:34`                                | default?           | `<div style={{ padding: '8px 16px 32px 0' }}>`                                             |
| `src/color/CssVar/index.tsx:58`                                | multi-line, review | `style={{`                                                                                 |
| `src/dashboard/PageSkeleton/PageSkeleton.tsx:60`               | prop/dynamic       | `style={{ ...bone, width }}`                                                               |
| `src/dashboard/RouteProgress/RouteProgress.tsx:41`             | multi-line, review | `style={{`                                                                                 |
| `src/dashboard/TitleWithTips/TitleWithTips.tsx:17`             | default?           | `<Icon color={cssVar.colorTextTertiary} icon={InfoIcon} style={{ cursor: 'help' }} />`     |
| `src/mdx/Callout/index.tsx:74`                                 | default?           | `<Icon icon={icon} size={{ size: '1.2em' }} style={{ marginBlock: '0.25em' }} />`          |
| `src/mdx/Cards/Card.tsx:59`                                    | default?           | `style={{ height: 'auto', width: '100%' }}`                                                |
| `src/mdx/Cards/Card.tsx:67`                                    | default?           | `style={{ paddingBottom: '0.2em', paddingTop: '1.8em' }}`                                  |
| `src/mdx/Cards/Card.tsx:72`                                    | multi-line, review | `style={{`                                                                                 |
| `src/mdx/Mdx/index.tsx:120`                                    | multi-line, review | `style={{`                                                                                 |
| `src/mdx/mdxComponents/Citation/PopoverPanel.tsx:63`           | default?           | `style={{ borderRadius: 4 }}`                                                              |
| `src/mdx/mdxComponents/Image.tsx:12`                           | multi-line, review | `style={{`                                                                                 |
| `src/mdx/mdxComponents/Video.tsx:17`                           | multi-line, review | `style={{`                                                                                 |
| `src/mobile/ChatInputArea/ChatInputArea.tsx:105`               | prop/dynamic       | `style={{ insetInlineEnd: 14, position: 'absolute', ...(expand ? { top: 6 } : {}) }}`      |
| `src/mobile/ChatInputArea/ChatInputArea.tsx:119`               | default?           | `style={{ flex: 1, minHeight: 36, paddingBlock: 6 }}`                                      |
| `src/mobile/ChatInputArea/ChatInputArea.tsx:96`                | default?           | `style={{ position: 'relative' }}`                                                         |

## Not in a batch (internal or exempt) (10 sites, 4 `default?`)

| Site                                                 | Kind               | Code                                                                                         |
| ---------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------- |
| `src/Freeze/Freeze.tsx:89`                           | default?           | `<div ref={contentRef} style={{ display: 'contents' }}>`                                     |
| `src/hooks/useMarkdown/useMarkdownComponents.tsx:48` | default?           | `({ children }: any) => <Hotkey keys={children} style={{ display: 'inline-flex' }} />,`      |
| `src/internal/overflow/OverflowList.tsx:79`          | default?           | `<div className={classNames?.root} ref={rootRef} style={{ position: 'relative' }}>`          |
| `src/spline/LogoThree/Loading.tsx:9`                 | prop/dynamic       | `<Center height={'100%'} justify={'center'} style={{ position: 'absolute' }} width={'100%'}` |
| `src/spline/LogoThree/LogoSpline.tsx:22`             | prop/dynamic       | `<div className={className} style={{ height, position: 'relative', width, ...style }}>`      |
| `src/spline/LogoThree/index.tsx:31`                  | prop/dynamic       | `style={{ height: size, overflow: 'hidden', position: 'relative', width: size, ...style }}`  |
| `src/spline/LogoThree/index.tsx:38`                  | default?           | `style={{ position: 'absolute' }}`                                                           |
| `src/spline/LogoThree/index.tsx:44`                  | multi-line, review | `style={{`                                                                                   |
| `src/spline/Spline/ParentSize.tsx:128`               | prop/dynamic       | `style={{ ...defaultParentSizeStyles, ...parentSizeStyles }}`                                |
| `src/spline/Spline/Spine.tsx:125`                    | multi-line, review | `style={{`                                                                                   |

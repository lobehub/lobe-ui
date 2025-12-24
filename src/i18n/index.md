---
nav: Hooks & Providers
group: Internationalization
title: I18n
description: Internationalization (i18n) provider and hooks for managing translations across multiple languages in your application.
---

## Locale Switcher

<code src="./demos/index.tsx" nopadding></code>

## APIs

### I18nProvider

Provider component that enables internationalization for your application.

| Property  | Description                           | Type                     | Default |
| --------- | ------------------------------------- | ------------------------ | ------- |
| locale    | Current locale                        | `string`                 | `'en'`  |
| resources | Array of translation resource objects | `TranslationResources[]` | `[]`    |
| children  | Child components                      | `ReactNode`              | -       |

### useI18n

Hook to access the translation function and current locale.

Returns an object with:

| Property | Type                              | Description          |
| -------- | --------------------------------- | -------------------- |
| locale   | `string`                          | Current locale       |
| t        | `(key: TranslationKey) => string` | Translation function |

### TranslationResources

A partial record of translation key-value pairs.

```ts
type TranslationResources = Partial<Record<TranslationKey, TranslationValue>>;
```

### Available Translation Keys

#### Common

| Key              | English | 简体中文 |
| ---------------- | ------- | -------- |
| `common.confirm` | Confirm | 确认     |
| `common.cancel`  | Cancel  | 取消     |
| `common.edit`    | Edit    | 编辑     |
| `common.delete`  | Delete  | 删除     |

#### Form

| Key                   | English                                                   | 简体中文                         |
| --------------------- | --------------------------------------------------------- | -------------------------------- |
| `form.submit`         | Submit                                                    | 提交                             |
| `form.reset`          | Reset                                                     | 重置                             |
| `form.unsavedChanges` | Unsaved changes                                           | 未保存的更改                     |
| `form.unsavedWarning` | You have unsaved changes. Are you sure you want to leave? | 您有未保存的更改。确定要离开吗？ |

#### Emoji Picker

| Key                         | English                                    | 简体中文                 |
| --------------------------- | ------------------------------------------ | ------------------------ |
| `emojiPicker.upload`        | Upload                                     | 上传                     |
| `emojiPicker.uploadBtn`     | Crop and Upload                            | 裁剪并上传               |
| `emojiPicker.delete`        | Delete                                     | 删除                     |
| `emojiPicker.emoji`         | Emoji                                      | 表情                     |
| `emojiPicker.draggerDesc`   | Click or Drag image to this area to upload | 点击或拖动图片到此处上传 |
| `emojiPicker.fileTypeError` | You can only upload image file!            | 只能上传图片文件！       |

#### Editable Message

| Key                                 | English                            | 简体中文           |
| ----------------------------------- | ---------------------------------- | ------------------ |
| `editableMessage.input`             | Input                              | 输入               |
| `editableMessage.output`            | Output                             | 输出               |
| `editableMessage.system`            | System                             | 系统               |
| `editableMessage.addProps`          | Add Props                          | 添加属性           |
| `editableMessage.delete`            | Delete                             | 删除               |
| `editableMessage.inputPlaceholder`  | Please enter sample input content  | 请输入示例输入内容 |
| `editableMessage.outputPlaceholder` | Please enter sample output content | 请输入示例输出内容 |

#### Hotkey

| Key                         | English                                                                           | 简体中文                                                     |
| --------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `hotkey.placeholder`        | Press keys to record shortcut                                                     | 按键录制快捷键                                               |
| `hotkey.reset`              | Reset to default                                                                  | 重置为默认                                                   |
| `hotkey.conflict`           | This shortcut conflicts with an existing one.                                     | 此快捷键与现有快捷键冲突。                                   |
| `hotkey.invalidCombination` | Shortcut must include a modifier key (Ctrl, Alt, Shift) and only one regular key. | 快捷键必须包含修饰键（Ctrl、Alt、Shift）且只能有一个常规键。 |

#### Token Tag

| Key                 | English  | 简体中文 |
| ------------------- | -------- | -------- |
| `tokenTag.used`     | Used     | 已用     |
| `tokenTag.remained` | Remained | 剩余     |
| `tokenTag.overload` | Overload | 超额     |

#### Message Modal

| Key                    | English | 简体中文 |
| ---------------------- | ------- | -------- |
| `messageModal.confirm` | Confirm | 确认     |
| `messageModal.cancel`  | Cancel  | 取消     |
| `messageModal.edit`    | Edit    | 编辑     |

#### Chat

| Key                | English | 简体中文 |
| ------------------ | ------- | -------- |
| `chat.avatar`      | avatar  | 头像     |
| `chat.placeholder` | ...     | ...      |

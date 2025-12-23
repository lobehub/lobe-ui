export type Locale = string;

type BuiltinTranslationResources = typeof import('./resources/chat').default &
  typeof import('./resources/common').default &
  typeof import('./resources/editableMessage').default &
  typeof import('./resources/emojiPicker').default &
  typeof import('./resources/form').default &
  typeof import('./resources/hotkey').default &
  typeof import('./resources/messageModal').default &
  typeof import('./resources/sideNav').default;

export type TranslationKey = keyof BuiltinTranslationResources;

export type TranslationValue = string;

/**
 * A (partial) dictionary of translations.
 *
 * Note: it's intentionally Partial so feature-level modules can pass only their own keys as
 * fallback resources (e.g. `useTranslation(editableMessageMessages)`).
 */
export type TranslationResources = Partial<Record<TranslationKey, TranslationValue>>;

export type I18nContextValue = {
  locale: Locale;
  t: (key: TranslationKey) => string;
};

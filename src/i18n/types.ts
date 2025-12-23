export type Locale = string;

type BuiltinTranslationResources = typeof import('./resources/en/chat').default &
  typeof import('./resources/en/common').default &
  typeof import('./resources/en/editableMessage').default &
  typeof import('./resources/en/emojiPicker').default &
  typeof import('./resources/en/form').default &
  typeof import('./resources/en/hotkey').default &
  typeof import('./resources/en/messageModal').default &
  typeof import('./resources/en/sideNav').default;

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

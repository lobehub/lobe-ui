// `@emoji-mart/data` resolves to a JSON file, which Node only loads with an import attribute,
// so it stays out of the static graph and loads when the picker opens.
export const loadEmojiData = (): Promise<unknown> =>
  import('@emoji-mart/data').then((module) => module.default);

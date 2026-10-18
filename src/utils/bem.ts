const BLOCK_PREFIX = 'lobe-';

export interface BEM {
  /** The block class name, e.g. `lobe-slider`. */
  block: string;
  /** The block itself, or `block__element` when a name is passed. */
  (element?: string): string;
}

const cache = new Map<string, BEM>();

/**
 * Builds the stable class names of one component block, following the
 * `lobe-<block>` / `lobe-<block>__<element>` BEM convention.
 *
 * Element names must match the component's `classNames` / `styles` slot keys, so
 * a consumer reads the same part name in CSS and in props. State and variants
 * belong on `data-*` attributes, never on `--modifier` classes: one source of
 * truth beats two.
 *
 * Generated StyleX hashes are not stable between releases, so these names are
 * the only surface integrations and e2e selectors may target.
 *
 * The factory is cached per block, so calling it at module scope, inside render,
 * or from a test all hand back the same instance.
 *
 * @example
 * ```tsx
 * const slider = bem('slider');
 *
 * slider();        // 'lobe-slider'
 * slider('thumb'); // 'lobe-slider__thumb'
 * ```
 */
export const bem = (block: string): BEM => {
  const cached = cache.get(block);
  if (cached) return cached;

  const base = `${BLOCK_PREFIX}${block}`;
  const factory = ((element?: string) => (element ? `${base}__${element}` : base)) as BEM;
  factory.block = base;

  cache.set(block, factory);
  return factory;
};

export interface StableClassManifest<E extends string> {
  block: string;
  dataAttributes?: readonly string[];
  elements: readonly E[];
}

export interface StableClasses<E extends string> {
  (element?: E): string;
  block: string;
  dataAttributes: readonly string[];
  elements: readonly E[];
}

export const stableClasses = <const E extends string>({
  block,
  dataAttributes = [],
  elements,
}: StableClassManifest<E>): StableClasses<E> => {
  const base = bem(block);
  const classes = ((element?: E) => base(element)) as StableClasses<E>;
  classes.block = base.block;
  classes.elements = elements;
  classes.dataAttributes = dataAttributes;
  return classes;
};

const toKebab = (key: string) => key.replaceAll(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);

export const toDataAttributes = (
  attrs: Record<string, string | number | boolean | null | undefined>,
): Record<`data-${string}`, string> => {
  const result: Record<`data-${string}`, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false || value === '') continue;
    result[`data-${toKebab(key)}`] = value === true ? '' : String(value);
  }
  return result;
};

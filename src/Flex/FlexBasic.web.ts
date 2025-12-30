import type { FC } from 'react';

import type { FlexBasicProps } from './type';
import { getCssValue, getFlexDirection, isHorizontal, isSpaceDistribution } from './utils';

type MaybeNumber = string | number | undefined;

type AttrName =
  | 'visible'
  | 'flex'
  | 'gap'
  | 'direction'
  | 'horizontal'
  | 'align'
  | 'justify'
  | 'distribution'
  | 'height'
  | 'width'
  | 'padding'
  | 'padding-inline'
  | 'paddingInline'
  | 'paddinginline'
  | 'padding-block'
  | 'paddingBlock'
  | 'paddingblock'
  | 'prefix-cls'
  | 'prefixCls'
  | 'prefixcls'
  | 'wrap';

const parseBooleanAttr = (value: string | null) => {
  if (value === null) return undefined;
  const normalized = value.trim().toLowerCase();
  if (normalized === '' || normalized === 'true' || normalized === '1' || normalized === 'yes')
    return true;
  if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
  // Treat presence as true if unknown
  return true;
};

const parseMaybeNumber = (value: string | null): MaybeNumber => {
  if (value === null) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (/^\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
};

const readStringAttr = (value: string | null) => {
  if (value === null) return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const getAttr = (el: HTMLElement, ...names: string[]) => {
  for (const name of names) {
    const direct = el.getAttribute(name);
    if (direct !== null) return direct;

    const lowered = name.toLowerCase();
    if (lowered !== name) {
      const lowerValue = el.getAttribute(lowered);
      if (lowerValue !== null) return lowerValue;
    }
  }
  return null;
};

const defineFlexBasicElement = (tagName = 'lobe-flex') => {
  if (typeof customElements === 'undefined' || typeof document === 'undefined') return;
  if (customElements.get(tagName)) return;

  class FlexBasicElement extends HTMLElement {
    static observedAttributes: AttrName[] = [
      'visible',
      'flex',
      'gap',
      'direction',
      'horizontal',
      'align',
      'justify',
      'distribution',
      'height',
      'width',
      'padding',
      'padding-inline',
      'paddingInline',
      'paddinginline',
      'padding-block',
      'paddingBlock',
      'paddingblock',
      'prefix-cls',
      'prefixCls',
      'prefixcls',
      'wrap',
    ];

    #initialized = false;
    #prefixFlexClass: string | undefined;

    connectedCallback() {
      if (!this.#initialized) {
        // Don't clobber existing classes set by frameworks (e.g. React `className`)
        this.classList.add('lobe-flex');
        this.#initialized = true;
      }

      this.#sync();
    }

    attributeChangedCallback() {
      this.#sync();
    }

    #sync() {
      if (!this.#initialized) return;

      // visible -> hidden
      const visible = parseBooleanAttr(this.getAttribute('visible'));
      const isVisible = visible !== false;
      this.classList.toggle('lobe-flex--hidden', !isVisible);

      // prefix class
      const prefixCls = readStringAttr(getAttr(this, 'prefix-cls', 'prefixCls'));
      const nextPrefixFlexClass = prefixCls ? `${prefixCls}-flex` : undefined;
      if (this.#prefixFlexClass && this.#prefixFlexClass !== nextPrefixFlexClass) {
        this.classList.remove(this.#prefixFlexClass);
      }
      if (nextPrefixFlexClass) this.classList.add(nextPrefixFlexClass);
      this.#prefixFlexClass = nextPrefixFlexClass;

      const direction = readStringAttr(this.getAttribute('direction')) as any;
      const horizontal = parseBooleanAttr(this.getAttribute('horizontal'));

      const justify = readStringAttr(this.getAttribute('justify'));
      const distribution = readStringAttr(this.getAttribute('distribution'));
      const justifyContent = justify ?? distribution;

      const widthAttr = parseMaybeNumber(this.getAttribute('width'));
      const finalWidth = (() => {
        if (
          isHorizontal(direction, horizontal) &&
          widthAttr === undefined &&
          isSpaceDistribution(justifyContent)
        ) {
          return '100%';
        }
        return getCssValue(widthAttr as any);
      })();

      const flex = readStringAttr(this.getAttribute('flex'));
      const wrap = readStringAttr(this.getAttribute('wrap'));
      const align = readStringAttr(this.getAttribute('align'));

      const height = parseMaybeNumber(this.getAttribute('height'));
      const padding = parseMaybeNumber(this.getAttribute('padding'));
      const paddingInline = parseMaybeNumber(getAttr(this, 'padding-inline', 'paddingInline'));
      const paddingBlock = parseMaybeNumber(getAttr(this, 'padding-block', 'paddingBlock'));
      const gap = parseMaybeNumber(this.getAttribute('gap'));

      const setVar = (name: string, value: string | number | undefined) => {
        if (value === undefined) {
          this.style.removeProperty(name);
          return;
        }
        this.style.setProperty(name, String(value));
      };

      if (flex !== undefined) setVar('--lobe-flex', flex);
      else this.style.removeProperty('--lobe-flex');

      if (direction !== undefined || horizontal !== undefined) {
        setVar('--lobe-flex-direction', getFlexDirection(direction, horizontal));
      } else {
        this.style.removeProperty('--lobe-flex-direction');
      }

      if (wrap !== undefined) setVar('--lobe-flex-wrap', wrap);
      else this.style.removeProperty('--lobe-flex-wrap');

      if (justifyContent !== undefined) setVar('--lobe-flex-justify', justifyContent);
      else this.style.removeProperty('--lobe-flex-justify');

      if (align !== undefined) setVar('--lobe-flex-align', align);
      else this.style.removeProperty('--lobe-flex-align');

      if (finalWidth !== undefined) setVar('--lobe-flex-width', finalWidth);
      else this.style.removeProperty('--lobe-flex-width');

      if (height !== undefined) setVar('--lobe-flex-height', getCssValue(height as any)!);
      else this.style.removeProperty('--lobe-flex-height');

      if (padding !== undefined) setVar('--lobe-flex-padding', getCssValue(padding as any)!);
      else this.style.removeProperty('--lobe-flex-padding');

      if (paddingInline !== undefined)
        setVar('--lobe-flex-padding-inline', getCssValue(paddingInline as any)!);
      else this.style.removeProperty('--lobe-flex-padding-inline');

      if (paddingBlock !== undefined)
        setVar('--lobe-flex-padding-block', getCssValue(paddingBlock as any)!);
      else this.style.removeProperty('--lobe-flex-padding-block');

      if (gap !== undefined) setVar('--lobe-flex-gap', getCssValue(gap as any)!);
      else this.style.removeProperty('--lobe-flex-gap');
    }
  }
  customElements.define(tagName, FlexBasicElement);
};

void defineFlexBasicElement();
export const NativeFlexBasicElement = 'lobe-flex' as unknown as FC<FlexBasicProps>;

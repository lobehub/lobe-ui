import './FlexBasic.web';

describe('FlexBasic.web custom element attrs', () => {
  it('should read React-style camelCase attrs for paddingInline/paddingBlock/prefixCls', () => {
    // JSDOM may not support custom elements depending on environment/polyfills.
    if (typeof customElements === 'undefined') return;

    const el = document.createElement('lobe-flex') as HTMLElement;
    el.setAttribute('paddingInline', '4');
    el.setAttribute('paddingBlock', '8');
    el.setAttribute('prefixCls', 'acme');
    document.body.append(el);

    expect(el.style.getPropertyValue('--lobe-flex-padding-inline')).toBe('4px');
    expect(el.style.getPropertyValue('--lobe-flex-padding-block')).toBe('8px');
    expect(el.classList.contains('acme-flex')).toBe(true);

    el.remove();
  });

  it('should still support kebab-case attrs', () => {
    if (typeof customElements === 'undefined') return;

    const el = document.createElement('lobe-flex') as HTMLElement;
    el.setAttribute('padding-inline', '12');
    el.setAttribute('padding-block', '16');
    el.setAttribute('prefix-cls', 'kebab');
    document.body.append(el);

    expect(el.style.getPropertyValue('--lobe-flex-padding-inline')).toBe('12px');
    expect(el.style.getPropertyValue('--lobe-flex-padding-block')).toBe('16px');
    expect(el.classList.contains('kebab-flex')).toBe(true);

    el.remove();
  });
});

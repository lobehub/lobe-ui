import { memo, useEffect, useRef } from 'react';

const createElement = (url: string) => {
  const element = document.createElement('link');
  element.rel = 'stylesheet';
  element.href = url;
  return element;
};

export interface FontLoaderProps {
  /**
   * @description The URL of the font to load
   */
  url: string;
}

const FontLoader = memo<FontLoaderProps>(({ url }) => {
  const loadRef = useRef(false);

  useEffect(() => {
    if (loadRef.current) return;
    loadRef.current = true;

    const element = createElement(url);
    document.head.append(element);
  }, []);

  return null;
});

export default FontLoader;

import { memo, useEffect } from 'react';

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
  useEffect(() => {
    const element = createElement(url);
    document.head.append(element);
  }, []);
  return false;
});

export default FontLoader;

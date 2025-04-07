'use client';

import { memo, useEffect, useRef } from 'react';

const createElement = (url: string) => {
  const element = document.createElement('link');
  element.rel = 'stylesheet';
  element.href = url;
  return element;
};

export interface FontLoaderProps {
  url: string;
}

const FontLoader = memo<FontLoaderProps>(({ url }) => {
  const elementRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Create and append element
    const element = createElement(url);
    document.head.append(element);
    elementRef.current = element;

    // Optional: Add error handling
    const handleError = () => console.error(`Failed to load font from ${url}`);
    element.addEventListener('error', handleError);

    // Cleanup function to remove element when component unmounts
    // or when url changes
    return () => {
      element.removeEventListener('error', handleError);
      element.remove();
      elementRef.current = null;
    };
  }, [url]);

  return null;
});

FontLoader.displayName = 'FontLoader';

export default FontLoader;

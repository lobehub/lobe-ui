import { ReactNode, createContext, memo, useEffect, useRef, useState } from 'react';

type Direction = 'left' | 'right';

export const GlobalMouseDirectionContext = createContext<Direction>('right');

export const GlobalMouseDirectionProvider = memo(({ children }: { children: ReactNode }) => {
  const [direction, setDirection] = useState<Direction>('right');
  const prevX = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX > prevX.current) {
        setDirection((prev) => (prev !== 'right' ? 'right' : prev));
      } else if (e.clientX < prevX.current) {
        setDirection((prev) => (prev !== 'left' ? 'left' : prev));
      }
      prevX.current = e.clientX;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <GlobalMouseDirectionContext.Provider value={direction}>
      {children}
    </GlobalMouseDirectionContext.Provider>
  );
});

import { Flexbox } from '@lobehub/ui';
import { Button, Carousel, type CarouselRef } from '@lobehub/ui/base-ui';
import { useRef, useState } from 'react';

const slides = [
  { background: '#0f172a', height: 160, title: 'Agents' },
  { background: '#7c3aed', height: 220, title: 'Plugins' },
  { background: '#0891b2', height: 120, title: 'Knowledge' },
];

export default () => {
  const ref = useRef<CarouselRef>(null);
  const [index, setIndex] = useState(0);

  return (
    <Flexbox gap={16} padding={16} style={{ maxWidth: 420 }}>
      <Carousel adaptiveHeight arrows autoplay={4000} ref={ref} onIndexChange={setIndex}>
        {slides.map(({ background, height, title }) => (
          <Flexbox
            align="center"
            justify="center"
            key={title}
            style={{ background, borderRadius: 12, color: '#fff', fontSize: 24, height }}
          >
            {title}
          </Flexbox>
        ))}
      </Carousel>
      <Flexbox horizontal align="center" gap={8}>
        <Button onClick={() => ref.current?.prev()}>Prev</Button>
        <Button onClick={() => ref.current?.next()}>Next</Button>
        <span>Slide {index + 1}</span>
      </Flexbox>
    </Flexbox>
  );
};

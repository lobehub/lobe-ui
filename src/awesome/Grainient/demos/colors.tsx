import { Grainient } from '@lobehub/ui/awesome';

export default () => (
  <div style={{ blockSize: 320, overflow: 'hidden', position: 'relative' }}>
    <Grainient
      color1="#7DD3FC"
      color2="#0EA5E9"
      color3="#1E293B"
      grainAmount={0.06}
      lightMode="auto"
      timeSpeed={0.15}
    />
  </div>
);

'use client';

import { memo, type PointerEvent, useRef } from 'react';

import { styles } from './style';

export interface SaturationAreaProps {
  hue: number;
  label: string;
  onChange: (saturation: number, value: number) => void;
  onChangeComplete: (saturation: number, value: number) => void;
  saturation: number;
  value: number;
}

const clamp = (n: number) => Math.min(1, Math.max(0, Math.round(n * 100) / 100));

const SaturationArea = memo<SaturationAreaProps>(
  ({ hue, label, onChange, onChangeComplete, saturation, value }) => {
    const areaRef = useRef<HTMLDivElement>(null);

    const fromPointer = (event: PointerEvent<HTMLDivElement>): [number, number] => {
      const rect = areaRef.current!.getBoundingClientRect();
      const next: [number, number] = [
        clamp((event.clientX - rect.left) / rect.width),
        clamp(1 - (event.clientY - rect.top) / rect.height),
      ];
      onChange(...next);
      return next;
    };

    return (
      <div
        aria-label={label}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(saturation * 100)}
        aria-valuetext={`Saturation ${Math.round(saturation * 100)}%, brightness ${Math.round(value * 100)}%`}
        className={styles.saturation}
        ref={areaRef}
        role="slider"
        tabIndex={0}
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue} 100% 50%))`,
        }}
        onKeyDown={(event) => {
          const delta = event.shiftKey ? 0.1 : 0.01;
          const moves: Record<string, [number, number]> = {
            ArrowDown: [0, -delta],
            ArrowLeft: [-delta, 0],
            ArrowRight: [delta, 0],
            ArrowUp: [0, delta],
          };
          const move = moves[event.key];
          if (!move) return;
          event.preventDefault();
          const next: [number, number] = [clamp(saturation + move[0]), clamp(value + move[1])];
          onChange(...next);
          onChangeComplete(...next);
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
        }}
        onPointerUp={(event) => {
          event.currentTarget.releasePointerCapture(event.pointerId);
          onChangeComplete(...fromPointer(event));
        }}
      >
        <span
          className={styles.thumb}
          style={{ left: `${saturation * 100}%`, top: `${(1 - value) * 100}%` }}
        />
      </div>
    );
  },
);

SaturationArea.displayName = 'ColorPickerSaturationArea';

export default SaturationArea;

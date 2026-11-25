import clsx from 'clsx';
import type { FC } from 'react';

import { styleProps } from '@/styles/stylex/props';

import { brandLobotBrandLoadingClasses } from './stable';
import { styles } from './style';
import type { LobotBrandLoadingProps } from './type';

// Geometry of the Lobot logo on its 446 × 469 artboard. The view box adds the outline of
// `LobotMono` around it, so both render the mark at the same place and scale.
const VIEW_BOX = '-29.1 -28.46 525.24 525.24';
const BODY =
  'M125.436 127.784C137.593 75.2061 188.685 39.7239 243.897 47.3418C280.292 52.3634 309.891 74.9284 325.114 105.166C340.495 94.3117 359.563 89.0506 379.298 91.7734C421.81 97.6394 451.315 138.336 445.197 182.672C442.807 199.998 435.329 215.315 424.569 227.198C430.651 244.902 433.934 263.76 433.934 283.327C433.933 385.548 344.373 468.414 233.897 468.414C123.42 468.414 33.8606 385.548 33.8604 283.327C33.8604 277.825 34.1196 272.378 34.628 266.997C10.4918 250.502 -3.60641 220.437 0.802757 188.48C6.92004 144.145 46.3427 112.958 88.8555 118.824C100.518 120.433 111.202 124.663 120.439 130.871C122.087 129.819 123.753 128.791 125.436 127.784Z';
const INK = '#000';
const PAPER = '#fff';
// Outline width of the mark, as a stroke centered on the silhouette.
const OUTLINE = 56.94;
const BUBBLE_RADIUS = 32.034;
const HALO_RADIUS = BUBBLE_RADIUS + OUTLINE / 2;
// The two bubbles of the logo are the ends of the orbit's long axis.
const ORBIT = 'translate(224.286 55.882) rotate(-10.572)';

const bubbleClassName = brandLobotBrandLoadingClasses('bubble');
const bodyClassName = brandLobotBrandLoadingClasses('body');

/**
 * The Lobot mark as a loader: its two bubbles circle the head, passing over it and then behind
 * the body, while the eyes follow the one overhead and blink as the next one comes around.
 *
 * The white outline is one backing layer under every black part, so it always traces the union
 * of body and bubbles and never cuts into a bubble that slides behind the body.
 */
const LobotBrandLoading: FC<LobotBrandLoadingProps> = ({
  size = 64,
  className,
  style,
  ...rest
}) => (
  <svg
    fill="none"
    height={size}
    viewBox={VIEW_BOX}
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...styleProps(styles.root, clsx(brandLobotBrandLoadingClasses(), className), style)}
    {...rest}
  >
    <title>Lobot</title>
    <g fill={PAPER}>
      <g transform={ORBIT}>
        <g {...styleProps(styles.orbitXSmall)}>
          <g {...styleProps(styles.orbitYSmall)}>
            <circle r={HALO_RADIUS} {...styleProps(styles.haloSmall)} />
          </g>
        </g>
        <g {...styleProps(styles.orbitXLarge)}>
          <g {...styleProps(styles.orbitYLarge)}>
            <circle r={HALO_RADIUS} {...styleProps(styles.haloLarge)} />
          </g>
        </g>
      </g>
      <path
        d={BODY}
        stroke={PAPER}
        strokeLinejoin="round"
        strokeWidth={OUTLINE}
        {...styleProps(styles.body)}
      />
    </g>
    <g fill={INK}>
      <g transform={ORBIT}>
        <g {...styleProps(styles.orbitXSmall)}>
          <g {...styleProps(styles.orbitYSmall)}>
            <circle r={BUBBLE_RADIUS} {...styleProps(styles.bubbleSmall, bubbleClassName)} />
          </g>
        </g>
        <g {...styleProps(styles.orbitXLarge)}>
          <g {...styleProps(styles.orbitYLarge)}>
            <circle r={BUBBLE_RADIUS} {...styleProps(styles.bubbleLarge, bubbleClassName)} />
          </g>
        </g>
      </g>
      <g {...styleProps(styles.body, bodyClassName)}>
        <path d={BODY} />
        <g fill={PAPER} {...styleProps(styles.eyes, brandLobotBrandLoadingClasses('eyes'))}>
          <ellipse cx={170.54} cy={280.479} rx={58.373} ry={66.916} />
          <ellipse cx={320.035} cy={280.479} rx={58.373} ry={66.916} />
          <g fill={INK} {...styleProps(styles.pupils)}>
            <ellipse cx={181.219} cy={290.443} rx={30.61} ry={34.17} />
            <ellipse cx={310.779} cy={290.443} rx={30.61} ry={34.17} />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

LobotBrandLoading.displayName = 'LobotBrandLoading';

export default LobotBrandLoading;

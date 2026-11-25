/**
 * Writes scenes into the SVG of a live avatar. Elements are pooled and an attribute is only
 * touched when its value changed, so a frame costs a few transforms rather than a React render.
 */
import type { AgentAvatarScene, SceneEye, SceneUse } from './scene';
import { PUPIL_COLOR, SCLERA_COLOR } from './utils';

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface AgentAvatarLayers {
  body: SVGGElement;
  defs: SVGDefsElement;
  eyes: SVGGElement;
}

const create = <K extends keyof SVGElementTagNameMap>(tag: K, parent: Element) => {
  const element = document.createElementNS(SVG_NS, tag);
  parent.append(element);
  return element as SVGElementTagNameMap[K];
};

/** The attribute values last written per element. */
const written = new WeakMap<Element, Record<string, string | null>>();

/** Set or remove an attribute, skipping the DOM when the value is unchanged. */
const put = (element: Element, name: string, value: string | null) => {
  let cache = written.get(element);
  if (!cache) {
    cache = {};
    written.set(element, cache);
  }
  if (cache[name] === value) return;
  cache[name] = value;
  if (value === null) element.removeAttribute(name);
  else element.setAttribute(name, value);
};

const show = (element: Element, visible: boolean) =>
  put(element, 'display', visible ? null : 'none');

interface EyeNodes {
  group: SVGGElement;
  pupil: SVGPathElement;
  sclera: SVGPathElement;
  smile: SVGPathElement;
}

export interface PainterEyeColors {
  pupil: string;
  sclera: string;
}

export const createPainter = (
  layers: AgentAvatarLayers,
  idPrefix: string,
  eyeColors: PainterEyeColors = { pupil: PUPIL_COLOR, sclera: SCLERA_COLOR },
) => {
  const defined = new Map<string, SVGPathElement>();
  const slices: SVGUseElement[] = [];
  const eyes: EyeNodes[] = [];
  const owned: Element[] = [];
  let extra: SVGPathElement | undefined;

  const paintSlices = (items: SceneUse[]) => {
    while (slices.length < items.length) {
      const element = create('use', layers.body);
      owned.push(element);
      slices.push(element);
    }
    for (const [index, element] of slices.entries()) {
      const item = items[index];
      show(element, !!item);
      if (!item) continue;
      put(element, 'href', `#${idPrefix}${item.href}`);
      put(element, 'transform', item.transform);
    }
  };

  const createEye = (): EyeNodes => {
    const group = create('g', layers.eyes);
    owned.push(group);
    const sclera = create('path', group);
    sclera.setAttribute('fill', eyeColors.sclera);
    const pupil = create('path', group);
    pupil.setAttribute('fill', eyeColors.pupil);
    const smile = create('path', group);
    smile.setAttribute('fill', 'none');
    smile.setAttribute('stroke', eyeColors.sclera);
    smile.setAttribute('stroke-linecap', 'round');
    return { group, pupil, sclera, smile };
  };

  const paintPart = (element: SVGPathElement, d: string | null) => {
    show(element, d !== null);
    if (d !== null) put(element, 'd', d);
  };

  const paintEyes = (items: SceneEye[]) => {
    while (eyes.length < items.length) eyes.push(createEye());
    for (const [index, nodes] of eyes.entries()) {
      const item = items[index];
      show(nodes.group, !!item);
      if (!item) continue;
      put(nodes.group, 'transform', item.transform);
      paintPart(nodes.sclera, item.sclera);
      paintPart(nodes.pupil, item.pupil);
      paintPart(nodes.smile, item.smile);
      if (item.smile) put(nodes.smile, 'stroke-width', String(item.smileWidth));
    }
  };

  return {
    destroy: () => {
      for (const element of owned) element.remove();
      for (const element of defined.values()) element.remove();
    },
    paint: (scene: AgentAvatarScene) => {
      for (const { d, evenOdd, id } of scene.paths) {
        if (defined.has(id)) continue;
        const path = create('path', layers.defs);
        path.id = `${idPrefix}${id}`;
        path.setAttribute('d', d);
        if (evenOdd) path.setAttribute('fill-rule', 'evenodd');
        defined.set(id, path);
      }
      paintSlices(scene.body);
      if (scene.extra && !extra) {
        extra = create('path', layers.body);
        owned.push(extra);
      }
      if (extra) {
        show(extra, !!scene.extra);
        if (scene.extra) {
          put(extra, 'd', scene.extra.d);
          put(extra, 'transform', scene.extra.transform);
        }
      }
      paintEyes(scene.eyes);
    },
  };
};

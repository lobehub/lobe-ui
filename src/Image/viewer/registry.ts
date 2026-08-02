import type { ImagePreviewOptions } from '../type';

export interface ResolvedPreviewOptions extends Omit<ImagePreviewOptions, 'maxScale'> {
  maxScale: number;
}

export interface PreviewEntry {
  element: HTMLImageElement;
  options: ResolvedPreviewOptions;
  previewSrc?: string;
  src: string;
}

export const openPreview = (_entry: PreviewEntry): void => {};

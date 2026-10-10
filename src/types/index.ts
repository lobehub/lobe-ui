import type { AnchorHTMLAttributes, HTMLAttributes,ImgHTMLAttributes } from 'react';

export * from './customStylish';
export * from './customToken';
export * from './trigger';

export type DivProps = HTMLAttributes<HTMLDivElement>;

export type VideoProps = HTMLAttributes<HTMLVideoElement>;

export type SvgProps = HTMLAttributes<SVGSVGElement>;

export type ImgProps = ImgHTMLAttributes<HTMLImageElement>;

export type AProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type InputProps = HTMLAttributes<HTMLInputElement>;

export type TextAreaProps = HTMLAttributes<HTMLTextAreaElement>;

export type SpanProps = HTMLAttributes<HTMLSpanElement>;

export type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;

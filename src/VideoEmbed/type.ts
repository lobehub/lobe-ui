import type { CSSProperties, HTMLAttributes, Ref } from 'react';

export interface VideoEmbedClassNames {
  caption?: string;
  frame?: string;
  root?: string;
}

export interface VideoEmbedStyles {
  caption?: CSSProperties;
  frame?: CSSProperties;
  root?: CSSProperties;
}

export interface VideoEmbedTexts {
  /** Accessible name of the player when there is no `title`. @default 'Video' */
  title?: string;
  /** Shown for a URL that is neither YouTube, Vimeo nor a video file. */
  unsupported?: string;
}

export type VideoEmbedVariant = 'default' | 'a2ui';

/** Where a URL plays: an embedded YouTube or Vimeo player, a video file, or nowhere. */
export type VideoEmbedSource =
  | { id: string; kind: 'youtube' | 'vimeo'; src: string }
  | { kind: 'file'; src: string }
  | { kind: 'unsupported' };

export interface VideoEmbedProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  classNames?: VideoEmbedClassNames;
  /** Poster of a video file. */
  poster?: string;
  ref?: Ref<HTMLElement>;
  styles?: VideoEmbedStyles;
  /** Overrides the built-in `video.embed*` texts. */
  texts?: VideoEmbedTexts;
  /** Caption under the player; also its accessible name. */
  title?: string;
  /**
   * A YouTube (`watch`, `youtu.be`, `embed`, `shorts`) or Vimeo link, embedded through the
   * privacy-friendly `youtube-nocookie.com` and `player.vimeo.com?dnt=1`; or a video file
   * (`.mp4`, `.webm`, `.mov`, `.ogg`), played by the lobe-ui `Video`.
   */
  url: string;
  /**
   * `default`: a lobe-ui frame (theme radius) with a body-size caption.
   * `a2ui`: the A2UI playground embed (12px hairline frame, 12px muted caption).
   * @default 'default'
   */
  variant?: VideoEmbedVariant;
}

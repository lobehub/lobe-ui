'use client';

import * as stylex from '@stylexjs/stylex';
import clsx from 'clsx';
import { memo, useMemo } from 'react';

import videoMessages from '@/i18n/resources/en/video';
import { useTranslation } from '@/i18n/useTranslation';
import { a2uiStyles } from '@/internal/a2ui/styles';
import { a2ui } from '@/internal/a2ui/tokens.stylex';
import { cssVar } from '@/styles/stylex/cssVar.stylex';
import { styleProps } from '@/styles/stylex/props';
import Video from '@/Video';

import { videoEmbedSourceOf } from './source';
import { videoEmbedClasses } from './stable';
import type { VideoEmbedProps } from './type';

// Adapted from CopilotKit a2ui-playground (MIT), `renderers/content.tsx` VideoEmbed.
const styles = stylex.create({
  caption: {
    color: a2ui.fgMuted,
    fontSize: 12,
  },
  dCaption: {
    color: cssVar.colorTextDescription,
    fontSize: cssVar.fontSizeSM,
  },
  dFrame: {
    borderColor: cssVar.colorBorderSecondary,
    borderRadius: cssVar.borderRadiusLG,
  },
  frame: {
    overflow: 'hidden',
    borderColor: a2ui.line,
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 1,
    // The letterbox behind the player, as the lobe-ui `Video` frame.
    backgroundColor: '#000',
    inlineSize: '100%',
  },
  player: {
    borderWidth: 0,
    display: 'block',
    blockSize: '100%',
    inlineSize: '100%',
  },
  root: {
    gap: 6,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    inlineSize: '100%',
    minInlineSize: 0,
  },
  unsupported: {
    alignItems: 'center',
    color: cssVar.colorTextLightSolid,
    display: 'flex',
    fontSize: 12,
    justifyContent: 'center',
    opacity: 0.65,
    blockSize: '100%',
  },
});

/**
 * A YouTube or Vimeo video embedded by URL (privacy-friendly embed domains), or a video file in
 * the lobe-ui `Video` player, with a caption. A lobe-ui frame (`default`) or the A2UI playground
 * embed (`a2ui`).
 */
const VideoEmbed = memo<VideoEmbedProps>(
  ({
    className,
    classNames,
    poster,
    ref,
    style,
    styles: customStyles,
    texts,
    title,
    url,
    variant = 'default',
    ...rest
  }) => {
    const isA2ui = variant === 'a2ui';
    const { t } = useTranslation(videoMessages);
    const source = useMemo(() => videoEmbedSourceOf(url), [url]);
    const name = title ?? texts?.title ?? t('video.embedTitle');

    return (
      <figure
        ref={ref}
        {...rest}
        {...styleProps(
          [isA2ui && a2uiStyles.base, styles.root],
          clsx(videoEmbedClasses(), className, classNames?.root),
          { ...style, ...customStyles?.root },
        )}
        data-source={source.kind}
        data-variant={variant}
      >
        <div
          {...styleProps(
            [styles.frame, !isA2ui && styles.dFrame],
            clsx(videoEmbedClasses('frame'), classNames?.frame),
            { aspectRatio: '16 / 9', ...customStyles?.frame },
          )}
        >
          {source.kind === 'youtube' || source.kind === 'vimeo' ? (
            <iframe
              allowFullScreen
              allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              src={source.src}
              title={name}
              {...styleProps(styles.player, videoEmbedClasses('player'))}
            />
          ) : source.kind === 'file' ? (
            <Video
              className={videoEmbedClasses('player')}
              height="100%"
              poster={poster}
              src={source.src}
              style={{ height: '100%', width: '100%' }}
              width="100%"
            />
          ) : (
            <div {...styleProps(styles.unsupported, videoEmbedClasses('unsupported'))}>
              {texts?.unsupported ?? t('video.embedUnsupported')}
            </div>
          )}
        </div>
        {title ? (
          <figcaption
            {...styleProps(
              isA2ui ? styles.caption : styles.dCaption,
              clsx(videoEmbedClasses('caption'), classNames?.caption),
              customStyles?.caption,
            )}
          >
            {title}
          </figcaption>
        ) : null}
      </figure>
    );
  },
);

VideoEmbed.displayName = 'VideoEmbed';

export default VideoEmbed;

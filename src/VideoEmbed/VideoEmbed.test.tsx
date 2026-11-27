import { render, screen } from '@testing-library/react';

import { videoEmbedSourceOf } from './source';
import VideoEmbed from './VideoEmbed';

describe('videoEmbedSourceOf', () => {
  test('maps YouTube and Vimeo links to privacy-friendly embeds', () => {
    for (const url of [
      'https://www.youtube.com/watch?v=aircAruvnKk',
      'https://youtu.be/aircAruvnKk',
      'https://www.youtube.com/shorts/aircAruvnKk',
      'https://www.youtube.com/embed/aircAruvnKk',
    ])
      expect(videoEmbedSourceOf(url)).toEqual({
        id: 'aircAruvnKk',
        kind: 'youtube',
        src: 'https://www.youtube-nocookie.com/embed/aircAruvnKk',
      });
    expect(videoEmbedSourceOf('https://vimeo.com/76979871')).toEqual({
      id: '76979871',
      kind: 'vimeo',
      src: 'https://player.vimeo.com/video/76979871?dnt=1',
    });
  });

  test('recognises video files and rejects the rest', () => {
    expect(videoEmbedSourceOf('https://cdn.example.com/clip.mp4?x=1').kind).toBe('file');
    expect(videoEmbedSourceOf('https://example.com/page').kind).toBe('unsupported');
    expect(videoEmbedSourceOf('javascript:alert(1)').kind).toBe('unsupported');
  });
});

describe('VideoEmbed', () => {
  test('embeds a YouTube video with its title as caption and name', () => {
    const { container } = render(
      <VideoEmbed title="Neural networks" url="https://youtu.be/aircAruvnKk" />,
    );
    const iframe = container.querySelector('iframe')!;
    expect(iframe.getAttribute('src')).toBe('https://www.youtube-nocookie.com/embed/aircAruvnKk');
    expect(iframe.getAttribute('title')).toBe('Neural networks');
    expect(screen.getByText('Neural networks').tagName).toBe('FIGCAPTION');
  });

  test('shows a notice for an unsupported URL', () => {
    const { container } = render(<VideoEmbed url="https://example.com/page" />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByText('Unsupported video URL')).toBeTruthy();
  });

  test('defaults to the lobe-ui variant and switches to a2ui', () => {
    const url = 'https://youtu.be/aircAruvnKk';
    const { container, rerender } = render(<VideoEmbed title="A" url={url} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.dataset.variant).toBe('default');
    expect(root.dataset.source).toBe('youtube');
    const frame = container.querySelector('.lobe-video-embed__frame')!.className;
    rerender(<VideoEmbed title="A" url={url} variant="a2ui" />);
    expect(root.dataset.variant).toBe('a2ui');
    expect(container.querySelector('.lobe-video-embed__frame')!.className).not.toBe(frame);
  });
});

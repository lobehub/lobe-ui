import { Flexbox, useVideo, useVideoPlayer, useVideoState, Video } from '@lobehub/ui';

import { markers, SAMPLE_SRC, sections } from './data';

const NOTE = { end: 19, start: 16 };

const NotesLane = () => {
  const duration = useVideo((state) => state.duration);
  if (!duration) return null;
  return (
    <div style={{ height: 6, marginBlock: 4, position: 'relative' }}>
      <div
        style={{
          background: 'rgb(255 77 79 / 70%)',
          borderRadius: 3,
          height: '100%',
          left: `${(NOTE.start / duration) * 100}%`,
          position: 'absolute',
          width: `${((NOTE.end - NOTE.start) / duration) * 100}%`,
        }}
      />
    </div>
  );
};

export default () => {
  const player = useVideoPlayer();
  const active = useVideoState(player, (state) => state.activeMarkers);

  return (
    <Flexbox gap={12} style={{ maxWidth: 640, width: '100%' }}>
      <Video.Root markers={markers} player={player} sections={sections} src={SAMPLE_SRC}>
        <Video.Frame>
          <Video.Caption
            action={(marker) =>
              marker.color === 'success' ? (
                <button
                  type="button"
                  style={{
                    background: 'rgb(255 255 255 / 14%)',
                    border: 'none',
                    borderRadius: 4,
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12,
                    marginInlineStart: 8,
                    padding: '2px 6px',
                  }}
                >
                  Disagree
                </button>
              ) : null
            }
          />
          <Video.CenterPlay />
          <Video.LoadError />
        </Video.Frame>
        <Video.Controls frameStep>
          <Video.Timeline>
            <NotesLane />
          </Video.Timeline>
        </Video.Controls>
        <Video.SectionList />
      </Video.Root>
      <Flexbox gap={4}>
        {markers.map((marker) => (
          <button
            key={marker.time}
            type="button"
            style={{
              background: active.includes(marker)
                ? 'var(--lobe-color-fill-tertiary)'
                : 'transparent',
              border: 'none',
              borderRadius: 6,
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              fontSize: 13,
              gap: 8,
              padding: '4px 8px',
              textAlign: 'start',
            }}
            onClick={() => {
              player.pause();
              player.seek(marker.time);
            }}
          >
            <span style={{ fontFamily: 'var(--lobe-font-family-code)', opacity: 0.6 }}>
              0:{marker.time}
            </span>
            <b>{marker.label}</b>
            {marker.content}
          </button>
        ))}
      </Flexbox>
    </Flexbox>
  );
};

import { TypewriterEffect } from '@lobehub/ui/awesome';

import { Flexbox } from '@/Flex';

export default () => {
  return (
    <Flexbox gap={16}>
      <div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
          Default - Cursor always visible
        </div>
        <TypewriterEffect sentences={['Always show cursor']} />
      </div>
      <div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Hide cursor while typing</div>
        <TypewriterEffect hideCursorWhileTyping="typing" sentences={['Hide while typing']} />
      </div>
      <div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>
          Hide cursor after typing (during pause)
        </div>
        <TypewriterEffect
          hideCursorWhileTyping="afterTyping"
          sentences={['Hide after typing complete']}
        />
      </div>
      <div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>No cursor fade</div>
        <TypewriterEffect cursorFade={false} sentences={['Cursor without fade effect']} />
      </div>
    </Flexbox>
  );
};

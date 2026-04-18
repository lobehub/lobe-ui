import { Avatar, Button, Flexbox, Text } from '@lobehub/ui';
import { FloatingSheet, type FloatingSheetProps } from '@lobehub/ui/base-ui';
import { Tag } from 'antd';
import { cssVar } from 'antd-style';
import { Bookmark, Heart, MessageCircle, Send, Share2 } from 'lucide-react';
import { useState } from 'react';

const shellStyle = {
  background: cssVar.colorBgContainer,
  border: `1px solid ${cssVar.colorBorderSecondary}`,
  borderRadius: 20,
  boxShadow: cssVar.boxShadowSecondary,
  overflow: 'hidden',
};

const articleStyle = {
  background: cssVar.colorBgElevated,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  padding: 24,
};

const paragraphStyle = {
  color: cssVar.colorTextSecondary,
  fontSize: 14,
  lineHeight: 1.8,
};

const metaRowStyle = {
  alignItems: 'center',
  color: cssVar.colorTextTertiary,
  display: 'flex',
  fontSize: 12,
  gap: 10,
};

const statChipStyle = {
  alignItems: 'center',
  background: cssVar.colorFillQuaternary,
  borderRadius: 999,
  color: cssVar.colorTextSecondary,
  display: 'inline-flex',
  fontSize: 12,
  gap: 6,
  padding: '4px 10px',
};

const commentRowStyle = {
  alignItems: 'flex-start',
  display: 'flex',
  gap: 10,
};

const commentBubbleStyle = {
  background: cssVar.colorFillQuaternary,
  borderRadius: 12,
  flex: 1,
  padding: '10px 12px',
};

const comments = [
  {
    author: 'Mira',
    body: 'The anchor analogy finally made restingHeight click for me — feels obvious in hindsight.',
    role: 'Designer',
    time: '2h',
  },
  {
    author: 'Jun',
    body: 'Works well for long-form threads where the composer needs breathing room but the article must not shift.',
    role: 'Engineer',
    time: '5h',
  },
  {
    author: 'Ada',
    body: 'Would love a variant that snaps to viewport height too — covered here via maxHeight?',
    role: 'PM',
    time: '1d',
  },
  {
    author: 'Rin',
    body: 'Pro tip: pair this with reduced motion preferences to keep the overflow transition subtle.',
    role: 'A11y',
    time: '1d',
  },
];

export default () => {
  const [open, setOpen] = useState(true);

  const sheetProps: FloatingSheetProps = {
    className: 'floating-sheet-demo-inline',
    closeThreshold: 0.3,
    defaultOpen: true,
    dismissible: false,
    headerActions: (
      <Button
        data-no-drag=""
        icon={<Send size={14} />}
        size="small"
        type="text"
        onClick={() => setOpen((v) => !v)}
      >
        Reply
      </Button>
    ),
    maxHeight: 520,
    minHeight: 120,
    mode: 'inline',
    onOpenChange: setOpen,
    open,
    restingHeight: 180,
    snapPoints: [180, 320, 520],
    title: (
      <Flexbox horizontal align="center" gap={6}>
        <MessageCircle size={14} />
        <Text style={{ fontSize: 13, fontWeight: 600 }}>Discussion · {comments.length}</Text>
      </Flexbox>
    ),
    variant: 'embedded',
    width: '100%',
  };

  return (
    <Flexbox gap={16} padding={16} style={{ margin: '0 auto', maxWidth: 680 }}>
      <Flexbox gap={16} padding={20}>
        <Text style={{ color: cssVar.colorTextDescription, fontSize: 12, letterSpacing: 1.2 }}>
          INLINE MODE · EMBEDDED CARD
        </Text>
        <Text style={{ fontSize: 18, fontWeight: 700 }}>
          Discussion panel inside a long-form article
        </Text>
        <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
          The sheet sits as a card within the vertical document flow. Its layout footprint is fixed
          at <code>restingHeight</code>; dragging the header upward expands it over the paragraphs
          above, while paragraphs below stay anchored in place.
        </Text>
      </Flexbox>

      <div style={shellStyle}>
        <article style={articleStyle}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Flexbox horizontal gap={8}>
              <Tag bordered={false} color="geekblue" style={{ margin: 0 }}>
                Design Engineering
              </Tag>
              <Tag bordered={false} color="purple" style={{ margin: 0 }}>
                Layout
              </Tag>
            </Flexbox>
            <Text style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>
              Anchoring, not overlaying: a quieter kind of bottom sheet
            </Text>
            <div style={metaRowStyle}>
              <Avatar avatar="🐒" background={cssVar.colorFillTertiary} size={24} />
              <span>Innei · Apr 18</span>
              <span>·</span>
              <span>6 min read</span>
            </div>
          </header>

          <p style={paragraphStyle}>
            Overlay sheets are famously disruptive. They hover above content, grab focus, and demand
            a decision. Inline sheets go the other way: they take a fixed seat in the document,
            occupy predictable space, and let readers dip in when curious.
          </p>

          <p style={paragraphStyle}>
            The idea is small but the constraint is surprisingly strict — the sheet must be
            resizable without ever reflowing what sits below it. Drag it up, drag it down, close it;
            the footer, the related articles, the whole tail of the page must not budge.
          </p>

          <FloatingSheet {...sheetProps}>
            <Flexbox gap={12} style={{ padding: '0 16px 16px' }}>
              {comments.map((comment) => (
                <div key={comment.author} style={commentRowStyle}>
                  <Avatar
                    avatar={comment.author[0]}
                    background={cssVar.colorFillTertiary}
                    size={28}
                  />
                  <div style={commentBubbleStyle}>
                    <Flexbox horizontal align="center" gap={6} style={{ marginBottom: 2 }}>
                      <Text style={{ fontSize: 12, fontWeight: 600 }}>{comment.author}</Text>
                      <Text style={{ color: cssVar.colorTextTertiary, fontSize: 11 }}>
                        {comment.role} · {comment.time}
                      </Text>
                    </Flexbox>
                    <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13 }}>
                      {comment.body}
                    </Text>
                  </div>
                </div>
              ))}
            </Flexbox>
          </FloatingSheet>

          <p style={paragraphStyle}>
            The mechanism is disarmingly plain: reserve exactly <code>restingHeight</code> in the
            flex column, then use a negative top margin to let the visible sheet spill upward
            whenever a drag exceeds that anchor. Z-index paints the overflow cleanly above the
            preceding paragraphs.
          </p>

          <p style={paragraphStyle}>
            In practice, readers get a stable article shape with an optional, focused side-quest.
            Content below never jumps; the discussion panel behaves more like a pull-down drawer
            tucked inside the page than a floating modal.
          </p>

          <footer style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            <Flexbox horizontal align="center" gap={8}>
              <span style={statChipStyle}>
                <Heart size={13} /> 248
              </span>
              <span style={statChipStyle}>
                <MessageCircle size={13} /> {comments.length}
              </span>
              <span style={statChipStyle}>
                <Bookmark size={13} /> Save
              </span>
              <span style={statChipStyle}>
                <Share2 size={13} /> Share
              </span>
            </Flexbox>
            <Text style={{ color: cssVar.colorTextTertiary, fontSize: 12 }}>
              Article footer · Fixed position. Drag the Discussion card above to prove it.
            </Text>
          </footer>
        </article>
      </div>
    </Flexbox>
  );
};

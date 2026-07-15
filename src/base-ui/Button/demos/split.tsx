import { Flexbox } from '@lobehub/ui';
import { SplitButton } from '@lobehub/ui/base-ui';
import { CopyIcon, DownloadIcon, ShareIcon, Trash2Icon } from 'lucide-react';

const primaryItems = [
  {
    icon: <DownloadIcon size={14} />,
    key: 'download',
    label: 'Download',
    onClick: () => console.info('download'),
  },
  {
    icon: <ShareIcon size={14} />,
    key: 'share',
    label: 'Share link',
    onClick: () => console.info('share'),
  },
  {
    icon: <CopyIcon size={14} />,
    key: 'duplicate',
    label: 'Duplicate',
    onClick: () => console.info('duplicate'),
  },
];

const dangerItems = [
  {
    icon: <Trash2Icon size={14} />,
    key: 'delete',
    label: 'Delete permanently',
    onClick: () => console.info('delete'),
  },
  { key: 'archive', label: 'Move to archive', onClick: () => console.info('archive') },
];

export default () => (
  <Flexbox gap={20} padding={16}>
    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Type</span>
      <Flexbox horizontal gap={12} style={{ flexWrap: 'wrap' }}>
        <SplitButton type="primary">
          <SplitButton.Main onClick={() => console.info('save')}>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>

        <SplitButton>
          <SplitButton.Main onClick={() => console.info('save')}>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>

        <SplitButton type="dashed">
          <SplitButton.Main onClick={() => console.info('save')}>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Danger</span>
      <Flexbox horizontal gap={12} style={{ flexWrap: 'wrap' }}>
        <SplitButton danger type="primary">
          <SplitButton.Main onClick={() => console.info('delete')}>Delete</SplitButton.Main>
          <SplitButton.Menu items={dangerItems} />
        </SplitButton>

        <SplitButton danger>
          <SplitButton.Main onClick={() => console.info('delete')}>Delete</SplitButton.Main>
          <SplitButton.Menu items={dangerItems} />
        </SplitButton>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>Sizes</span>
      <Flexbox horizontal gap={12} style={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <SplitButton size="small" type="primary">
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>

        <SplitButton type="primary">
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>

        <SplitButton size="large" type="primary">
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>
      </Flexbox>
    </Flexbox>

    <Flexbox gap={8}>
      <span style={{ fontSize: 12, opacity: 0.6 }}>States</span>
      <Flexbox horizontal gap={12} style={{ flexWrap: 'wrap' }}>
        <SplitButton disabled type="primary">
          <SplitButton.Main>Save</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>

        <SplitButton loading type="primary">
          <SplitButton.Main>Saving</SplitButton.Main>
          <SplitButton.Menu items={primaryItems} />
        </SplitButton>
      </Flexbox>
    </Flexbox>
  </Flexbox>
);

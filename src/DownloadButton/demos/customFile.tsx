import { DownloadButton } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { useEffect, useState } from 'react';

export default () => {
  const store = useCreateStore();
  const [blobUrl, setBlobUrl] = useState<string>('');

  const options = useControls(
    {
      contentType: {
        description: 'Type of content to download',
        options: ['SVG Graphic', 'Text Content', 'JSON Data'],
        value: 'SVG Graphic',
      },
      disabled: {
        description: 'Disable the download button',
        value: false,
      },
      fileName: {
        description: 'Name of the file to download ',
        value: 'sample.json',
      },
      fileType: {
        description: 'Type of file to download',
        options: ['svg', 'txt', 'json'],
        value: 'svg',
      },
      glass: {
        description: 'Apply glass effect to the button',
        value: true,
      },
      size: {
        description: 'Size of the download button',
        options: ['small', 'normal', 'large'],
        value: 'normal',
      },
    },
    { store },
  );

  useEffect(() => {
    let content = '';
    let type = '';

    switch (options.contentType) {
      case 'SVG Graphic': {
        content = `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
          <rect width="200" height="200" fill="#e6f7ff" />
          <circle cx="100" cy="100" r="50" fill="#1890ff" />
          <text x="100" y="105" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="14">
            SVG Sample
          </text>
        </svg>
      `;
        type = 'image/svg+xml';

        break;
      }
      case 'Text Content': {
        content = 'Hello, this is a sample text file content.\nYou can download me as a text file!';
        type = 'text/plain';

        break;
      }
      case 'JSON Data': {
        content = JSON.stringify(
          {
            description: 'This is a sample JSON file for download',
            items: ['item1', 'item2', 'item3'],
            name: 'Sample Data',
            value: 12_345,
          },
          null,
          2,
        );
        type = 'application/json';

        break;
      }
      // No default
    }

    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [options.contentType]);

  return (
    <StoryBook levaStore={store}>
      <DownloadButton
        blobUrl={options.disabled ? undefined : blobUrl}
        disabled={options.disabled}
        fileName={options.fileName}
        fileType={options.fileType}
        glass={options.glass}
        // @ts-ignore demo use correct type
        size={options.size}
      />
    </StoryBook>
  );
};

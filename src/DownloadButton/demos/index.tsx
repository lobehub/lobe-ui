import { DownloadButton } from '@lobehub/ui';

export default () => {
  const svgContent =
    '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue"/></svg>';
  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const blobUrl = URL.createObjectURL(blob);

  return <DownloadButton blobUrl={blobUrl} fileName="demo" fileType="svg" />;
};

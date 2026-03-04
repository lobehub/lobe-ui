/**
 * Convert image blob to PNG format.
 * Clipboard API only supports image/png and image/svg+xml.
 * WebP, JPEG and other formats need to be converted for clipboard copy.
 */
export const blobToPng = (blob: Blob): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error('Failed to convert to PNG'));
          }
        },
        'image/png',
        1,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });

const CLIPBOARD_SUPPORTED_TYPES = ['image/png', 'image/svg+xml'] as const;

export const getClipboardBlob = async (
  blob: Blob,
): Promise<{ 'image/png': Blob } | { 'image/svg+xml': Blob }> => {
  const type = (blob.type || '').toLowerCase();

  if (type === 'image/png' || type === 'image/svg+xml') {
    return { [type]: blob } as { 'image/png': Blob } | { 'image/svg+xml': Blob };
  }

  const pngBlob = await blobToPng(blob);
  return { 'image/png': pngBlob };
};

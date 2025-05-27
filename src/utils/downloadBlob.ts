export const downloadBlob = async (blobUrl: string, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      link.style.display = 'none';

      document.body.append(link);
      link.click();
      link.remove();

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

import { toast } from '@lobehub/ui';
import { Button, Space } from 'antd';

const mockApiCall = (shouldSucceed: boolean) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve('Data fetched successfully!');
      } else {
        reject(new Error('Failed to fetch data'));
      }
    }, 2000);
  });

const handlePromiseSuccess = () => {
  toast.promise(mockApiCall(true), {
    error: (err: Error) => `Error: ${err.message}`,
    loading: 'Loading data...',
    success: (data: string) => `Success: ${data}`,
  });
};

const handlePromiseError = () => {
  toast
    .promise(mockApiCall(false), {
      error: (err: Error) => `Error: ${err.message}`,
      loading: 'Loading data...',
      success: 'Data loaded!',
    })
    .catch(() => {
      // Handle error silently
    });
};

export default () => {
  return (
    <Space wrap>
      <Button onClick={handlePromiseSuccess}>Promise (Success)</Button>
      <Button onClick={handlePromiseError}>Promise (Error)</Button>
    </Space>
  );
};

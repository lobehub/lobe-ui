import { Button, Flexbox, toast } from '@lobehub/ui';
import { StoryBook, useControls, useCreateStore } from '@lobehub/ui/storybook';
import { CheckCircle, CloudDownload, Database, RefreshCw, XCircle } from 'lucide-react';

const mockApiCall = (shouldSucceed: boolean, delay: number = 2000) =>
  new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve('Data fetched successfully!');
      } else {
        reject(new Error('Network error: Failed to fetch data'));
      }
    }, delay);
  });

const handleMultiplePromises = async () => {
  const promises = [mockApiCall(true, 1500), mockApiCall(true, 2000), mockApiCall(true, 2500)];

  promises.forEach((promise, index) => {
    toast.promise(promise, {
      error: 'Request failed',
      loading: `Loading task ${index + 1}...`,
      success: `Task ${index + 1} completed!`,
    });
  });
};

const handleLongRunningTask = () => {
  toast.promise(mockApiCall(true, 4000), {
    error: {
      description: 'The operation took too long and failed',
      title: 'Timeout Error',
    },
    loading: {
      description: 'This might take a while...',
      title: 'Processing Large File',
    },
    success: {
      description: 'All data has been successfully processed',
      title: 'Process Complete',
    },
  });
};

const fetchData = async () => {
  await mockApiCall(true, 2000);
  return { count: 42, items: ['Item 1', 'Item 2', 'Item 3'] };
};

export default () => {
  const store = useCreateStore();
  const options = useControls(
    {
      delay: {
        max: 5000,
        min: 500,
        step: 500,
        value: 2000,
      },
      placement: {
        options: ['top', 'top-left', 'top-right', 'bottom', 'bottom-left', 'bottom-right'],
        value: 'bottom-right',
      },
      withDescription: true,
    },
    { store },
  );

  const handlePromiseSuccess = () => {
    toast.promise(mockApiCall(true, options.delay), {
      error: (err: Error) =>
        options.withDescription ? `Failed to load: ${err.message}` : 'Failed to load',
      loading: {
        description: options.withDescription ? 'Fetching data from server...' : undefined,
        title: 'Loading',
      },
      success: (data: string) => (options.withDescription ? `Success: ${data}` : 'Success'),
    });
  };

  const handlePromiseError = () => {
    toast
      .promise(mockApiCall(false, options.delay), {
        error: (err: Error) =>
          options.withDescription ? `Request failed: ${err.message}` : 'Request failed',
        loading: {
          description: options.withDescription ? 'Please wait...' : undefined,
          title: 'Processing',
        },
        success: 'Data loaded!',
      })
      .catch(() => {
        // Handle error silently
      });
  };

  return (
    <StoryBook levaStore={store}>
      <Flexbox horizontal gap={8} style={{ flexWrap: 'wrap' }}>
        <Button icon={CheckCircle} type="primary" onClick={handlePromiseSuccess}>
          Promise Success
        </Button>
        <Button danger icon={XCircle} onClick={handlePromiseError}>
          Promise Error
        </Button>
        <Button icon={RefreshCw} onClick={handleMultiplePromises}>
          Multiple Promises
        </Button>
        <Button icon={CloudDownload} onClick={handleLongRunningTask}>
          Long Running Task
        </Button>
        <Button
          icon={Database}
          onClick={() => {
            toast.promise(fetchData(), {
              error: 'Failed to fetch',
              loading: 'Fetching database records...',
              success: (data) =>
                options.withDescription
                  ? `Database query complete: found ${data.count} items`
                  : 'Database Query Complete',
            });
          }}
        >
          Complex Data
        </Button>
      </Flexbox>
    </StoryBook>
  );
};

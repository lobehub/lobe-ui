import { Flexbox, Pagination } from '@lobehub/ui';
import { useState } from 'react';

export default () => {
  const [current, setCurrent] = useState(3);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Flexbox gap={16} padding={16}>
      <Pagination
        showSizeChanger
        current={current}
        pageSize={pageSize}
        showTotal={(total, range) => `${range[0]}-${range[1]} of ${total}`}
        total={230}
        onChange={setCurrent}
        onPageSizeChange={(_, size) => setPageSize(size)}
      />
      <Pagination defaultCurrent={1} pageSize={10} size="small" total={80} />
      <Pagination disabled pageSize={10} total={100} />
    </Flexbox>
  );
};

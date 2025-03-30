import { kebabCase } from 'lodash-es';
import { Loader2 } from 'lucide-react';
import { memo, useId } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

import Icon from '@/Icon';
import { useMermaid } from '@/hooks/useMermaid';

import { useStyles } from './style';

const MermaidContainer = memo<{ children?: string }>(({ children = '' }) => {
  const { styles } = useStyles();
  const id = useId();
  const mermaidId = kebabCase(`mermaid-${id}`);
  const { data, isLoading } = useMermaid(mermaidId, children);

  if (!data) return null;

  return (
    <>
      <Center
        as={'pre'}
        dangerouslySetInnerHTML={{
          __html: data,
        }}
        id={`mermaid-${id}`}
      />
      {isLoading && (
        <Flexbox align={'center'} className={styles.loading} gap={8} horizontal justify={'center'}>
          <Icon icon={Loader2} spin />
        </Flexbox>
      )}
    </>
  );
});

export default MermaidContainer;

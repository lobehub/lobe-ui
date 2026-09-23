'use client';

import Text from '@/base-ui/Text';
import { Flexbox } from '@/Flex';

import { styles } from './style';
import type { PageHeaderProps } from './type';

function PageHeader({ action, children, description, mark, title }: PageHeaderProps) {
  const extra = action ?? children;
  return (
    <div className={styles.root}>
      <Flexbox align={mark ? 'flex-start' : undefined} gap={12} horizontal={Boolean(mark)}>
        {mark}
        <Flexbox gap={8}>
          <Text as="h1" className={styles.title} weight="bold">
            {title}
          </Text>
          {description ? <Text className={styles.description}>{description}</Text> : null}
        </Flexbox>
      </Flexbox>
      {extra ? <div className={styles.actions}>{extra}</div> : null}
    </div>
  );
}

PageHeader.displayName = 'PageHeader';

export default PageHeader;

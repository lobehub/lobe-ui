import { memo, PropsWithChildren } from 'react';

import { useStyles } from '@/Markdown/style';

const Code = memo((p: PropsWithChildren<any>) => {
  const { styles } = useStyles();

  return <code className={styles.code}>`{p.children}`</code>;
});

export default Code;

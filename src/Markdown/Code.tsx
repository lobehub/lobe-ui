import { useStyles } from '@/Markdown/style';
import { memo, PropsWithChildren } from 'react';

const Code = memo((p: PropsWithChildren<any>) => {
  const { styles } = useStyles();
  return <code className={styles.code}>`{p.children}`</code>;
});

export default Code;

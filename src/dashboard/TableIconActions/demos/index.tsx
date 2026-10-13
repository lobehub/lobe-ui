import { tableActionColumnWidth, TableIconAction, TableIconActions } from '@lobehub/ui/dashboard';
import { Ban, Copy, Pencil } from 'lucide-react';

export default () => (
  <div style={{ width: tableActionColumnWidth(3) }}>
    <TableIconActions>
      <TableIconAction icon={Pencil} label="Edit" />
      <TableIconAction icon={Copy} label="Duplicate" />
      <TableIconAction danger icon={Ban} label="Disable" />
    </TableIconActions>
  </div>
);

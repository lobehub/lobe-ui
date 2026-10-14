import {
  TableBody,
  TableCell,
  TableColGroup,
  TableContainer,
  TableElement,
  TableHeader,
  TableHeaderCell,
  TableRoot,
  TableRow,
  TableScroll,
} from '@lobehub/ui';
import { useState } from 'react';

const models = [
  { context: '200K', id: 'claude', name: 'Claude Opus', provider: 'Anthropic' },
  { context: '1M', id: 'gemini', name: 'Gemini Pro', provider: 'Google' },
  { context: '128K', id: 'gpt', name: 'GPT', provider: 'OpenAI' },
];

const cols = [{ width: 200 }, { width: 160 }, { width: 120 }];

export default () => {
  const [selected, setSelected] = useState<string>();
  return (
    <TableRoot hoverable size="middle" variant="outlined">
      <TableContainer>
        <TableScroll>
          <TableElement style={{ tableLayout: 'fixed' }}>
            <TableColGroup columns={cols} />
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Model</TableHeaderCell>
                <TableHeaderCell>Provider</TableHeaderCell>
                <TableHeaderCell align="end">Context</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <TableRow
                  key={model.id}
                  level={0}
                  selected={selected === model.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelected(model.id)}
                >
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.provider}</TableCell>
                  <TableCell align="end">{model.context}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableElement>
        </TableScroll>
      </TableContainer>
    </TableRoot>
  );
};

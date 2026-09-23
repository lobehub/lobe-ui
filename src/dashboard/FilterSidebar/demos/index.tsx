import { FilterOption, FilterSidebar } from '@lobehub/ui/dashboard';
import { Box, Layers } from 'lucide-react';
import { useState } from 'react';

const options = [
  { count: 12, icon: Layers, label: 'All resources' },
  { count: 7, icon: Box, label: 'Services' },
  { count: 5, icon: Box, label: 'Jobs' },
];

export default () => {
  const [selected, setSelected] = useState(0);
  return (
    <FilterSidebar
      label="Filter"
      summary={options[selected]?.label ?? 'All'}
      body={() =>
        options.map((option, index) => (
          <FilterOption
            count={option.count}
            icon={<option.icon size={15} />}
            key={option.label}
            name={option.label}
            selected={selected === index}
            onClick={() => setSelected(index)}
          />
        ))
      }
    >
      <div style={{ padding: 16 }}>{options[selected]?.label}</div>
    </FilterSidebar>
  );
};

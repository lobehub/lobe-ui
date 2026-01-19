import {
  Flexbox,
  SelectGroup,
  SelectGroupLabel,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectList,
  SelectPopup,
  SelectPortal,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  Tag,
} from '@lobehub/ui';
import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';

const warmOptions = [
  { label: 'Amber', value: 'amber' },
  { label: 'Coral', value: 'coral' },
  { label: 'Sunset', value: 'sunset' },
];

const coolOptions = [
  { label: 'Ice', value: 'ice' },
  { label: 'Mint', value: 'mint' },
  { label: 'Ocean', value: 'ocean' },
];

export default () => {
  const [value, setValue] = useState<string | null>(null);
  const labelMap = useMemo(
    () =>
      [...warmOptions, ...coolOptions].reduce<Record<string, string>>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
    [],
  );

  return (
    <Flexbox align="center" gap={12} height={260} justify="center">
      <Flexbox align="center" gap={8} horizontal>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Atomic Select</div>
        <Tag color="blue">Atoms</Tag>
      </Flexbox>
      <SelectRoot onValueChange={setValue} value={value}>
        <SelectTrigger size="large" style={{ minWidth: 240 }} variant="filled">
          <SelectValue>{(current) => (current ? labelMap[current] : 'Pick a tone')}</SelectValue>
          <SelectIcon>
            <ChevronDown size={14} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup>
              <SelectList>
                <SelectGroup>
                  <SelectGroupLabel>Warm</SelectGroupLabel>
                  {warmOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <SelectItemText>{option.label}</SelectItemText>
                      <SelectItemIndicator>
                        <Check size={14} />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectGroupLabel>Cool</SelectGroupLabel>
                  {coolOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <SelectItemText>{option.label}</SelectItemText>
                      <SelectItemIndicator>
                        <Check size={14} />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectList>
            </SelectPopup>
          </SelectPositioner>
        </SelectPortal>
      </SelectRoot>
      <div style={{ color: 'var(--lobe-color-text-2)', fontSize: 12, textAlign: 'center' }}>
        Compose trigger, popup, and items for full control.
      </div>
    </Flexbox>
  );
};

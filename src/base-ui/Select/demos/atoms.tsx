import { Flexbox, Tag } from '@lobehub/ui';
import {
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
} from '@lobehub/ui/base-ui';
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
    <Flexbox
      align="center"
      gap={12}
      justify="center"
      style={{
        background: 'var(--lobe-color-fill-secondary)',
        borderRadius: 16,
        minHeight: 260,
        padding: 28,
      }}
    >
      <Flexbox horizontal align="center" gap={8}>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Atomic Select</div>
        <Tag color="blue">Atoms</Tag>
      </Flexbox>
      <SelectRoot value={value} onValueChange={setValue}>
        <SelectTrigger size="large" style={{ width: 320 }} variant="filled">
          <SelectValue>{(current) => (current ? labelMap[current] : 'Pick a tone')}</SelectValue>
          <SelectIcon>
            <ChevronDown size={14} />
          </SelectIcon>
        </SelectTrigger>
        <SelectPortal>
          <SelectPositioner>
            <SelectPopup
              style={{
                maxWidth: 'var(--available-width)',
                minWidth: 'var(--anchor-width)',
                width: 'var(--anchor-width)',
              }}
            >
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
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, textAlign: 'center' }}>
        Compose trigger, popup, and items for full control.
      </div>
    </Flexbox>
  );
};

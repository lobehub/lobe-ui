import {
  Flexbox,
  LobeSelectGroup,
  LobeSelectGroupLabel,
  LobeSelectIcon,
  LobeSelectItem,
  LobeSelectItemIndicator,
  LobeSelectItemText,
  LobeSelectList,
  LobeSelectPopup,
  LobeSelectPortal,
  LobeSelectPositioner,
  LobeSelectRoot,
  LobeSelectTrigger,
  LobeSelectValue,
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
      <Flexbox align="center" gap={8} horizontal>
        <div style={{ fontSize: 15, fontWeight: 600 }}>Atomic Select</div>
        <Tag color="blue">Atoms</Tag>
      </Flexbox>
      <LobeSelectRoot onValueChange={setValue} value={value}>
        <LobeSelectTrigger size="large" style={{ width: 320 }} variant="filled">
          <LobeSelectValue>
            {(current) => (current ? labelMap[current] : 'Pick a tone')}
          </LobeSelectValue>
          <LobeSelectIcon>
            <ChevronDown size={14} />
          </LobeSelectIcon>
        </LobeSelectTrigger>
        <LobeSelectPortal>
          <LobeSelectPositioner>
            <LobeSelectPopup
              style={{
                maxWidth: 'var(--available-width)',
                minWidth: 'var(--anchor-width)',
                width: 'var(--anchor-width)',
              }}
            >
              <LobeSelectList>
                <LobeSelectGroup>
                  <LobeSelectGroupLabel>Warm</LobeSelectGroupLabel>
                  {warmOptions.map((option) => (
                    <LobeSelectItem key={option.value} value={option.value}>
                      <LobeSelectItemText>{option.label}</LobeSelectItemText>
                      <LobeSelectItemIndicator>
                        <Check size={14} />
                      </LobeSelectItemIndicator>
                    </LobeSelectItem>
                  ))}
                </LobeSelectGroup>
                <LobeSelectGroup>
                  <LobeSelectGroupLabel>Cool</LobeSelectGroupLabel>
                  {coolOptions.map((option) => (
                    <LobeSelectItem key={option.value} value={option.value}>
                      <LobeSelectItemText>{option.label}</LobeSelectItemText>
                      <LobeSelectItemIndicator>
                        <Check size={14} />
                      </LobeSelectItemIndicator>
                    </LobeSelectItem>
                  ))}
                </LobeSelectGroup>
              </LobeSelectList>
            </LobeSelectPopup>
          </LobeSelectPositioner>
        </LobeSelectPortal>
      </LobeSelectRoot>
      <div style={{ color: 'var(--lobe-color-text-3)', fontSize: 12, textAlign: 'center' }}>
        Compose trigger, popup, and items for full control.
      </div>
    </Flexbox>
  );
};

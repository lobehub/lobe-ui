interface SelectProps<T extends string> {
  label: string;
  onChange: (value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}

export const Select = <T extends string>({ label, onChange, options, value }: SelectProps<T>) => (
  <div className="field">
    <label className="field-label" htmlFor={`select-${label}`}>
      <span>{label}</span>
    </label>
    <div className="select">
      <select id={`select-${label}`} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        fill="none"
        height="14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
        width="14"
      >
        <path d="M7 10l5 5 5-5" />
      </svg>
    </div>
  </div>
);

interface SegmentedProps<T extends string> {
  label: string;
  onChange: (value: T) => void;
  options: readonly { label: string; value: T }[];
  value: T;
}

export const Segmented = <T extends string>({
  label,
  onChange,
  options,
  value,
}: SegmentedProps<T>) => (
  <div className="field">
    <div className="field-label">
      <span>{label}</span>
    </div>
    <div aria-label={label} className="seg" role="group">
      {options.map((option) => (
        <button
          aria-pressed={option.value === value}
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </div>
);

interface RangeProps {
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  unit: string;
  value: number;
}

export const Range = ({ label, max, min, onChange, step = 1, unit, value }: RangeProps) => (
  <div className="field">
    <label className="field-label" htmlFor={`range-${label}`}>
      <span>{label}</span>
      <span className="field-value">
        {value} {unit}
      </span>
    </label>
    <input
      className="range"
      id={`range-${label}`}
      max={max}
      min={min}
      step={step}
      style={{ '--pct': `${((value - min) / (max - min)) * 100}%` } as React.CSSProperties}
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

interface SwitchProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export const Switch = ({ checked, label, onChange }: SwitchProps) => (
  <div className="switch-row">
    <span>{label}</span>
    <button
      aria-checked={checked}
      aria-label={label}
      className="switch"
      role="switch"
      type="button"
      onClick={() => onChange(!checked)}
    >
      <i />
    </button>
  </div>
);

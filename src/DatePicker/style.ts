import './style.css';

export const PREFIX_CLS = 'lobe-picker';

// rc-picker puts rootClassName on both the input box and the popup; style.css hangs every
// rule off it.
export const ROOT_CLS = `${PREFIX_CLS}-root`;

import type { AliasToken } from 'antd/es/theme/interface';

/* antd's formatToken recomputes boxShadow* after the mapping algorithm runs, so these only take
   effect when passed through ThemeConfig.token, never from light/dark base tokens. */
export const shadowToken: Record<'light' | 'dark', Partial<AliasToken>> = {
  dark: {
    boxShadow:
      '0 40px 80px rgba(0, 0, 0, 0.09), 0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.06), 0 5px 10px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03)',
    boxShadowSecondary:
      '0 17.5px 23.4px rgba(0, 0, 0, 0.06), 0 9.4px 12.5px rgba(0, 0, 0, 0.05), 0 5.25px 7px rgba(0, 0, 0, 0.03), 0 2.8px 3.7px -2px rgba(0, 0, 0, 0.02), 0 1.2px 1.5px rgba(0, 0, 0, 0.02)',
    boxShadowTertiary: '0 1px 2px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.03)',
  },
  light: {
    boxShadow:
      '0 40px 80px rgba(0, 0, 0, 0.06), 0 20px 40px rgba(0, 0, 0, 0.05), 0 10px 20px rgba(0, 0, 0, 0.04), 0 5px 10px rgba(0, 0, 0, 0.03), 0 2px 4px rgba(0, 0, 0, 0.02)',
    boxShadowSecondary:
      '0 17.5px 23.4px rgba(0, 0, 0, 0.04), 0 9.4px 12.5px rgba(0, 0, 0, 0.03), 0 5.25px 7px rgba(0, 0, 0, 0.02), 0 2.8px 3.7px -2px rgba(0, 0, 0, 0.01), 0 1.2px 1.5px rgba(0, 0, 0, 0.01)',
    boxShadowTertiary: '0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 4px rgba(0, 0, 0, 0.02)',
  },
};

import { AuthLocaleSwitch, type AuthThemeMode, AuthThemeSwitch } from '@lobehub/ui/dashboard';
import { useState } from 'react';

const locales = [
  { label: 'English', value: 'en-US' },
  { label: '简体中文', value: 'zh-CN' },
];

export default () => {
  const [theme, setTheme] = useState<AuthThemeMode>('auto');
  const [locale, setLocale] = useState('en-US');
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
      <AuthThemeSwitch value={theme} onChange={setTheme} />
      <AuthLocaleSwitch options={locales} value={locale} onChange={setLocale} />
    </div>
  );
};

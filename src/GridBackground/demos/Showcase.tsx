import { GridShowcase, LogoThree } from '@unitalkai/ui';

export default () => {
  return (
    <GridShowcase style={{ width: '100%' }}>
      <LogoThree size={180} style={{ marginTop: -64 }} />
      <div style={{ fontSize: 48, fontWeight: 600, marginTop: -16 }}>Grid Showcase</div>
      <div>Lobe UI is an open-source UI component library for building chatbot web apps</div>
    </GridShowcase>
  );
};

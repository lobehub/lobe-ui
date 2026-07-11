export default function DynamicImportFixture() {
  void import('./helper');
  return <div>Dynamic import fixture</div>;
}

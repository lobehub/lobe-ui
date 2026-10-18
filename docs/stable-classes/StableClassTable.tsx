import type { StableClasses } from '@/utils/bem';

export function StableClassTable({ of }: { of: StableClasses<string> }) {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Part</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>.{of.block}</code>
            </td>
            <td>block</td>
          </tr>
          {of.elements.map((element) => (
            <tr key={element}>
              <td>
                <code>.{of(element)}</code>
              </td>
              <td>{element}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {of.dataAttributes.length > 0 && (
        <p>
          Attributes on the block:{' '}
          {of.dataAttributes.map((name, index) => (
            <span key={name}>
              {index > 0 && ', '}
              <code>data-{name}</code>
            </span>
          ))}
          .
        </p>
      )}
    </>
  );
}

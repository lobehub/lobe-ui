import './Api.css';

import type { ApiComponent, ApiProperty, ApiSourceLocation } from '../../types/api';

interface ApiProps {
  data?: ApiComponent;
  from?: string;
  migrationKey?: string;
  name: string;
}

const formatSource = ({ column, file, line }: ApiSourceLocation): string =>
  `${file}:${line}:${column}`;

function PropertyDetails({ property }: { property: ApiProperty }) {
  const hasDetails =
    property.deprecated !== undefined ||
    property.since !== undefined ||
    property.inheritedFrom !== undefined ||
    property.source !== undefined;

  if (!hasDetails) return <span className="api-reference__empty">None</span>;

  return (
    <div className="api-reference__details">
      {property.deprecated !== undefined ? (
        <div className="api-reference__detail api-reference__detail--deprecated">
          <span className="api-reference__badge api-reference__badge--deprecated">Deprecated</span>
          {property.deprecated ? <span>{property.deprecated}</span> : null}
        </div>
      ) : null}
      {property.since ? (
        <span className="api-reference__badge api-reference__badge--since">
          Since {property.since}
        </span>
      ) : null}
      {property.inheritedFrom ? (
        <span className="api-reference__detail">Inherited from {property.inheritedFrom}</span>
      ) : null}
      {property.source ? (
        <span className="api-reference__source" title={formatSource(property.source)}>
          Source {formatSource(property.source)}
        </span>
      ) : null}
    </div>
  );
}

export default function Api({ data, name }: ApiProps) {
  if (!data) {
    throw new Error(
      `Missing compile-time API metadata for "${name}". Ensure the MDX compiler injects the serialized data prop.`,
    );
  }

  const label = `${data.name} properties`;

  return (
    <section
      aria-label={`${data.name} API reference`}
      className="api-reference"
      data-pagefind-meta="api"
    >
      {data.description ? <p className="api-reference__description">{data.description}</p> : null}
      {data.deprecated !== undefined || data.since ? (
        <div className="api-reference__component-details">
          {data.deprecated !== undefined ? (
            <span className="api-reference__detail api-reference__detail--deprecated">
              <span className="api-reference__badge api-reference__badge--deprecated">
                Deprecated
              </span>
              {data.deprecated ? <span>{data.deprecated}</span> : null}
            </span>
          ) : null}
          {data.since ? (
            <span className="api-reference__badge api-reference__badge--since">
              Since {data.since}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        aria-label={`Scrollable ${label} table`}
        className="api-reference__overflow"
        role="region"
        tabIndex={0}
      >
        <table className="api-reference__table">
          <caption>{label}</caption>
          <thead>
            <tr>
              <th scope="col">Property</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {data.properties.length === 0 ? (
              <tr>
                <td className="api-reference__empty-row" colSpan={4}>
                  No public properties.
                </td>
              </tr>
            ) : (
              data.properties.map((property) => (
                <tr key={property.name}>
                  <th scope="row">
                    <code className="api-reference__property-name">{property.name}</code>
                    <span
                      className="api-reference__badge"
                      data-required={property.required ? 'true' : 'false'}
                    >
                      {property.required ? 'Required' : 'Optional'}
                    </span>
                    {property.description ? (
                      <span className="api-reference__property-description">
                        {property.description}
                      </span>
                    ) : null}
                  </th>
                  <td>
                    <code className="api-reference__type">{property.type}</code>
                  </td>
                  <td>
                    {property.defaultValue === undefined ? (
                      <span aria-label="No default value" className="api-reference__empty">
                        —
                      </span>
                    ) : (
                      <code className="api-reference__default">{property.defaultValue}</code>
                    )}
                  </td>
                  <td>
                    <PropertyDetails property={property} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

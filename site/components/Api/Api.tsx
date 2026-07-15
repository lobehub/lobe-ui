import type { ApiComponent, ApiProperty } from '../../types/api';
import { styles } from './style';

interface ApiProps {
  data?: ApiComponent;
  from?: string;
  migrationKey?: string;
  name: string;
}

const isNativeAttribute = (property: ApiProperty): boolean =>
  property.source?.file.includes('@types/react') ?? false;

const isInternalProperty = (property: ApiProperty): boolean => property.name.startsWith('_');

function PropertyRow({ property }: { property: ApiProperty }) {
  return (
    <div className={styles.row}>
      <dt className={styles.term}>
        <code className={styles.propertyName}>{property.name}</code>
        {property.required ? <span className={styles.flag}>Required</span> : null}
        {property.deprecated !== undefined ? (
          <span className={styles.flagDeprecated}>Deprecated</span>
        ) : null}
        {property.since ? <span className={styles.origin}>Since {property.since}</span> : null}
        {property.inheritedFrom ? (
          <span className={styles.origin}>{property.inheritedFrom}</span>
        ) : null}
      </dt>
      <dd className={styles.definition}>
        <code className={styles.type}>{property.type}</code>
        {property.deprecated ? <p className={styles.prose}>{property.deprecated}</p> : null}
        {property.description ? <p className={styles.prose}>{property.description}</p> : null}
        {property.defaultValue === undefined ? null : (
          <p className={styles.proseDefault}>
            Defaults to <code>{property.defaultValue}</code>.
          </p>
        )}
      </dd>
    </div>
  );
}

export function Api({ data, name }: ApiProps) {
  if (!data) {
    throw new Error(
      `Missing compile-time API metadata for "${name}". Ensure the MDX compiler injects the serialized data prop.`,
    );
  }

  const label = `${data.name} properties`;
  const documentedProperties = data.properties.filter(
    (property) => !isNativeAttribute(property) && !isInternalProperty(property),
  );
  const hasNativeAttributes = data.properties.some((property) => isNativeAttribute(property));

  return (
    <section
      aria-label={`${data.name} API reference`}
      className={styles.root}
      data-pagefind-meta="api"
    >
      {data.description ? <p className={styles.description}>{data.description}</p> : null}
      {data.deprecated !== undefined || data.since ? (
        <div className={styles.componentDetails}>
          {data.deprecated !== undefined ? (
            <span className={styles.detailDeprecated}>
              <span className={styles.flagDeprecated}>Deprecated</span>
              {data.deprecated ? <span>{data.deprecated}</span> : null}
            </span>
          ) : null}
          {data.since ? <span className={styles.origin}>Since {data.since}</span> : null}
        </div>
      ) : null}

      <div aria-label={label} className={styles.card} role="group">
        <div className={styles.caption}>{label}</div>
        {documentedProperties.length === 0 ? (
          <p className={styles.empty}>No public properties.</p>
        ) : (
          <dl className={styles.list}>
            {documentedProperties.map((property) => (
              <PropertyRow key={property.name} property={property} />
            ))}
          </dl>
        )}
        {hasNativeAttributes ? (
          <p className={styles.footnote}>Also accepts all native HTML and ARIA attributes.</p>
        ) : null}
      </div>
    </section>
  );
}

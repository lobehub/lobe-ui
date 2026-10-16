import * as stylex from '@stylexjs/stylex';

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
    <div {...stylex.props(styles.row)}>
      <dt {...stylex.props(styles.term)}>
        <code {...stylex.props(styles.propertyName)}>{property.name}</code>
        {property.required ? <span {...stylex.props(styles.flag)}>Required</span> : null}
        {property.deprecated !== undefined ? (
          <span {...stylex.props(styles.flagDeprecated)}>Deprecated</span>
        ) : null}
        {property.since ? (
          <span {...stylex.props(styles.origin)}>Since {property.since}</span>
        ) : null}
        {property.inheritedFrom ? (
          <span {...stylex.props(styles.origin)}>{property.inheritedFrom}</span>
        ) : null}
      </dt>
      <dd {...stylex.props(styles.definition)}>
        <code {...stylex.props(styles.type)}>{property.type}</code>
        {property.deprecated ? <p {...stylex.props(styles.prose)}>{property.deprecated}</p> : null}
        {property.description ? (
          <p {...stylex.props(styles.prose)}>{property.description}</p>
        ) : null}
        {property.defaultValue === undefined ? null : (
          <p {...stylex.props(styles.proseDefault)}>
            Defaults to <code {...stylex.props(styles.code)}>{property.defaultValue}</code>.
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
      {...stylex.props(styles.root)}
      data-pagefind-meta="api"
    >
      {data.description ? <p {...stylex.props(styles.description)}>{data.description}</p> : null}
      {data.deprecated !== undefined || data.since ? (
        <div {...stylex.props(styles.componentDetails)}>
          {data.deprecated !== undefined ? (
            <span {...stylex.props(styles.detailDeprecated)}>
              <span {...stylex.props(styles.flagDeprecated)}>Deprecated</span>
              {data.deprecated ? <span>{data.deprecated}</span> : null}
            </span>
          ) : null}
          {data.since ? <span {...stylex.props(styles.origin)}>Since {data.since}</span> : null}
        </div>
      ) : null}

      <div aria-label={label} {...stylex.props(styles.card)} role="group">
        <div {...stylex.props(styles.caption)}>{label}</div>
        {documentedProperties.length === 0 ? (
          <p {...stylex.props(styles.empty)}>No public properties.</p>
        ) : (
          <dl {...stylex.props(styles.list)}>
            {documentedProperties.map((property) => (
              <PropertyRow key={property.name} property={property} />
            ))}
          </dl>
        )}
        {hasNativeAttributes ? (
          <p {...stylex.props(styles.footnote)}>
            Also accepts all native HTML and ARIA attributes.
          </p>
        ) : null}
      </div>
    </section>
  );
}

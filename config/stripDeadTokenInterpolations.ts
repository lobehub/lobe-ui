import type { Rolldown } from 'tsdown';

// The StyleX compiler inlines module-scope token interpolations into style.css, so the declarations
// that fed them are dead. Tree shaking drops the declaration but keeps the interpolation as a bare
// template literal (`${cssVar.colorError};`), because a template literal is assumed to be
// side-effectful. Those reads are the only reason a consumer bundle still carries the whole `cssVar`
// token table (786 constants), and neither `treeshake.propertyReadSideEffects` nor a stricter
// `treeshake` setting drops them.
const deadTokenInterpolation =
  /^[\t ]*`(?:\$\{[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\})*`;[\t ]*$/gm;

// Blanking the statement instead of deleting the line keeps line numbers — and therefore the source
// maps of the emitted .mjs — aligned with the source.
export const stripDeadTokenInterpolations = (code: string) =>
  code.replaceAll(deadTokenInterpolation, '');

export const stripDeadTokenInterpolationsPlugin = (): Rolldown.Plugin => ({
  generateBundle(_options, bundle) {
    for (const file of Object.values(bundle)) {
      if (file.type === 'chunk') file.code = stripDeadTokenInterpolations(file.code);
    }
  },
  name: 'lobe-ui:strip-dead-token-interpolations',
});

import type { FieldValidator, FormValidator } from './engine/types';

export interface StandardSchemaIssue {
  message: string;
  path?: ReadonlyArray<PropertyKey | { key: PropertyKey }>;
}

export interface StandardSchema<Input = unknown, Output = Input> {
  readonly '~standard': {
    readonly types?: { readonly input: Input; readonly output: Output };
    readonly validate: (
      value: unknown,
    ) =>
      | { readonly issues?: undefined; readonly value: Output }
      | { readonly issues: ReadonlyArray<StandardSchemaIssue> }
      | Promise<
          | { readonly issues?: undefined; readonly value: Output }
          | { readonly issues: ReadonlyArray<StandardSchemaIssue> }
        >;
    readonly vendor: string;
    readonly version: 1;
  };
}

export type InferSchemaInput<S> = S extends StandardSchema<infer I, any> ? I : never;

export type FieldValidate =
  StandardSchema | ((value: any, values: any) => string | undefined | Promise<string | undefined>);

export const isStandardSchema = (value: unknown): value is StandardSchema =>
  typeof value === 'object' && value !== null && '~standard' in value;

const issuePath = (issue: StandardSchemaIssue) =>
  (issue.path ?? [])
    .map((segment) => String(typeof segment === 'object' ? segment.key : segment))
    .join('.');

export const schemaToFormValidator =
  (schema: StandardSchema): FormValidator =>
  async (values) => {
    const result = await schema['~standard'].validate(values);
    if (!result.issues) return undefined;
    const errors: Record<string, string> = {};
    for (const issue of result.issues) {
      const path = issuePath(issue);
      if (errors[path] === undefined) errors[path] = issue.message;
    }
    return errors;
  };

export const toFieldValidator = (validate: FieldValidate): FieldValidator => {
  if (!isStandardSchema(validate)) return validate;
  return async (value) => {
    const result = await validate['~standard'].validate(value);
    return result.issues?.[0]?.message;
  };
};

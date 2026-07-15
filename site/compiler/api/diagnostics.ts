import type { ApiComponent, ApiRequest } from '../../types/api';
import { extractComponentApi } from './extractComponent';

export const validateApiRequest = (request: ApiRequest): void => {
  if (!request.documentPath || !/\.mdx?$/.test(request.documentPath)) {
    throw new Error(
      `${request.documentPath || '<unknown document>'}: API request requires an MDX document path.`,
    );
  }
  if (!request.name.trim()) {
    throw new Error(
      `${request.documentPath}: API request requires a non-empty name static string.`,
    );
  }
  if (request.from !== undefined && !request.from.trim()) {
    throw new Error(`${request.documentPath}: API "${request.name}" requires a non-empty from=.`);
  }
};

export const extractComponentApis = (requests: readonly ApiRequest[]): ApiComponent[] => {
  const components: ApiComponent[] = [];
  const diagnostics: string[] = [];
  for (const request of requests) {
    try {
      validateApiRequest(request);
      components.push(extractComponentApi(request));
    } catch (error) {
      diagnostics.push(error instanceof Error ? error.message : String(error));
    }
  }
  if (diagnostics.length > 0) {
    throw new Error(`API extraction failed:\n- ${diagnostics.join('\n- ')}`);
  }
  return components;
};
